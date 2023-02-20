var express = require('express');
var fs = require('fs');
var router = express.Router();
const StringBuilder = require("string-builder");
const config = require('../../configurations/config');
var RazorpayKey = config.RazorpayKey;
var RazorpaySecret = config.RazorpaySecret;
var SecurityToken = config.SecurityToken;
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
const ip = require('ip');
var ajaxReq = require('ajax-request');
const Razorpay = require("razorpay");
var serialize = require('serialize-javascript');
var js2xmlparser = require("js2xmlparser");
var LogTypeId = config.LogTypeId;
const Enum = require('enum');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var InsertErrorLogApi = config.InsertErrorLog;
var httpReq = require('../../common/httpCall/apiCall');
var ErrorLog = new Enum({
  All: 0,
  Text_File: 1,
  SendError_Message: 2,
  SendError_Message_TextFile: 3,
  TextFile_DBLog: 4,
  ErrorLog_NotRequired: -1
});
var VerifyCookieDetails = config.VerifyCookieDetails;
const date = require('date-and-time');
const ErrorLogFilePath = config.ErrorLogFilePath;
const IsErrorLogFileCretaion = config.IsErrorLogFileCretaion;
const fse = require('fs-extra');
router.post('/', function (req, res, next) {
  try {
    var IsPGSuccess = false;
    var RAZORPAYPGamount = '';
    var RAZORPAYTransactionId = '';
    var RAZORPAYOrderId = '';
    var RAZORPAYsignature = '';
    var StoreOrderStatus = 'PG_Failure';
    var totalOrderAmount = 0;
    var totalPaidAmount = 0;
    var status = '';
    var paymentId = '';
    var dblFetchAPIAmount = 0;
    var strFetchAPIOrderId = '';
    var strFetchAPIPaymentId = '';
    var strPaymentMode = '';
    var RazorpayTotalOrderAmount = '';
    var RazorpayPaidAmount = '';
    var RazorpayOfferAmount = 0.0;
    var RazorpayOfferId = '';
    var BankName = '';
    var PGRespCode = '';
    var strRazorpayResponseMessage = '';
    var strRazorpayResponseCode = '';
    let sbResponseMessage = new StringBuilder();
    var sbPGResponseMessage = '';
    var sbOrderAPIResponseMessage = '';
    var sbFetchAPIResponseMessage = '';
    var IsNotException = false;
    var logFileCreation = new StringBuilder();
    CreateLogErrorFile(req.body, '-------- PG RESPONSE -1 ----'+ req.body["receipt"] +'------', req.body["receipt"], true, false);
    CreateLogErrorFile(RAZORPAYPGamount, '-------- RAZORPAYPGamount -1 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    CreateLogErrorFile(RAZORPAYTransactionId, '-------- RAZORPAYTransactionId -1 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    CreateLogErrorFile(RAZORPAYOrderId, '-------- RAZORPAYOrderId -1 ----'+ req.body["receipt"] +'------', req.body["receipt"], false, false);
    if(Object.keys(req.body).length > 0) {
      sbPGResponseMessage = serialize(req.body);
      console.log('sbPGResponseMessage');
      console.log(sbPGResponseMessage);

      paymentId = req.body["razorpay_payment_id"];
      RAZORPAYPGamount = req.body["amount"];
      RAZORPAYTransactionId = req.body["receipt"];
      RAZORPAYOrderId = req.body["razorpay_order_id"];
      status = req.body["status"];
    }
    CreateLogErrorFile(req.body, '--------PG RESPONSE -2 -----'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, true, false);
    CreateLogErrorFile(RAZORPAYPGamount, '-------- RAZORPAYPGamount -2 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    CreateLogErrorFile(RAZORPAYTransactionId, '-------- RAZORPAYTransactionId -2 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    CreateLogErrorFile(RAZORPAYOrderId, '-------- RAZORPAYOrderId -2 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    if (status != undefined && status != null && status != '') {
      status = status.toLowerCase();
    }
    sbResponseMessage.append("<xml>");
    sbResponseMessage.append("<PGResponse>");
    sbResponseMessage.append("<Parameters>");
    sbResponseMessage.append("<razorpay_payment_id>");
    sbResponseMessage.append(paymentId);
    sbResponseMessage.append("</razorpay_payment_id>");
    sbResponseMessage.append("<amount>");
    sbResponseMessage.append(RAZORPAYPGamount);
    sbResponseMessage.append("</amount>");
    sbResponseMessage.append("<OrderId>");
    sbResponseMessage.append(RAZORPAYTransactionId);
    sbResponseMessage.append("</OrderId>");
    sbResponseMessage.append("<razorpay_order_id>");
    sbResponseMessage.append(RAZORPAYOrderId);
    sbResponseMessage.append("</razorpay_order_id>");
    sbResponseMessage.append("</Parameters>");

    CreateLogErrorFile(sbResponseMessage, '-------- sbResponseMessage -1 -----'+ req.body["receipt"] +'-----', req.body["receipt"], false, false);
    

    totalOrderAmount = parseFloat(req.cookies.TotalOrderAmount).toFixed(2);
    totalPaidAmount = parseFloat(RAZORPAYPGamount).toFixed(2);

    // Geeting Cookie Details from API

    objAPIRequest = {};
    objAPIRequest.PaymentGatewayTransactionId = '';
    CreateLogErrorFile(RAZORPAYTransactionId, '-------- RAZORPAYTransactionId - 3 ----'+ req.body["receipt"] +'------', req.body["receipt"], false, false);
    objAPIRequest.StoreOrderNumber = RAZORPAYTransactionId;
    CreateLogErrorFile(RAZORPAYTransactionId, '-------- RAZORPAYTransactionId - 4 ----'+ req.body["receipt"] +'------', req.body["receipt"], false, false);
    var request = {};
    request.method = 'post';
    request.ServicePoint = { "Expect100Continue": false };
    request.Timeout = 60000;
    request.ContentType = "application/json;";
    request.authorization = "Bearer " + SecurityToken;
    CreateLogErrorFile(objAPIRequest, '----------- COOKIE API REQUEST -----'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, true, false);
    ajaxReq.post({
      url: VerifyCookieDetails,
      data: objAPIRequest,
      headers: request
    }, function (err, res1, body) {
      body = JSON.parse(body);
      console.log('-----body Start------');
      console.log(body);
      console.log('-----body End------');
      CreateLogErrorFile(body, '----------- COOKIE API RESPONSE ----'+ req.body["receipt"] +'------', RAZORPAYTransactionId, true, false);
      if(body.Data != undefined && body.Data != null && body.Data != "" && body.ReturnCode == 0) {
        var VerifyCookie = {};
        VerifyCookie = body.Data;
        CreateLogErrorFile(VerifyCookie, '----------- VerifyCookie ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, true, false);
        totalOrderAmount = VerifyCookie.TotalOrderAmount * 100;
        totalOrderAmount = parseFloat(totalOrderAmount).toFixed(2);
      
    if (RAZORPAYTransactionId != undefined && RAZORPAYTransactionId != null && RAZORPAYTransactionId != '' &&
      VerifyCookie.StoreOrderNumber == RAZORPAYTransactionId && paymentId != undefined && paymentId != null &&
      paymentId != "" && RAZORPAYPGamount != undefined && RAZORPAYPGamount != null && RAZORPAYPGamount != "" &&
      status != "closed" && RAZORPAYOrderId != undefined && RAZORPAYOrderId != null && RAZORPAYOrderId != "") {
      var client = null;
      var objRazorpayOrder = null;
      var objPayment = null;
      if (RazorpayKey != undefined && RazorpayKey != null && RazorpayKey != "" && RazorpaySecret != undefined &&
        RazorpaySecret != null && RazorpaySecret != "") {
        client = new Razorpay({
          key_id: RazorpayKey,
          key_secret: RazorpaySecret
        });
      }
      if (client != null) {
        CreateLogErrorFile(RAZORPAYOrderId, '----------- Before Fetch Order RAZORPAYOrderId ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, false, false);
        client.orders.fetch(RAZORPAYOrderId).then((response) => {
          objRazorpayOrder = response;
          CreateLogErrorFile(objRazorpayOrder, '----------- Fetch Order Response ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, true, false);
          console.log('objRazorpayOrder');
          console.log(objRazorpayOrder);
          if (objRazorpayOrder != null && Object.keys(objRazorpayOrder) != null && Object.keys(objRazorpayOrder).length > 0) {
            sbResponseMessage.append("<Fetch Order Response>");
            for (var key in objRazorpayOrder) {
              sbResponseMessage.append("<" + key + ">");
              sbResponseMessage.append(objRazorpayOrder[key] != null ? objRazorpayOrder[key].toString() : "");
              sbResponseMessage.append("</" + key + ">");
            }
            sbResponseMessage.append("</Fetch Order Response>");
            CreateLogErrorFile(sbResponseMessage, '----------- After Fetch Order Response Append -----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, false, false);
            sbOrderAPIResponseMessage = serialize(objRazorpayOrder);

            if (objRazorpayOrder["amount"] != null) {
              RazorpayTotalOrderAmount = objRazorpayOrder["amount"].toString();
            }
            if (objRazorpayOrder["amount_paid"] != null) {
              RazorpayPaidAmount = objRazorpayOrder["amount_paid"].toString();
            }
            if (objRazorpayOrder["amount_due"] != null) {
              RazorpayOfferAmount = parseFloat(objRazorpayOrder["amount_due"].toString()).toFixed(2);
            }
            if (objRazorpayOrder["offer_id"] != null) {
              RazorpayOfferId = objRazorpayOrder["offer_id"];
            } else if (objRazorpayOrder["offers"] != null) {
              for (var offerid in objRazorpayOrder["offers"]) {
                RazorpayOfferId += offerid + ",";
              }
            }
            if (RazorpayOfferId.Length > 256) {
              RazorpayOfferId = RazorpayOfferId.substring(0, 256);
            }
            if ((RazorpayTotalOrderAmount != undefined && RazorpayTotalOrderAmount != null && RazorpayTotalOrderAmount != '') ||
              (RazorpayPaidAmount != undefined && RazorpayPaidAmount != null && RazorpayPaidAmount != '')) {
                CreateLogErrorFile(req.body, '----------- Before Fetch Payment PG Request -----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, true, false);
                CreateLogErrorFile(VerifyCookie, '----------- Before Fetch Payment VerifyCookie ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, true, false);
                CreateLogErrorFile(paymentId, '----------- Before Fetch Payment paymentId ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, false, false);
              client.payments.fetch(paymentId + '?expand[]=offers').then((response) => {
                objPayment = response;
                CreateLogErrorFile(objPayment, '----------- Fetch Payment Response ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, true, false);
                console.log('objPayment');
                console.log(objPayment);
                if (objPayment != null && Object.keys(objPayment) != null && Object.keys(objPayment).length > 0) {
                  if (objPayment["error_code"] != null) {
                    PGRespCode = objPayment["error_code"];
                  }

                  sbResponseMessage.append("<Fetch API Response>");
                  for (var key in objPayment) {
                    sbResponseMessage.append("<" + key + ">");
                    sbResponseMessage.append(objPayment[key] != null ? objPayment[key].toString() : "");
                    sbResponseMessage.append("</" + key + ">");
                  }
                  sbResponseMessage.append("</Fetch API Response>");
                  CreateLogErrorFile(sbResponseMessage, '----------- Fetch Payment Response Append ----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'------', RAZORPAYTransactionId, false, false);
                  sbFetchAPIResponseMessage = serialize(objPayment);

                  if (objPayment["status"] != '') {
                    strRazorpayResponseMessage = objPayment["status"];
                  }
                  if (objPayment["method"] != null) {
                    strPaymentMode = objPayment["method"];
                  }

                  if (objPayment["bank"] != undefined && objPayment["bank"] != null) {
                    BankName = objPayment["bank"].toString();
                  } else if (objPayment["wallet"] != undefined && objPayment["wallet"] != null) {
                    BankName = objPayment["wallet"].toString();
                  } else if (objPayment["card_id"] != undefined && objPayment["card_id"] != null) {
                    BankName = objPayment["card_id"].toString();
                  } else if (objPayment["vpa"] != undefined && objPayment["vpa"] != null) {
                    BankName = objPayment["vpa"].toString();
                  }

                  if (objPayment["offers"] != undefined && objPayment["offers"] != null) {
                    // console.log('offerid-------------------1' + JSON.stringify(objPayment["offers"]["items"]));
                    // console.log('offerid-------------------2' + JSON.stringify(objPayment["offers"].items));
                    var offers = objPayment["offers"];
                    if (offers.items != undefined && offers.items != null) {
                      if (offers.count == 1) {
                        RazorpayOfferId = offers.items[0].id;
                      } else if (offers.count > 1){
                        for (var offerid in offers.items) {
                          // console.log('offerid-------------------3' + JSON.stringify(offerid));
                          RazorpayOfferId += offerid.id + ",";
                        }
                        for(i=0; i < offers.items.length; i++) {
                          if (i == offers.items.length-1) {
                            RazorpayOfferId += offers.items[i].id;
                          } else {
                            RazorpayOfferId += offers.items[i].id + ",";
                          }
                        // console.log('offerid test - AAAAA-------------------' + JSON.stringify(offers.items[i]));
                        }
                        // if (RazorpayOfferId != undefined && RazorpayOfferId != null && RazorpayOfferId != '') {
                        //   RazorpayOfferId = RazorpayOfferId.replace(/,\s*$/, "");
                        // }
                      } else {
                        RazorpayOfferId = '';
                      }
                      
                    }
                  }


                  if (objPayment["status"] != undefined && objPayment["status"] != null && objPayment["status"] != '') {
                    strRazorpayResponseMessage = objPayment["status"];
                  }
                  if (objPayment["status"] != '' && objPayment["status"].toString().toLowerCase() == "captured") {
                    if (objPayment["error_code"] == null) {
                      if (objPayment["id"] != undefined && objPayment["id"] != null && objPayment["id"] != "" &&
                        objPayment["order_id"] != undefined && objPayment["order_id"] != null && objPayment["order_id"] != "" &&
                        objPayment["amount"] != null && objPayment["amount"] > 0) {
                        strFetchAPIPaymentId = objPayment["id"];
                        dblFetchAPIAmount = parseFloat(objPayment["amount"].toFixed(2));
                        strFetchAPIOrderId = objPayment["order_id"];
                      }
                      if (strFetchAPIPaymentId != "" && strFetchAPIOrderId != "" && paymentId == strFetchAPIPaymentId && strFetchAPIOrderId == RAZORPAYOrderId) {
                        if (VerifyCookie.StoreOrderNumber != undefined && VerifyCookie.StoreOrderNumber != null && VerifyCookie.StoreOrderNumber != "" && dblFetchAPIAmount != null && dblFetchAPIAmount > 0) {
                          CreateLogErrorFile(RAZORPAYTransactionId, '----------- RAZORPAYTransactionId -----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, false);
                          CreateLogErrorFile(req.body, '----------- PG Response Before OrderNumber condition------'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'----', RAZORPAYTransactionId, true, false);
                          CreateLogErrorFile(VerifyCookie, '----------- VerifyCookie Before OrderNumber condition-----'+ VerifyCookie.StoreOrderNumber + '---'+ req.body["receipt"] +'-----', RAZORPAYTransactionId, true, true);
                          if (VerifyCookie.StoreOrderNumber == RAZORPAYTransactionId) {
                            console.log(parseFloat(RazorpayTotalOrderAmount).toFixed(2));
                            console.log(totalOrderAmount);
                            console.log(parseFloat(RazorpayPaidAmount).toFixed(2));
                            console.log(dblFetchAPIAmount);
                            if ((parseFloat(RazorpayTotalOrderAmount).toFixed(2)) == totalOrderAmount && (parseFloat(RazorpayPaidAmount).toFixed(2)) == dblFetchAPIAmount) {
                              StoreOrderStatus = "Verified";
                              IsPGSuccess = true;
                              strPaymentMode = objPayment["method"];
                              paymentRedirection()
                            } else {
                              appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Order amount and amount paid are mismatched, cookie amount is: " + totalOrderAmount + " transaction amount is : " + RAZORPAYPGamount + " fetch api amount is : " + dblFetchAPIAmount, '</PGMessage>');
                              paymentRedirection()
                            }
                          } else {
                            appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Order number and PG transaction id are mismatched, order number is: " + VerifyCookie.StoreOrderNumber + " razorpay transactionid is :" + RAZORPAYTransactionId, '</PGMessage>');
                            paymentRedirection()
                          }
                        } else {
                          appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "PG storeordernumber id is empty, storeordernumber is : " + VerifyCookie.StoreOrderNumber + " fetch api amount is null : " + dblFetchAPIAmount, '</PGMessage>');
                          paymentRedirection()
                        }
                      } else {
                        appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "PaymentId and fetch api paymentId are mismatched or empty, payment id is :" + paymentId + " paymentapipaymentId is :" + strFetchAPIPaymentId + " razorpay order id and fetch api order id are mismatched or empty, Razorpay order id : " + RAZORPAYOrderId + "fetch api order id : " + strFetchAPIOrderId, '</PGMessage>');
                        paymentRedirection()
                      }
                    } else {
                      var strErrorCode = "Razor Pay error_code is not null.";
                      if (objPayment["error_code"] != null && objPayment["error_code"] != '') {
                        strErrorCode = strErrorCode + " error_code is:" + objPayment["error_code"].toString();
                        strRazorpayResponseCode = objPayment["error_code"].toString();
                        // paymentRedirection()
                      }
                      appendSbResponseMessage(sbResponseMessage, '<PGMessage>', strErrorCode + " paymentid : " + paymentId, '</PGMessage>');
                      if (objPayment["error_description"] != null && objPayment["error_description"] != '') {
                        strRazorpayResponseMessage = objPayment["error_description"].toString();
                      }
                      paymentRedirection()
                    }
                  } else {
                    appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Payment staus is not \"captured\" paymentid :" + paymentId, '</PGMessage>');
                    paymentRedirection()
                  }

                } else {
                  appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Unable to featch the order with this payment id : " + paymentId, '</PGMessage>');
                  paymentRedirection()
                }
              }).catch((error) => {
                console.log(error);
              });
            } else {
              appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Response attributes amount and amount_paid mismatch.", '</PGMessage>');
              paymentRedirection()
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "PGFailure client is null : " + paymentId, '</PGMessage>');
        paymentRedirection()
      }
    } else {
      appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "PGFailure closed payment popup window or payment id is null : " + paymentId + " or amount is null : " + RAZORPAYPGamount + " or Razorpay order id is null :" + RAZORPAYOrderId, '</PGMessage>');
      strRazorpayResponseMessage = "Closed payment popup window by user";
      paymentRedirection()
    }

    function appendSbResponseMessage(sbResponseMessage, tagOpen, value, tagClose) {
      sbResponseMessage.append(tagOpen + value + tagClose);
    }
    function paymentRedirection() {
      sbResponseMessage.append("</PGResponse>");
      sbResponseMessage.append("</xml>");

      function deserialize(serializedJavascript){
        return eval('(' + serializedJavascript + ')');
      }
  
      if(sbPGResponseMessage != undefined && sbPGResponseMessage != null && sbPGResponseMessage != '') {
        var node1 = js2xmlparser.parse("RootResponse", deserialize(sbPGResponseMessage));
        sbPGResponseMessage = node1.toString();
      }
      if(sbOrderAPIResponseMessage != undefined && sbOrderAPIResponseMessage != null && sbOrderAPIResponseMessage != '') {
        var node2 = js2xmlparser.parse("OrderAPIResponse", deserialize(sbOrderAPIResponseMessage));
        sbPGResponseMessage += node2.toString();
      }
      if(sbFetchAPIResponseMessage != undefined && sbFetchAPIResponseMessage != null && sbFetchAPIResponseMessage != '') {
        var node3 = js2xmlparser.parse("FetchAPIResponse", deserialize(sbFetchAPIResponseMessage));
        sbPGResponseMessage += node3.toString();

        sbPGResponseMessage = sbPGResponseMessage.toString().replace(/\n/g, "").replace(/\s/g, "");
        console.log('sbPGResponseMessage1111');
        console.log(sbPGResponseMessage);
      }

      objAPIRequest = {};
      objAPIRequest.TempStoreOrderNumber = VerifyCookie.StoreOrderNumber;
      objAPIRequest.PGResponse = sbPGResponseMessage;
      objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
      objAPIRequest.PaymentType = VerifyCookie.PaymentType;
      objAPIRequest.SecurityToken = SecurityToken;
      objAPIRequest.IPAddress = GetIP4Address();
      objAPIRequest.PAYUPGResponse = sbPGResponseMessage;
      if (VerifyCookie.BasketGuid != '') {
        objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
      }
      objAPIRequest.StoreOrderNumber = RAZORPAYOrderId;
      objAPIRequest.PaymentId = paymentId;
      objAPIRequest.TotalAmount = totalPaidAmount > 0 ? (totalPaidAmount / 100): 0;
      var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');

      objAPIRequest = {};
      objAPIRequest.StoreOrderNumber = VerifyCookie.StoreOrderNumber;
      objAPIRequest.StoreOrderStatus = StoreOrderStatus;
      objAPIRequest.IsCouponCodeApplyToCOD = false;
      objAPIRequest.PaymentType = VerifyCookie.PaymentType;
      objAPIRequest.PaymentGateway = VerifyCookie.PaymentGateway.toString().toUpperCase();
      //objAPIRequest.TransactionId = PGTransactionNo;
      objAPIRequest.TransactionId = RAZORPAYOrderId;
      objAPIRequest.ResponseCode = strRazorpayResponseCode;
      objAPIRequest.ResponseMessage = strRazorpayResponseMessage;
      objAPIRequest.PGResponse = sbResponseMessage.toString();
      objAPIRequest.SecurityToken = SecurityToken;
      objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
      objAPIRequest.IPAddress = GetIP4Address();
      objAPIRequest.TransactionType = strPaymentMode;
      if (VerifyCookie.BasketGuid != '') {
        objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
      }
      objAPIRequest.PaymentId = paymentId;
      objAPIRequest.TotalAmount = (totalPaidAmount / 100); // Changed objAPIRequest.TotalAmount = totalPaidAmount to objAPIRequest.TotalAmount = (totalPaidAmount / 100) by Ravishankar on 19 March 2019 
      objAPIRequest.Order_Id = RAZORPAYOrderId;
      if (RazorpayOfferId != undefined && RazorpayOfferId != null && RazorpayOfferId != '') {
        objAPIRequest.PGOfferId = RazorpayOfferId.trim();
      }
      objAPIRequest.PGOfferAmount = (RazorpayOfferAmount / 100);

      if (RazorpayPaidAmount != undefined && RazorpayPaidAmount != null && RazorpayPaidAmount != '') {
        objAPIRequest.PGPaidAmount = (parseFloat(RazorpayPaidAmount).toFixed(2) / 100);
      }
      if(BankName != undefined && BankName != null && BankName != '') {
        objAPIRequest.BankDetails = BankName;
      }
      // var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
      var request = {};
      request.method = 'post';
      request.ServicePoint = { "Expect100Continue": false };
      request.Timeout = 60000;
      request.ContentType = "application/json;";
      request.authorization = "Bearer " + SecurityToken;
      //request.ContentLength = JSON.parse(strRequest).Length;
      // httpReq.httpReq(UpdateStoreOrderStatus, 'post', strRequest, request);
      ajaxReq.post({
        url: UpdateStoreOrderStatus,
        data: objAPIRequest,
        headers: request

      }, function (err, res, body) {

        if (err) {
          console.log('Ajax err-' + err);
          PgResponse();
        }
        console.log('Ajax res -' + res);
        console.log('Ajax body -' + body);
        PgResponse();
        // return res;

  });
    function PgResponse() {
      sbResponseMessage = null;
      if (IsPGSuccess) {
        res.writeHead(301,
          // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
          { Location: config.SiteUrl + 'thankyou' }
        );
        // res.redirect(config.SiteUrl + 'thankyou');

        res.end();
      } else {
        res.writeHead(301,
          // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
          { Location: config.SiteUrl + 'makepayment' }
        );
        res.end();
      }
    }

    }
  } else {
    res.writeHead(301,
      // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
      { Location: config.SiteUrl + 'makepayment'  }
    );
    res.end();
  }
});
  } catch (exception) {
    if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
      insertErrorLog.insertErrorLog(LogTypeId, exception, InsertErrorLogApi, 'getRazorPayResponse');
    }
    res.writeHead(301,
      // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
      { Location: config.SiteUrl + 'thankyou' }
    );
    res.end();
  }
  function CreateLogErrorFile(strLogMessage, heading, orderNumber, isSerialize, isSave) {
    if(IsErrorLogFileCretaion){
      console.log('Error log File Creation');
      console.log(strLogMessage);
      // var a=strSource.split('\n').slice(1);
      // var errStackSource = '';
      // a.forEach(element => {
      //     errStackSource = errStackSource + '\n' + element.trim();
      // });
      // console.log(errStackSource);
      // if(errData == undefined) {
      //   var errData = new StringBuilder();
      // }
      if(isSerialize) {
        strLogMessage = serialize(strLogMessage);
      }
      logFileCreation.appendLine(heading + "---------------" + date.format(new Date(), 'HH:mm:ss DD MMMM YYYY'));
      // errData.appendLine("{0} {1}"+ new Date().toGMTString());
      logFileCreation.appendLine(" :");
      logFileCreation.appendLine(" :" + strLogMessage);
      logFileCreation.appendLine(" :");
      logFileCreation.appendLine("---------------------------------------------------------------------------");
      
      
      fs.stat(ErrorLogFilePath , function (err) {
          if (err) {
              console.log(err)
              fs.mkdir(ErrorLogFilePath , { recursive: true }, (err) => {
                  if (err) throw err;
              });
    
          } else {
              console.log('success');
              fs.stat(ErrorLogFilePath +config.ProjectName  + '_' + currentDate() + '_' + orderNumber +'.txt', function (er) {
                      
    
                      // var a=strSource.split('\n').slice(1);
                      // a.forEach(element => {
                      //     errData.appendLine(" :"+ element.trim());
                      // });
                     // errData.appendLine(" :"+ errStackSource);
                      
                  if (er && isSave) {
                      console.log('Error file not exists')
                      fse.outputFile(ErrorLogFilePath +config.ProjectName +'_'+ currentDate() + '_' + orderNumber +'.txt', logFileCreation, err => {
                          if (err) {
                              console.log(err);
                          } else {
                              console.log('The file was saved! - 1');
                          }
                      })
                  } else if(isSave){
                    console.log('Error file not exists')
                    fse.outputFile(ErrorLogFilePath +config.ProjectName +'_'+ currentDate() + '_' + orderNumber +'.txt', logFileCreation, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('The file was saved! - 2');
                        }
                    })
                  } 
                  // else {
                      
                  //     fs.appendFile(ErrorLogFilePath +config.ProjectName +'_'+ currentDate() + '_' + orderNumber +'.txt', errData, err => {
                  //         if (err) {
                  //             console.log(err);
                  //         } else {
                  //             console.log('The file was appended!');
                  //         }
                  //     })
                  // }
    
              });
          }
      });
    }
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
  //   // return res;

  // });
}
function getResponse(req, sbResponseMessage, RAZORPAYOrderId, paymentId, totalPaidAmount, StoreOrderStatus, RAZORPAYOrderId, strRazorpayResponseMessage, strPaymentMode, RazorpayOfferAmount, PGRespCode, RazorpayPaidAmount, IsPGSuccess, res) {

  objAPIRequest = {};
  objAPIRequest.TempStoreOrderNumber = req.cookies.StoreOrderNumber;
  objAPIRequest.PGResponse = sbResponseMessage.toString();
  objAPIRequest.CustomerToken = req.cookies.CustomerToken;
  objAPIRequest.PaymentType = req.cookies.PaymentType;
  objAPIRequest.SecurityToken = SecurityToken;
  objAPIRequest.IPAddress = GetIP4Address();
  if (req.cookies.BasketGuid != '') {
    objAPIRequest.BasketGUID = req.cookies.BasketGuid;
  }
  objAPIRequest.StoreOrderNumber = RAZORPAYOrderId;
  objAPIRequest.PaymentId = paymentId;
  objAPIRequest.TotalAmount = (totalPaidAmount / 100);
  var strResponse1 = GetRestAPIResponse(InsertPgLogAPIUrl, objAPIRequest, 'Post');

  objAPIRequest = {};
  objAPIRequest.StoreOrderNumber = req.cookies.StoreOrderNumber;
  objAPIRequest.StoreOrderStatus = StoreOrderStatus;
  objAPIRequest.IsCouponCodeApplyToCOD = false;
  objAPIRequest.PaymentType = req.cookies.PaymentType
  objAPIRequest.PaymentGateway = req.cookies.PaymentGateway.toString().toUpperCase();
  //objAPIRequest.TransactionId = PGTransactionNo;
  objAPIRequest.TransactionId = RAZORPAYOrderId;
  objAPIRequest.ResponseCode = PGRespCode;
  objAPIRequest.ResponseMessage = strRazorpayResponseMessage;
  objAPIRequest.PGResponse = sbResponseMessage.toString();
  objAPIRequest.SecurityToken = SecurityToken;
  objAPIRequest.CustomerToken = req.cookies.CustomerToken;
  objAPIRequest.IPAddress = GetIP4Address();
  objAPIRequest.TransactionType = strPaymentMode;
  if (req.cookies.BasketGuid != '') {
    objAPIRequest.BasketGUID = req.cookies.BasketGuid;
  }
  objAPIRequest.PaymentId = paymentId;
  objAPIRequest.TotalAmount = (totalPaidAmount / 100); // Changed objAPIRequest.TotalAmount = totalPaidAmount to objAPIRequest.TotalAmount = (totalPaidAmount / 100) by Ravishankar on 19 March 2019 
  objAPIRequest.Order_Id = RAZORPAYOrderId;
  // if (RazorpayOfferId != undefined && RazorpayOfferId != null && RazorpayOfferId != '') {
  //   objAPIRequest.PGOfferId = RazorpayOfferId.trim();
  // }
  objAPIRequest.PGOfferAmount = (RazorpayOfferAmount / 100);

  if (RazorpayPaidAmount != undefined && RazorpayPaidAmount != null && RazorpayPaidAmount != '') {
    objAPIRequest.PGPaidAmount = (parseFloat(RazorpayPaidAmount).toFixed(2) / 100);
  }
  var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
  sbResponseMessage = null;


}


function currentDate() {
  var date1 = new Date().toDateString();
  date1 = date1.split(" ");
  date1 = date1[2]+"_"+date1[1]+"_"+date1[3];
  console.log(date.format(new Date(), 'HH:mm:ss DD MMMM YYYY'));
  return date1;
}

module.exports = router;
