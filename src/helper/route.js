module.exports = async function (req, res, filePath, conf) {
    const fs = require('fs');
    const Handlebars = require('handlebars');
    const path = require('path');
    const { promisify } = require("util");
    const stat = promisify(fs.stat);
    const readdir = promisify(fs.readdir);
    const mime = require('./mime');
    const tplPath = path.join(__dirname, "../template/dir.tpl");//route.js的绝对目录__dirname
    // console.info("tplPath:",tplPath);
    const tpl = fs.readFileSync(tplPath);//因为以下下操作依赖tpl文件,必须先加载,结果时buffer
    const template = Handlebars.compile(tpl.toString());//这里只接受字符串
    const compress = require('./compress');//压缩
    const range = require('./range');//请求部分内容
    const isFresh = require('./cache');//缓存设置和校验
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);
            console.info(contentType);
            res.setHeader('Content-Type', contentType);

            if(isFresh(stats,req,res)){
                res.statusCode = 304;//缓存还是新鲜的
                res.end();
                return;
            }
            let rs;
            const { code, start, end } = range(stats.size, req, res);
            if (code == 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, { start, end });
            }

            if (filePath.match(conf.compress)) {
                rs = compress(rs, req, res);//20%
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            try {
                const files = await readdir(filePath);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');

                const dir = path.relative(conf.root, filePath);
                console.info("root:", conf.root);
                console.info("filePath:", filePath);
                console.info("dir:", dir);
                var htmlData = {
                    title: path.basename(filePath),//文件夹的目录anyDoor
                    dir: dir ? `/${dir}` : '',
                    files,
                }
                res.end(template(htmlData))


            } catch (ex) {
                console.error(ex);
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`${filePath} is not a directory or file\n`);
            }
        }
    } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file\n`);
    }

}
