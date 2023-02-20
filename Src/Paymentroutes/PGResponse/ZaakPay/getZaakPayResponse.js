var express = require('express');
const zaakpayChecksumFile = require('./zaakPayChecksum');
var router = express.Router();
const StringBuilder = require("string-builder");
const config = require('../../configurations/config');
var ZAAKPAYSecretKey = config.ZAAKPAYSecretKey;
var ZAAKPAYResponseSuccessCode = config.ZAAKPAYResponseSuccessCode;
var SecurityToken = config.SecurityToken
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
const ip = require('ip');
var httpReq = require('../../common/httpCall/apiCall');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var ajaxReq = require('ajax-request');
var VerifyZaakpayChecksum = config.VerifyZaakpayChecksum;
var request = {};
  request.Timeout = 60000;
  request.ContentType = "application/json;";
  request.authorization = "Bearer " + SecurityToken;


router.post('/', function (req, res, next) {
  try {
    var IsPGSuccess = false;
    var ZAAKPAYPGamount = '';
    var ZAAKPAYTransactionId = '';
    var ZAAKPAYChecksum = '';
    var StoreOrderStatus = 'PG_Failure';
    var TransactionId = '';
    var totalOrderAmount = 0;
    var totalPaidAmount = 0;
    var ZaakpayDiscountAmount = '';
    var ZaakpayCouponName = '';
    var ZaakpayResponseCode = '';
    var BankName = '';
    var PaymentMode = '';
    var ZaakpayResponseMessage = '';
    let sbResponseMessage = new StringBuilder();
    sbResponseMessage.append("<xml>");
    sbResponseMessage.append("<PGResponse>");

    var parameters = {};

    for (var key in req.body) {

      if (key == "checksum") {
        appendSbResponseMessage(sbResponseMessage, "<hash>", req.body[key], "</hash>");
        ZAAKPAYChecksum = req.body[key];

      } else {
        parameters[key] = req.body[key];
        appendSbResponseMessage(sbResponseMessage, "<" + key + ">", req.body[key] != null ? req.body[key] : "", "</" + key + ">");
      }
    }
    if (parameters.responseCode != undefined && parameters.responseCode != null && parameters.responseCode != '') {
      ZaakpayResponseCode = parameters.responseCode.toString();
    }

    if (parameters.responseDescription != undefined && parameters.responseDescription != null && parameters.responseDescription != '') {
      ZaakpayResponseMessage = parameters.responseDescription.toString();
    }

    if (parameters.bank != undefined && parameters.bank != null && parameters.bank != '') {
      BankName = parameters.bank.toString();
    }

    if (parameters.paymentMode != undefined && parameters.paymentMode != null && parameters.paymentMode != '') {
      PaymentMode = parameters.paymentMode.toString();
    }

    if (parameters.bank != undefined && parameters.bank != null && parameters.bank != '') {
      BankName = parameters.bank.toString();
    }

    if (parameters.responseCode != undefined && parameters.responseCode != null && parameters.responseCode != '' &&
      parseInt(parameters.responseCode) == ZAAKPAYResponseSuccessCode && ZAAKPAYSecretKey != undefined && ZAAKPAYSecretKey != null &&
      ZAAKPAYSecretKey != '' && ZAAKPAYChecksum != undefined && ZAAKPAYChecksum != null && ZAAKPAYChecksum != '') {
      try {
        var allParamValue = '';
        var isChecksumValid = false;
        // allParamValue = zaakpayChecksumFile.getAllNotEmptyParamValue(req.body).trim();
        // console.log('allParamValue' + allParamValue);
        // var strZAAKPAYChecksum;
        // zaakpayChecksumFile.calculateChecksum(ZAAKPAYSecretKey, allParamValue, function (err, data) {
        //   console.log(data);
        //   if (err) {
        //     console.log(err)
        //   } else {
        //     strZAAKPAYChecksum = data;
        //     console.log('data: ' + strZAAKPAYChecksum)
        //   }
        // });
        // console.log('strZAAKPAYChecksum : ' + strZAAKPAYChecksum);
        // console.log('waiting');
        ajaxReq.post({
          url: VerifyZaakpayChecksum,
          data: req.body,
          headers: request
      
      }, function (err, res, body) {
      
          if (err) {
              console.log('Ajax err-' + err);
          }
          body = JSON.parse(body);
          if(body.ReturnCode == 503) {
            isChecksumValid = true;
          } else {
            isChecksumValid = false;
          }
          checksumVerify();
      });

      } catch (ex) {
        StoreOrderStatus = "PG_Failure";
        appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
        paymentRedirection();
      }
    } else {
      StoreOrderStatus = "PG_Failure";
      appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Success code mismatched", "</PGMessage>");
      paymentRedirection();
    }

    function appendSbResponseMessage(sbResponseMessage, tagOpen, value, tagClose) {
      sbResponseMessage.append(tagOpen + value + tagClose);
    }
    function paymentRedirection() {
    sbResponseMessage.append("</PGResponse>");
    sbResponseMessage.append("</xml>");

    objAPIRequest = {};
    objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
    objAPIRequest.PAYUPGResponse = sbResponseMessage.toString();
    objAPIRequest.CustomerToken = req.cookies.CustomerToken;
    objAPIRequest.PaymentType = req.cookies.PaymentType;
    objAPIRequest.SecurityToken = SecurityToken;
    objAPIRequest.IPAddress = GetIP4Address();
    objAPIRequest.ResponseMessage = ZaakpayResponseMessage;
    if (req.cookies.BasketGuid != '') {
      objAPIRequest.BasketGUID = req.cookies.BasketGuid;
  }
  objAPIRequest.TotalAmount = (totalPaidAmount / 100);

  var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');

  objAPIRequest = {};
  objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
  objAPIRequest.StoreOrderStatus = StoreOrderStatus;
  objAPIRequest.IsCouponCodeApplyToCOD = false;
  objAPIRequest.PaymentType = req.cookies.PaymentType;
  objAPIRequest.PaymentGateway = req.cookies.PaymentGateway.toString().toUpperCase();
  //objAPIRequest.TransactionId = PGTransactionNo;
  objAPIRequest.TransactionId = TransactionId;
  objAPIRequest.ResponseCode = ZaakpayResponseCode;
  objAPIRequest.ResponseMessage = ZaakpayResponseMessage;
  objAPIRequest.PGResponse = sbResponseMessage.toString();
  objAPIRequest.SecurityToken = SecurityToken;
  objAPIRequest.CustomerToken = req.cookies.CustomerToken;
  if (req.cookies.BasketGuid != '') {
    objAPIRequest.BasketGUID = req.cookies.BasketGuid;
}
  objAPIRequest.IPAddress = GetIP4Address();
  objAPIRequest.TotalAmount = (totalOrderAmount / 100); // Changed objAPIRequest.TotalAmount = totalpaidamount to objAPIRequest.TotalAmount = (totalOrderAmount / 100) by Ravishankar on 19 March 2019 // Modified by kushagra as totalPaidAmount to total order amount
  ZaakpayDiscountAmount = (ZaakpayDiscountAmount / 100);
  objAPIRequest.PGPaidAmount = (totalPaidAmount / 100);
  objAPIRequest.PGOfferAmount = ZaakpayDiscountAmount;
  objAPIRequest.PGOfferId = ZaakpayCouponName;
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
          { Location: config.SiteUrl + 'makepayment' }
      );
      res.end();
  }
  }
  function checksumVerify() {
    if (isChecksumValid) {
      if (parameters.orderId != undefined && parameters.orderId != null && parameters.orderId != '') {
        ZAAKPAYTransactionId = parameters.orderId;
      }
      if (parameters.amount != undefined && parameters.amount != null && parameters.amount != '') {
        ZAAKPAYPGamount = parameters.amount;
      }
      if (parameters.discountAmount != undefined && parameters.discountAmount != null && parameters.discountAmount != '') {
        ZaakpayDiscountAmount = parseFloat(parameters.discountAmount).toFixed(2);
      }
      if (parameters.couponName != undefined && parameters.couponName != null && parameters.couponName != '') {
        ZaakpayCouponName = parameters.couponName;
      }
      if (parameters.pgTransId != undefined && parameters.pgTransId != null && parameters.pgTransId != '') {
        TransactionId = parameters.pgTransId;
      }

      if (ZAAKPAYPGamount != '') {
        if (ZAAKPAYTransactionId != '') {
          if (req.cookies.StoreOrderNumber == ZAAKPAYTransactionId) {
            totalOrderAmount = parseFloat(req.cookies.TotalOrderAmount).toFixed(2);
            totalPaidAmount = parseFloat(ZAAKPAYPGamount).toFixed(2);
            if (totalOrderAmount > 0) {
              if ((totalPaidAmount + ZaakpayDiscountAmount) >= totalOrderAmount) {
                StoreOrderStatus = "Verified";
                IsPGSuccess = true;
                paymentRedirection();
              } else {
                appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount and amount paid are mismatched", "</PGMessage>");
                paymentRedirection();
              }
            } else {
              appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount is empty", "</PGMessage>");
              paymentRedirection();
            }
          } else {
            appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order number and PG transaction id are mismatched", "</PGMessage>");
            paymentRedirection();
          }
        } else {
          appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "PG transaction id is empty", "</PGMessage>");
          paymentRedirection();
        }
      } else {
        appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Amount paid is empty", "</PGMessage>");
        paymentRedirection();
      }
    } else {
      StoreOrderStatus = "PG_Failure";
      appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
      paymentRedirection();
    }
  }

    
    
    

  } catch (exception) {
    if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
      insertErrorLog.insertErrorLog(LogTypeId, exeption, InsertErrorLogApi, 'getPayUResponse');
  }

  res.writeHead(301,
      { Location: config.SiteUrl + 'makepayment' }
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
