const {WindowSingleCounter} = require('./single-counter');
const {resultFn} = require('./utils');
const {TimePoint } = require('./core');

class TimeBasedWindowCounter extends WindowSingleCounter{
    constructor(options){
        options = options || {};
        if (!options.defaultNumber)
        options.defaultNumber = 0;

        if (!options.defaultValueFactory)  {
 
            const defaultNumber = options.defaultNumber;
            options.defaultValueFactory = function defaultValueFactory(){
                return new TimePoint(Date.now() , resultFn(defaultNumber ))
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
    
}

module.exports = {
    TimeBasedWindowCounter
}