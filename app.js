/**
 * Created by feverdestiny on 2017/9/22.
 */
const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
let count = 0; //叠加
let url = 'http://www.23us.cc/html/150/150567/'; //小说Url
let list = []; //章节List
let booksName = ''; //小说名称

/**
 * 获取小说目录页
 */
const books = function () {
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log(`获取小说基本信息成功·······`)
            booksQuery(body);
        } else {
            console.log('err:' + err)
        }
    })
}
/**
 * 处理小说名称及其小说目录
 * @param {*} body 
 */
const booksQuery = function (body) {
    $ = cheerio.load(body);
    booksName = $('.btitle').find('h1').text(); //小说名称
    $('.chapterlist').find('a').each(function (i, e) { //获取章节UrlList
        list.push($(e).attr('href'))
    });
    createFolder(path.join(__dirname, `/book/${booksName}.txt`)); //创建文件夹
    fs.createWriteStream(path.join(__dirname, `/book/${booksName}.txt`)) //创建txt文件
    console.log(`开始写入《${booksName}》·······`)
    getBody(); //获取章节信息

}
/**
 * 获取章节页面信息
 * 
 */
const getBody = function () {
    let primUrl = url + list[count];
    // console.log(primUrl)
    request(primUrl, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            toQuery(body);
        } else {
            console.log('err:' + err)
        }
    })
};
/**
 * 处理章节页面信息
 * @param {any} body 
 */
const toQuery = function (body) {
    $ = cheerio.load(body);
    const title = $('h1').text(); //获取章节标题
    const content = Trim($('#content').text(), 'g'); //获取当前章节文本内容并去除文本所有空格
    writeFs(title, content);
}
/**
 * 写入txt文件
 * @param {*} title 
 * @param {*} content 
 */
const writeFs = function (title, content) {
    // 添加数据
    fs.appendFile(path.join(__dirname, `/book/${booksName}.txt`), title, function (err) {
        if (err) throw err;
    });
    fs.appendFile(path.join(__dirname, `/book/${booksName}.txt`), content, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(title + '········保存成功')
            if (count + 1 < list.length) { //当前页码是否超过章节数
                count = count + 1;
                getBody();
            }
        }
    });
}
/**
 * 创建文件夹
 * 
 * @param {any} to 
 */
const createFolder = function (to) { //文件写入
    var sep = path.sep
    var folders = path.dirname(to).split(sep);
    var p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

/**
 * 
 * 去除所有空格
 * @param {any} str 
 * @param {any} is_global 
 * @returns 
 */
const Trim = function (str, is_global) {

    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g")
    {
        result = result.replace(/\s/g, "");
    }
    return result;
}
books();