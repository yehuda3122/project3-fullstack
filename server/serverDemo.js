class ServerDemo {
    handle(request, url, data) {
        this.checkUrl(url)
        if (request === 'get') return this.get(url);
        else if (request === 'post') return this.post(url, data);
        else if (request === 'put') return this.put(url, data);
        else if (request === 'delete') return this.delete(url, data);
    }

    get(url) {

        //structure of search query '/user/search/query'
        //example for search query '/shoham/search/coffee'
        let x = url.split('/');

        if (x.length === 2) {
            if (x[1]==='currentuser') return getCurrentUser();
            return getAllRecords(x[1]);

        } else if (x[2] === 'search' && x[3] && x[3] !== '') {
            return search(x[1], x[3]);

        } else if(x[1]==='currentuser'){
            console.log('retrieving username')
            return getCurrentUser();
        }
        return undefined;
        // handle getting specific record
    }

    post(url, data) {
        data = JSON.parse(data);

        this.checkData(data);

        let x = url.split('/');
        addRecord(x[1], data);

        return data.value;
    }

    put(url, data) {
        data = JSON.parse(data);

        this.checkData(data);

        let x = url.split('/');
        changeRecord(x[1], data);

        return data.value;
    }

    delete(url, data) {
        data = JSON.parse(data);
        console.log(data)
        this.checkDataForDelete(data);

        let x = url.split('/');
        return deleteRecord(x[1], data);
    }

    checkUrl(url) {
        if (url.split('/').length < 2) {
            throw 'the url is bad'
        }
    }

    checkData(data) {
        if (data && data.key && data.value) return
        if (data) throw 'data format is bad'
        else throw 'data is needed'
    }

    checkDataForDelete(data) {
        if (data && data.key) return
        if (data) throw 'data format is bad'
        else throw 'data is needed'
    }
}