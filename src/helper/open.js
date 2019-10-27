const {exec} = require('child_process');

module.exports = url => {
    //process.platform不同，打开方法不同
    switch(process.platform){
    case 'darwin':
        exec(`open ${url}`);
        break;
    case 'win32':
        exec(`start ${url}`);
    }
}
