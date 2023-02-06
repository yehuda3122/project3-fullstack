methods = ['GET', 'POST', 'PUT', 'DELETE'];

class FXMLHttpRequest {
    constructor() {
        this.server = new ServerDemo();
    }

    open(method, url) {
        if (!methods.includes(method.toUpperCase())) {
            throw 'Method is not supported!!!';
        }
        this.method = method;
        this.url = url;
    }

    send(string = '') {
        return this.server.handle(this.method.toLowerCase(), this.url, string);
    }
}
let f = new FXMLHttpRequest();
f.open('get', '/q/search/coffee')
// console.log(f.send())

let server = new ServerDemo();
console.log(server.handle('put', '/q', {key:347587,value:"kajehf"}))
/*erq = new FXMLHttpRequest();
erq.open('get', '/')
erq.send()

let url = '/user'*/