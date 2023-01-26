import Complie from "./complie";
import { observe } from "./observer";
import Watcher from './watcher'

interface Option {
    [propName: string]: any;
}

// 初始化MVVM
export default class MVVM {
    public $option:Option;
    public _data:any;
    public $compile:Option;

    constructor(option:Option) {
        this.$option = option || {};
        var data = this._data = this.$option.data;
        var that = this;

        // 数据代理 
        // vm._data.xxx -> vm.xxx
        Object.keys(data).forEach(function(key:any){
            that._proxyData(key);
        })

        // Computed属性初始化
        this._initComputed();

        //  进行数据劫持 把对象的所有属性改成get和set方法
        observe(data, this);

        // 进行编译操作，虚拟dom进行操作再传进真实dom中
        this.$compile = new Complie(option.el || document.body, this)
    }

    $watch(key:string, cb:any, options?:object) {
        new Watcher(this, key, cb);
    }

    _proxyData(key:any) {
        var that = this;
        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return that._data[key];
            },
            set: function proxySetter(newVal) {
                that._data[key] = newVal
            }
        })
    }

    _initComputed() {
        var that = this;
        var computed = this.$option.computed;
        // 查看实例是否具有Computed属性
        if (typeof computed === 'object'){
            Object.keys(computed).forEach(function(key){
                Object.defineProperty(that, key, {
                    get: typeof computed[key] === 'function'
                            ? computed[key]
                            : computed[key].get,
                    set: function(){}
                });
            });
        }
    }
}