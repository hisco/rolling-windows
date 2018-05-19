const { resultFn } = require('../../src/utils');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('utils' , ()=>{
    describe('#resultFn' , ()=>{
        it('Should get the result of function' , ()=>{
            expect(resultFn(()=>3)).to.equal(3);
        });
        it('Should get the value' , ()=>{
            expect(resultFn(4)).to.equal(4);
        });
    })
});