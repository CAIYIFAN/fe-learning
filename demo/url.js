function getQuery (url, key) {
    const arr1 = url.split('?').splice(1).join('')
    const arr2 = arr1.split('&');
    const obj = {}
    for(let i = 0; i < arr2.length; i++) {
        const arr3 = arr2[i].split('=')
        obj[arr3[0]] = JSON.parse(JSON.stringify(arr3[1]));
    }
    return obj[key];
}