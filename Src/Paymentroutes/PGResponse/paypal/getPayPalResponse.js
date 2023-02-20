// 1. Set up your server to make calls to PayPal

// 1a. Import the SDK package
var express = require('express');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const config = require('../../configurations/config');
var router = express.Router();
const StringBuilder = require("string-builder");
var SecurityToken = config.SecurityToken
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
var httpReq = require('../../common/httpCall/apiCall');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var VerifyCookieDetails = config.VerifyCookieDetails;
const ip = require('ip');
var ajaxReq = require('ajax-request');
var request = {};
var VerifyCookie = {};
var objAPIRequest = {};
request.Timeout = 60000;
request.ContentType = "application/json;";
request.authorization = "Bearer " + SecurityToken;
/**
 * PayPal HTTP client dependency
 */


const payPalClient = require('../../common/PayPal/payPalClient');

module.exports = async function handleRequest(req, res) {
  var IsPGSuccess = false;
  var StoreOrderStatus = 'PG_Failure';
  var TransactionId = '';
  var totalOrderAmount = 0;
  var totalPaidAmount = 0;
  var BankName = '';
  var PaymentMode = '';
  let sbResponseMessage = new StringBuilder();
  var isChecksumValid = false;
  var status = '';
  var currencyCode = '';
  var paymentId = '';
 
    
    sbResponseMessage.append("<xml>");
    sbResponseMessage.append("<PGResponse>");
  // 2a. Get the order ID from the request body
  const orderID = req.body.orderID;
  console.log(req.body);

  try {
  // 3. Call PayPal to capture the order
  appendSbResponseMessage(sbResponseMessage, "<PayPalResponse>",JSON.stringify(req.body),"</PayPalResponse>");
if(req.body.status != null && req.body.status == 'success'){
  const requestResponse = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  requestResponse.requestBody({});

  
    // req.body.CurrencyCode = req.cookies.CurrencyCode;
    // appendSbResponseMessage(sbResponseMessage, "<CurrencyCode>",req.cookies.CurrencyCode,"</CurrencyCode>");
    const capture = await payPalClient.client().execute(requestResponse);
    console.log('--capture--');
    console.log(capture);
    // 4. Save the capture ID to your database. Implement logic to save capture to your database for future reference.
    const captureID = capture.result.purchase_units[0]
        .payments.captures[0].id;
   // await database.saveCaptureID(captureID);
   if(capture.result != undefined && capture.result != null && capture.result != '') {
    isChecksumValid = true;
    
    } else {
    isChecksumValid = false;
    }
    console.log(isChecksumValid);
   console.log('-captureid--')
   console.log(captureID);

   checksumVerify(capture.result);
}
else{
  checksumVerify(req.body);
}
 

  } catch (err) {

    StoreOrderStatus = "PG_Failure";
    appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
    checksumVerify(req.body);
   // paymentRedirection();

    // 5. Handle any errors from the call
   //  console.error(err);
    // return res.sendStatus(500);
    // res.writeHead(500,
    //       // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
    //       { Location: config.SiteUrl + 'payment' }
    //   );
    //   res.end();
  }

//   res.writeHead(301,
//     // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
//     { Location: config.SiteUrl + 'thankyou' }
// );
// res.end();
  // 6. Return a successful response to the client
  // res.send(200);
  function checksumVerify(res) {

    try {
      if (res.id != undefined && res.id != null && res.id != '') {
        TransactionId = res.id;
      }
      objAPIRequest = {};
      objAPIRequest.StoreOrderNumber = '',
      objAPIRequest.PaymentGatewayTransactionId = orderID;
        request = {};
        request.method = 'post';
        request.ServicePoint = { "Expect100Continue": false };
        request.Timeout = 60000;
        request.ContentType = "application/json;";
        request.authorization = "Bearer " + SecurityToken;
        console.log('VerifyCookieDetails');
        console.log(orderID);
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
              if (res.id != undefined && res.id != null && res.id != '') {
                TransactionId = res.id;
              }
              if (res.purchase_units != undefined && res.purchase_units != null && res.purchase_units != '' &&
              res.purchase_units[0].payments != undefined && res.purchase_units[0].payments != null && res.purchase_units[0].payments != '' &&
              res.purchase_units[0].payments.captures != undefined && res.purchase_units[0].payments.captures != null && res.purchase_units[0].payments.captures != '' &&
              res.purchase_units[0].payments.captures[0].amount != undefined && res.purchase_units[0].payments.captures[0].amount != null && res.purchase_units[0].payments.captures[0].amount != '' &&
              res.purchase_units[0].payments.captures[0].amount.value != undefined && res.purchase_units[0].payments.captures[0].amount.value != null && res.purchase_units[0].payments.captures[0].amount.value != '') {
                totalPaidAmount = res.purchase_units[0].payments.captures[0].amount.value;
              }
              if (res.purchase_units != undefined && res.purchase_units != null && res.purchase_units != '' &&
              res.purchase_units[0].payments != undefined && res.purchase_units[0].payments != null && res.purchase_units[0].payments != '' &&
              res.purchase_units[0].payments.captures != undefined && res.purchase_units[0].payments.captures != null && res.purchase_units[0].payments.captures != '' &&
              res.purchase_units[0].payments.captures[0].amount != undefined && res.purchase_units[0].payments.captures[0].amount != null && res.purchase_units[0].payments.captures[0].amount != '' &&
              res.purchase_units[0].payments.captures[0].amount.currency_code != undefined && res.purchase_units[0].payments.captures[0].amount.currency_code != null && res.purchase_units[0].payments.captures[0].amount.currency_code != '') {
                currencyCode = res.purchase_units[0].payments.captures[0].amount.currency_code;
              }
              if (res.status !== undefined && res.status != null && res.status !== '') {
                status = res.status;
              }
              if (res.purchase_units != undefined && res.purchase_units != null && res.purchase_units != '' &&
              res.purchase_units[0].payments != undefined && res.purchase_units[0].payments != null && res.purchase_units[0].payments != '' &&
              res.purchase_units[0].payments.captures != undefined && res.purchase_units[0].payments.captures != null && res.purchase_units[0].payments.captures != '' &&
              res.purchase_units[0].payments.captures[0].id != undefined && res.purchase_units[0].payments.captures[0].id != null && res.purchase_units[0].payments.captures[0].id != '') {
                paymentId = res.purchase_units[0].payments.captures[0].id;
              }
        
             
                if (VerifyCookie.CurrencyCode == currencyCode) {
            
                  
                  if (totalPaidAmount != '') {
                    if (TransactionId != '') {
                      if (VerifyCookie.PaymentGatewayTransactionId == TransactionId) {
                        totalOrderAmount = parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2);
                        totalPaidAmount = parseFloat(totalPaidAmount).toFixed(2);
                        if (totalOrderAmount > 0) {
                          if (totalPaidAmount == totalOrderAmount) {
                            if (status.toLowerCase() == 'completed' ) {
                              StoreOrderStatus = "Verified";
                              IsPGSuccess = true;
                              if (res != null && res != undefined && res != "") {
                                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                              }
                              paymentRedirection(res);
                            } else{
                              appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "PG status is not completed", "</PGMessage>");
                              if (res != null && res != undefined && res != "") {
                                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                              }
                              paymentRedirection(res);
                            }
                            
                          } else {
                            appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount and amount paid are mismatched", "</PGMessage>");
                            if (res != null && res != undefined && res != "") {
                              appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                            }
                            paymentRedirection(res);
                          }
                        } else {
                          appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order amount is empty", "</PGMessage>");
                          if (res != null && res != undefined && res != "") {
                            appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                          }
                          paymentRedirection(res);
                        }
                      } else {
                        appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Order number and PG transaction id are mismatched", "</PGMessage>");
                        if (res != null && res != undefined && res != "") {
                          appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                        }
                        paymentRedirection(res);
                      }
                    } else {
                      appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "PG transaction id is empty", "</PGMessage>");
                      if (res != null && res != undefined && res != "") {
                        appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                      }
                      paymentRedirection(res);
                    }
                  } else {
                    appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Amount paid is empty", "</PGMessage>");
                    if (res != null && res != undefined && res != "") {
                      appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                    }
                    paymentRedirection(res);
                  }
                 } else {
                  appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Currency does not match", "</PGMessage>");
                  if (res != null && res != undefined && res != "") {
                    appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
                  }
                  paymentRedirection(res);
                 }
        
             
            } else {
              StoreOrderStatus = "PG_Failure";
              appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "CheckSum did not matched", "</PGMessage>");
              if (res != null && res != undefined ) {
                appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
              }
              paymentRedirection(res);
            }


          } else {
            StoreOrderStatus = "PG_Failure";
            appendSbResponseMessage(sbResponseMessage, "<PGMessage>", "Could not get cookies", "</PGMessage>");
            if (res != null && res != undefined && res != "") {
              appendSbResponseMessage(sbResponseMessage, "<ResponseParameters>",JSON.stringify(res),"</ResponseParameters>");
            }
            paymentRedirection(res);
          }


        });
    } catch (error) {
      console.log(error);
      // return res.sendStatus(500);
    }
    console.log('checksum function');
  
  
  // res.send('success');
  
  
  }

  function appendSbResponseMessage(sbResponseMessage, tagOpen, value, tagClose) {
    sbResponseMessage.append(tagOpen + value + tagClose);
  }

  function paymentRedirection(data) {
    sbResponseMessage.append("</PGResponse>");
    sbResponseMessage.append("</xml>");
  
    objAPIRequest = {};
    objAPIRequest.TempStoreOrderNumber = VerifyCookie.StoreOrderNumber;
    objAPIRequest.PGResponse = sbResponseMessage.toString();
    objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
    objAPIRequest.PaymentType = VerifyCookie.PaymentType;
    objAPIRequest.SecurityToken = SecurityToken;
    objAPIRequest.IPAddress = GetIP4Address();
    objAPIRequest.StoreOrderNumber = TransactionId;
    objAPIRequest.PaymentId = paymentId;
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
    objAPIRequest.Tag = VerifyCookie.PaymentGateway.toString().toUpperCase();
  }
  //objAPIRequest.TransactionId = PGTransactionNo;
  objAPIRequest.TransactionId = TransactionId;
  objAPIRequest.ResponseCode = status;
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
  objAPIRequest.Order_Id = TransactionId;

  var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
        sbResponseMessage = null;
  // res.send('success');
  
    if (IsPGSuccess) {
      // res.writeHead(301,
      //     // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
      //     { Location: config.SiteUrl + 'thankyou' }
      // );
      // res.end();
    //   res.writeHead(301,
    //     // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
    //     { Location: config.SiteUrl + 'thankyou' }
    // );
    // res.end();
    return res.sendStatus(200);
  } else {
      // res.writeHead(301,
      //     // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
      //     { Location: config.SiteUrl + 'payment' }
      // );
      // res.end();
      // res.end();
      return res.sendStatus(500);
  }
  }
  
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
  

}
