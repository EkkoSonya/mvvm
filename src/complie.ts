import Watcher from "./watcher";

export default class Complie {
    /**
     *
     * @param el
     * @param vm mvvm实例
     */
    public $vm:any;
    public $el:any;
    public $fragment:any;

    constructor(el:any, vm:any){
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        
        if (this.$el) {
            // 如果实例中该元素成功获取，开始编译
            // 1> 将真实dom转移到虚拟dom中
            this.$fragment = this.node2Fragment(this.$el);

            // 2> 进行编译，提取指定的元素节点(v-model 以及 {{}} 文本节点)
            this.init();

            // 3> 将编译好的虚拟dom重新放回真实dom中，结束编译
            this.$el.appendChild(this.$fragment);
        }
    };


    init(){
        this.compileElement(this.$fragment);
    };

    // 主要编译过程
    compileElement(el:any){
        var childNodes = el.childNodes,
            that = this;

        [].slice.call(childNodes).forEach(function(node:any) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/

            if(that.isElementNode(node)){
                that.compile(node);
            }
            else if (that.isTextNode(node) && reg.test(text)) {
                that.compileText(node, RegExp.$1.trim());
                // console.log(1111)
            }

            if (node.childNodes && node.childNodes.length) {
                that.compileElement(node);
            }
        })
    };

    compile(node:any){
        var nodeAttrs = node.attributes,
            that = this;

        [].slice.call(nodeAttrs).forEach(function(attr:any) {
            var attrName = attr.name;
            if (that.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 事件指令
                if (that.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, that.$vm, exp, dir);
                }
                else {
                    compileUtil[dir] && compileUtil[dir](node, that.$vm, exp);
                }
            }
        })
    };

    compileText(node:any, exp:any) {
        compileUtil.text(node, this.$vm, exp);
    };

    node2Fragment(el:any) {
        var fragment = document.createDocumentFragment(),
            child;
        
        // 将原生节点移动到fragment中
        while (child = el.firstChild){
            fragment.appendChild(child);
        }

        return fragment;
    };

    isElementNode(node:any) {
        return node.nodeType == 1;
    };

    isTextNode(node:any) {
        return node.nodeType == 3;
    };

    isDirective(attr:any) {
        return attr.indexOf('v-') == 0;
    };

    isEventDirective(dir:any) {
        return dir.indexOf('on') == 0;
    };
}

class compileUtil {
    static text(node:any, vm:any, exp:any) {
        this.bind(node, vm, exp, 'text');
    };

    static html(node:any, vm:any, exp:any) {
        this.bind(node, vm, exp, 'html');
    };

    static class(node:any, vm:any, exp:any) {
        this.bind(node, vm, exp, 'class');
    };

    static model(node:any, vm:any, exp:any) {
        this.bind(node, vm, exp, 'model');

        var that = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e:any) {
            var newValue = e.target.value;
            if(val === newValue) {
                return;
            }

            that._setVMVal(vm, exp, newValue);
            val = newValue;
        })
    };

    static bind(node:any, vm:any, exp:any, dir:any) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function(value:any, oldValue:any) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    };

    static eventHandler(node:any, vm:any, exp:any, dir:any) {
        var eventType = dir.split(':')[1],
            fn = vm.$option.methods && vm.$option.methods[exp];
        
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    };
    
    static _getVMVal(vm:any, exp:any) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k:any) {
            val = val[k]
        })
        return val
    };

    static _setVMVal(vm:any, exp:any, value:any) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k:any, i:any) {
            if(i < exp.length - 1) {
                val = val[k];
            }
            else {
                val[k] = value;
            }
        })
    }
}

var updater = {
    textUpdater(node:any, value:any) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater(node:any, value:any) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater(node:any, value:any, oldValue:any) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');
        var space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    },

    modelUpdater(node:any, value:any, oldValue:any) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
} 