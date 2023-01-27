export default class Dep {
    static uid:number = 0;
    public id:number;
    public subs = new Array();
    static target:any = null;

    constructor() {
        // 消息订阅的数组
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
        this.subs.forEach(function(sub){
            sub.update()
        })
    }
}