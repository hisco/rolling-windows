const {resultFn} = require('./utils');
const {WindowBucket , TimeWindowCore} = require('./core');

class WindowSingleCounter{
    get WindowBucket(){
        return WindowBucket
    }
    get TimeWindowCore(){
        return TimeWindowCore
    }
    constructor(options){
        if (!options.defaultNumber)
            options.defaultNumber = 0;

        if (!options.defaultValueFactory) {
            const defaultNumber = options.defaultNumber;
            options.defaultValueFactory = function defaultValueCB(){
                return new (this.WindowBucket)(resultFn(defaultNumber));
            }.bind(this)
        }  
        this.defaultValueFactory = options.defaultValueFactory;
        this._createContainer(options);
    }
    _createContainer(options){
        this.container = new (this.TimeWindowCore)(options);
        this.container.setPublicOn(this);
    }
    increase(){
        return this.getLastBucket().bucketValue.value++;
    }
    decrease(){
        return this.getLastBucket().bucketValue.value--;
    }
    increaseBy(by){
        return this.getLastBucket().bucketValue.value+=by;
    }
    decreaseBy(by){
        return this.getLastBucket().bucketValue.value-=by;
    }
    toArray(){
        const array = [];
        this.iterate(function iteration(bucket ){
            array.push(bucket .bucketValue.value);
        });
        return array;
    }
}

module.exports = {
    WindowSingleCounter
}