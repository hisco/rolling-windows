const {TimeBasedWindowMultipleCounters} = require('../src/time-based-counters');

const rollingTimeCounters = new TimeBasedWindowMultipleCounters({
    timeWindow : 1000*20, //I want to have information up to 20 seconds
    bucketsFrequancy : 1000*2,//I want to have bucket per 2 seconds
});
rollingTimeCounters.start();

const server = require('http').createServer((req, res) => {
    if (req.url == '/info'){
        res.setHeader('Content-Type', 'application/json');

        const results = {
            aggregated : {
                '500' : 0,
                '200' : 0
            },
            rawBucketsData : [],
            dateArray : rollingTimeCounters.toDateArray()
        }
        rollingTimeCounters.iterateValues((multiValue)=>{
            const values = multiValue.value;
            results.rawBucketsData.push(values);
            if (values["200"])
                results.aggregated["200"]+= values["200"];
            if (values["500"])
                results.aggregated["500"]+= values["500"];
        });
        res.writeHead(200);
        res.end(JSON.stringify(results));
    }
    else if (req.url == '/'){
        res.setHeader('Content-Type', 'text/palin');
        let isError = Math.floor(Math.random()*2) === 1;
        if (isError){
            rollingTimeCounters.increase(500);
            res.writeHead(500);
            res.end('I\'m going to report that you just had an error');
        }
        else{
            rollingTimeCounters.increase(200);
            res.writeHead(200);
            res.end('ok');
        }
    }
    else{
        res.writeHead(404);
        res.end(`Please use only the "/" or "/info" pages`)
    }
  }).listen(3030);