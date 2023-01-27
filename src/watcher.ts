import Dep from './dep'

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

    addDep(dep:Dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    };

    // 获取 Wacher 实例监视的值
    get() {
        // 访问监听的属性时把 Dep.target 指向自身，从而在 Observer 中把当前实例添加到属性订阅者中
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        // 获取属性值后置空 Dep.target
        Dep.target = null;
        return value;
    };

    parseGetter(exp:any) {
        if (/[^\w.$]/.test(exp)) return;

        var exps = exp.split('.');

        return function(obj:any) {
            for (let i = 0, len = exps.length; i < len;i++){
                if(!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    } 
}