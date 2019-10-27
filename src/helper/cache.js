const {cache} = require('../config/defaultConfig');
function refreshRes(stats, res){
    const {maxAge, expires, cacheControl, lastModified, etag} = cache;
    if(expires){
        //下次可请求的时间，如果时间不到，告诉浏览器直接用上回的缓存
        res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());//"Fri, 18 Oct 2019 06:45:40 GMT"
    }
    if(cacheControl){
        //表明有效期
        res.setHeader('Cache-Control', `public,max-age=${maxAge}`);//"Fri, 18 Oct 2019 06:45:40 GMT"
    }
    if(lastModified){
        //上次修改时间
        res.setHeader('Last-Modified',stats.mtime.toUTCString());//"Fri, 18 Oct 2019 06:45:40 GMT"
    }
    if(etag){
        //用于校验，新哈希
        res.setHeader('ETag',`${stats.size}-${stats.mtime}`);//"Fri, 18 Oct 2019 06:45:40 GMT"
    }
}
module.exports = function isFresh(stats, req, res){
    refreshRes(stats, res);
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    //第一次请求
    if(!lastModified&&!etag){
        return false;//本地缓存不是最新
    }

    if(lastModified && lastModified !== res.getHeader('Last-Modified'))
    {
        //上次修改时间不一致，有新更新
        return false;//本地缓存不是最新
    }
    if(etag && etag !== res.getHeader('ETag'))
    {
        //上次修改时间不一致，有新更新
        return false;//本地缓存不是最新
    }

    return true;//本地缓存是最新,可以直接使用缓存
};
