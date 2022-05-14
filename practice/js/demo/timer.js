function debounce(fn, time) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, time)
    }
}

function throttle(fn, time) {
    let flag = true;
    return function() {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            flag = true;
        }, time)
    }
}


const node =[
    {
        id: '1',
        parent: '3',
    },
    {
        id: '2',
        parent: '1'
    },
    {
        id: '3',
        parent: null
    }
]

function generate(node, parentValue) {
    return node.filter((item) => item.parent === parentValue).map(items => (
        {
            ...items,
            child: generate(node, items.id)
        }
    ))
}

function debounce(fn, timer) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, timer)
    }
}

function throttle(fn, timer) {
    let flag = true
    return function () {
        if (flag) {
            flag = false
            setTimeout(() => {
                fn.apply(this, arguments);
                flag = true
            },timer)
        }
    }
}