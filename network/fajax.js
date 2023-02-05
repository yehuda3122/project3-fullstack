methods = ['GET', 'POST', 'PUT', 'DELETE'];

class FXMLHttpRequest {
    constructor() {
    }

    open(method, url) {
        if (!(methods.includes(method) || methods.includes(method.toUpperCase()))) {
            throw 'Method is not supported!!!';
        }
        this.method = method;
        this.url = url;
    }

    send(string = '') {
        server.handle(this.method.toLowerCase(), this.url, string);
    }
}

server = new ServerDemo();