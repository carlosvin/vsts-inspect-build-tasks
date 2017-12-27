import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('Contents', '**');
tmr.setInput('SourceFolder', '.');

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "echo": "/mocked/tools/echo"
    },
    "exec": {
        "/mocked/tools/echo Hello, from task!": {
            "code": 1,
            "stdout": "atool output here",
            "stderr": "atool with this stderr output"            
        }
    }
};
tmr.setAnswers(a);


tmr.run();
