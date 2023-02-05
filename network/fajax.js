methods = ['GET', 'POST', 'PUT', 'DELETE'];

class FXMLHttpRequest {
    constructor() {
    }

    open(method, url) {
        if (!(methods.includes(method) || methods.includes(method.toLowerCase()))) {
            throw 'Method is not supported!!!';
        }
        this.method = method;
        this.url = url;
    }

    send(string = '') {
        if (this.method === 'get') server.get(this.url, string);
        else if (this.method === 'post') server.post(this.url, string);
        else if (this.method === 'put') server.put(this.url, string);
        else if (this.method === 'delete') server.delete(this.url, string);
    }
}

server = new ServerDemo();