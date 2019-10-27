module.exports=(totalSize, req, res)=>{
    //range(bytes):范围多少字节, Accept_Ranges(bytes):响应中加入头,Content-Range(bytes):start-end/total告诉你返回内容时是从哪里到哪里
    //totalSize总字节数,req客户端请求从哪到哪的字节,res需要修改头Content-Range
    const range = req.headers['range'];
    if(!range){
        return {code:200};
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;

    if(end > totalSize || start > end || start < 0){
        return {code:200};
    }
    res.setHeader("Accept-Ranges",'bytes');
    res.setHeader("Content-Range",`bytes ${start}=${end}/${totalSize}`);
    res.setHeader("Content-Length",end-start);
    return {
        code:206,
        start:parseInt(start),
        end:parseInt(end)
    }
}
