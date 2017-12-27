import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('Contents', '**');
tmr.setInput('SourceFolder', '');
// TODO: find a wayt to #334334

tmr.run();

// TODO sdfasdf #123123 implement
/// sdfa da TODO comprar pan #644345 a las 3

