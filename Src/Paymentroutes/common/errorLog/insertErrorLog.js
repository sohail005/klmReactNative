const Enum = require('enum');
var ajaxReq = require('ajax-request');
const config = require('../../configurations/config');
const StringBuilder = require("string-builder");
const fse = require('fs-extra');
var fs = require('fs');
var stackTrace = require('stack-trace');
const date = require('date-and-time');
var httpReq = require('../httpCall/apiCall');
const ErrorLogFilePath = config.ErrorLogFilePath;
var DonotLogErrors = config.DonotLogErrors;
var ErrorLog = new Enum({
    All: 0,
    Text_File: 1,
    SendError_Message: 2,
    SendError_Message_TextFile: 3,
    TextFile_DBLog: 4,
    ErrorLog_NotRequired: -1
});
module.exports.insertErrorLog = function(intLogTypeId, exception, InsertErrorLog, methodName) {
    console.log(exception.stack.split('\n'));
    //var a=exception.stack.split('\n').slice(1);
    // var b = '';
    // a.forEach(element => {
    //    b = b + '\n' + element.trim();
    // });
   // console.log(b);
    console.log("Path:" + ErrorLogFilePath);
    
    console.log(intLogTypeId);
  //  CreateLogErrorFile(exception.message, exception.stack);
  console.log(ErrorLog.ErrorLog_NotRequired.value);
  console.log(ErrorLog.Text_File.value);
  console.log(ErrorLog.SendError_Message.value);
  console.log(ErrorLog.SendError_Message_TextFile.value);
  console.log(ErrorLog.TextFile_DBLog.value);
  console.log(ErrorLog.All.value);
  var fileName = stackTrace.parse(exception)[0].fileName;
  console.log('fileName' + fileName);
    if (intLogTypeId > ErrorLog.ErrorLog_NotRequired.value) {
        console.log('Error log file called')
        console.log(DonotLogErrors);
        if (DonotLogErrors != undefined && DonotLogErrors != null && DonotLogErrors != '') {
            console.log('DonotLogErrors');
            console.log(DonotLogErrors);
            var strdonotlogerrors = DonotLogErrors.split('|');
            console.log('DonotLogErrors123')
            console.log(strdonotlogerrors);
            if (strdonotlogerrors != undefined && strdonotlogerrors != null && strdonotlogerrors.length > 0) {
                console.log('element')
                strdonotlogerrors.forEach(element => {
                    console.log('element1');
                    console.log(element);
                    if (element == exception.message) {
                        intLogTypeId = parseInt(ErrorLog.Text_File.value);
                        console.log(intLogTypeId);
                    }
                    console.log(false);
                });
            }
        }
        console.log("intLogTypeId == ErrorLog.Text_File.value")
        console.log(intLogTypeId == ErrorLog.Text_File.value)
        if (intLogTypeId == ErrorLog.Text_File.value) {
            console.log('ErrorLog.Text_File.value');
            CreateLogErrorFile(exception.message, exception.stack);
        } else if (intLogTypeId == ErrorLog.SendError_Message.value) {
            console.log("intLogTypeId == ErrorLog.SendError_Message.value")
            console.log(intLogTypeId == ErrorLog.SendError_Message.value)
            console.log(intLogTypeId);

        } else if (intLogTypeId == ErrorLog.SendError_Message_TextFile.value)//Log the error in text file and send a email with error details.
        {
            console.log("intLogTypeId == ErrorLog.SendError_Message_TextFile.value")
            console.log(intLogTypeId == ErrorLog.SendError_Message_TextFile.value)
            CreateLogErrorFile(exception.message, exception.stack);
            console.log(intLogTypeId);
            //SendEmailError(ex.Message, ex.StackTrace);
        } else if (parseInt(intLogTypeId) == ErrorLog.TextFile_DBLog.value)//Log the error in text file and send a email with error details.
        {
            console.log("intLogTypeId == ErrorLog.TextFile_DBLog.value")
            console.log(intLogTypeId == ErrorLog.TextFile_DBLog.value)
            CreateLogErrorFile(exception.message, exception.stack);
            console.log('textfileDB');
            //SendEmailError(ex.Message, ex.StackTrace);
            var request = {};
            request.method = 'POST';
            console.log(request);
            request.ContentType = "application/json;";
            console.log(request);
            request.authorization = "Bearer " + config.SecurityToken;
            console.log(request);
            console.log('fileName' + fileName);
             //var url = config.InsertErrorLog;
            var strRequest = {};
            console.log(strRequest);
            strRequest.RequestLogTypeId = intLogTypeId;
            console.log(strRequest);
            strRequest.Message = exception.message;
            console.log(strRequest);
            strRequest.StackTrace = exception.stack;
            console.log(strRequest);
            strRequest.PageName = fileName;
            console.log(strRequest);
            strRequest.MethodName  = methodName;
            console.log(request);
            console.log(strRequest)
            httpReq.httpReq(InsertErrorLog, 'post', strRequest , request);

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
            console.log(intLogTypeId);
            //SendEmailError(ex.Message, ex.StackTrace);
            var request = {};
            request.method = 'POST';
            request.ContentType = "application/json;";
            request.authorization = "Bearer " + config.SecurityToken;
            // var InsertErrorLog = config.InsertErrorLog;
            
            var strRequest = {};
            strRequest.RequestLogTypeId = intLogTypeId;
            strRequest.Message = exception.message;
            strRequest.StackTrace = exception.stack;
            strRequest.PageName = fileName;
            strRequest.MethodName  = methodName;
            console.log(request);
            console.log(strRequest)
            httpReq.httpReq(InsertErrorLog, 'post', strRequest , request);
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
        console.log(intLogTypeId);
    }
    console.log('methodName');
    
    console.log('fileName' + fileName);

}
function CreateLogErrorFile (strLogMessage, strSource) {
    console.log('Error log File Creation');
    console.log(strLogMessage);
    // var a=strSource.split('\n').slice(1);
    // var errStackSource = '';
    // a.forEach(element => {
    //     errStackSource = errStackSource + '\n' + element.trim();
    // });
    // console.log(errStackSource);
    fs.stat(ErrorLogFilePath , function (err) {
        if (err) {
            console.log(err)
            fs.mkdir(ErrorLogFilePath , { recursive: true }, (err) => {
                if (err) throw err;
            });

        } else {
            console.log('success')
            fs.stat(ErrorLogFilePath +config.ProjectName  + '_' + currentDate() +'.txt', function (er) {
                var errData = new StringBuilder();

                    errData.appendLine("Log Entry : " + date.format(new Date(), 'HH:mm:ss DD MMMM YYYY'));
                   // errData.appendLine("{0} {1}"+ new Date().toGMTString());
                    errData.appendLine(" :");
                    errData.appendLine(" :" + strLogMessage);
                    errData.appendLine(" :");

                    var a=strSource.split('\n').slice(1);
                    a.forEach(element => {
                        errData.appendLine(" :"+ element.trim());
                    });
                   // errData.appendLine(" :"+ errStackSource);
                    errData.appendLine("---------------------------------------------------------------------------");
                if (er) {
                    console.log('Error file not exists')
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
    console.log(date.format(new Date(), 'HH:mm:ss DD MMMM YYYY'));
    return date1;
}