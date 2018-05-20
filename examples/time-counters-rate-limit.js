const REQUEST_LIMIT_PER_HOUR = 1000;
const {TimeBasedWindowMultipleCounters} = require('../src/time-based-counters');
const querystring = require('querystring');

const rollingTimeCounters = new TimeBasedWindowMultipleCounters({
    timeWindow : 1000*60*60, //I want to have information up to 1 hour
    bucketsFrequancy : 1000*2,//I want to have bucket every 1 minute
});
//Start the internal interval
rollingTimeCounters.start();

function verifyRateLimitAndSetHeaders(clientAccount , res ){
    let shouldBlock = false;
    //If the account already passed the limit we need to block it
    let requestsThisHour = 0;
    //Find requests count of the last hour - the full window
    rollingTimeCounters.iterateValues((singleValue)=>{
        const multiValues = singleValue.value;
        const counter = multiValues[clientAccount];
        if (typeof counter == 'number')
            requestsThisHour+=counter;
    });
    if (shouldBlock){
        return false;
    }
    else {
        //Request passed - count it
        rollingTimeCounters.increase(clientAccount);
        //Sending rate limits information to the client
        res.setHeader('X-RateLimit-Reset' , rollingTimeCounters.getTimeToNextTick());
        res.setHeader('X-RateLimit-Remaining' , REQUEST_LIMIT_PER_HOUR - requestsThisHour-1 );
        res.setHeader('X-RateLimit-Limit' , REQUEST_LIMIT_PER_HOUR);
        return true;
    }
    
    //Find if this account passed one of the limits
}
require('http').createServer((req, res) => {
    if (/^\/\??/.test(req.url)){
        req.query = querystring.parse(req.url.replace(/^\/\??/ , ''));
        const clientAccount = req.query.clientAccount;
        if (clientAccount){
            res.setHeader('Content-Type', 'text/json');
            const canPass = verifyRateLimitAndSetHeaders(clientAccount , res);
            if (canPass){
                //Request is within account limits
                res.writeHead(200);
                res.end(`{"status" : "Passed"}`);
            }
            else {
                //Request blocked
                res.writeHead(429);
                res.end(`{"status" : "Blocked"}`);
            }
        }
       else{
            res.writeHead(401);
            res.end(`Please send \`clientAccount\` in query string to use this API `)
       }
    }
    else{
        res.writeHead(404);
        res.end(`Please use only the root "/" `)
    }
  }).listen(3030);