const { WindowBucket , WindowCore , TimeWindowCore , TimePointPoint  , MultiValue } = require('../../src/core');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('WindowBucket' , ()=>{
    let windowBucket;
    beforeEach(()=>{
        windowBucket = new WindowBucket(2);
    });
    describe('#contructor', ()=> {
        it('Should assign first argument to the value property' , ()=>{
            expect(windowBucket.bucketValue).to.equal(2); 
        })
    });
    describe('#next', ()=> {
        it('Should behave like a regular property' , ()=>{
            windowBucket.next = "something";  
            expect(windowBucket.next).to.equal("something"); 
        })
    });
});
describe('WindowCore' , ()=>{
    describe('#contructor', ()=> {
        let windowCore;
        let windowOptions;
        beforeEach(()=>{
            windowOptions = {
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>{},
                preFillWindow : false
            };
        });
        it('Should throw an exception if bucketsCount is NaN' , ()=>{
            windowOptions.bucketsCount = "ddd";
            function badConstruction(){
                windowCore = new WindowCore(windowOptions);
            }
            expect(badConstruction).to.throw();
        });
        it('Should throw an exception if bucketsCount is Infinity' , ()=>{
            windowOptions.bucketsCount = Infinity;
            function badConstruction(){
                windowCore = new WindowCore(windowOptions);
            }

            expect(badConstruction).to.throw();
        });
        it('Should assign bucketsCount as bucketsCount passed in argument' , ()=>{
            windowOptions.bucketsCount = 17;

            windowCore = new WindowCore(windowOptions);
            expect(windowCore.bucketsCount).to.equal(windowOptions.bucketsCount);
        });
        it('Should assign defaultValueFactory as defaultValueFactory in argument' , ()=>{
            windowOptions.defaultValueFactory = ()=>{};

            windowCore = new WindowCore(windowOptions);
            expect(windowCore.defaultValueFactory).to.equal(windowOptions.defaultValueFactory);
        });
        it('Should call _createBuckets with bucketsCount X if preFillWindow is true' , ()=>{
            windowOptions.preFillWindow = true;
            windowOptions.bucketsCount = 10;
            const spy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spy(...arguments);
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(spy).to.have.been.called.with(windowOptions.bucketsCount);
        });
        it('Should call _createBuckets with bucketsCount equals to 1 if preFillWindow is false' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.bucketsCount = 10;
            const spy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spy(...arguments);
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(spy).to.have.been.called.with(1);
        });
        it('Should set onRemoved if preFillWindow is true' , ()=>{
            windowOptions.preFillWindow = true;
            windowOptions.onRemoved = ()=>{};
            const spy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spy(...arguments);
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.onRemoved).to.equal(windowOptions.onRemoved);
        });
        it('Should set tick to be equal to _tickWinthOnRemoved if preFillWindow and onRemmoved are truthy' , ()=>{
            windowOptions.preFillWindow = true;
            windowOptions.onRemoved = ()=>{};
            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickWithOnRemoved(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.tick).to.equal(windowCore._tickWithOnRemoved.bind(windowCore));
        });
        it('Should set tick to be equal to _tickOnly if preFillWindow is truthy' , ()=>{
            windowOptions.preFillWindow = true;
            windowOptions.onRemoved = null;

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickOnly(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.tick).to.equal(windowCore._tickOnly.bind(windowCore));
        });
        it('Should call _createWidnows(1) if preFillWindow is falsy' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = null;

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickOnly(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(spyDummy).to.have.been.called.with(1);
        });
        it('Should set onRemoved if preFillWindow is false' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = ()=>{};

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.onRemoved).to.equal(windowOptions.onRemoved);
        });
        it('Should not set onRemoved if onRemoved is falsy' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = null;

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.onRemoved).to.equal(undefined);
        });
        it('Should set tick to be equal to _tickOnly if preFillWindow is falsy' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = ()=>{};

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickOnly(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.onRemoved).to.equal(windowOptions.onRemoved);
        });
        it('Should set tick to be equal to _tickAndFillWithOnRemoved if preFillWindow is falsy' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = ()=>{};

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickAndFillWithOnRemoved(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.tick).to.equal(windowCore._tickAndFillWithOnRemoved.bind(windowCore));
        });
        it('Should set tick to be equal to _tickAndFillOnly if preFillWindow and onRemoved are falsy' , ()=>{
            windowOptions.preFillWindow = false;
            windowOptions.onRemoved = null;

            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _tickAndFillOnly(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.tick).to.equal(windowCore._tickAndFillOnly.bind(windowCore));
        });

        it('Should set getLastBucket' , ()=>{
            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _getLastBucket(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.getLastBucket).to.equal(windowCore._getLastBucket.bind(windowCore));
        });
        it('Should set iterate' , ()=>{
            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _iterate(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.iterate).to.equal(windowCore._iterate.bind(windowCore));
        });
        it('Should set addAndTick' , ()=>{
            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _addAndTick(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.addAndTick).to.equal(windowCore._addAndTick.bind(windowCore));
        });
        it('Should set asyncIterate' , ()=>{
            const spy = chai.spy(function (){});
            const spyDummy = chai.spy(function (){});
            class DummyWindowCore extends WindowCore{
                constructor(){
                    super(...arguments);
                }
                _createBuckets(){
                    return spyDummy(...arguments);
                }
                get _asyncIterate(){
                    return {bind:()=>spy};
                }
            }
            windowCore = new DummyWindowCore(windowOptions);
            expect(windowCore.asyncIterate).to.equal(windowCore._asyncIterate.bind(windowCore));
        });
    });
    describe('#createWindow' , ()=>{
        let windowCore;
        let _createBuckets;
        let windowOptions;
        beforeEach(()=>{
            windowOptions = {
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>{},
                preFillWindow : false
            };
            windowCore = {
                defaultValueFactory : chai.spy(()=>1),
            };
            _createBuckets = WindowCore.prototype._createBuckets.bind(windowCore);
        });
        it('Should create as much buckets as bucketsCount(3)' , ()=>{
            _createBuckets(3);
            let current;
            expect(current = windowCore.next).to.not.equal(undefined);
            expect(current = current.next).to.not.equal(undefined);
            expect(current = current.next).to.not.equal(undefined);
            //The firth shouldn't exist
            expect(current = current.next).to.equal(undefined);
        });
        it('Should create as much buckets as bucketsCount(3)' , ()=>{
            _createBuckets(4);
            let current;
            expect(current = windowCore.next).to.not.equal(undefined);
            expect(current = current.next).to.not.equal(undefined);
            expect(current = current.next).to.not.equal(undefined);
            expect(current = current.next).to.not.equal(undefined);
            //The fith shouldn't exist
            expect(current = current.next).to.equal(undefined);
        });
        it('Should create the same pointer on first and last if it\'s a single bucket' , ()=>{
            _createBuckets(1);

            expect(windowCore.next).to.not.equal(undefined);
            expect(windowCore.next).to.equal(windowCore.last);
        });
        it('Should call defaultValueFactory and pass it\'s value to WindowBucket' , ()=>{
            _createBuckets(1);

            expect(windowCore.defaultValueFactory).to.have.been.called();
            expect(windowCore.next.bucketValue).to.equal(1)
        });
    });
    describe('#setPublicOn' , ()=>{
        let windowCore;
        let instance = {};
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>{},
                preFillWindow : false
            });
        });
        it('Should set tick on instance' , ()=>{
            windowCore.setPublicOn(instance);

            expect(instance.tick).to.equal(windowCore.tick)
        });
        it('Should set addAndTick on instance' , ()=>{
            windowCore.setPublicOn(instance);

            expect(instance.addAndTick).to.equal(windowCore.addAndTick)
        });
        it('Should set iterate on instance' , ()=>{
            windowCore.setPublicOn(instance);

            expect(instance.iterate).to.equal(windowCore.iterate)
        });
        it('Should set getLastBucket on instance' , ()=>{
            windowCore.setPublicOn(instance);

            expect(instance.getLastBucket).to.equal(windowCore.getLastBucket)
        });
        it('Should set asyncIterate on instance' , ()=>{
            windowCore.setPublicOn(instance);

            expect(instance.asyncIterate).to.equal(windowCore.asyncIterate)
        });
    });
    describe('#_addChildAtTheEnd' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : chai.spy(function (){
                    return 1;
                }),
                onRemoved : ()=>{},
                preFillWindow : false
            });
        });
        it('Should add a new child at the end' , ()=>{
            const lasChild = windowCore.last;

            windowCore._addChildAtTheEnd();

            expect(windowCore.last).to.not.equal(lasChild);
        });
        it('Should add set the last child to point on the new last child' , ()=>{
            const lasChild = windowCore.last;

            windowCore._addChildAtTheEnd();

            expect(lasChild.next).to.not.equal(windowCore.next);
        });
        it('Should pass the return value of defaultValueFactory to WindowBucket' , ()=>{
            windowCore._addChildAtTheEnd();

            expect(windowCore.last.bucketValue).to.equal(1)
        });
    })
    describe('#_tickWithOnRemoved' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : false
            });
        });
        it('Should call _tickOnly before removing the first bucket' , ()=>{
            let nextDuring;
            const nextBefore = windowCore.next;
            const spy = chai.spy(function (){
                nextDuring = windowCore.next;
                windowCore.next = "something else"
            });
            windowCore._tickOnly = spy;

            windowCore._tickWithOnRemoved();

            const nextAfter = windowCore.next;
            expect(spy).to.have.been.called();
            expect(nextBefore).to.equal(nextDuring);
            expect(nextBefore).to.not.equal(nextAfter);
        });
        it('Should call onRemoved with deleted bucket when counter > bucketsCount' , ()=>{
            const nextBefore = windowCore.next;
            windowCore.counter = 40;
 
             windowCore._tickWithOnRemoved();
 
             expect(windowCore.onRemoved).to.have.been.called.with(nextBefore);
         });
         it('Shouldn\'t call onRemoved when  counter <= bucketsCount' , ()=>{
            const nextBefore = windowCore.next;
 
             windowCore._tickWithOnRemoved();
 
             expect(windowCore.onRemoved).to.have.not.been.called.with(nextBefore);
         });
    });
    describe('#_tickOnly' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : false
            });
            windowCore._addChildAtTheEnd = chai.spy(function (){
            })
        });
        it('Should set first child as the second child in the list' , ()=>{
            const secondChild = windowCore.next.next;

            windowCore._tickOnly();

            expect(windowCore.next).to.equal(secondChild);
        });
        it('Should call _addChildAtTheEnd' , ()=>{
            const secondChild = windowCore.next.next;

            windowCore._tickOnly();

            expect(windowCore._addChildAtTheEnd).to.have.been.called();
        });
    });
    describe('#_tickAndFillOnly' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : true
            });
            windowCore.counter = 100;
            windowCore._addChildAtTheEnd = chai.spy(function (){})
        });
        it('Should increase counter by 1' , ()=>{
            const lastCount = windowCore.counter;

            windowCore._tickAndFillOnly();

            expect(lastCount + 1).to.equal(windowCore.counter);
        });
        it('Should remove first child if counter is bigger then bucketsCount' , ()=>{
            const second = windowCore.next.next;
            windowCore.counter = 100;
            windowCore._tickAndFillOnly();

            expect(windowCore.next == second).to.equal(true);
        });
        it('Should remove first child if counter is bigger then bucketsCount' , ()=>{
            windowCore._tickAndFillOnly();

            expect(windowCore._addChildAtTheEnd).to.have.been.called();
        });
    });
    describe('#_tickAndFillWithOnRemoved' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : false
            });
        });
        it('Should call _tickAndFillOnly before removing the first bucket' , ()=>{
            let nextDuring;
            const nextBefore = windowCore.next;
            const spy = chai.spy(function (){
                nextDuring = windowCore.next;
                windowCore.next = "something else"
            });
            windowCore._tickAndFillOnly = spy;

            windowCore._tickAndFillWithOnRemoved();

            const nextAfter = windowCore.next;
            expect(spy).to.have.been.called();
            expect(nextBefore).to.equal(nextDuring);
            expect(nextBefore).to.not.equal(nextAfter);
        });
        it('Should call onRemoved with deleted bucket when count > bucketsCount' , ()=>{
            const nextBefore = windowCore.next;
            windowCore.counter = 10;
            windowCore._tickAndFillWithOnRemoved();

            expect(windowCore.onRemoved).to.have.been.called.with(nextBefore);
        });
        it('Shouldn\'t call onRemoved when count <= bucketsCount' , ()=>{
            const nextBefore = windowCore.next;
            windowCore.counter = 1;
            windowCore._tickAndFillWithOnRemoved();

            expect(windowCore.onRemoved).to.have.not.been.called.with(nextBefore);
        });
    });
    describe('#_iterate' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : true
            });
        });
        it('Should collect all elements' , ()=>{
            const array = [];
            windowCore._iterate((windowBucket)=>{
                array.push(windowBucket)
            });

            expect(array.length).to.equal(2);
        })
    });
    describe('#_asyncIterate' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : true
            });
        });
        it('Should touch all elements' , ()=>{
            const array = [];
            windowCore._asyncIterate((windowBucket , i , next)=>{
                array.push(windowBucket);
                next()
            });

            expect(array.length).to.equal(2);
        });
        it('Should call userDone with the size of the list when finished' , ()=>{
            const array = [];
            const userDone = chai.spy(function (){});
            windowCore._asyncIterate((windowBucket , i , next)=>{
                array.push(windowBucket);
                next()
            } , userDone);

            expect(userDone).to.have.been.called.with(2);
        });
    });
    describe('#_getLastBucket' , ()=>{
        let windowCore;
        beforeEach(()=>{
            windowCore = new WindowCore({
                bucketsCount : 2,
                defaultValueFactory : ()=>1,
                onRemoved : chai.spy(function (){
                }),
                preFillWindow : true
            });
        });
        it('Should return last child' , ()=>{
            expect(windowCore._getLastBucket()).to.equal(windowCore.last);
        })
    });
});

describe('TimeWindowCore' , ()=>{
    describe('#constructor' , ()=>{
        let timeWindowCore;
        let timeWindowOptions;
        beforeEach(()=>{
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
        });
        it('Should call _createContainer with correct timeWindow/bucketsFrequancy',()=>{
            const spy = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _createContainer(){
                    return spy;
                }
            };
            timeWindowOptions.timeWindow = 11;
            timeWindowOptions.bucketsFrequancy = 2;
            timeWindowOptions.onRemoved = "something";
            timeWindowOptions.defaultValueFactory = "something1";

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);

            expect(spy).to.have.been.called.with(
                5,
                timeWindowOptions.onRemoved,
                timeWindowOptions.defaultValueFactory
            );
        });
        it('Should set bucketsFrequancy' , ()=>{
            const spy = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _createContainer(){
                    return spy;
                }
            };
            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);

            expect(timeWindowCore.bucketsFrequancy).to.equal(timeWindowOptions.bucketsFrequancy)
        })
    });
    describe('#_onIntervalTick' , ()=>{
        let timeWindowCore;
        let timeWindowOptions;
        beforeEach(()=>{
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }

        })
        it('Should set lastTick' , ()=>{
            const timeWindowCore = new TimeWindowCore(timeWindowOptions);
            timeWindowCore.tick = chai.spy(()=>5);

            timeWindowCore._onIntervalTick();

            expect(timeWindowCore.lastTick).to.be.a("number");
        });
        it('Should call tick' , ()=>{
            const timeWindowCore = new TimeWindowCore(timeWindowOptions);
            timeWindowCore.tick = chai.spy(()=>5);

            timeWindowCore._onIntervalTick();

            expect(timeWindowCore.tick).to.have.been.called();
        });
    })
    describe('#_startInterval' , ()=>{
        let timeWindowCore;
        let timeWindowOptions;
        beforeEach(()=>{
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
        })
        it('Should call _stopInterval' , ()=>{
            const spyStopInterval = chai.spy(()=>5);
            const spyInterval = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _stopInterval(){
                    return spyStopInterval;
                }
                get _setInterval(){
                    return spyInterval
                }
            };

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
            timeWindowCore._startInterval();

            expect(spyStopInterval).to.have.been.called()
        });
        it('Should set _interval ' , ()=>{
            const spyStopInterval = chai.spy(()=>5);
            const spyInterval = chai.spy(()=>5);
            const spyOnIntervalTick = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _stopInterval(){
                    return spyStopInterval;
                }
                get _setInterval(){
                    return spyInterval
                }
                get _onIntervalTick(){
                    return {
                        bind : ()=>spyOnIntervalTick
                    }
                }
            };

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
            timeWindowCore._startInterval();

            expect(spyInterval).to.have.been.called.with(spyOnIntervalTick , timeWindowOptions.bucketsFrequancy);
        
        });
    });
    describe('#_stopInterval' , ()=>{
        let timeWindowCore;
        let timeWindowOptions;
        beforeEach(()=>{
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
        })
        it('Should clear interval only if interval is already set' , ()=>{
            const spyInterval = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _clearInterval(){
                    return spyInterval
                }
            };

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
            timeWindowCore._interval = 100;
            timeWindowCore._stopInterval();

            expect(spyInterval).to.have.been.called.with(100);
        });
        it('Should not clear interval if interval is not set' , ()=>{
            const spyInterval = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _clearInterval(){
                    return spyInterval
                }
            };

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
            timeWindowCore._interval = null;
            timeWindowCore._stopInterval();

            expect(spyInterval).to.have.not.been.called();
        });
        it('Should set interval to null' , ()=>{
            const spyInterval = chai.spy(()=>5);
            class DummyTimeWindowCore extends TimeWindowCore{
                get _clearInterval(){
                    return spyInterval
                }
            };

            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
            timeWindowCore._interval = 1;
            timeWindowCore._stopInterval();

            expect(timeWindowCore._interval).to.equal(null);
    
        })
    });
    describe('#_start' , ()=>{
        let timeWindowCore;
        beforeEach(()=>{
            timeWindowCore = new TimeWindowCore({
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            });
        })
        it('Should call _startInterval' , ()=>{
            timeWindowCore._startInterval = chai.spy(()=>5);

            timeWindowCore._start();

            expect(timeWindowCore._startInterval).to.have.been.called();
        });
    });
    describe('#_pause' , ()=>{
        let timeWindowCore;
        beforeEach(()=>{
            timeWindowCore = new TimeWindowCore({
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            });
        })
        it('Should call _startInterval' , ()=>{
            timeWindowCore._stopInterval = chai.spy(()=>5);

            timeWindowCore._pause();

            expect(timeWindowCore._stopInterval).to.have.been.called();
        });
    });
    describe('#setPublicOn' , ()=>{
        let timeWindowCore;
        let timeWindowOptions;
        let _createContainerSpy;
        let setPublicOnSpy;
        let _getTimeToNextTickSpy;
        beforeEach(()=>{
            _getTimeToNextTickSpy = chai.spy(()=>9);
            setPublicOnSpy = chai.spy(()=>6);
            _createContainerSpy = chai.spy(()=>3);
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
            class DummyTimeWindowCore extends TimeWindowCore{
                get _createContainer(){
                    return _createContainerSpy;
                }
                get _getTimeToNextTick(){
                    return {
                        bind : ()=>{
                            return _getTimeToNextTickSpy;
                        }
                    }
                }
                get container(){
                    return {
                        setPublicOn : (n)=>{
                            return setPublicOnSpy(...arguments)
                        }
                    }
                }
            };
            timeWindowCore = new DummyTimeWindowCore({});
        });

        it('Should call container #setPublicOn ',()=>{
            const spy = chai.spy(()=>4);
            const instance = {};
            timeWindowCore.setPublicOn(instance)

            expect(setPublicOnSpy).to.have.been.called();
        });
        it('Should set `getTimeToNextTick` on instance' , ()=>{
            const spy = chai.spy(()=>4);
            const instance = {};
            timeWindowCore.setPublicOn(instance)

            expect(instance.getTimeToNextTick).to.equal(_getTimeToNextTickSpy);
        });
        it('Should set `start` on instance' , ()=>{
            const spy = chai.spy(()=>4);
            const instance = {};
            timeWindowCore.setPublicOn(instance)

            expect(instance.start).to.equal(timeWindowCore.start);
        });
        it('Should set `pause` on instance' , ()=>{
            const spy = chai.spy(()=>4);
            const instance = {};
            timeWindowCore.setPublicOn(instance)

            expect(instance.pause).to.equal(timeWindowCore.pause);
        });
    });
    describe('#_getTimeToNextTick' , ()=>{

    });
    describe('#_createContainer' , ()=>{
        let timeWindowCore;
        let timeWindowOption;
        let windowCoreSpy;
        let publicOnSpy;
        let startBindSpy;
        let pauseBindSpy;
        let timeWindowOptions;
        beforeEach(()=>{
            publicOnSpy = chai.spy(()=>3);
            startBindSpy = chai.spy(()=>3);
            pauseBindSpy = chai.spy(()=>4);
            timeWindowOptions = {
                timeWindow : 5000,
                bucketsFrequancy : 3,
                defaultValueFactory : ()=>1,
                onRemoved : ()=>4
            }
            windowCoreSpy = chai.spy();
            class DummyTimeWindowCore extends TimeWindowCore{
                get WindowCore(){
                    class DummyWindowCore{
                        constructor(){
                            this.setPublicOn = publicOnSpy;
                            windowCoreSpy(...arguments);
                        }
                        
                    }
                    return DummyWindowCore
                }
                get _start(){
                    return {
                        bind : startBindSpy
                    }
                }
                get _pause(){
                    return {
                        bind : pauseBindSpy
                    }
                }
            };
            timeWindowCore = new DummyTimeWindowCore(timeWindowOptions);
        })
        it('Should create container with parameter passed to it' , ()=>{
            timeWindowCore._createContainer(1,2,3);

            expect(windowCoreSpy).to.have.been.called.with({
                bucketsCount : 1,
                onRemoved:2,
                defaultValueFactory:3
            });
        });
        it('Should call setPublicOn of container and pass it `this`' , ()=>{
            timeWindowCore._createContainer(1,2,3);

            expect(publicOnSpy).to.have.been.called.with(timeWindowCore);
        });
        it('Should bind _start and set it to #start' , ()=>{
            timeWindowCore._createContainer(1,2,3);

            expect(startBindSpy).to.have.been.called.with(timeWindowCore);
            expect(timeWindowCore.start).to.equal(3)
        });
        it('Should bind _pause and set it to #pause' , ()=>{
            timeWindowCore._createContainer(1,2,3);

            expect(pauseBindSpy).to.have.been.called.with(timeWindowCore);
            expect(timeWindowCore.pause).to.equal(4);
        });
    });
});

describe('TimePointPoint ' , ()=>{
    describe('#consturctor' , ()=>{
        let timePointBucket ;
        beforeEach(()=>{
            timePointBucket  = new TimePointPoint (1,2);
        })
        it('Should set `date` ' , ()=>{
            expect(timePointBucket.date).to.equal(1);
        });
        it('Should set `value` ' , ()=>{
            expect(timePointBucket.value).to.equal(2);
        })
    })
});

describe('MultiValue' , ()=>{
    describe('#constructor' , ()=>{
        const multiValue = new MultiValue();
        expect(multiValue).to.not.equal(undefined);
    })
});