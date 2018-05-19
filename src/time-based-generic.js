const {TimeBasedWindowMultipleCounters} = require('./time-based-counters');

class GenericTimeBasedStore extends TimeBasedWindowMultipleCounters{
    setInLast( key , value){
        this._getLastBucketValueAndCreateKey(key)[key] = value;
    }
    getFromLast(key){
        return this._getLastBucketValueAndCreateKey(key)[key];
    }
}
module.exports = {
    GenericTimeBasedStore
}