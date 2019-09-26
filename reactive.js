function defineReactive(obj, key, val) {
    // 新建一个 Dep 类
    const dep = new Dep();

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            console.log('get value')
            /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
            dep.addSub(Dep.target);

            return val;
        },
        set: function reactiveSetter(newVal) {
            if (val === newVal) {
                return;
            } else {
                console.log('change value')
                val = newVal;
                /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
                dep.notify();
            }
        }
    })
}

function observer(value) {
    if (!value || (typeof value !== 'object')) {
        return;

    } else {
        Object.keys(value).forEach(key => {
            defineReactive(value, key, value[key]);
        })
    }
}

function cb() {
    console.log('数据更新啦~')
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data)
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        console.log('render~', this._data.name);
    }
}

class Dep {
    constructor() {
        // 用来存放Watcher对象
        this.sub = [];
    }

    // 新增Watcher对象
    addSub(sub) {
        this.sub.push(sub);
    }


    // 通知所有的 Watcher 对象更新视图
    notify() {
        this.sub.forEach(sub => {
            sub.update();
        })
    }
}

class Watcher {
    constructor() {
        Dep.target = this;
    }

    update() {
        console.log('视图需要更新啦~')
    }
}

Dep.target = null;

let o = new Vue({
    data: {
        name: '',
        age: 20,
        job: 'coding monkey'
    }
})
