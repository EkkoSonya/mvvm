/**
 * @jest-environment jsdom
 */

import { optimize } from 'webpack';
import MVVM from '../src/mvvm'
interface Option {
    [propName: string]: any;
}

it('v-model', ()=>{
    document.body.innerHTML = '<div id="app"><input id="input" type="text" v-model="message.a"></div>'
    const vm:Option = new MVVM({
        el:'#app',
        data:{
            message: {
                a: 'hello',
            },
            a:1
        }
    })
    vm.message.a = 1 ;
    expect(vm.message.a).toBe(1);
});

it('v-text', ()=>{
    document.body.innerHTML = '<div id="app"><input id="input" type="text" v-model="message.a">{{message.a}}</div>'
    const vm:Option = new MVVM({
        el:'#app',
        data:{
            message: {
                a: 'hello',
            },
            a:1
        }
    })
    vm.message.a = 3 ;
    expect(vm.message.a).toBe(3);
});

it('v-on', ()=>{
    document.body.innerHTML = '<div id="app">{{child.someStr}}<button v-on:click="clickBtn">Click</button></div>'
    var randomStrArr = ['childOne', 'childTwo', 'childThree']
        ,index = Math.floor(Math.random() * 3)
    const vm:Option = new MVVM({
        el: '#app',
        data: {
            child: {
                someStr: 'World !'
            }
        },
        methods: {
            clickBtn: function(e:any) {
                this.child.someStr = randomStrArr[index];
            }
        }
    });
    document.querySelector('button').click()
    expect(vm.child.someStr).toBe(randomStrArr[index]);
})

it('v-computed', ()=>{
    document.body.innerHTML = '<div id="app">{{getHelloWord}}</div>'
    const vm:Option = new MVVM({
        el: '#app',
        data: {
            someStr: 'hello ',
            child: {
                someStr: 'World !'
            }
        },
        computed: {
            getHelloWord: function() {
                return this.someStr + this.child.someStr;
            }
        },
    });
    expect(vm.getHelloWord).toBe(vm.someStr + vm.child.someStr);
})

it('v-html', ()=>{
    document.body.innerHTML = '<div id="app"><p v-html="htmlStr"></p></div>'
    const vm:Option = new MVVM({
        el: '#app',
        data: {
            htmlStr: '<span style="color: #f00;">red</span>',
        }
    })
    var text = document.querySelector('p span').textContent
    expect(text).toBe('red');
})

it('v-class', ()=>{
    document.body.innerHTML = '<div id="app"><p v-class="className" class="abc"></p></div>'
    const vm:Option = new MVVM({
        el: '#app',
        data: {
            className: '123'
        }
    })
    var text = document.querySelector('p').className
    expect(text).toBe('abc 123');
})

it('v-watch', ()=>{
    document.body.innerHTML = '<div id="app">{{child.someStr}}</div>'
    var flag = false

    var vm:Option = new MVVM({
        el: '#app',
        data: {
            child: {
                someStr: 'World !'
            }
        },
    });
    
    vm.$watch('child.someStr', function() {
        flag = true
    });

    vm.child.someStr = '123'
    expect(flag).toBe(true);
})