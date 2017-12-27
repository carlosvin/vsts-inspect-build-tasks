"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const tl = require("vsts-task-lib/task");
const builder = require("xmlbuilder");
const regex = /TODO[\s|\:]+\:*\s*(?:(.*))$/gm;
const regexPbi = /(?:(\#\d{6})).*$/;
const getInputFiles = () => {
    // contents is a multiline input containing glob patterns
    let contents = tl.getDelimitedInput('Contents', '\n', true);
    let sourceFolder = tl.getPathInput('SourceFolder', true, true);
    // normalize the source folder path. this is important for later in order to accurately
    // determine the relative path of each found file (substring using sourceFolder.length).
    sourceFolder = path.normalize(sourceFolder);
    let allPaths = tl.find(sourceFolder); // default find options (follow sym links)
    let matchedPaths = tl.match(allPaths, contents, sourceFolder); // default match options
    let matchedFiles = matchedPaths.filter((itemPath) => !tl.stats(itemPath).isDirectory()); // filter-out directories
    // copy the files to the target folder
    console.log(`Found ${matchedFiles.length} files`);
    return matchedFiles;
};
class Todo {
    constructor(todoText, file) {
        const found = regexPbi.exec(todoText);
        this.pbi = found && found.length > 0 ? found[0] : undefined;
        this.todoText = todoText;
        this.file = file;
    }
    get hasPbi() {
        return this.pbi !== undefined && this.pbi !== null;
    }
    get testCaseResultType() {
        return this.hasPbi ? 'system-out' : 'error';
    }
    get testCaseResultMessage() {
        return this.hasPbi ?
            `TODO with assigned PBI ${this.pbi}` :
            'Unhandled TODO which might be forgotten because it does not have a PBI';
    }
    toString() {
        return this.todoText + ' at ' + this.file;
    }
    addTestCase(testSuite) {
        return this.addTestCaseResult(testSuite.ele('testcase', { name: `Found TODO at ${this.file}: ${this.todoText}`, id: this.todoText }));
    }
    addTestCaseResult(testCase) {
        testCase.ele(this.testCaseResultType, { message: this.testCaseResultMessage });
        testCase.ele('system-out', { message: 'File: ' + this.file });
        testCase.ele('system-out', { message: 'TODO Text:' + this.todoText });
    }
}
const getTodos = (str, file) => {
    let m;
    const todos = [];
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        todos.push(new Todo(m[1], file));
    }
    return todos;
};
/*const getInputFilesTest = () => {
    return ['tests/_suite.ts', 'tests/sucess.ts'];
}*/
const runTask = () => {
    tl.setResourcePath(path.join(__dirname, 'task.json'));
    const matchedFiles = getInputFiles();
    if (matchedFiles.length > 0) {
        const initialTime = new Date();
        const root = builder.create('testsuites')
            .att('name', 'Find unhandled TODOs in source code')
            .att('timestamp', initialTime.toString());
        const errors = [];
        try {
            matchedFiles.forEach((file) => {
                const relFile = path.relative('.', file);
                const data = fs.readFileSync(file);
                const todos = getTodos(data.toString('utf8'), file);
                if (todos.length > 0) {
                    const testSuite = root.ele('testsuite', { name: 'TODOs found at ' + relFile, id: relFile, tests: todos.length });
                    todos.forEach(todo => {
                        todo.addTestCase(testSuite);
                        if (!todo.hasPbi) {
                            errors.push(todo);
                        }
                    });
                }
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err);
        }
        finally {
            root.att('time', (new Date().getMilliseconds() - initialTime.getMilliseconds()) / 1000);
            root.att('tests', matchedFiles.length);
            root.end({ pretty: true });
            fs.writeFileSync('todos.junit.xml', root.toString());
            if (errors.length > 0) {
                tl.setResult(tl.TaskResult.Failed, errors.toString());
            }
            else {
                tl.setResult(tl.TaskResult.Succeeded, 'OK');
            }
        }
    }
    else {
        tl.setResult(tl.TaskResult.SucceededWithIssues, 'There are no matched files');
    }
};
runTask();
