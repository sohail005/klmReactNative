var ajaxReq = require('ajax-request');
var express = require('express');

module.exports.httpReq = function(url, method, data, reqHeaders) {
   if(method.toLowerCase() == 'post') {
   return ajaxReq.post({
        url: url,
        data: data,
        headers: reqHeaders

    }, function (err, res, body) {

        if (err) {
            console.log('Ajax err-' + err);
        }
        console.log('Ajax res -' + res);
        console.log('Ajax body -' + body);
        return res;

    });
    }
}