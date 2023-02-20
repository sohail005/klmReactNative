var express = require('express');
var router = express.Router();
const StringBuilder = require("string-builder");
const Enum = require('enum');
const config = require('../../configurations/config');
var insertErrorLog = require('../../common/errorLog/insertErrorLog');
var SALT = config.SALT;
var SecurityToken = config.SecurityToken
var InsertPgLogAPIUrl = config.InsertPgLogAPIUrl;
var UpdateStoreOrderStatus = config.UpdateStoreOrderStatus;
const ip = require('ip');
var ajaxReq = require('ajax-request');
var crypto = require('crypto');
const fse = require('fs-extra');
var fs = require('fs');
var stackTrace = require('stack-trace');
const date = require('date-and-time');
var httpReq = require('../../common/httpCall/apiCall');
var LogTypeId = config.LogTypeId;
var DonotLogErrors = config.DonotLogErrors;
var ErrorLogFilePath = config.ErrorLogFilePath;
var InsertErrorLogApi = config.InsertErrorLog;
var ErrorLog = new Enum({
    All: 0,
    Text_File: 1,
    SendError_Message: 2,
    SendError_Message_TextFile: 3,
    TextFile_DBLog: 4,
    ErrorLog_NotRequired: -1
});
var VerifyCookieDetails = config.VerifyCookieDetails;

router.post('/', function (req, res, next) {
    try {
        var IsPGSuccess = false;
        var PAYUPGamount = '';
        var StoreOrderStatus = '';
        var PAYUTransactionId = '';
        var PGRespCode = req.body.error;
        let sbResponseMessage = new StringBuilder();
        var PayUPGTransactionMessage = req["msg"];
        var PGTransactionNo = req["pgTxnNo"];
        sbResponseMessage.append("<xml>");
        sbResponseMessage.append("<PGResponse>");

        var merc_hash_vars_seq = [];
        var merc_hash_string = '';
        var merc_hash = '';
        var order_id = '';
        var hash_seq = config.hashSequence;
        merc_hash_vars_seq = hash_seq.split('|');
        merc_hash_vars_seq.reverse();
        merc_hash_string = SALT + "|" + req.body["status"];
        var totalOrderAmount = 0;

        if (req.body != null && req.body != undefined) {
            appendSbResponseMessage(sbResponseMessage, "<PayUResponse>",JSON.stringify(req.body),"</PayUResponse>");
          }

        if (req.body["status"] != undefined && req.body["status"] != null && req.body["status"] != '') {
            appendSbResponseMessage(sbResponseMessage, '<status>', req.body["status"], '</status>')
        }

        if (req.body["hash"] != undefined && req.body["hash"] != null && req.body["hash"] != '') {
            appendSbResponseMessage(sbResponseMessage, '<hash>', req.body["hash"], '</hash>')
        }

        if (req.body["txnid"] != undefined && req.body["txnid"] != null && req.body["txnid"] != '') {
            PAYUTransactionId = req.body["txnid"];
        }

        // Geeting Cookie Details
        try {
            objAPIRequest = {};
            objAPIRequest.PaymentGatewayTransactionId = '';
            objAPIRequest.StoreOrderNumber = PAYUTransactionId;
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
                VerifyCookie = {};
                VerifyCookie = body.Data;

                merc_hash_vars_seq.forEach(merc_hash_var => {
                    merc_hash_string += "|";
                    appendSbResponseMessage(sbResponseMessage, "<" + merc_hash_var + ">", req.body[merc_hash_var] != null ? req.body[merc_hash_var] : "", "</" + merc_hash_var + ">");
                    merc_hash_string = merc_hash_string + (req.body[merc_hash_var] != null ? req.body[merc_hash_var] : "");
                });
                if (req.body["status"] != null && req.body["status"].toString().toLowerCase() == "success") {
                    merc_hash = Generatehash512(merc_hash_string).toLowerCase();
                    if (req.body["hash"] != undefined && req.body["hash"] != null && req.body["hash"] != '' && merc_hash != req.body["hash"]) {
                        IsPGSuccess = false;
                        StoreOrderStatus = "PG_Failure";
                        appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Hash value did not matched", '</PGMessage>');
                    } else {
                        
            
                        if (req.body["amount"] != undefined && req.body["amount"] != null && req.body["amount"] != '') {
                            PAYUPGamount = req.body["amount"];
                        }
                        totalOrderAmount = parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2);
                        if (PAYUPGamount != '' && PAYUTransactionId != '' && parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2) > 0
                            && parseFloat(PAYUPGamount).toFixed(2) == parseFloat(VerifyCookie.TotalOrderAmount).toFixed(2) && VerifyCookie.StoreOrderNumber == PAYUTransactionId) {
                            IsPGSuccess = true;
                            StoreOrderStatus = "Verified";
                        }
                        else {
                            IsPGSuccess = false;
                            StoreOrderStatus = "PG_Failure";
                            appendSbResponseMessage(sbResponseMessage, '<PGMessage>', "Order amount,amount paid are mismatched.", '</PGMessage>');
                        }
                       
                    }
                } else {
                    IsPGSuccess = false;
                    StoreOrderStatus = "PG_Failure";
                }
        
                sbResponseMessage.append("</PGResponse>");
                sbResponseMessage.append("</xml>");
        
                
        
                objAPIRequest = {};
                objAPIRequest.StoreOrderNumber = VerifyCookie.StoreOrderNumber;
                objAPIRequest.PAYUPGResponse = sbResponseMessage.toString();
                objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
                objAPIRequest.PaymentType = VerifyCookie.PaymentType;
                objAPIRequest.SecurityToken = SecurityToken;
                objAPIRequest.IPAddress = GetIP4Address();
                objAPIRequest.ResponseMessage = PayUPGTransactionMessage;
                if (VerifyCookie.BasketGuid != '') {
                    objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
                }
                objAPIRequest.TotalAmount = PAYUPGamount;
        
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
                objAPIRequest.TransactionId = PGTransactionNo;
                objAPIRequest.ResponseCode = PGRespCode;
                objAPIRequest.ResponseMessage = PayUPGTransactionMessage;
                objAPIRequest.PGResponse = sbResponseMessage.toString();
                objAPIRequest.SecurityToken = SecurityToken;
                objAPIRequest.CustomerToken = VerifyCookie.CustomerToken;
                objAPIRequest.IPAddress = GetIP4Address();
                if (VerifyCookie.BasketGuid != '') {
                    objAPIRequest.BasketGUID = VerifyCookie.BasketGuid;
                }
                objAPIRequest.TotalAmount = totalOrderAmount; // Changed objAPIRequest.TotalAmount = totalpaidamount to objAPIRequest.TotalAmount = (totalOrderAmount / 100) by Ravishankar on 19 March 2019 // Modified by kushagra as totalPaidAmount to total order amount
                objAPIRequest.PGPaidAmount = PAYUPGamount ;
               
                var strResponse2 = GetRestAPIResponse(UpdateStoreOrderStatus, objAPIRequest, 'Post');
                sbResponseMessage = null;
                if (IsPGSuccess) {
                    res.writeHead(301,
                        // {Location: 'http://jockeyangulardev.revalweb.com/thankyou'}
                        { Location: config.SiteUrl + 'thankyou' }
                    );
                    res.end();
                } else {
                    res.writeHead(301,
                        // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
                        { Location: config.SiteUrl + 'payu-failure' }
                    );
                    res.end();
                }

            });
        }
        catch(error) {
        res.writeHead(301,
            // {Location: 'http://jockeyangulardev.revalweb.com/makepayment'}
            { Location: config.SiteUrl + 'payu-failure' }
          );
          res.end();
        }  
                
       

       
    } catch (exeption) {
        if (LogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
            insertErrorLog.insertErrorLog(LogTypeId, exeption, InsertErrorLogApi, 'getPayUResponse');
        }

        res.writeHead(301,
            { Location: config.SiteUrl + 'payu-failure' }
        );
        res.end();

    }

    

});

function appendSbResponseMessage(sbResponseMessage, tagOpen, value, tagClose) {
    sbResponseMessage.append(tagOpen + value + tagClose);
}


function GetIP4Address() {
    IP4Address = '';
    return ip.address();
}
function Generatehash512(merc_hash_string) {
    var cryp = crypto.createHash('sha512');
    cryp.update(merc_hash_string);
    return cryp.digest('hex');
}
function GetRestAPIResponse(strAPIURL, strRequest, strRequestMethodType) {
    var request = {};
    request.method = strRequestMethodType;
    request.ServicePoint = { "Expect100Continue": false };
    request.Timeout = 60000;
    request.ContentType = "application/json;";
    request.authorization = "Bearer " + SecurityToken;
    httpReq.httpReq(strAPIURL, 'post', strRequest, request);
    // ajaxReq.post({
    //     url: strAPIURL,
    //     data: strRequest,
    //     headers: request

    // }, function (err, res, body) {

    //     if (err) {
    //         console.log('Ajax err-' + err);
    //     }
    //     console.log('Ajax res -' + res);
    //     console.log('Ajax body -' + body);
    //     return res;

    // });
}
function CreateErrorLog(intLogTypeId, exception) {
    if (intLogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
        if (DonotLogErrors != undefined && DonotLogErrors != null && DonotLogErrors != '') {
            var strdonotlogerrors = DonotLogErrors.split('|');
            if (strdonotlogerrors != undefined && strdonotlogerrors != null && strdonotlogerrors.length > 0) {
                strdonotlogerrors.forEach(element => {
                    if (element == exception.message) {
                        intLogTypeId = parseInt(ErrorLog.Text_File.value);
                    }
                });
            }
        }
        if (intLogTypeId == ErrorLog.Text_File.value) {
            CreateLogErrorFile(exception.message, exception.stack);
        } else if (intLogTypeId == ErrorLog.SendError_Message.value) {

        } else if (intLogTypeId == ErrorLog.SendError_Message_TextFile.value)//Log the error in text file and send a email with error details.
        {
            CreateLogErrorFile(exception.message, exception.stack);
            //SendEmailError(ex.Message, ex.StackTrace);
        } else if (parseInt(intLogTypeId) == ErrorLog.TextFile_DBLog.value)//Log the error in text file and send a email with error details.
        {
            CreateLogErrorFile(exception.message, exception.stack);
            //SendEmailError(ex.Message, ex.StackTrace);
            var request = {};
            request.method = 'POST';
            request.ContentType = "application/json;";
            request.authorization = "Bearer " + SecurityToken;
            var InsertErrorLog = config.InsertErrorLog;
            var strRequest = {};
            strRequest.RequestLogTypeId = intLogTypeId;
            strRequest.Message = exception.message;
            strRequest.StackTrace = exception.stack;
            strRequest.PageName = 'getPayUResponse';
            strRequest.MethodName  = 'getPayUResponse';
            httpReq.httpReq(InsertErrorLog, 'post', strRequest, request);
            // ajaxReq.post({
            //     url: InsertErrorLog,
            //     data: strRequest,
            //     headers: request
        
            // }, function (err, res, body) {
        
            //     if (err) {
            //         console.log('Ajax err-' + err);
            //     }
            //     console.log('Ajax res -' + res);
            //     console.log('Ajax body -' + body);
            //     return res;
        
            // });
        } else if (intLogTypeId == parseInt(ErrorLog.All))//Log the error in text file and send a email with error details.
        {
            CreateLogErrorFile(exception.message, exception.stack);
            //SendEmailError(ex.Message, ex.StackTrace);
            var request = {};
            request.method = 'POST';
            request.ContentType = "application/json;";
            request.authorization = "Bearer " + SecurityToken;
            var InsertErrorLog = config.InsertErrorLog;
            var strRequest = {};
            strRequest.RequestLogTypeId = intLogTypeId;
            strRequest.Message = exception.message;
            strRequest.StackTrace = exception.stack;
            strRequest.PageName = 'getPayUResponse';
            strRequest.MethodName  = 'getPayUResponse';
            httpReq.httpReq(InsertErrorLog, 'post', strRequest, request);
            // ajaxReq.post({
            //     url: InsertErrorLog,
            //     data: strRequest,
            //     headers: request
        
            // }, function (err, res, body) {
        
            //     if (err) {
            //         console.log('Ajax err-' + err);
            //     }
            //     console.log('Ajax res -' + res);
            //     console.log('Ajax body -' + body);
            //     return res;
        
            // });
        } 
    }
    var fileName = stackTrace.parse(exception)[0].fileName;
    var methodName = stackTrace.parse(exception)[0].methodName;
    var lineNumber = stackTrace.parse(exception)[0].lineNumber;
}
function CreateLogErrorFile (strLogMessage, strSource) {
    fs.stat(ErrorLogFilePath , function (err) {
        if (err) {
            console.log(err)
            fs.mkdir(ErrorLogFilePath , { recursive: true }, (err) => {
                if (err) throw err;
            });

        } else {
            fs.stat(ErrorLogFilePath +config.ProjectName  + '_' + currentDate() +'.txt', function (er) {
                var errData = new StringBuilder();

                    errData.appendLine("Log Entry : " + date.format(new Date(), 'HH:mm:ss DD MMMM YYYY'));
                   // errData.appendLine("{0} {1}"+ new Date().toGMTString());
                    errData.appendLine(" :");
                    errData.appendLine(" :" + strLogMessage);
                    errData.appendLine(" :");

                    var stackData=strSource.split('\n').slice(1);
                    stackData.forEach(element => {
                        errData.appendLine(" :"+ element.trim());
                    });
                   // errData.appendLine(" :"+ errStackSource);
                    errData.appendLine("---------------------------------------------------------------------------");
                if (er) {
                    fse.outputFile(ErrorLogFilePath +config.ProjectName +'_'+ currentDate() +'.txt', errData, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('The file was saved!');
                        }
                    })
                } else {
                    
                    fs.appendFile(ErrorLogFilePath +config.ProjectName +'_'+ currentDate() +'.txt', errData, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('The file was appended!');
                        }
                    })
                }

            });
        }
    });
}
function currentDate() {
    var date1 = new Date().toDateString();
    date1 = date1.split(" ");
    date1 = date1[2]+"_"+date1[1]+"_"+date1[3];
    return date1;
}

module.exports = router;
