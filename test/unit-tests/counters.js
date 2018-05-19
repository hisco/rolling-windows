const { WindowMultipleCounters } = require('../../src/counters');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('WindowMultipleCounters' , ()=>{
    let windowMultipleCountersOptions;
    let createContainerSpy;
    let DummyWindowMultipleCounters;
    let DummyTimeWindowCore;
    let setPublicOnSpy;
    let TimeWindowCoreSpy;
    beforeEach(()=>{
        createContainerSpy = chai.spy(()=>9);
        TimeWindowCoreSpy = chai.spy(()=>(
            {
                setPublicOn : setPublicOnSpy
            }
        ));
        windowMultipleCountersOptions = {
            timeWindow : 5000,
            bucketsFrequancy : 3,
            defaultValueFactory : ()=>1,
            onRemoved : ()=>4
        }
        class DummyWindowMultipleCountersO extends WindowMultipleCounters{
            get TimeWindowCore(){
                return TimeWindowCoreSpy;
            }
            _createContainer(){
                createContainerSpy(...arguments);
            }
        }
        DummyWindowMultipleCounters = DummyWindowMultipleCountersO;
    })
    describe('#constructor' , ()=>{
        
        it('Should set `defaultNumber` to 0 if not defined' , ()=>{
            const options = {};
        
            const windowMultipleCounters = new DummyWindowMultipleCounters(options);
            expect(windowMultipleCounters._defaultNumber).to.equal(0);
        });
        it('Shouldn\'t set `defaultValueFactoy` if it\'s truthy ' , ()=>{
            const options = {
                defaultValueFactory : 9
            };
        
            const windowMultipleCounters = new DummyWindowMultipleCounters(options);
            expect(windowMultipleCounters.defaultValueFactory).to.equal(9);
        });
        it('Should set `defaultValueFactoy`' , ()=>{
            const options = {
                defaultValueFactory : false
            };
        
            const windowMultipleCounters = new DummyWindowMultipleCounters(options);
            const result = windowMultipleCounters.defaultValueFactory();

            expect(Object.keys(result.bucketValue).length).to.equal(0);
        });
        it('Should call #_createContainer(options)' , ()=>{
            const options = {};
            const windowMultipleCounters = new DummyWindowMultipleCounters(options);

            expect(createContainerSpy).to.have.been.called();
        });
    });
    describe('#_createContainer' , ()=>{
        it('Should create `TimeWindowCore` ' , ()=>{
            const windowMultipleCounters = new DummyWindowMultipleCounters(windowMultipleCountersOptions);
            setPublicOnSpy = ()=>0;
            windowMultipleCounters._createContainer = WindowMultipleCounters.prototype._createContainer.bind(windowMultipleCounters); 
            windowMultipleCounters._createContainer(1);

            expect(TimeWindowCoreSpy).to.have.been.called()
        });
        it('Should create container #setPublicOn on `this` ' , ()=>{
            const windowMultipleCounters = new DummyWindowMultipleCounters(windowMultipleCountersOptions);
            setPublicOnSpy = chai.spy(()=>9);
            windowMultipleCounters._createContainer = WindowMultipleCounters.prototype._createContainer.bind(windowMultipleCounters); 
            windowMultipleCounters._createContainer(1);

            expect(windowMultipleCounters.container).to.not.equal(undefined);
        });
        it('Should create container #setPublicOn on `this` ' , ()=>{
            const windowMultipleCounters = new DummyWindowMultipleCounters(windowMultipleCountersOptions);
            setPublicOnSpy = chai.spy(()=>9);
            windowMultipleCounters._createContainer = WindowMultipleCounters.prototype._createContainer.bind(windowMultipleCounters); 
            windowMultipleCounters._createContainer(1);

            expect(setPublicOnSpy).to.have.been.called.with(windowMultipleCounters)
        });
    });
    describe('#_getLastBucketValueAndCreateKey' , ()=>{
        let getLastBucketSpy;
        let windowMultipleCounters;
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
            windowMultipleCounters = new DummyWindowMultipleCounters(windowMultipleCountersOptions);
            windowMultipleCounters.getLastBucket = getLastBucketSpy;
        });
        it('Should call #getLastBucket()' , ()=>{
            windowMultipleCounters._getLastBucketValueAndCreateKey("key");

            expect(getLastBucketSpy).to.have.been.called();
        });
        it('Should not create key if one exists', ()=>{
            windowMultipleCounters._defaultNumber = chai.spy(()=>4);

            windowMultipleCounters._getLastBucketValueAndCreateKey("g");
            expect(Object.keys(bucketValueValue).length).to.equal(2);
            expect(windowMultipleCounters._defaultNumber).to.have.not.been.called();
        });
        it('Should create key if one not exists', ()=>{
            windowMultipleCounters._defaultNumber = chai.spy(()=>4);
            windowMultipleCounters._getLastBucketValueAndCreateKey("gsdaf");
            expect(Object.keys(bucketValueValue).length).to.equal(3);
            expect(windowMultipleCounters._defaultNumber).to.have.been.called();
        });
    });
    describe("",()=>{
        let getLastBucketSpy;
        let bucketValueValue;
        let lastWidnowValueSetterSpy;
        let windowMultipleCounters;
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
            windowMultipleCounters = new DummyWindowMultipleCounters(windowMultipleCountersOptions);
            windowMultipleCounters.getLastBucket = getLastBucketSpy;
        })

        describe('#decrease',()=>{
            it('Should decrease lastWindow.widnowValue.value by 1' , ()=>{
                windowMultipleCounters.decrease('t');
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(9);
            })
        });
        describe('#increaseBy',()=>{
            it('Should increase lastWindow.widnowValue.value by x' , ()=>{
    
                windowMultipleCounters.increaseBy('t',10);
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(20);
            })
        });
        describe('#decreaseBy',()=>{
            it('Should decrease lastWindow.widnowValue.value by x' , ()=>{
    
                windowMultipleCounters.decreaseBy('t',2);
    
                expect(getLastBucketSpy).to.have.been.called();
                expect(lastWidnowValueSetterSpy).to.have.been.called.with(8);
            })
        });
        describe('#toArray',()=>{

            it('Should call iterate' , ()=>{
                windowMultipleCounters.iterate = chai.spy();
                windowMultipleCounters.toArray();
    
                expect( windowMultipleCounters.iterate).to.have.been.called()
            });
            it('Should collect iteration elements' , ()=>{
    
                windowMultipleCounters.iterate = function iterate(cb){
                    cb({
                        bucketValue : {value : 10}
                    });
                    cb({
                        bucketValue : {value : 12}
                    })
                }
                const result = windowMultipleCounters.toArray();
    
                expect(result.length).to.equal(2);
                expect(result[0]).to.equal(10);
                expect(result[1]).to.equal(12);
            });
        });
    })
});