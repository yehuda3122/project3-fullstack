methods = ['GET', 'POST', 'PUT', 'DELETE'];

class FXMLHttpRequest {
    constructor() {
    }

    open(method, url) {
        if (methods.includes(method)) {
            throw 'Method is not supported!!!';
        }
        this.method = method;
        this.url = url;
    }

    send(string = '') {


    }
}