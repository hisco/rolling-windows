const { TimeBasedWindowMultipleCounters } = require('../../src/time-based-counters');
const { TimeWindowCore } = require('../../src/core');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('TimeBasedWindowMultipleCounters' , ()=>{
    const OriginalTimeBasedWindowMultipleCountersProto = Object.getPrototypeOf(TimeBasedWindowMultipleCounters);
    let parentSpy;
    let timeWindowMultipleCountersOptions;
    let timeBasedWindowMultipleCounters;
    let createContainerSpy;
    beforeEach(()=>{
        parentSpy = chai.spy(()=>3);
        createContainerSpy = chai.spy(()=>9);
        timeWindowMultipleCountersOptions = {
            timeWindow : 5000,
            bucketsFrequancy : 3,
            defaultValueFactory : ()=>{},
            onRemoved : ()=>4
        }
        class PrarentClass{
            constructor(){
                parentSpy(...arguments);
            }
        }
        Object.setPrototypeOf(TimeBasedWindowMultipleCounters , PrarentClass);
    });
    afterEach(()=>{
        Object.setPrototypeOf(TimeBasedWindowMultipleCounters , OriginalTimeBasedWindowMultipleCountersProto);
    });
    describe('get TimeWindowCore', ()=>{
        it('Should return TimeWindowCore' , ()=>{
            const result =  TimeBasedWindowMultipleCounters.prototype.TimeWindowCore;

            expect(result).to.equal(TimeWindowCore);
        })
    });
    describe('#constructor' , ()=>{
        it('Should have defaults' , ()=>{
            new TimeBasedWindowMultipleCounters();
            expect(parentSpy).to.have.been.called.not.with(undefined);
        });
        it('Should set `defaultNumber` to 0 if it\'s falsy' , ()=>{
            const options = {};
            new TimeBasedWindowMultipleCounters(options);

            expect(options.defaultNumber).to.equal(0);
        });
        it('Should not set `defaultNumber` to 0 if it\'s truthy' , ()=>{
            const options = {
                defaultNumber : 3
            };
            new TimeBasedWindowMultipleCounters(options);

            expect(options.defaultNumber).not.to.equal(0);
        });
        it('Should set `defaultValueFactory` if it\'s falsy' , ()=>{
            const options = {};
            new TimeBasedWindowMultipleCounters(options);
            const result = options.defaultValueFactory();

            expect(result.date).to.be.a('number');
            expect(result.value).to.not.equal(undefined);
        });
    });
    describe('#toDateArray' , ()=>{
        beforeEach(()=>{
            timeBasedWindowMultipleCounters = new TimeBasedWindowMultipleCounters
        })
        it('Should call iterate' , ()=>{
            timeBasedWindowMultipleCounters.iterate = chai.spy();
            timeBasedWindowMultipleCounters.toDateArray();

            expect( timeBasedWindowMultipleCounters.iterate).to.have.been.called()
        });
        it('Should push bucketValue' , ()=>{
            timeBasedWindowMultipleCounters.iterate = (cb)=>{
                cb({
                    bucketValue : 88
                })
            };
            const result = timeBasedWindowMultipleCounters.toDateArray();

            expect( result[0] ).to.equal(88)
        });
  
        it('Should collect iteration elements' , ()=>{

            timeBasedWindowMultipleCounters.iterate = function iterate(cb){
                cb({
                    bucketValue : {value : 10}
                });
                cb({
                    bucketValue : {value : 12}
                })
            }
            const result = timeBasedWindowMultipleCounters.toArray();

            expect(result.length).to.equal(2);
            expect(result[0]).to.equal(10);
            expect(result[1]).to.equal(12);
        })
    });
    describe('#_createContainer' , ()=>{
        let DummyWindowMultipleCounters;
        let TimeWindowCoreSpy;
        let setPublicOnSpy;
        beforeEach(()=>{
            TimeWindowCoreSpy = chai.spy(()=>(
                {
                    setPublicOn : setPublicOnSpy
                }
            ));
            class DummyWindowMultipleCountersO extends TimeBasedWindowMultipleCounters{
                get TimeWindowCore(){
                    return TimeWindowCoreSpy;
                }
                _createContainer(){
                    createContainerSpy(...arguments);
                }
            }
            DummyWindowMultipleCounters = DummyWindowMultipleCountersO;
       
            timeBasedWindowMultipleCounters = new TimeBasedWindowMultipleCounters
        })
        it('Should create `TimeWindowCore` ' , ()=>{
            const timeBasedWindowMultipleCounters = new DummyWindowMultipleCounters(timeWindowMultipleCountersOptions);
            setPublicOnSpy = ()=>0;
            timeBasedWindowMultipleCounters._createContainer = TimeBasedWindowMultipleCounters.prototype._createContainer.bind(timeBasedWindowMultipleCounters); 
            timeBasedWindowMultipleCounters._createContainer(1);

            expect(TimeWindowCoreSpy).to.have.been.called()
        });
        it('Should create container #setPublicOn on `this` ' , ()=>{
            const timeBasedWindowMultipleCounters = new DummyWindowMultipleCounters(timeWindowMultipleCountersOptions);
            setPublicOnSpy = chai.spy(()=>9);
            timeBasedWindowMultipleCounters._createContainer = TimeBasedWindowMultipleCounters.prototype._createContainer.bind(timeBasedWindowMultipleCounters); 
            timeBasedWindowMultipleCounters._createContainer(1);

            expect(timeBasedWindowMultipleCounters.container).to.not.equal(undefined);
        });
        it('Should create container #setPublicOn on `this` ' , ()=>{
            const timeBasedWindowMultipleCounters = new DummyWindowMultipleCounters(timeWindowMultipleCountersOptions);
            setPublicOnSpy = chai.spy(()=>9);
            timeBasedWindowMultipleCounters._createContainer = TimeBasedWindowMultipleCounters.prototype._createContainer.bind(timeBasedWindowMultipleCounters); 
            timeBasedWindowMultipleCounters._createContainer(1);

            expect(setPublicOnSpy).to.have.been.called()
        });
    });
    describe('#_getLastBucketValueAndCreateKey' , ()=>{
        let getLastBucketSpy;
        let timeWindowMultipleCounters;
        let bucketValueValue;
        let lastWidnowValueSetterSpy;
        beforeEach(()=>{
            lastWidnowValueSetterSpy = chai.spy(()=>{
            })
            bucketValueValue = {
                "g":10,
                set t(v){
                    lastWidnowValueSetterSpy(...arguments);
                }
            };
            getLastBucketSpy = chai.spy(()=>({
                bucketValue : {
                    value : bucketValueValue
                }
            }));
            class DummyWindowMultipleCounters extends TimeBasedWindowMultipleCounters{
                get TimeWindowCore(){
                    return TimeWindowCoreSpy;
                }
                _createContainer(){
                    createContainerSpy(...arguments);
                }
            }
       
            timeWindowMultipleCounters = new DummyWindowMultipleCounters({});
            timeWindowMultipleCounters.getLastBucket = getLastBucketSpy;
        });
        it('Should call #getLastBucket()' , ()=>{
            timeWindowMultipleCounters._getLastBucketValueAndCreateKey("key");

            expect(getLastBucketSpy).to.have.been.called();
        });
        it('Should not create key if one exists', ()=>{
            timeWindowMultipleCounters._defaultNumber = chai.spy(()=>4);

            timeWindowMultipleCounters._getLastBucketValueAndCreateKey("g");
            expect(Object.keys(bucketValueValue).length).to.equal(2);
            expect(timeWindowMultipleCounters._defaultNumber).to.have.not.been.called();
        });
        it('Should create key if one not exists', ()=>{
            timeWindowMultipleCounters._defaultNumber = chai.spy(()=>4);
            timeWindowMultipleCounters._getLastBucketValueAndCreateKey("gsdaf");
            expect(Object.keys(bucketValueValue).length).to.equal(3);
            expect(timeWindowMultipleCounters._defaultNumber).to.have.been.called();
        });
    });
    describe("",()=>{
        let getLastBucketSpy;
        let bucketValueValue;
        let lastWidnowValueSetterSpy;
        let timeWindowMultipleCounters;
        beforeEach(()=>{
            lastWidnowValueSetterSpy = chai.spy(()=>{
            })
            bucketValueValue = {
                "g":30,
                get t(){
                    return 10
                },
                set t(v){
                    lastWidnowValueSetterSpy(...arguments);
                }
            };
            getLastBucketSpy = chai.spy(()=>({
                bucketValue : {
                    value : bucketValueValue
                }
            }));
            class DummyWindowMultipleCounters extends TimeBasedWindowMultipleCounters{
                get TimeWindowCore(){
                    return TimeWindowCoreSpy;
                }
                _createContainer(){
                    createContainerSpy(...arguments);
                }
            }
            timeWindowMultipleCounters = new DummyWindowMultipleCounters({});
            timeWindowMultipleCounters.getLastBucket = getLastBucketSpy;
        })

        describe('#increase',()=>{
            it('Should decrease lastWindow.widnowValue.value by 1' , ()=>{
                timeWindowMultipleCounters.increase('t');
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(11);
            })
        });
        describe('#decrease',()=>{
            it('Should decrease lastWindow.widnowValue.value by 1' , ()=>{
                timeWindowMultipleCounters.decrease('t');
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(9);
            })
        });
        describe('#increaseBy',()=>{
            it('Should increase lastWindow.widnowValue.value by x' , ()=>{
    
                timeWindowMultipleCounters.increaseBy('t',10);
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(20);
            })
        });
        describe('#decreaseBy',()=>{
            it('Should decrease lastWindow.widnowValue.value by x' , ()=>{
    
                timeWindowMultipleCounters.decreaseBy('t',2);
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(8);
            })
        });
        describe('#toArray',()=>{

            it('Should call iterate' , ()=>{
                timeWindowMultipleCounters.iterate = chai.spy();
                timeWindowMultipleCounters.toArray();
    
                expect( timeWindowMultipleCounters.iterate).to.have.been.called()
            });
            it('Should collect iteration elements' , ()=>{
    
                timeWindowMultipleCounters.iterate = function iterate(cb){
                    cb({
                        bucketValue : {value : 10}
                    });
                    cb({
                        bucketValue : {value : 12}
                    })
                }
                const result = timeWindowMultipleCounters.toArray();
    
                expect(result.length).to.equal(2);
                expect(result[0]).to.equal(10);
                expect(result[1]).to.equal(12);
            });
        })
    })
});