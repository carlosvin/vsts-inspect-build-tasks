"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assert = require("assert");
const ttm = require("vsts-task-lib/mock-test");
// TODO write proper tests
describe('Sample task tests', function () {
    before(() => {
    });
    after(() => {
    });
    it('should succeed with simple inputs', (done) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'success.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert(tr.succeeded, 'should have succeeded');
        done();
    });
    it('it should fail if tool returns 1', (done) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'failrc.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert(!tr.succeeded, 'should have failed');
        done();
    });
});
