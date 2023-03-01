methods = ['GET', 'POST', 'PUT', 'DELETE'];

class FXMLHttpRequest {
    onload;
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
        if(!this.onload) throw `no onload function was provided\n
        method: ${this.method}\n
        url: ${this.url}\n
        onload: ${this.onload}\n
        data: ${string}`

        console.log(this.server.status)
        this.onload(this.server.handle(this.method.toLowerCase(), this.url, string));
        if (this.server.status === 404) {
            alert('the page not found')
        }
        if (this.server.status === 400) {
            alert('bad request')
        }
    }
}
// let f = new FXMLHttpRequest();
// f.open('get', '/q/search/coffee')
// f.onload = function log(arg) {
//     console.log(arg);
// }
//f.send()

/*erq = new FXMLHttpRequest();
erq.open('get', '/')
erq.send()

let url = '/user'*/