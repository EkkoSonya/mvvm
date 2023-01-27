import Dep from './dep'
class Observer {
    public data:any;
    constructor(data:any){
        this.data = data;
        this.walk(data);
    };

    walk(data:any){
        var that = this;
        Object.keys(data).forEach(function(key) {
                that.convert(key, data[key]);
        })
    };

    convert(key:any, val:any) {
        this.defineReactive(this.data, key, val);
    };

    defineReactive(data:any, key:any, val:any) {
        var dep = new Dep();
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                // 访问该 key 时如果 Dep.target 指向 Watcher 实例，把该 key 对应的 Dep 实例传递给 Watcher 实例
  				// 也可以直接 dep.addSub(Dep.target)
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅该 key 的 Watcher 实例
                dep.notify();
            }
        })
    }
}

function observe(value:any, vm?:any) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
}

export {observe};