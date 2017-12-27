"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("vsts-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('Contents', '**');
tmr.setInput('SourceFolder', '.');
// provide answers for task mock
let a = {
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
