class ServerDemo {
    handle(request, url, data) {
        if (request === 'get') this.get(url, data);
        else if (request === 'post') this.post(url, data);
        else if (request === 'put') this.put(url, data);
        else if (request === 'delete') this.delete(url, data);
    }

    get(url, data) {
        if (!data) {
            getAll(url);
        }
        // handle getting specific record
    }

    post(url, data) {

    }

    put(url, data) {

    }

    delete(url, data) {

    }
}