module.exports={
    root : process.cwd(),
    hostname : "127.0.0.1",
    port : 9528,
    compress : /\.(html|js|css|md)/,
    cache:{//缓存设置
        maxAge:600,//秒s
        expires:true,
        cacheControl:true,
        lastModified:true,
        etag:true
    }
}
