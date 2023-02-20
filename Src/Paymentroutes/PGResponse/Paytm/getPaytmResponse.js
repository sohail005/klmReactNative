var express = require('express');
var fs = require('fs');
var router = express.Router();
var paytm_config = require('./paytm_config').paytm_config;
var paytm_checksum = require('./checksum');
var querystring = require('querystring');
const StringBuilder = require("string-builder");
const config = require('../../configurations/config');
const Enum = require('enum');
var PayTmMerchantKey = config.paytmMarchentKey;
var PaytmResponceSuccessCode = config.PaytmResponceSuccessCode;
var PaytmPaymentPendingStatusCode1 = config.PaytmPaymentPendingStatusCode1;
var PaytmPaymentPendingStatusCode2 = config.PaytmPaymentPendingStatusCode2;
var PaytmCancelledTransactionResponseCode = config.PaytmCancelledTransactionResponseCode;
var SecurityToken = config.SecurityToken
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
var VerifyCookieDetails = config.VerifyCookieDetails;
const ip = require('ip');
var ajaxReq = require('ajax-request');
var LogTypeId = config.LogTypeId;
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var httpReq = require('../../common/httpCall/apiCall');
var InsertErrorLogApi = config.InsertErrorLog;
var VerifyCookie = {};
var ErrorLog = new Enum({
    All: 0,
    Text_File: 1,
    SendError_Message: 2,
    SendError_Message_TextFile: 3,
    TextFile_DBLog: 4,
    ErrorLog_NotRequired: -1
});
let SON = '';

router.post('/', function (req, res, next) {
  try {
    var paytmChecksum = "";
    var IsPGSuccess = false;
    var PAYTMPGamount = '';
    var PAYTMTransactionId = '';
    var strPaymentMode = '';
    var strBankName = '';
    var StoreOrderStatus = 'PG_Failure';
    var TransactionId = '';
    var totalOrderAmount = 0;
    var totalPaidAmount = 0;
    var strResponseMessage = '';
    let sbResponseMassage = new StringBuilder();
    
    // console.log(req);
    // console.log(req.body);
    // console.log(req.cookies);
    sbResponseMassage.append("<xml>");
    sbResponseMassage.append("<PGResponse>");

    /**
    * Create an Object from the parameters received in POST
    * received_data should contains all data received in POST
    */
    var paytmParams = {};
    var PGRespCode = req.body.RESPCODE;
    for (var key in req.body) {

      if (key == "CHECKSUMHASH") {
        sbResponseMassage.append("<hash>");
        sbResponseMassage.append(req.body[key]);
        sbResponseMassage.append("</hash>");
        paytmChecksum = req.body[key];

      } else {
        paytmParams[key] = req.body[key];
        sbResponseMassage.append("<" + key + ">");
        sbResponseMassage.append(req.body[key] != null ? req.body[key] : "");
        sbResponseMassage.append("</" + key + ">");
      }
    }

    if(paytmParams.ORDERID != undefined && paytmParams.ORDERID != null && paytmParams.ORDERID != '') {
      PAYTMTransactionId = paytmParams.ORDERID;
      SON = paytmParams.ORDERID;
    }

     // Geeting Cookie Details
     try {
      objAPIRequest = {};
      objAPIRequest.PaymentGatewayTransactionId = '';
      objAPIRequest.StoreOrderNumber = PAYTMTransactionId;
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
        }, function (err, res1, body) {

          body = JSON.parse(body);
        
         console.log('-----body Start------');
         console.log(body);
         console.log('-----body End------');
        if(body.Data != undefined && body.Data != null && body.Data != "" && body.ReturnCode == 0) {
        // VerifyCookie = {};
        VerifyCookie = body.Data;

          
         if (paytmParams != null && paytmParams.STATUS != undefined && paytmParams.STATUS != null && paytmParams.STATUS != '') {
          if (paytmParams.RESPCODE != undefined && paytmParams.RESPCODE != null && paytmParams.RESPCODE != '' && paytmParams.RESPCODE == PaytmResponceSuccessCode &&
            PayTmMerchantKey != undefined && PayTmMerchantKey != null && PayTmMerchantKey != '' && paytmChecksum != undefined && paytmChecksum != null && paytmChecksum != '') {
            try {
              var isValidChecksum = paytm_checksum.verifychecksum(paytmParams, PayTmMerchantKey, paytmChecksum);
              if (isValidChecksum) {
                if (paytmParams.ORDERID != undefined && paytmParams.ORDERID != null && paytmParams.ORDERID != '') {
                  PAYTMTransactionId = paytmParams.ORDERID;
                  SON = paytmParams.ORDERID;
                } else {
                  sbResponseMassage.append("<PGMessage>");
                  sbResponseMassage.append("PG transaction id is empty");
                  sbResponseMassage.append("</PGMessage>");
                }
                if (paytmParams.TXNAMOUNT != undefined && paytmParams.TXNAMOUNT != null && paytmParams.TXNAMOUNT != '') {
                  PAYTMPGamount = paytmParams.TXNAMOUNT;
                } else {
                  sbResponseMassage.append("<PGMessage>");
                  sbResponseMassage.append("Amount paid is empty");
                  sbResponseMassage.append("</PGMessage>");
                }
                if (paytmParams.TXNID != undefined && paytmParams.TXNID != null && paytmParams.TXNID != '') {
                  TransactionId = paytmParams.TXNID;
                }
                if (paytmParams.RESPMSG != undefined && paytmParams.RESPMSG != null && paytmParams.RESPMSG != '') {
                  strResponseMessage = paytmParams.RESPMSG;
                }
                if (PAYTMPGamount != '') {
                  if (PAYTMTransactionId != '') {
                    if (VerifyCookie.StoreOrderNumber == PAYTMTransactionId) {
                      totalOrderAmount = parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2);
                      totalPaidAmount = parseFloat(PAYTMPGamount).toFixed(2);
                      if (totalOrderAmount > 0) {
                        if (totalPaidAmount == totalOrderAmount) {
                          StoreOrderStatus = "Verified";
                          IsPGSuccess = true;
                          if (paytmParams.PAYMENTMODE != undefined && paytmParams.PAYMENTMODE != null && paytmParams.PAYMENTMODE != '') {
                            strPaymentMode = paytmParams.PAYMENTMODE;
                          }
                          if (paytmParams.BANKNAME != undefined && paytmParams.BANKNAME != null && paytmParams.BANKNAME != '') {
                            strBankName = paytmParams.BANKNAME;
                          }
                        } else {
                          sbResponseMassage.append("<PGMessage>");
                          sbResponseMassage.append("Order amount and amount paid are mismatched");
                          sbResponseMassage.append("</PGMessage>");
                        }
                      } else {
                        sbResponseMassage.append("<PGMessage>");
                        sbResponseMassage.append("Order amount is empty");
                        sbResponseMassage.append("</PGMessage>");
                      }
                    }
                  } else {
                    sbResponseMassage.append("<PGMessage>");
                    sbResponseMassage.append("Order number and PG transaction id are mismatched");
                    sbResponseMassage.append("</PGMessage>");
                  }
                }
              }
              else {
                StoreOrderStatus = "PG_Failure";
                sbResponseMassage.append("<PGMessage>");
                sbResponseMassage.append("CheckSum did not matched");
                sbResponseMassage.append("</PGMessage>");
              }
            } catch {
              StoreOrderStatus = "PG_Failure";
              sbResponseMassage.append("<PGMessage>");
              sbResponseMassage.append("CheckSum did not matched");
              sbResponseMassage.append("</PGMessage>");
            }
          } else if (paytmParams.RESPCODE != undefined && paytmParams.RESPCODE != null && paytmParams.RESPCODE != '' &&
            (paytmParams.STATUS.toUpperCase() == "PENDING " || paytmParams.RESPCODE == PaytmPaymentPendingStatusCode1 || paytmParams.RESPCODE == PaytmPaymentPendingStatusCode2)) {
            StoreOrderStatus = "PAYMENT_PENDING";
            sbResponseMassage.append("<PGMessage>");
            sbResponseMassage.append("Payment is pending");
            sbResponseMassage.append("</PGMessage>");
            if (paytmParams.RESPMSG != undefined && paytmParams.RESPMSG != null && paytmParams.RESPMSG != '') {
              strResponseMessage = paytmParams.RESPMSG
            } else {
              strResponseMessage = "Payment is pending";
            }
          } else if (paytmParams.RESPCODE != undefined && paytmParams.RESPCODE != null && paytmParams.RESPCODE != '' &&
            paytmParams.STATUS.toUpperCase() == "TXN_FAILURE " && paytmParams.RESPCODE == PaytmCancelledTransactionResponseCode) {
            StoreOrderStatus = "TXN_FAILURE";
    
            if (paytmParams.RESPMSG != undefined && paytmParams.RESPMSG != null && paytmParams.RESPMSG != '') {
              sbResponseMassage.append("<PGMessage>");
              sbResponseMassage.append(paytmParams.RESPMSG);
              sbResponseMassage.append("</PGMessage>");
              strResponseMessage = paytmParams.RESPMSG
            } else {
              sbResponseMassage.append("<PGMessage>");
              sbResponseMassage.append("User has not completed transaction.");
              sbResponseMassage.append("</PGMessage>");
              strResponseMessage = "User has not completed transaction.";
            }
          } else {
            StoreOrderStatus = "PG_Failure";
            sbResponseMassage.append("<PGMessage>");
            sbResponseMassage.append("Success code mismatched");
            sbResponseMassage.append("</PGMessage>");
            if (paytmParams.RESPMSG != undefined && paytmParams.RESPMSG != null && paytmParams.RESPMSG != '') {
              strResponseMessage = paytmParams.RESPMSG
            } else {
              strResponseMessage = "Success code mismatched";
            }
          }
    
          sbResponseMassage.append("</PGResponse>");
          sbResponseMassage.append("</xml>");
    
         
    
    
          // API Request
          objAPIRequest = {};
          // objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
          objAPIRequest.StoreOrderNumber = VerifyCookie.StoreOrderNumber;

          objAPIRequest.PAYTMPGResponse = sbResponseMassage.toString();
          objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
          // objAPIRequest.CustomerToken = req.cookies.CustomerToken;

          // objAPIRequest.PaymentType = req.cookies.PaymentType;
          objAPIRequest.PaymentType = VerifyCookie.PaymentType;

          objAPIRequest.SecurityToken = SecurityToken;
          objAPIRequest.IPAddress = GetIP4Address();
          objAPIRequest.ResponseMessage = strResponseMessage;
          // if (req.cookies.BasketGUID != '') {
          //   objAPIRequest.BasketGUID = req.cookies.BasketGUID;
          // }
          if (VerifyCookie.BasketGuid != '') {
            objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
          }
          objAPIRequest.TotalAmount = totalPaidAmount;
          var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');
    
          objAPIRequest = {};
          // objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
          objAPIRequest.StoreOrderNumber = VerifyCookie.StoreOrderNumber;

          objAPIRequest.StoreOrderStatus = StoreOrderStatus;
          objAPIRequest.IsCouponCodeApplyToCOD = false;
          // objAPIRequest.PaymentType = req.cookies.PaymentType;
          objAPIRequest.PaymentType = VerifyCookie.PaymentType;

          // objAPIRequest.PaymentGateway = req.cookies.PaymentGateway;
          objAPIRequest.PaymentGateway = VerifyCookie.PaymentGateway;

          //objAPIRequest.TransactionId = PGTransactionNo;
          objAPIRequest.TransactionId = TransactionId;
          objAPIRequest.ResponseCode = PGRespCode;
          objAPIRequest.ResponseMessage = strResponseMessage;
          objAPIRequest.PGResponse = sbResponseMassage.toString();
          objAPIRequest.SecurityToken = SecurityToken;
          // objAPIRequest.CustomerToken = req.cookies.CustomerToken;
          objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;

          objAPIRequest.IPAddress = GetIP4Address();
          objAPIRequest.TransactionType = strPaymentMode;
          objAPIRequest.BankDetails = strBankName;
          // if (req.cookies.BasketGUID != '') {
          //   objAPIRequest.BasketGUID = req.cookies.BasketGUID;
          // }
          if (VerifyCookie.BasketGuid != '') {
            objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
          }
          objAPIRequest.TotalAmount = totalPaidAmount;
          var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
          sbResponseMassage = null;
          if (IsPGSuccess) {
            res.writeHead(301,
              // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
              { Location: config.SiteUrl + 'thankyou' }
            );
            res.end();
          } else {
            res.writeHead(301,
              // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
              { Location: config.SiteUrl + 'paytm-failure/' + SON  }
            );
            res.end();
          }
        }

        } else {
          res.writeHead(301,
            // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
            { Location: config.SiteUrl + 'paytm-failure/' + SON  }
          );
          res.end();
        }
 
        });
       
     } catch (error) {
      res.writeHead(301,
        // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
        { Location: config.SiteUrl + 'paytm-failure/' + SON  }
      );
      res.end();
     }
    
      

    // end of getting cookie details

   
  } catch (exception) {
    if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
      insertErrorLog.insertErrorLog(LogTypeId, exception, InsertErrorLogApi, 'getPaytmResponse');
    }

    res.writeHead(301,
      // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
      { Location: config.SiteUrl + 'paytm-failure/' + SON }
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
  request.method = strRequestMethodType;
  request.ServicePoint = { "Expect100Continue": false };
  request.Timeout = 60000;
  request.ContentType = "application/json;";
  request.authorization = "Bearer " + SecurityToken;
  //request.ContentLength = JSON.parse(strRequest).Length;
  httpReq.httpReq(strAPIURL, 'post', strRequest, request);
  //   Request.post({
  //     headers: request,
  //     url: strAPIURL,
  //     data: strRequest
  // }, (error, response, body) => {
  //     if(error) {
  //         console.log('err');
  //         return console.dir(error);
  //     }
  //     console.log('Success');
  //     console.log('body:'+body);
  //     console.log('response'+JSON.stringify(response));
  //     return JSON.stringify(response);
  // });
  // ajaxReq.post({
  //   url: strAPIURL,
  //   data: strRequest,
  //   headers: request

  // }, function (err, res, body) {

  //   if (err) {
  //     console.log('Ajax err-' + err);
  //   }
  //   console.log('Ajax res -' + res);
  //   console.log('Ajax body -' + body);
  //   return res;

  // });

}

module.exports = router;
