function getAll(user) {
    let data = JSON.parse(localStorage.getItem(user));
    return data.list;
}

function addRecord(user, obj) {

    let data = JSON.parse(localStorage.getItem(user));

    data.list[obj.key] = obj.value
    
    localStorage.setItem(user,JSON.stringify(data))
}

function changeRecord(user, obj) {

    let data = JSON.parse(localStorage.getItem(user));
    let k = Object.keys(data.list)
    if (!k.find(obj.key)) {
        throw 'the value are not exit'
    }

    data.list[obj.key] = obj.value
    
    localStorage.setItem(user,JSON.stringify(data))
}

function deleteRecord(user,obj){
    let data = JSON.parse(localStorage.getItem(user));
    let k = Object.keys(data.list)
    if (!k.find(obj.key)) {
        throw 'the value are not exit'
    }
    delete data.list[obj.key]
    
    localStorage.setItem(user,JSON.stringify(data))
}

function  search(username, query) {
    let records = getAll(username);
    let response = [];

    for (const recordsKey in records) {

        //console.log(records[recordsKey].includes(query))

        if (records[recordsKey].includes(query)) {
            let obj = {key: recordsKey, value: records[recordsKey]};
            response.push(obj)
        }
    }
    return response;
}
