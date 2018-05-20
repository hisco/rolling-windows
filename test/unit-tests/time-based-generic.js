const { GenericTimeBasedStore } = require('../../src/time-based-generic');

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

describe('GenericTimeBasedStore' , ()=>{
    const OriginalGenericTimeBasedStoreProto = Object.getPrototypeOf(GenericTimeBasedStore);
    let parentSpy;
    let GenericTimeBasedStoreOptions;
    let genericTimeBasedStore;
    let lastWidnowValueSetterSpy;
    let getLastBucketSpy;
    let lastWindowData;
    function _getLastBucketValueAndCreateKey(key){
        return getLastBucketSpy(key)
    }
    beforeEach(()=>{
        parentSpy = chai.spy(()=>3);
        lastWidnowValueSetterSpy = chai.spy(()=>{
        })
        lastWindowData = {};
        getLastBucketSpy = chai.spy(()=>(lastWindowData));
        class PrarentClass{
            constructor(){
                parentSpy(...arguments);
            }
            
        }
        Object.setPrototypeOf(GenericTimeBasedStore , PrarentClass);
    });
    afterEach(()=>{
        Object.setPrototypeOf(GenericTimeBasedStore , OriginalGenericTimeBasedStoreProto);
    });
    
    describe('#constructor' , ()=>{
        it('Shouldn\'t add change argument' , ()=>{
            new GenericTimeBasedStore('34');

            expect(parentSpy).to.have.been.called.with('34');
        });
        it('Shouldn\'t have defaults' , ()=>{
            new GenericTimeBasedStore();

            expect(parentSpy).to.have.been.called.with();
        });
    });
    
    describe('#setInLast' , ()=>{
        it('Should call #_getLastBucketValueAndCreateKey' , ()=>{
            const genericTimeBasedStore = new GenericTimeBasedStore();
            genericTimeBasedStore._getLastBucketValueAndCreateKey = _getLastBucketValueAndCreateKey;
            
            genericTimeBasedStore.setInLast('key' , 'value');

            expect(getLastBucketSpy).to.have.been.called.with('key');
        });
        it('Should set key to value' , ()=>{
            const genericTimeBasedStore = new GenericTimeBasedStore();
            genericTimeBasedStore._getLastBucketValueAndCreateKey = _getLastBucketValueAndCreateKey;
            
            genericTimeBasedStore.setInLast('key' , 'value');

            expect(lastWindowData.key).to.equal('value');
        });
    })
    describe('#getFromLast' , ()=>{
        it('Should call #_getLastBucketValueAndCreateKey' , ()=>{
            const genericTimeBasedStore = new GenericTimeBasedStore();
            genericTimeBasedStore._getLastBucketValueAndCreateKey = _getLastBucketValueAndCreateKey;
            
            genericTimeBasedStore.getFromLast('key');

            expect(getLastBucketSpy).to.have.been.called.with('key');
        });
        it('Should get value of key' , ()=>{
            const genericTimeBasedStore = new GenericTimeBasedStore();
            genericTimeBasedStore._getLastBucketValueAndCreateKey = _getLastBucketValueAndCreateKey;
            
            lastWindowData['key']='value';
            genericTimeBasedStore.getFromLast('key');

            expect(lastWindowData.key).to.equal('value');
        });
    })
});