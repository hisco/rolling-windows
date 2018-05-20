const {TimeBasedWindowMultipleCounters} = require('../src/counters');

const rollingTimeCounters = new TimeBasedWindowMultipleCounters({
    timeWindow : 1000*60, //I want to have information up to 1 minute
    bucketsFrequancy : 1000*10,//I want to have bucket every 10 seconds
});
//Start the internal
rollingTimeCounters.start();

//You can count any event
rollingTimeCounters.increaseBy("eventName" , 50);

//You can iterate over your bucket
rollingTimeCounters.iterateValues((timePoint)=>{
    //This is the bucket value in our case it's a TimePoint    
    console.log(`At ${timePoint.date} the count was ${timePoint.value.eventName} `);
})