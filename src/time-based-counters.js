const {WindowMultipleCounters} = require('./counters');
const {resultFn} = require('./utils');
const {MultiValue , TimePoint  , TimeWindowCore} = require('./core');

class TimeBasedWindowMultipleCounters extends WindowMultipleCounters{
    get TimeWindowCore(){
        return TimeWindowCore;
    }
    constructor(options){
        options = options || {};

        if (!options.defaultNumber)
            options.defaultNumber = 0;
        if (!options.defaultValueFactory)  {
            options.defaultValueFactory = function defaultValueFactory(){
                return new TimePoint(Date.now() ,new MultiValue())
            }
        } 
        super(options);
    }
    toDateArray(){
        const array = [];
        this.iterate(function iteration(bucket ){
            array.push(bucket.bucketValue);
        });
        return array;
    }
    _createContainer(options){
        this.container = new (this.TimeWindowCore)(options);
        this.container.setPublicOn(this);
    }
    _getLastBucketValueAndCreateKey(key){
        const lastWindowBucket = this.getLastBucket().bucketValue.value;
        if (!lastWindowBucket.hasOwnProperty(key)){
            lastWindowBucket[key] = resultFn(this._defaultNumber);
        }
        return lastWindowBucket;
    }
    increase(key){
        return this._getLastBucketValueAndCreateKey(key)[key]++;
    }
    decrease(key){
        return this._getLastBucketValueAndCreateKey(key)[key]--;
    }
    increaseBy(key , by){
        return this._getLastBucketValueAndCreateKey(key)[key]+=by;
    }
    decreaseBy(key , by){
        return this._getLastBucketValueAndCreateKey(key)[key]-=by;
    }
}

module.exports = {
    TimeBasedWindowMultipleCounters
}