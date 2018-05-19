const {WindowMultipleCounters} = require('../src/counters');

const rollingCounters = new WindowMultipleCounters({
    timeWindow : 1000*60*60, //I want to have information up tp an hour
    bucketsFrequancy : 1000*20,//I want to have bucket per 20 seconds
    defaultValueFactory : function(){return 0}, //I want every counter to start with default 0
    onRemoved : function(bucket){
        console.log('A minute have passed, the following bucket was just released from memory');
        console.log(bucket);
    }
});

rollingCounters.start();

const server = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  }).listen(3030);