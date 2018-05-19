const { WindowSingleStackedCounter } = require('../../src/single-stacked-counter');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('WindowSingleStackedCounter', ()=>{
    describe('#constructor' , ()=>{
        let parentSpy;
        let windowSingleStackedCounterOptions;
        let lastWindowSpy;
        const OriginalWindowSingleStackedCounterProto = Object.getPrototypeOf(WindowSingleStackedCounter);
        afterEach(()=>{
            Object.setPrototypeOf(WindowSingleStackedCounter , OriginalWindowSingleStackedCounterProto)
        });
        beforeEach(()=>{
            windowSingleStackedCounterOptions = {

            };
            lastWindowSpy = chai.spy(()=>({bucketValue : {
                value : 4
            }}));
            parentSpy = chai.spy(()=>4)
            class DummyParentClass{
                constructor(){
                    parentSpy(...arguments)
                }
                getLastBucket(){
                    return lastWindowSpy();
                }
            }
            Object.setPrototypeOf(WindowSingleStackedCounter, DummyParentClass);
            
        });
        it('Should create default options if non defined' , ()=>{
            new WindowSingleStackedCounter();

            expect(parentSpy).to.have.been.called();
        });
        it('Should result first value ' , ()=>{
            const defaultNumberSpy = chai.spy(()=>4);
            const options = {
                defaultNumber : defaultNumberSpy
            }
            new WindowSingleStackedCounter(options);
            
            expect(defaultNumberSpy).to.have.been.called();
        });
        it('Should getLastBucket()...value if context is defined' , ()=>{
            const defaultNumberSpy = chai.spy(()=>4);
            const options = {
                defaultNumber : defaultNumberSpy
            }
            const windowSingleStackedCounter = new WindowSingleStackedCounter(options);
            windowSingleStackedCounter.getLastBucket = lastWindowSpy;
            expect(options.defaultNumber).to.not.equal(defaultNumberSpy);
            expect(options.defaultNumber()).to.equal(4);
        });
    });
});