const { TimeBasedWindowCounter } = require('../../src/time-based-single-counter');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('TimeBasedWindowCounter' , ()=>{
    const OriginalTimeBasedWindowCounterProto = Object.getPrototypeOf(TimeBasedWindowCounter);
    let parentSpy = chai.spy(()=>3);
    beforeEach(()=>{
        class PrarentClass{
            constructor(){
                parentSpy(...arguments);
            }
        }
        Object.setPrototypeOf(TimeBasedWindowCounter , PrarentClass);
    });
    afterEach(()=>{
        Object.setPrototypeOf(TimeBasedWindowCounter , OriginalTimeBasedWindowCounterProto);
    });
    describe('#constructor' , ()=>{
        it('Should have default options' , ()=>{
            new TimeBasedWindowCounter();

            expect(parentSpy).to.have.been.called();
            expect(parentSpy).to.have.not.been.called.with(undefined);
        });
        it('Should set `defaultNumber` to 0 if it\'s falsy' , ()=>{
            const options = {
                defaultNumber : false
            };
            new TimeBasedWindowCounter(options);

            expect(options.defaultNumber).to.equal(0);
        });
        it('Shouldn\'t set `defaultNumber` to 0 if it\'s truthy' , ()=>{
            const options = {
                defaultNumber : 7
            };
            new TimeBasedWindowCounter(options);

            expect(options.defaultNumber).to.equal(7);
        });
        it('Shouldn\'t set `defaultValueFactory` if it\'s truthy' , ()=>{
            const options = {
                defaultValueFactory : 8
            };
            new TimeBasedWindowCounter(options);

            expect(options.defaultValueFactory).to.equal(8);
        });
        it('Should set `defaultValueFactory` to return `TimePoint ` with `defaultNumber`' , ()=>{
            const options = {
                defaultNumber : ()=>8
            };
            new TimeBasedWindowCounter(options);
            const result = options.defaultValueFactory();

            expect(result.date).to.be.a('number');
            expect(result.value).to.equal(8);
        });
    });
    describe('#toDateArray' , ()=>{
        it('Should collect all values' , ()=>{
            const timeBasedWindowCounter = new TimeBasedWindowCounter();
            timeBasedWindowCounter.iterate = (cb)=>{
                cb({
                    bucketValue : 1
                })
                cb({
                    bucketValue : 2
                })
            }
            const result = timeBasedWindowCounter.toDateArray();
            expect(result.length).to.equal(2);
        })
    });
});
