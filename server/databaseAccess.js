function getAll(user) {
    let data = JSON.parse(localStorage.getItem(user));
    return data.list;
}

function addRecord(user, obj) {

}