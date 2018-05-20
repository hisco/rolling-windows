const {resultFn} = require('./utils');
const {MultiValue , WindowBucket , TimeWindowCore} = require('./core');

class WindowMultipleCounters{
    get TimeWindowCore(){
        return TimeWindowCore;
    }
    get MultiValue(){
        return MultiValue;
    }
    get WindowBucket(){
        return WindowBucket;
    }
    constructor(options){
        if (!options.defaultNumber)
            options.defaultNumber = 0;
        this._defaultNumber = options.defaultNumber;

        if (!options.defaultValueFactory) {
            options.defaultValueFactory = function defaultValueCB(){
                return new WindowBucket(new MultiValue());
            }
        }  
        this.defaultValueFactory = options.defaultValueFactory;
        this._createContainer(options);
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
    toArray(){
        const array = [];
        this.iterate(function iteration(bucket ){
            array.push(bucket.bucketValue.value);
        });
        return array;
    }
}
module.exports = {
    WindowMultipleCounters
}