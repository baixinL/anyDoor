const http = require('http');
const chalk = require("chalk");
const conf = require("./config/defaultConfig");
const path = require('path');
const openUrl = require('./helper/open');
// const hostname = conf.hostname;//客户端通过此主机访问服务器
// const port = conf.port;
class Server{
    constructor (config) {
        this.conf = Object.assign({},conf,config);//第一个是目标对象（被修改），后面是源对象，（对象去重合并，以后面的值为优先）
    }
    start (){
        const route = require('./helper/route');
        const server = http.createServer((req, res) => {
            const filePath = path.join(this.conf.root , req.url);
            route(req, res,filePath,this.conf);
        });
        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.info(`Server  started at ${chalk.green(addr)}`);
            openUrl(addr);
        });
    }
}
module.exports = Server;
// const route = require('./helper/route');
// const server = http.createServer((req, res) => {
//     const filePath = path.join(conf.root , req.url);
//     route(req, res,filePath);
// });

// server.listen(port, hostname, () => {
//     const addr = `http://${hostname}:${port}`;
//     console.info(`Server  started at ${chalk.green(addr)}`);
// });
