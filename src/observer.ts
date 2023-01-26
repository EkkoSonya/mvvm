class Observer {
    public data:any;
    constructor(data:any){
        this.data = data;
        this.walk(data);
    };

    walk(data:any){
        var that = this;
        // console.log(that)
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
        // console.log(data)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                // console.log(newVal, val, 22)
                if (newVal === val) {
                    return;
                }
                val = newVal;
                childObj = observe(newVal);
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

class Dep {
    static uid:number = 0;
    public id:number;
    public subs = new Array();
    static target:any = null;

    constructor() {
        this.subs = [];
        this.id = Dep.uid++;
    }

    addSub(sub:any) {
        this.subs.push(sub);
    };

    depend() {
        Dep.target.addDep(this);
    };

    removeSub(sub:any) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    };

    notify(){
        // console.log(111)
        this.subs.forEach(function(sub){
            // console.log(sub)
            sub.update()
        })
    }
}

export {Observer, Dep, observe};