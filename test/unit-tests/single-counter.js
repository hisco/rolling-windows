const { WindowSingleCounter } = require('../../src/single-counter');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('WindowSingleCounter' , ()=>{
    let windowSingleCounter;
    let windowSingleConterOptions;
    let constructorSpy;
    let setPublicOnSpy;
    let DummyWindowSingleCounter;
    let SingleValueSpy;
    let TimeWindowCoreSpy;
    let lastWindowSpy;
    let lastWidnowValueSetterSpy;
    let iterateSpy;
    let createContainerSpy;
    beforeEach(()=>{
        constructorSpy = chai.spy(()=>3);
        setPublicOnSpy = chai.spy(()=>5);
        createContainerSpy = chai.spy(()=>18);
        TimeWindowCoreSpy = chai.spy(()=>4);
        SingleValueSpy = chai.spy(()=>19);
        const lastWindow = {
            bucketValue :{
                get value(){
                    return 11;
                },
                set value(v){
                    lastWidnowValueSetterSpy(v);
                }
            }
        }
        lastWindowSpy = chai.spy(()=>lastWindow);
        lastWidnowValueSetterSpy = chai.spy(()=>9);
        windowSingleConterOptions = {
            timeWindow : 5000,
            bucketsFrequancy : 3,
            defaultValueFactory : ()=>1,
            onRemoved : ()=>4
        }
        class DummyWindowSingleCounterO extends WindowSingleCounter{
            constructor(){
                constructorSpy(...arguments);
                super(...arguments);
            }
            get SingleValue(){
                class SingleValueSpyClass{
                    constructor(){
                        SingleValueSpy(...arguments)
                    }
                }
                return SingleValueSpyClass;
            }
            get _createContainer(){
                return createContainerSpy;
            }
            get increase(){
                return WindowSingleCounter.prototype.increase.bind(this);
            }
            get decrease(){
                return WindowSingleCounter.prototype.decrease.bind(this);
            }
            get increaseBy(){
                return WindowSingleCounter.prototype.increaseBy.bind(this);
            }
            get decreaseBy(){
                return WindowSingleCounter.prototype.decreaseBy.bind(this);
            }
            get getLastBucket(){
                return lastWindowSpy;
            }
        }
        DummyWindowSingleCounter = DummyWindowSingleCounterO;
    })
    describe('#constructor',()=>{
        it('Should set `defaultNumber` to 0 if `defaultNumber` is falsy',()=>{
            windowSingleConterOptions.defaultNumber = false;
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            expect(windowSingleConterOptions.defaultNumber).to.equal(0);
        });
        it('Should not set `defaultNumber` to 0 if `defaultNumber` is truthy',()=>{
            windowSingleConterOptions.defaultNumber = true;
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            expect(windowSingleConterOptions.defaultNumber).to.equal(true);
        });
        it('Should set `defaultValueFactory` if it\'s falsy',()=>{
            windowSingleConterOptions.defaultValueFactory = false;
            windowSingleConterOptions.defaultNumber = ()=>5;
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            const defaultValueFactoryResult = windowSingleConterOptions.defaultValueFactory();

            expect(SingleValueSpy).to.have.been.called.with(5);
        });
        
        it('Should not set `defaultValueFactory` if it\'s truthy',()=>{
            windowSingleConterOptions.defaultValueFactory = true;
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            expect(windowSingleConterOptions.defaultValueFactory).to.equal(true);
        });
        it('Should set `defaultValueFactory` on `this`' , ()=>{
            windowSingleConterOptions.defaultValueFactory = true;
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            expect(windowSingleCounter.defaultValueFactory).to.equal(true);
        })
        it('Should call #createContainer' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            expect(createContainerSpy).to.have.been.called.with(windowSingleConterOptions);
        });
    });
    describe('#_createContainer',()=>{
        let windowSingleCounter;
        let windowSingleConterOptions;
        let constructorSpy;
        let setPublicOn;
        let DummyWindowSingleCounter;
        let TimeWindowCoreSpy;
        let lastWindowSpy;
        let lastWidnowValueSetterSpy;
        beforeEach(()=>{
            constructorSpy = chai.spy(()=>3);
            setPublicOnSpy = chai.spy(()=>5);
            TimeWindowCoreSpy = chai.spy(()=>4);
            const lastWindow = {
                bucketValue :{
                    set value(v){
                        lastWidnowValueSetterSpy(v);
                    }
                }
            }
            lastWindowSpy = chai.spy(()=>lastWindow);
            lastWidnowValueSetterSpy = chai.spy(()=>9);
            windowSingleConterOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
            class DummyWindowSingleCounterO{
                constructor(){
                    constructorSpy(...arguments);
                }
                get TimeWindowCore(){
                    class TimeWindowCoreClass{
                        constructor(){
                            TimeWindowCoreSpy(...arguments)
                        }
                        get setPublicOn(){
                            return setPublicOnSpy;
                        }
                    }
                    return TimeWindowCoreClass;
                }
                get _createContainer(){
                    return WindowSingleCounter.prototype._createContainer.bind(this);
                }
            }
            DummyWindowSingleCounter = DummyWindowSingleCounterO;
        });
        it('Should create TimeWindowCore with the options provided in it\'s argument' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter._createContainer(4);

            expect(TimeWindowCoreSpy).to.have.been.called.with(4);
        });
        it('Should set `container`' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter._createContainer(4);

            expect(windowSingleCounter.container).to.not.equal(TimeWindowCoreSpy); 
        });
        it('Should call #setPublicOn of container with `this` as argument' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter._createContainer(4);

            expect(setPublicOnSpy).to.have.been.called.with(windowSingleCounter); 
        })
    });
    describe('#increase',()=>{
        it('Should increase lastWindow.widnowValue.value by 1' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter.increase();

            expect(lastWindowSpy).to.have.been.called()
            expect(lastWidnowValueSetterSpy).to.have.been.called.with(12)
        })
    });
    describe('#decrease',()=>{
        it('Should decrease lastWindow.widnowValue.value by 1' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter.decrease();

            expect(lastWindowSpy).to.have.been.called()
            expect(lastWidnowValueSetterSpy).to.have.been.called.with(10)
        })
    });
    describe('#increaseBy',()=>{
        it('Should increase lastWindow.widnowValue.value by x' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter.increaseBy(10);

            expect(lastWindowSpy).to.have.been.called()
            expect(lastWidnowValueSetterSpy).to.have.been.called.with(21)
        })
    });
    describe('#decreaseBy',()=>{
        it('Should decrease lastWindow.widnowValue.value by x' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter.decreaseBy(2);

            expect(lastWindowSpy).to.have.been.called()
            expect(lastWidnowValueSetterSpy).to.have.been.called.with(9)
        })
    });
    describe('#toArray',()=>{
        it('Should call iterate' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);
            windowSingleCounter.iterate = chai.spy();
            windowSingleCounter.toArray();

            expect( windowSingleCounter.iterate).to.have.been.called()
        });
        it('Should collect iteration elements' , ()=>{
            windowSingleCounter = new DummyWindowSingleCounter(windowSingleConterOptions);

            windowSingleCounter.iterate = function iterate(cb){
                cb({
                    bucketValue : {value : 10}
                });
                cb({
                    bucketValue : {value : 12}
                })
            }
            const result = windowSingleCounter.toArray();

            expect(result.length).to.equal(2);
            expect(result[0]).to.equal(10);
            expect(result[1]).to.equal(12);
        });
    });
});
