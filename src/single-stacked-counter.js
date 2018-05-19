
const {WindowSingleCounter} = require('./single-counter');
const {resultFn} = require('./utils');

class WindowSingleStackedCounter extends WindowSingleCounter{
    constructor(options){
        options = options || {};
        
        var firstValue = resultFn(options.defaultNumber) || 0;
        var context;
        options.defaultNumber = function returnStackedNumber(){
            return context ? context.getLastBucket().bucketValue.value : firstValue;
        };
        super(options);
        context = this;
    }
}
module.exports = {
    WindowSingleStackedCounter
}