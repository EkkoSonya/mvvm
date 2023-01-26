import {Dep} from './observer'

// Watcher的目的是给需要变化的元素增加一个监视，当数据变化后执行对应的方法
export default class Watcher {
    public cb:any; 
    public vm:any;
    public expOrFn:any;

    public getter:Function;
    public value:any;
    public depIds = {};

    constructor(vm:any, expOrFn:any, cb:any) {
        this.cb = cb;
        this.vm = vm;
        this.expOrFn = expOrFn;

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        }
        else {
            this.getter = this.parseGetter(expOrFn.trim())
        }

        this.value = this.get();
    };

    update() {
        this.run();
    };

    run() {
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    };

    addDep(dep:any) {
        // console.log(this.depIds,111)
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    };

    get() {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        // console.log(this.getter())
        Dep.target = null;
        return value;
    };

    parseGetter(exp:any) {
        if (/[^\w.$]/.test(exp)) return;

        var exps = exp.split('.');

        return function(obj:any) {
            // console.log(exp)
            for (let i = 0, len = exps.length; i < len;i++){
                if(!obj) return;
                obj = obj[exps[i]];
            }
            // console.log(obj)
            return obj;
        }
    } 
}