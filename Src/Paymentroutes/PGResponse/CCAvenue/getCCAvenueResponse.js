var express = require('express');
const StringBuilder = require("string-builder");
var router = express.Router();
const config = require('../../configurations/config');
var httpReq = require('../../common/httpCall/apiCall');
var ajaxReq = require('ajax-request');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
var request = {};
const ip = require('ip');
var verifyCCAvenue = config.verifyCCAvenue;
var VerifyCookieDetails = config.VerifyCookieDetails;
var VerifyCookie = {};

var SecurityToken = config.SecurityToken;
request.Timeout = 60000;
request.ContentType = "application/json;";
request.authorization = "Bearer " + SecurityToken;

router.post('/', function (req, res, next) {
    console.log(req.method);
    console.log(req.body);
    var IsPGSuccess = false;
    let sbResponseMessage = new StringBuilder();
    var isChecksumValid = false;
    var StoreOrderStatus = 'PG_Failure';
    var TransactionId = '';
    var totalOrderAmount = 0;
    var totalPaidAmount = 0;
    var CurrencyCode = '';
    var BankName = '';
    var PaymentMode = '';
    sbResponseMessage.append("<xml>");
    sbResponseMessage.append("<PGResponse>");

    try {
        try {
            appendSbResponseMessage(sbResponseMessage, "<CCAvenueResponse>", JSON.stringify(req.body), "</CCAvenueResponse>");
            // req.body.CurrencyCode = req.cookies.CurrencyCode;
            // req.body.TempStoreOrderNumber = req.cookies.StoreOrderNumber;
            // req.body.TotalAmount = req.cookies.TotalOrderAmount;
            // appendSbResponseMessage(sbResponseMessage, "<CurrencyCode>", req.cookies.CurrencyCode, "</CurrencyCode>");
            ajaxReq.post({
                url: verifyCCAvenue,
                data: req.body,
                headers: request
            }, function (err, res1, body) {
                if (err) {
                    console.log('Ajax err-' + err);
                }
    
                body = JSON.parse(body);
                console.log(body);
                if (body.Data != undefined && body.Data != null && body.Data != "" &&
                    (body.Data.PGSuccess == 'true' && body.Data.StatusMessage.toLowerCase() == 'success')) {
                    isChecksumValid = true;
                } else {
                    isChecksumValid = false;
                }
                checksumVerify(body.Data);
            })
        } catch (error) {
            StoreOrderStatus = "PG_Failure";
            appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
            paymentRedirection('');
        }
    
        function checksumVerify(res) {
          if (res.ReturnOrderNumber != undefined && res.ReturnOrderNumber != null && res.ReturnOrderNumber != '') {
            TransactionId = res.ReturnOrderNumber;
          }

          try {

            objAPIRequest = {};
            objAPIRequest.StoreOrderNumber = TransactionId;
            objAPIRequest.PaymentGatewayTransactionId = '';
              var request = {};
              request.method = 'post';
              request.ServicePoint = { "Expect100Continue": false };
              request.Timeout = 60000;
              request.ContentType = "application/json;";
              request.authorization = "Bearer " + SecurityToken;
      
              ajaxReq.post({
                url: VerifyCookieDetails,
                data: objAPIRequest,
                headers: request
              }, function(err, res1, body) {
                body = JSON.parse(body);
                console.log('-----body Start------');
                console.log(body);
                console.log('-----body End------');
                if(body.Data != undefined && body.Data != null && body.Data != "" && body.ReturnCode == 0) {
                  VerifyCookie = body.Data;

                  
            if (isChecksumValid) {
              if (res.ReturnOrderNumber != undefined && res.ReturnOrderNumber != null && res.ReturnOrderNumber != '') {
                TransactionId = res.ReturnOrderNumber;
              }
              if (res.Amount != undefined && res.Amount != null && res.Amount != '') {
                totalPaidAmount = res.Amount;
              }
              if (res.Currency != undefined && res.Currency != null && res.Currency != '') {
                CurrencyCode = res.Currency
              }
              
              if(VerifyCookie.CurrencyCode == CurrencyCode) {
                if (totalPaidAmount != '') {
                  if (TransactionId != '') {
                    if (VerifyCookie.StoreOrderNumber == TransactionId) {
                      totalOrderAmount = parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2);
                      totalPaidAmount = parseFloat(totalPaidAmount).toFixed(2);
                      if (totalOrderAmount > 0) {
                        if (totalPaidAmount == totalOrderAmount) {
                          StoreOrderStatus = "Verified";
                          IsPGSuccess = true;
                          if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                            appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                          }
                          paymentRedirection(res);
                        } else {
                          appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount and amount paid are mismatched", "</PGMessage>");
                          if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                            appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                          }
                          paymentRedirection(res);
                        }
                      } else {
                        appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount is empty", "</PGMessage>");
                        if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                          appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                        }
                        paymentRedirection(res);
                      }
                    } else {
                      appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order number and PG transaction id are mismatched", "</PGMessage>");
                      if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                        appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                      }
                      paymentRedirection(res);
                    }
                  } else {
                    appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "PG transaction id is empty", "</PGMessage>");
                    if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                      appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                    }
                    paymentRedirection(res);
                  }
                } else {
                  appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Amount paid is empty", "</PGMessage>");
                  if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                    appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                  }
                  paymentRedirection(res);
                }
              }
              else {
                appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Currency didn't match", "</PGMessage>");
                if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                  appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
                }
                paymentRedirection(res);
              }
             
            } else {
              StoreOrderStatus = "PG_Failure";
              appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
              if (res.EncResponse != null && res.EncResponse != undefined && res.EncResponse != "") {
                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",res.EncResponse,"</ResponseParameters>");
              }
              paymentRedirection(res);
            }

                }
                else {
                  res.writeHead(301,
                    // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
                    { Location: config.SiteUrl + 'ccgateway_responces' }
                );
                res.end();
                }

              });
          } catch (error) {
            res.writeHead(301,
              // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
              { Location: config.SiteUrl + 'ccgateway_responces' }
          );
          res.end();
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
            objAPIRequest.PAYNIMOPGResponse = sbResponseMessage.toString();
            objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
            objAPIRequest.PaymentType = VerifyCookie.PaymentType;
            objAPIRequest.SecurityToken = SecurityToken;
            objAPIRequest.IPAddress = GetIP4Address();
            if (VerifyCookie.BasketGuid != '') {
              objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
          }
          objAPIRequest.TotalAmount = totalPaidAmount;
          
          var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');
          
          objAPIRequest = {};
          objAPIRequest.StoreOrderNumber = VerifyCookie.StoreOrderNumber;
          objAPIRequest.StoreOrderStatus = StoreOrderStatus;
          objAPIRequest.IsCouponCodeApplyToCOD = false;
          objAPIRequest.PaymentType = VerifyCookie.PaymentType;
          if (VerifyCookie.PaymentGateway != undefined && VerifyCookie.PaymentGateway != null && VerifyCookie.PaymentGateway != '') {
            objAPIRequest.PaymentGateway = VerifyCookie.PaymentGateway.toString().toUpperCase();
          }
          //objAPIRequest.TransactionId = PGTransactionNo;
          objAPIRequest.TransactionId = TransactionId;
          objAPIRequest.ResponseCode = data.PaynimoOrderStatus;
          objAPIRequest.PGResponse = sbResponseMessage.toString();
          objAPIRequest.SecurityToken = SecurityToken;
          objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
          if (VerifyCookie.BasketGuid != '') {
            objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
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
                  { Location: config.SiteUrl + 'ccgateway_responces' }
              );
              res.end();
          }
          }
              
    } catch (exception) {
        if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
            insertErrorLog.insertErrorLog(LogTypeId, exeption, InsertErrorLogApi, 'getCCAvenueResponse');
        }
      
        res.writeHead(301,
            { Location: config.SiteUrl + 'ccgateway_responces' }
        );
        res.end();
    }

      
});

function GetRestAPIResponse(strAPIURL, strRequest, strRequestMethodType) {
    var request = {};
    request.method = strRequestMethodType;
    request.ServicePoint = { "Expect100Continue": false };
    request.Timeout = 60000;
    request.ContentType = "application/json;";
    request.authorization = "Bearer " + SecurityToken;
    httpReq.httpReq(strAPIURL, 'post', strRequest, request);
  }

  function GetIP4Address() {
  IP4Address = '';
  return ip.address();
}
  

module.exports = router;