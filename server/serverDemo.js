class ServerDemo {
    handle(request, url, data) {
        if (request === 'get') return this.get(url);
        else if (request === 'post') this.post(url, data);
        else if (request === 'put') this.put(url, data);
        else if (request === 'delete') this.delete(url, data);
    }

    get(url) {

        //structure of search query '/user/search/query'
        //example for search query '/shoham/search/coffee'
        let x = url.split('/');

        if (x.length === 2) {
            return getAll(x[1]);

        } else if (x[2] === 'search' && x[3] && x[3]!=='') {
            return this.search(x[1], x[3]);

        } else {
            return undefined;
        }

        // handle getting specific record
    }

    post(url, data) {
        let user = url[0:-1];
        addRecord(user, data);
    }

    put(url, data) {

    }

    delete(url, data) {

    }

    search(username, query) {
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
}