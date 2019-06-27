
class WindowBucket{
    constructor(value){
        this.bucketValue = value;
    }
}  
class SingleValue{
    constructor(value){
        this.value = value;
    }
}  

class MultiValue{

}
class TimePoint {
    constructor(at , value){
        this.date = at;
        this.value = value;
    }
}

class WindowCore{
    constructor({
        bucketsCount,
        defaultValueFactory,
        onRemoved,
        preFillWindow
    }){
        if (isNaN(bucketsCount) || bucketsCount == Infinity)
            throw new Error("Windows count wasn't defined or was set to infinity");

        this.bucketsCount = bucketsCount;
        this.defaultValueFactory = defaultValueFactory;
        
        if (preFillWindow){
            this._createBuckets(bucketsCount);
            if (onRemoved){
                this.onRemoved = onRemoved;
                this.tick = this._tickWithOnRemoved.bind(this);
            }
            else {
                this.tick = this._tickOnly.bind(this);
            }
        }
        else{
            this._createBuckets(1);
            this.counter = 0;
            if (onRemoved){
                this.onRemoved = onRemoved;
                this.tick = this._tickAndFillWithOnRemoved.bind(this);
            }
            else {
                this.tick = this._tickAndFillOnly.bind(this);
            }
        }
        
        this.getLastBucket = this._getLastBucket.bind(this);
        this.addAndTick = this._addAndTick.bind(this);
        this.iterate = this._iterate.bind(this);
        this.iterateValues = this._iterateValues.bind(this);
        this.asyncIterate = this._asyncIterate.bind(this);
        this.asyncIterateValues = this._asyncIterateValues.bind(this);
    }
    _createBuckets(bucketsCount ){
        let first = new WindowBucket(this.defaultValueFactory());
        let last = first;
        for (let i= 0;i<bucketsCount-1;i++){
            last = last.next = new WindowBucket(this.defaultValueFactory());
        }
        this.next = first;
        this.last = last;
    }
    setPublicOn(instance){
        instance.addAndTick = this.addAndTick;
        instance.tick = this.tick;
        instance.iterate = this.iterate;
        instance.iterateValues = this.iterateValues;
        instance.getLastBucket = this.getLastBucket;
        instance.asyncIterate = this.asyncIterate;
        instance.asyncIterateValues = this.asyncIterateValues;
    }
    _addChildAtTheEnd(){
        this.last = this.last.next = new WindowBucket(this.defaultValueFactory());
    }
    _addAndTick(value){
        this._addChildAtTheEnd();
        this.last.value = value;
    }
    _tickWithOnRemoved(){
        var aboutToBeDeleted = this.next;
        this._tickOnly();
        if (this.counter >= this.bucketsCount)
            this.onRemoved(aboutToBeDeleted);
    }

    _tickOnly(){
        this.next = this.next.next;
        this._addChildAtTheEnd();
    }
    _tickAndFillOnly(){
        this.counter++;
        if (this.counter > this.bucketsCount)
            this.next = this.next.next;

        this._addChildAtTheEnd();
    }
    _tickAndFillWithOnRemoved(){
        var aboutToBeDeleted = this.next;
        this._tickAndFillOnly();
        if (this.counter > this.bucketsCount)
            this.onRemoved(aboutToBeDeleted);
    }
    
    _iterate(cb){
        var i = 0;
        var current = this;
        while(current.next){
            current = current.next;
            cb(current, i++);
        }
    }
    _iterateValues(cb){
       this.iterate(function iterateValues(bucket , i){
            cb(bucket.bucketValue , i);
       })
    }
    _asyncIterate(cb , userDone){
        var i = 0;
        var current = this;
        function iteration(){
            current = current.next;
            cb(current,i++,next);
            function next(){
                if (current.next)
                    iteration();
                else if (userDone)
                    userDone(i); 
            }
        }
        iteration();
    }
    _asyncIterateValues(cb , userDone){
        this.asyncIterate(function asyncIterate(bucket , i , next){
            cb(bucket.bucketValue , i , next);
        } , userDone)
    }
    _getLastBucket(){
        return this.last;
    }
}
class TimeWindowCore{
    get WindowCore(){
        return WindowCore;
    }
    constructor({
        timeWindow,
        bucketsFrequency,
        defaultValueFactory,
        onRemoved
    }){
    
       this._createContainer(
           parseInt(timeWindow/bucketsFrequency),
           onRemoved,
           defaultValueFactory
        );
        this.bucketsFrequency = bucketsFrequency;
    }
    _getTimeToNextTick(){
        return (this.lastTick + this.bucketsFrequency) - Date.now();
    }
    _onIntervalTick(){
        this.lastTick = Date.now();
        this.tick();
    }
    _startInterval(){
        this._stopInterval();
        this._interval = this._setInterval(this._onIntervalTick.bind(this), this.bucketsFrequency);
    }
    get _setInterval(){
        return setInterval;
    }
    get _clearInterval(){
        return clearInterval;
    }
    _stopInterval(){
        if(this._interval){
            this._clearInterval(this._interval);
        }
        this._interval = null;
    }
    _start(){
        this._startInterval();
    }
    _pause(){
        this._stopInterval();
    }
    setPublicOn(instance){
        this.container.setPublicOn(instance);
        instance.getTimeToNextTick = this._getTimeToNextTick.bind(this);
        instance.start = this.start;
        instance.pause = this.pause;
    }

    _createContainer(
        bucketsCount,
        onRemoved,
        defaultValueFactory
    ){
        this.container = new (this.WindowCore)({
            bucketsCount,
            onRemoved,
            defaultValueFactory
        });
        this.container.setPublicOn(this);
        this.start = this._start.bind(this);
        this.pause = this._pause.bind(this);
        
    }
}
module.exports = {
    SingleValue,
    WindowBucket,
    MultiValue,
    WindowCore,
    TimePoint ,
    TimeWindowCore
}