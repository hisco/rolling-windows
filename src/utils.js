function resultFn(fn){
    if (typeof fn == 'function')
        return fn();
    return fn;
}  

module.exports = {
    resultFn
}