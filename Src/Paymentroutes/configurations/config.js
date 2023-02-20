// var paytmMarchentKey = 'ThbLyv_svM5#3Xvq';
// var PaytmResponceSuccessCode = '01';

//var ApiUrl = 'https://klmapi2021.revalsys.com';
var ApiUrl = 'https://klmapidev.revalweb.com';
// var ApiUrl = 'http://uatangularapi.revalweb.com';

// Paytm keys
module.exports.paytmMarchentKey = 'ThbLyv_svM5#3Xvq';
module.exports.PaytmResponceSuccessCode = '01';
 //module.exports.SiteUrl = 'http://localhost:4000/';
module.exports.SiteUrl = 'https://klmuidev.revalweb.com/';
//module.exports.SiteUrl = 'https://fpuidev.revalweb.com/';
// module.exports.SiteUrl = 'http://uatangular.revalweb.com/';
module.exports.PaytmResponceSuccessCode = '01';
module.exports.PaytmPaymentPendingStatusCode1 = '400';
module.exports.PaytmPaymentPendingStatusCode2 = '402';
module.exports.PaytmCancelledTransactionResponseCode = '141'
module.exports.SecurityToken = 'FHTeL8mSg0ITSg0M8gvV5QiM4SllNZATPDCYs2BG2F41pi27eRZLJSdhBpspmFJycsf7125oJVWXlnahR2KmlKG+7ZwLII9ZZE8EsXFLTQ5cOiVTuf7khZxHIvvIk8Bv0NkFokMz/Z5RrZs3KAX6OMAzROZ5mkcWHu7knzbse5o=';
module.exports.InsertPgLogAPIUrl = ApiUrl + '/api/InsertPglog';
module.exports.UpdateStoreOrderStatus = ApiUrl + '/api/UpdateStoreOrderStatus';
module.exports.InsertErrorLog = ApiUrl + '/api/InsertErrorLog';
module.exports.VerifyZaakpayChecksum = ApiUrl + '/api/VerifyZaakpayChecksum';
module.exports.VerifyPaynimoChecksum = ApiUrl + '/api/VerifyPaynimoChecksum';
module.exports.verifyCCAvenue = ApiUrl + '/api/VerifyCCAvenueChecksum';
module.exports.VerifyCookieDetails = ApiUrl + '/api/GetPaymentCookieDetails';

// Razorpay keys
module.exports.RazorpayKey = 'rzp_test_gnwxSlt4ElL0W8';
module.exports.RazorpaySecret = 'RYcXsldChywXCEQP7Kzxv1on';

// PayU Krys
module.exports.MERCHANT_KEY = 'o3IRlM';
module.exports.SALT = '12woFkeH';
module.exports.hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';

// ZaakPay keys
module.exports.ZAAKPAYResponseSuccessCode = 100;
module.exports.ZAAKPAYSecretKey = '0678056d96914a8583fb518caf42828a';
module.exports.ZaakpayMerchantId = 'b19e8f103bce406cbd3476431b6b7973';

// PayPal Keys
module.exports.PayPalExecutePaymentURL = 'https://api.sandbox.paypal.com/v1/payments/payment/[#PaymentID#]/execute'
// Dev Keys
// module.exports.PayPalClientId = 'AQKMuvF_A3kk45tvhddmsMbd0CJY1Hsn7yJ67viIbsNrB3K8kRwaN0rLEArDsONzRFOlyZkApjovGx5j';
// module.exports.PayPalClientSecret = 'EK4glCe0Sn3MnnCmoM3g0UDTpsHGhIVA_PPSpNwUAoeoZvtRJpGzizxGIxlwpwoGAhYqN1-ZICWtBQL-';

// UAT Keys
// module.exports.PayPalClientId = 'AbIbOvbe4gFvJylBTfUoc-pM3LsHSpZoStOnbzjPpAA9cij33_uQEh1p_cKh17ipQNO485FqjNCV_GZr';
// module.exports.PayPalClientSecret = 'EHGzU2g2aPHwq56cUejpe0cwnBzumvsR9JTcxjhyWrdKq6T6FK-r3OQHPNUkee49KA6xdx8eI8IAOd1J';
// module.exports.PayPalType = 'sandbox';

// Live Keys
module.exports.PayPalClientId = 'AbIbOvbe4gFvJylBTfUoc-pM3LsHSpZoStOnbzjPpAA9cij33_uQEh1p_cKh17ipQNO485FqjNCV_GZr';
module.exports.PayPalClientSecret = 'EHGzU2g2aPHwq56cUejpe0cwnBzumvsR9JTcxjhyWrdKq6T6FK-r3OQHPNUkee49KA6xdx8eI8IAOd1J';
module.exports.PayPalType = 'sandbox'; 

// error log files
module.exports.ErrorLogFilePath = 'D:\\LiveRevalweb\\EcommerceDev\\ecommerceapidev.revalweb.com\\Errorlog\\';
module.exports.ProjectName = 'KLM';
module.exports.LogTypeId = 4;
module.exports.DonotLogErrors = 'Thread was being aborted.';

module.exports.abc = function(hi) {
}


