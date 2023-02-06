class ServerDemo {
    handle(request, url, data) {
        checkUrl(url)
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
            return search(x[1], x[3]);

        } else {
            return undefined;
        }

        // handle getting specific record
    }

    post(url,data) {
        checkData(data)
        let x = url.split('/');

        addRecord(x[1], data);
    }

    put(url, data) {
        checkData(data)
        let x = url.split('/');

        changeRecord(x[1],data)
    }

    delete(url, data) {
        let x = url.split('/');

        deleteRecord(x[1],data)

    }

    checkUrl(url){
        let x = url.split('/');
        if (x.length !== 2) {
            throw 'the url uncorrected'
        }
    }

    checkData(data){
        if(!data)
        {
            throw 'data is needed'
        }     
    }
}