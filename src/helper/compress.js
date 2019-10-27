const {createGzip,createDeflate} = require('zlib');
module.exports = (rs, req, res)=>{
    //压缩可以减少http传送
    //req响应,res请求
    const acceptEncoding = req.headers['accept-encoding'];//获取客户端支持的文件压缩方式
    if(!acceptEncoding||!acceptEncoding.match(/\b(gzip|deflate)\b/)){
        //不支持压缩,或不在可压缩类型内,原样放回
        return rs
    }else if (acceptEncoding.match(/\bgzip\b/)){
        res.setHeader('Content-Encoding','gzip');
        return rs.pipe(createGzip())
    }else if (acceptEncoding.match(/\bdeflate\b/)){
        res.setHeader('Content-Encoding','deflate');
        return rs.pipe(createDeflate())
    }
}
