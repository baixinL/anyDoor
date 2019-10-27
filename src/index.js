//process.argv//可获取命令行数据
//使用commander或者Yargs
const Server = require('./app');

const yargs = require('yargs');
const argv = yargs
    .usage('anywhere [options]')
    .option('p',{
        alias:'port',
        descibe:'端口号',
        default:9528,
    })
    .option('h',{
        alias:'hostname',
        descibe:'host',
        default:"127.0.0.1",
    })
    .option('d',{
        alias:'root',
        descibe:'root path',
        default:process.cwd(),
    })
    .version()
    .alias('v','version')
    .help()
    .argv;

const server = new Server(argv);
server.start();

