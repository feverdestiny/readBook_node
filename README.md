# node爬虫-小试牛刀（小说爬取）


接触node两个多月来，因项目紧急，一直无法好好的学习node相关模块，以前接触过python爬虫，今天尝试用node也来写一个小爬虫。
本文用到node模块有：cheerio、request、fs、path
## 效果图
![](/images/img1.png)
## node模块
```js
const cheerio = require("cheerio");         //再服务端进行 jq操作的库
const request = require("request");         //对http进一步封装的请求库
const fs = require("fs");                   //文件操作
const path = require("path");               //路径相关
```
因为使用到ES6语法，所以node版本需升级到7.0以上，本文使用的为node 8.1.3版本
## 步骤
拉取项目
```js
npm install
```
```js
node app.js
```
## 实现
* 选择小说目录页面
* 获取小说所有章节页面地址
* 使用request获取章节信息
* 使用cheerios获取章节标题及其章节内容
* 使用fs保存小说内容值txt文件内
### 随机选取小说网站
![](/images/web.png)
 
### 获取小说所有章节页面地址
```js
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
```
### 使用request获取章节信息

```js
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
```

### 使用cheerios获取章节标题及其章节内容

```js
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
```
### 使用fs保存小说内容值txt文件内
```js
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
```

# 拓展
爬取其他小说网站只需通过修改URL地址、 booksQuery方法及其toQuery方法中队页面节点信息过滤即可实现复用。
# 总结
在这个能用js实现以后都会用js实现的时代，node真是简单又方便啊。