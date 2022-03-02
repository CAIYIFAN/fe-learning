// 单例
class User{
    constructor () {
        if (new.target !== User) {
            return 
        }
        if (!User.instance) {
            this.name = 'xm'
            User._instance = this
        }
        return User._instance
    }
}

const u1 = new User();
const u2 = new User();
console.log(u1 === u2);

class User {
    constructor() {
        this.name = 'xm'
    }
    static getInstance() {
        if (!User._instance) {
            User._instance = new User()
        }
        return User._instance
    }
}

const u1 = User.getInstance()
const u2 = User.getInstance()

console.log(u1 === u2)

// 继承
function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subClass, superClass) {
    var p = inheritObject(superClass.prototype)
    p.constructor = subClass;
    subClass.prototype = p;
}

// 数组拍平

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];

function flat(arr) {
    let arrResult =[]
    arr.forEach(item => {
        if (Array.isArray(item)) {
            // arrResult = arrResult.concat(flat(item))
            arrResult.push(...flat(item))
        } else {
            arrResult.push(item)
        }
    });
    return arrResult
}

flat(arr)

arr.reduce((prev, cur) => prev.concat(cur),[])

const flat = arr => {
    return  arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? flat(cur) : cur);
    },[]);
};


function flat() {
    const result = [];
    const stack = [].concat(arr);
    while(stack.length !== 0) {
        const val = stack.pop();
        if (Array.isArray(val)) {
            stack.push(...val);
        } else {
            result.unshift(val)
        }
    }
    return result
}

function* flat(arr, num) {
    if (num === undefined) num = 1;
    for (const item of arr) {
        if (Array.isArray(item) && num > 0){
            yield * flat(item, num -1);
        } else {
            yield item
        }
    }
}

[...flat(arr, Infinity)]

// forEach跳过数组空位
