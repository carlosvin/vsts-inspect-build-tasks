import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

// TODO write proper tests

describe('Sample task tests', function () {
    before(() => {

    });

    after(() => {

    });

    it('should succeed with simple inputs', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.succeeded, 'should have succeeded');

        done();
    });

    it('it should fail if tool returns 1', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'failrc.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(!tr.succeeded, 'should have failed');
        
        done();
    });
});
