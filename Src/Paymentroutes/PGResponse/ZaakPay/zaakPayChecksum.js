var crypt = require('../Paytm/crypt');
var util = require('util');
var crypto = require('crypto');

function paramsToString(params, mandatoryflag) {
    var data = '';
    var tempKeys = Object.keys(params);
    tempKeys.sort();
    tempKeys.forEach(function (key) {
    var n = params[key].includes("REFUND"); 
     var m = params[key].includes("|");  
          if(n == true )
          {
            params[key] = "";
          }
            if(m == true)
          {
            params[key] = "";
          }  
      if (key !== 'checksum' ) {
        if (params[key] === 'null') params[key] = '';
        if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
          data += (params[key] + '|');
        }
      }
  });
  console.log(data);
    return data;
  }

function sanitizeParam(param) {
    var ret = null;
    if (param == null) {
        return null
    }
    ret = param.replace("[>><>(){}?&* ~`!#$%^=+|\\:'\";,\\x5D\\x5B]+", " ");
    return ret;
}

function getAllNotEmptyParamValue(Request) {
    var allNonEmptyParamValue = '';
    var postedValues = Request;
    var paramName = '';
    var paramSeq = ["amount", "bank", "bankid",
        "cardId", "cardScheme", "cardToken", "cardhashid", "doRedirect", "orderId", "paymentMethod", "paymentMode", "responseCode",
        "responseDescription"]
        console.log(Request);
        console.log(paramSeq);
    paramSeq.forEach(element => {
        try {
            var paramInArray = postedValues[element];
            if (paramInArray != undefined && paramInArray != null && paramInArray != '') {
                var paramValue = sanitizeParam(paramInArray);
                if (paramValue != null) {
                    allNonEmptyParamValue = allNonEmptyParamValue + element + "=" + paramValue + "&";
                }
            }
        } catch (exception) {
            console.log("Exception caught:" + exception)
        }
    });
    return allNonEmptyParamValue.replace(' &','');
}
function calculateChecksum(secretkey, allparamvalues, cb) {
    var data = paramsToString(allparamvalues);
    crypt.gen_salt(4, function (err, salt) {
        var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
        var check_sum = sha256 + salt;
        var encrypted = crypt.encrypt(check_sum, secretkey);
         cb(undefined, encrypted);
        // console.log('encrypted : '+ encrypted)
        // return encrypted;
      });
}
function verifyChecksum (key, params, checksumhash) {
    var data = paramsToString(params, false);

    //TODO: after PG fix on thier side remove below two lines
    if (typeof checksumhash !== "undefined") {
      checksumhash = checksumhash.replace('\n', '');
      checksumhash = checksumhash.replace('\r', '');
      var temp = decodeURIComponent(checksumhash);
      var checksum = crypt.decrypt(temp, key);
      var salt = checksum.substr(checksum.length - 4);
      var sha256 = checksum.substr(0, checksum.length - 4);
      var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
      if (hash === sha256) {
        return true;
      } else {
        util.log("checksum is wrong");
        return false;
      }
    } else {
      util.log("checksum not found");
      return false;
    }
}

module.exports.sanitizeParam = sanitizeParam;
module.exports.getAllNotEmptyParamValue = getAllNotEmptyParamValue;
module.exports.calculateChecksum = calculateChecksum;
module.exports.verifyChecksum = verifyChecksum;