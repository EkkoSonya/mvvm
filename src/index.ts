import MVVM from './mvvm'

var vm = new MVVM({
    el: '#mvvm-app',
    data: {
        someStr: 'hello ',
        className: 'btn',
        htmlStr: '<span style="color: #f00;">red</span>',
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
        clickBtn: function(e:any) {
            var randomStrArr = ['childOne', 'childTwo', 'childThree'];
            this.child.someStr = randomStrArr[Math.floor(Math.random() * 3)];
        }
    }
});

vm.$watch('child.someStr', function() {
    console.log(arguments);
});