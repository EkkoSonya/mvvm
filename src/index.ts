import MVVM from './mvvm'

var vm = new MVVM({
    el: '#app',
    data: {
        someStr: 'hello ',
        className: 'btn',
        htmlStr: '<span style="color: #ea4335;">red</span>',
        child: {
            someStr: 'World !'
        }
    },

    computed: {
        getHelloWord: function() {
            return this.someStr + this.child.someStr;
        }
    },

    methods: {
        clickBtn: function() {
            var randomStrArr = ['childOne', 'childTwo', 'childThree'];
            this.child.someStr = randomStrArr[Math.floor(Math.random() * 3)];
        },
        changeColor: function() {
            var color = [
                {red:'#ea4335'},
                {blue:'#4285f4'},
                {yellow:'#fbbc05'},
                {green:'#34a853'}
            ]
            var index = Math.floor(Math.random() * 4)
            this.htmlStr = `<span style="color: ${color[index][Object.keys(color[index])[0]]};">${Object.keys(color[index])[0]}</span>`
        }
    }
});

vm.$watch('child.someStr', function() {
    console.log(arguments);
});