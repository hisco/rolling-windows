const {WindowSingleCounter} = require('../src/single-counter');

const counter = new WindowSingleCounter({
    timeWindow : 1000*60*60, //I want to have information up tp an hour
    bucketsFrequancy : 1000*20,//I want to have bucket per 20 seconds
});
//increase
counter.increase();


//I can iterate over your bucket and calculate total
let total = 0;
counter.iterateValues((singleValue)=>{  
    total+= singleValue.value;
});
console.log(total);

counter.start();