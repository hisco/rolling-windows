# Rolling time window store

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

  Store your data efficiently in rolling window buckets store.
  This technique is also named:
  * Rolling ring
  * Bucketing
  * Bining
  * Sliding window

  Rolling windows module can be used by both browser and Node.js.

## High perormance
All rolling windows were built with great concern of memory and CPU consumption.
We don't use arrays under the hood.

Inside this module you will be able to find
  * Super-high test coverage
  * class _WindowCore_ - A very simple & basic window, it only manages to additions and disposals of buckets. 
  * class _TimeWindowCore_ - Window that adds and dispose buckets based on a configurable interval.
  * class _WindowSingleCounter_ - Window with counter in every bucket.
  * class _WindowSingleStackedCounter_ - Widnow with stacked counter (Based on previous bucket). 
  * class _TimeBasedWindowCounter_ - Window with counter in every bucket it adds and dispose buckets based on a configurable interval.
  * class _WindowMultipleCounters_ - Window with multiple counters in every bucket. 
  * class _TimeBasedWindowMultipleCounters_ - Window with multiple counters in every bucket it adds and dispose buckets based on a configurable interval. 
  * class _GenericTimeBasedStore_ - Window with generic object in any bucket that you can store any info in the last bucket and query all at once.

Speed and quality are the greatest concerns, this module was built with proper data structures and with some V8 micro-optimizations for even better CPU and memory consumption.

## What is a rolling window?

A rolling window is a technique to process and store a subset of an endless stream of data while perserving the order of processing/disposel of the data.

The window can be considerd as an actual window, while through the window you see at any given time data at a maximum size of the window.
Similiar to a very long train passing and you can see only a few railroas cars at any given time.

It is used in mathemtics to analyze a subset of a bigger set of data points, usally over time.

For example if your planing to count all the requests your server is getting at any last 24 hours, you cannot use a simple stright forward single counter `count++` because you will not know how to descrease the count.
  * You cannot reset the count `count=0` you will lose all your data.
  * You can store a timestamp of every request however, this will consume a lot of memory and CPU because you will store every individual timestamp.

No worries you can just use a 'Rolling window'!

## Simple to use

### Using Javascript
```js
    //Require all `rolling time window` module
    const rollingTimeWindow = require('rolling-time-window');
    //Now you can use `rollingTimeWindow.TimeBasedWindowCounter` etc...

    //Directly load the desired class
    const {WindowSingleCounter ,GenericTimeBasedStore} = require('rolling-time-window');

```

### Using TypeScript
```ts
    import {rollingTimeWindow} from 'rolling-time-window';
    //Now you can use `rollingTimeWindow.TimeBasedWindowCounter` etc...
```

## Why not just array?

The most common and simple implementation of rolling window is sometimes handled by an array under the hood.

### Arrays would have consumed more CPU in this use case
Array is an implementation of a stack data structure and is the best implementation when you need to push/pop something at the end of the stack.
However, when it is also requeired to remove something at the beging of the stack the array will need to *Move* all elements and re-index the entire array with o(n) complexity (Imagine an array with millions of elements). 
While with linked list it's only o(1) complexity at any size of array.

Example of a bad practice:
```js
var a = [1,2,3,4,5];
a.shift() // Will cause o(n) operations
```


### Array would have have wasted more memory
Under the hood arrays are dynamic data strucure these change per the programtic demand in run time.
Generally these are the recomendations of using arrays:
  * Don't pre-allocate large arrays to their maximum size, instead grow as you go.
  * Use contiguous keys starting at 0 for arrays
  * Don't delete elements in arrays.
  * Don't load uninitialized or deleted elements
 
Any deviation from these recomdations will cause the js engine (V8) to move the entire array from one implemnetation of array to the other, this will waste both memory & CPU.

Example of a bad practice:
```js
var a = new Array();
a[0] = 20;   // JS engine allocates
a[1] = 100;
a[2] = 100.5;   // JS engine allocates, converts
a[3] = true; // JS engine allocates, converts
```

Example of a better practice:
```js
var a = [20, 100, 100.5, true];
```

Example of a bad practice:
```js
var a = [1,2,3,4,5];
a.shift() // Will cause o(n) operations
```

## API

All rolling windows handles the basic concept rolling windows some in addition also handels a configurable internal time interval.
A few concepts that will ease the API description:
  * Window / Rolling window - The actual instance the implements the technique or the technique in general.
  * Bucket - A window has multiple buckets/bins that store the data of that window fraction.
  * Tick - The action of addind a bucket at the end of the window and when maximum window size passed it will also remove the bucket at the beginning of the window.
  * Bucket value - The value the bucket points on, it can be a single numeric value, an object , array, etc...

The follwing is *not* a complete module decleration, I sugesst to require the module with TypeScript, it will give you a full view on the entire module.

The following will assist you to gasp what the module can do for you before you install it.
If you are not famillier with TypeScript you can go a head and jump to the exampels.
```ts
    class WindowBucket<T>{
        constructor(public bucketValue : T);
    }
    class SingleValue<T>{
        constructor(public value : T);
    }
    interface TimeWindowCoreOptions<T>{
        timeWindow : number,
        bucketsFrequancy : number,
        defaultValueFactory : defaultValueFactory<T>,
        onRemoved : onRemoved<BucketValue<T>>;
    }
    interface TimeWindowCounterOptions extends TimeWindowCoreOptions<number>{
        defaultNumber : number
    }
    type defaultValueFactory<T> = ()=>T;
    type onRemoved<T> = ()=>T;
    type iterationSyncCallback<T> = (windowBucket:WindowBucket<T>,i:number)=>void;
    type iterationAsyncCallback<T> = (windowBucket:WindowBucket<T>, i:number , next : ()=>void)=>void;
    interface WindowCoreOptions<T>{
        bucketsCount : number;
        defaultValueFactory : defaultValueFactory<T>;
        onRemoved :onRemoved<BucketValue<T>>;
        preFillWindow : boolean;
    }
    class WindowCore<T>{
        bucketsCount:number;
        defaultValueFactory:defaultValueFactory<T>;
        onRemoved:onRemoved<BucketValue<T>>;

        constructor(
            options : WindowCoreOptions<T>
        );
        
        tick():void;
        getLastBucket():WindowBucket<T>;
        iterate(iterationCallback:iterationSyncCallback<T>);
        asyncIterate(iterationCallback : iterationAsyncCallback<T> , done : (total:number)=>void);
        setPublicOn(instance : any):void;
    }
    class TimeWindowCore<T> extends WindowCore<TimePoint>{
        constructor(options : TimeWindowCoreOptions<T>);
        contatiner:WindowCore<T>;
        start():void;
        pause():void;
    }
    class WindowSingleCounter extends TimeWindowCore<SingleValue<number>>{
        constructor(options : TimeWindowCounterOptions);
        contatiner:TimeWindowCore<number>;
        increase():number;
        decrease():number;
        increaseBy(by:number):number;
        decreaseBy(by:number):number;
        toArray():number[];
    }
    class WindowSingleStackedCounter extends WindowSingleCounter{

    }
    class TimePoint {
        at:number;
        value:number;
    }
    class TimeBasedWindowCounter extends WindowSingleCounter{
        toDateArray():WindowBucket<number>[]
    }
    class MultiValue{
        [key:string]:number|any;
    }
    class WindowMultipleCounters extends TimeWindowCore<TimePoint<MultiValue>>{
        toArray():MultiValue[];
        contatiner:TimeWindowCore<MultiValue>;
        increase(key:string):number;
        decrease(key:string):number;
        increaseBy(key:string,by:number):number;
        decreaseBy(key:string,by:number):number;
    }
    class TimeBasedWindowMultipleCounters extends WindowMultipleCounters{
        toDateArray():WindowBucket<TimePoint<MultiValue>>[]
        increase(key:string):number;
        decrease(key:string):number;
        increaseBy(key:string,by:number):number;
        decreaseBy(key:string,by:number):number;
    }
    class GenericTimeBaseStore extends TimeBasedWindowMultipleCounters{
        setInLast<T>(key:string , value:number);
        getFromLast<T>(key:string ):number;
    }
```

##Examples

###Simple use of multiple counters
```js
const {TimeBasedWindowMultipleCounters} = require('rolling-windows');

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
```

#Simple use of single counter
```js
const {WindowSingleCounter} = require('rolling-windows');

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
```

Some cool examples of what you can do with these rolling windows.

###Count the status code of your http server
```js
const {TimeBasedWindowMultipleCounters} = require('rolling-windows');

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
```
###Rate limit your client http requests per client account

In the following example I want to:
   * Limit account to 1K requests an hour.
   * Notify the client on the quata left at any given request.

```js
const REQUEST_LIMIT_PER_HOUR = 1000;
const {TimeBasedWindowMultipleCounters} = require('rolling-windows');
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
```

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/rolling-windows.svg
[npm-url]: https://npmjs.org/package/rolling-windows
[travis-image]: https://img.shields.io/travis/hisco/rolling-windows/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hisco/rolling-windows
[coveralls-image]: https://coveralls.io/repos/github/hisco/rolling-windows/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/hisco/rolling-windows?branch=master
