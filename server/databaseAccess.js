function getAllRecords(user) {
    let data = JSON.parse(localStorage.getItem(user));
    return data.list;
}

function addRecord(user, obj) {

    let data = JSON.parse(localStorage.getItem(user));

    data.list[obj.key] = obj.value;

    localStorage.setItem(user, JSON.stringify(data));
}

function changeRecord(user, obj) {

    let data = JSON.parse(localStorage.getItem(user));

    if (!data.list[obj.key]) {
        throw 'the value are not exit'
    }

    data.list[obj.key] = obj.value;

    localStorage.setItem(user, JSON.stringify(data));
}

function deleteRecord(user, obj) {
    let data = JSON.parse(localStorage.getItem(user));

    let k = Object.keys(data.list)

    if (!k.find((id) => id === obj.key)) {
        throw 'the value does not exit'
    }
    let removedTask = data.list[obj.key];
    delete data.list[obj.key]

    localStorage.setItem(user, JSON.stringify(data));

    return removedTask;
}

function search(username, query) {
    let records = getAllRecords(username);
    let response = {};

    for (const recordsKey in records) {

        //console.log(records[recordsKey].includes(query))

        if (records[recordsKey].includes(query)) {
            response[recordsKey] = records[recordsKey]
        }
    }
    console.log(response)
    return response;
}


function getUserPassword(username) {
    let data = JSON.parse(localStorage.getItem(username));
    if (data) return data.Password;
}