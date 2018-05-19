export declare module RollingTimeWindow{
    export class WindowBucket<T>{
        constructor(value : T);
        bucketValue:T;
    }
    export interface TimeWindowCoreOptions<T>{
        timeWindow : number,
        bucketsFrequancy : number,
        defaultValueFactory : defaultValueFactory<T>,
        onRemoved : onRemoved<BucketValue<T>>;
    }
    export interface TimeWindowCounterOptions extends TimeWindowCoreOptions<number>{
        defaultNumber : number
    }
    export type defaultValueFactory<T> = ()=>T;
    export type onRemoved<T> = ()=>T;
    export type iterationSyncCallback<T> = (windowBucket:WindowBucket<T>,i:number)=>void;
    export type iterationAsyncCallback<T> = (windowBucket:WindowBucket<T>, i:number , next : ()=>void)=>void;
    export interface WindowCoreOptions<T>{
        bucketsCount : number;
        defaultValueFactory : defaultValueFactory<T>;
        onRemoved :onRemoved<BucketValue<T>>;
        preFillWindow : boolean;
    }
    export class WindowCore<T>{
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
    export class TimeWindowCore<T> extends WindowCore<T>{
        constructor(options : TimeWindowCoreOptions<T>);
        contatiner:WindowCore<T>;
        start():void;
        pause():void;
    }
    export class WindowSingleCounter extends TimeWindowCore<number>{
        constructor(options : TimeWindowCounterOptions);
        contatiner:TimeWindowCore<number>;
        increase():number;
        decrease():number;
        increaseBy(by:number):number;
        decreaseBy(by:number):number;
        toArray():number[];
    }
    export class WindowSingleStackedCounter extends WindowSingleCounter{

    }
    export class TimePointPoint {
        at:number;
        value:number;
    }
    export class TimeBasedWindowCounter extends WindowSingleCounter{
        toDateArray():WindowBucket<number>[]
    }
    export class MultiValue{
        [key:string]:number|any;
    }
    export class WindowMultipleCounters extends TimeWindowCore<TimePointPoint <MultiValue>>{
        toArray():MultiValue[];
        contatiner:TimeWindowCore<MultiValue>;
        increase(key:string):number;
        decrease(key:string):number;
        increaseBy(key:string,by:number):number;
        decreaseBy(key:string,by:number):number;
    }
    
    export class TimeBasedWindowMultipleCounters extends WindowMultipleCounters{
        toDateArray():WindowBucket<TimePointPoint<MultiValue>>[]
        increase(key:string):number;
        decrease(key:string):number;
        increaseBy(key:string,by:number):number;
        decreaseBy(key:string,by:number):number;
    }
    export class GenericTimeBaseStore extends TimeBasedWindowMultipleCounters{
        setInLast<T>(key:string , value:number);
        getFromLast<T>(key:string ):number;
    }
}