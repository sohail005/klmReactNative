var express = require('express');
const paynimoChecksumFile = require('./paynimoChecksum');
var router = express.Router();
const StringBuilder = require("string-builder");
const config = require('../../configurations/config');

var SecurityToken = config.SecurityToken
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
const ip = require('ip');
var httpReq = require('../../common/httpCall/apiCall');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var ajaxReq = require('ajax-request');
var request = {};
var VerifyPaynimoChecksum = config.VerifyPaynimoChecksum;
  request.Timeout = 60000;
  request.ContentType = "application/json;";
  request.authorization = "Bearer " + SecurityToken;

router.post('/', function (req, res, next) {
  console.log(req.method);
  console.log(req.body);
  try {
    var RequestType = '';
    var MerchantCode = '';
    var CurrencyCode = '';
    var ReturnURL = '';
    var MerchantKey = '';
    var MerchantKeyValueIv = '';
    var strPaynimoSuccessCodes = '';
    var strPaynimoSuccessCode0200 = '';
    var strPaynimoSuccessCode0300 = '';
    var IsPGSuccess = false;
    var StoreOrderStatus = 'PG_Failure';
    var TransactionId = '';
    var totalOrderAmount = 0;
    var totalPaidAmount = 0;
    var BankName = '';
    var PaymentMode = '';
    let sbResponseMessage = new StringBuilder();
    var isChecksumValid = false;
    sbResponseMessage.append("<xml>");
    sbResponseMessage.append("<PGResponse>");
 try {
  appendSbResponseMessage(sbResponseMessage, "<PaynimoResponse>",JSON.stringify(req.body),"</PaynimoResponse>");
  req.body.CurrencyCode = req.cookies.CurrencyCode;
   appendSbResponseMessage(sbResponseMessage, "<CurrencyCode>",req.cookies.CurrencyCode,"</CurrencyCode>");
   ajaxReq.post({
    url: VerifyPaynimoChecksum,
    data: req.body,
    headers: request

}, function (err, res, body) {

    if (err) {
        console.log('Ajax err-' + err);
    }
    
   body = JSON.parse(body);
    if(body.Data != undefined && body.Data != null && body.Data != "" &&
    (body.Data.PaynimoOrderStatus == '0200' || body.Data.PaynimoOrderStatus == '0300')) {
      isChecksumValid = true;
    } else {
      isChecksumValid = false;
    }
    checksumVerify(body.Data);
});
} catch (ex) {
StoreOrderStatus = "PG_Failure";
appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
paymentRedirection();
}

function checksumVerify(res) {
  if (isChecksumValid) {
    if (res.PaynimoTxnRef != undefined && res.PaynimoTxnRef != null && res.PaynimoTxnRef != '') {
      TransactionId = res.PaynimoTxnRef;
    }
    if (res.PaynimoPaidAmount != undefined && res.PaynimoPaidAmount != null && res.PaynimoPaidAmount != '') {
      totalPaidAmount = res.PaynimoPaidAmount;
    }
    

    if (totalPaidAmount != '') {
      if (TransactionId != '') {
        if (req.cookies.StoreOrderNumber == TransactionId) {
          totalOrderAmount = parseFloat(req.cookies.TotalOrderAmount).toFixed(2);
          totalPaidAmount = parseFloat(totalPaidAmount).toFixed(2);
          if (totalOrderAmount > 0) {
            if (totalPaidAmount == totalOrderAmount) {
              StoreOrderStatus = "Verified";
              IsPGSuccess = true;
              if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
              }
              paymentRedirection(res);
            } else {
              appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount and amount paid are mismatched", "</PGMessage>");
              if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
              }
              paymentRedirection(res);
            }
          } else {
            appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount is empty", "</PGMessage>");
            if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
              appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
            }
            paymentRedirection(res);
          }
        } else {
          appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order number and PG transaction id are mismatched", "</PGMessage>");
          if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
            appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
          }
          paymentRedirection(res);
        }
      } else {
        appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "PG transaction id is empty", "</PGMessage>");
        if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
          appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
        }
        paymentRedirection(res);
      }
    } else {
      appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Amount paid is empty", "</PGMessage>");
      if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
        appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
      }
      paymentRedirection(res);
    }
  } else {
    StoreOrderStatus = "PG_Failure";
    appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
    if (res.ResponseParameters != null && res.ResponseParameters != undefined && res.ResponseParameters != "") {
      appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.ResponseParameters,"</ResponseParameters>");
    }
    paymentRedirection(res);
  }

// res.send('success');


}

function appendSbResponseMessage(sbResponseMessage, tagOpen, value, tagClose) {
  sbResponseMessage.append(tagOpen + value + tagClose);
}
function paymentRedirection(data) {
  sbResponseMessage.append("</PGResponse>");
  sbResponseMessage.append("</xml>");

  objAPIRequest = {};
  objAPIRequest.StoreOrderNumber = TransactionId;
  objAPIRequest.PGResponse = sbResponseMessage.toString();
  objAPIRequest.CustomerToken = req.cookies.CustomerToken;
  objAPIRequest.PaymentType = req.cookies.PaymentType;
  objAPIRequest.SecurityToken = SecurityToken;
  objAPIRequest.IPAddress = GetIP4Address();
  if (req.cookies.BasketGUID != '') {
    objAPIRequest.BasketGUID = req.cookies.BasketGUID;
}
objAPIRequest.TotalAmount = totalPaidAmount;

var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');

objAPIRequest = {};
objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
objAPIRequest.StoreOrderStatus = StoreOrderStatus;
objAPIRequest.IsCouponCodeApplyToCOD = false;
objAPIRequest.PaymentType = req.cookies.PaymentType;
if (req.cookies.PaymentGateway != undefined && req.cookies.PaymentGateway != null && req.cookies.PaymentGateway != '') {
  objAPIRequest.PaymentGateway = req.cookies.PaymentGateway.toString().toUpperCase();
}
//objAPIRequest.TransactionId = PGTransactionNo;
objAPIRequest.TransactionId = TransactionId;
objAPIRequest.ResponseCode = data.PaynimoOrderStatus;
objAPIRequest.PGResponse = sbResponseMessage.toString();
objAPIRequest.SecurityToken = SecurityToken;
objAPIRequest.CustomerToken = req.cookies.CustomerToken;
if (req.cookies.BasketGUID != '') {
  objAPIRequest.BasketGUID = req.cookies.BasketGUID;
}
objAPIRequest.IPAddress = GetIP4Address();
objAPIRequest.TotalAmount = totalOrderAmount; // Changed objAPIRequest.TotalAmount = totalpaidamount to objAPIRequest.TotalAmount = (totalOrderAmount / 100) by Ravishankar on 19 March 2019 // Modified by kushagra as totalPaidAmount to total order amount
objAPIRequest.PGPaidAmount = totalPaidAmount ;
if(BankName !== undefined && BankName != null && BankName !== '') {
  objAPIRequest.BankDetails = BankName;
}
if(PaymentMode !== undefined && PaymentMode != null && PaymentMode !== '') {
  objAPIRequest.TransactionType = PaymentMode;
}
var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
      sbResponseMessage = null;
// res.send('success');

  if (IsPGSuccess) {
    res.writeHead(301,
        // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
        { Location: config.SiteUrl + 'thankyou' }
    );
    res.end();
} else {
    res.writeHead(301,
        // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
        { Location: config.SiteUrl + 'payment' }
    );
    res.end();
}
}
    
  

  

  } catch (exception) {
    if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
      insertErrorLog.insertErrorLog(LogTypeId, exeption, InsertErrorLogApi, 'getPaynimoResponse');
  }

  res.writeHead(301,
      { Location: config.SiteUrl + 'payment' }
  );
  res.end();
  }

});

function GetIP4Address() {
  IP4Address = '';
  return ip.address();
}
function GetRestAPIResponse(strAPIURL, strRequest, strRequestMethodType) {
  var request = {};
  // request.uri =strAPIURL;
  // request = strRequest;
  request.method = strRequestMethodType;
  request.ServicePoint = { "Expect100Continue": false };
  request.Timeout = 60000;
  request.ContentType = "application/json;";
  request.authorization = "Bearer " + SecurityToken;
  //request.ContentLength = JSON.parse(strRequest).Length;
  httpReq.httpReq(strAPIURL, 'post', strRequest, request);
}


module.exports = router;
