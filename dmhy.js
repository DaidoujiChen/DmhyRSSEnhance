'use strict';

// 內容檢查
const Ajv = require('ajv');
const ajv = new Ajv();
const checkKeys = require('./checkKeys');

// request 相關
const request = require('request');
const urlencode = require('urlencode');

// 錯誤訊息
const responseError = require('./responseError');

// xml 轉換
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
    cdata: true
});

function fetchKeyword(req) {
    if (req['query'].hasOwnProperty('keyword')) {
        return req['query']['keyword'];
    }
    else {
        return null;
    }
}

function fetchExcludes(req) {
    if (req['query'].hasOwnProperty('exclude')) {
        const excludeString = req['query']['exclude'];
        return excludeString.split(' ');
    }
    else {
        return null;
    }
}

const handleRequest = (req, res) => {
    
    // 取得關鍵字
    const keyword = fetchKeyword(req);
    if (!keyword) {
        responseError.to(res, 1001);
        return;
    }
    
    // 取得排除列表
    let excludes = fetchExcludes(req);
    
    const requestURLString = `http://share.dmhy.org/topics/rss/rss.xml?keyword=${urlencode(keyword)}`;
    request(requestURLString, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            parser.parseString(body, (error, result) => {
                
                // 檢查 dmhy 回傳的內容是否正常
                const dmhyCheckResult = ajv.validate(checkKeys.dmhyResponse, result);
                if (!dmhyCheckResult) {
                    responseError.to(res, 1002);
                    return;
                }
                
                // 取得搜尋項目們
                const items = result['rss']['channel'][0]['item'];
                if (excludes !== null) {
                    let itemIndex;
                    let excludeIndex;
                    for (itemIndex = 0; itemIndex < items.length; itemIndex++) {
                        const item = items[itemIndex];
                        const title = item['title'][0];
                        const category = item['category'][0]['_']; 
                            
                        for (excludeIndex = 0; excludeIndex < excludes.length; excludeIndex++) {
                            const exclude = excludes[excludeIndex];
                            
                            if (title.match(exclude) || category.match(exclude)) {
                                items.splice(itemIndex, 1);
                                itemIndex--;
                                break;
                            }
                        }
                    }
                }
                res.setHeader('content-type', 'text/xml');
                res.send(builder.buildObject(result));
            });
        }
        else {
            responseError.to(res, 1003);
            return;
        }
    });
};

module.exports = {
    handleRequest
};