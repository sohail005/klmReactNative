import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, Switch, Image, Dimensions, RefreshControl, ScrollView, StyleSheet, TextInput, SafeAreaView, Modal, ActivityIndicator, ViewBase } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CommonHeader from '../CommonDesign/HomeHeader';
import cryptoJS from 'react-native-crypto-js';
import api from '../Helper/helperModule';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import SigninButton from '../Component/SigninButton';
//import ButtonCustom from '../Component/ButtonCustom';
//import GoogleLogin from '../Component/GoogleLogin';
//import FacebookLogin from '../Component/FacebookLogin';
//import AppleLogin from '../Component/AppleLogin';
import _, { set } from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Footer from '../CommonDesign/Footer';
//import InformationPopup from '../Component/InformationPopup';
//import OrderSummary from '../Component/OrderSummary';
import Path from '../Helper/Api';
import Bottomtaballpages from '../CommonDesign/Bottomtaballpages';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const Checkout = (props) => {

    const [data, setData] = useState({});
    const [cartData, setCartData] = useState([]);
    const [promo, setPromo] = useState('');
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [OTPEmail, setOTPEmail] = useState("");
    const [OTPEmailErr, setOTPEmailErr] = useState("");
    const [emailOTPData, setEmailOTPData] = useState([]);
    const [enterOTP, setEnterOTP] = useState('');
    const [enterOTPErr, setEnterOTPErr] = useState('');
    const [emailResponse, setEmailResponse] = useState(false);
    const [shippingData, setShippingData] = useState([]);
    const [billingData, setBillingData] = useState([]);


    const [changeForm, setChangeForm] = useState(false);
    const [makePayment, setMakePayment] = useState([]);
    const [makePaymentData, setMakePaymentData] = useState([]);
    const [cartTotalItems, setCartTotalItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [registeremail, setRegisterEmail] = useState("");
    const [registerpassword, setRegisterPassword] = useState("");

    const [guestOTPForm, setGuestOTPForm] = useState(false);

    const [loginOTP, setLoginOTP] = useState(false);
    const [checked, setChecked] = useState('');
    const [checkedBilling, setCheckedBilling] = useState('');
    const [BillingBtnSelect, setBillingBtnSelect] = useState(true);


    const [radioChecked, setRadioChecked] = useState('');
    const [radioAddress, setRadioAddress] = useState('second');
    const [editAddress, setEditAddress] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [isDefault, setIsDefault] = useState(false);
    const [radioPromo, setRadioPromo] = useState('first');
    const [receiversName, setReceiversName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [address, setAddress] = useState("");
    const [addressBilling, setAddressBilling] = useState("");


    const [addressIndex, setAddressIndex] = useState(0);
    const [addressBillingIndex, setAddressBillingIndex] = useState(0);


    const [pinCode, setPinCode] = useState("");
    const [OTPForm, setOTPForm] = useState(false);
    const [registerForm, setRegisterForm] = useState(false);
    const [shouldOpen, setshouldOpen] = useState([false, false, false]);
    const [isOpen, setIsOpen] = useState([false, false, false]);
    const [countryId, setCountryId] = useState(1);
    const [getState, setState] = useState([]);
    const [getCities, setCities] = useState([]);
    const [country, setCountryData] = useState([]);
    const [states, setStatesData] = useState([]);
    const [cities, setCitiesData] = useState([]);
    const [countryModal, setCountryModal] = useState(false);
    const [stateModal, setStateModal] = useState(false);
    const [cityModal, setCityModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [err, setErr] = useState(null);
    const [errFirstName, setErrorFN] = useState('');
    const [errLastName, setErrorLN] = useState('');
    const [errRegisterEmailField, setErrorRegisterEmailField] = useState('');
    const [errRegisterPasswordField, setErrorRegisterPasswordField] = useState('');
    const [errLoginEmailField, setErrorLoginEmailField] = useState('');
    const [errLoginPasswordField, setErrorLoginPasswordField] = useState('');
    const [errGuestEmailOTP, setErrorGuestEmailOTP] = useState('');
    const [errReceiverName, setErrorReceiverName] = useState('');
    const [errMobile, setErrorMobile] = useState('');
    const [errAddress, setErrorAddress] = useState('');
    const [errPincode, setErrorPincode] = useState('');
    const [CurrencyId, setCurrencyId] = useState(1);
    const [countryid, setCountryid] = useState('');
    const [errSelectedCountry, setErrorSelectedCountry] = useState('');
    const [errSelectedState, setErrorSelectedState] = useState('');
    const [errSelectedCity, setErrorSelectedCity] = useState('');
    const [addressSelect, setSelectedAddress] = useState('');
    const [errOTP, setErrorOTP] = useState('');
    const [errorReturnMsg, setErrorReturnMsg] = useState('');
    const [returnCode, setReturnCode] = useState(0);
    const [orderSummaryModal, setOrderSummaryModal] = useState(false);
    const [GCApplied, setGCApplied] = useState(false);
    const [GVApplied, setGVApplied] = useState(false);
    const [SummeryLoader, setSummeryLoader] = useState(false);

    const [editForm, setEditForm] = useState({
        ReceiverName: '',
        Address: '',
        Mobile: '',
        PinCode: '',
        Country: '',
        State: '',
        City: '',
        AddressGUID: '',
        Landmark: ''
    })
    const [addressType, setAddressType] = useState('')//sendSaveAddress()
    const [selectAddressmsg, setSelectAddressmsg] = useState(false);
    const [outOfStock, setOutOfStock] = useState(false);

    const [Count, setCount] = useState(0)
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            CartCountF();

            setCartGlobalVarsF({ showCartCountF: CartCountF });

        });
        return () => unsubscribe;

    }, [CartCountF]);
    const CartCountF = async () => {
        var cartCount = await AsyncStorage.getItem('CartCount');
        setCount(cartCount == null ? 0 : cartCount);
    }

    const [promoItems, setPromoItems] = useState([]);
    const [noPromoItems, setNoPromoItems] = useState([]);
    const [mainPromoItems, setMainPromoItems] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (addressType != '') {
            sendSaveAddress()
            setAddressType('')
            // GetBillingAddress();
        }
    }, [addressType]);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            CartDeatils()
            CheckLogin();
            getCountry();
            setResponseMessage('');
        });
        return () => unsubscribe;
    }, []);

    const CartDeatils = async () => {
        // setLoadPromoSection(false);
        // setResponseMessage('');
        // // setLoader(true);
        setSummeryLoader(false)

        let CartGuid = await AsyncStorage.getItem('BasketGuid');
        // setCartGuid(CartGuid);
        // let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        // setCustomerToken(CustomerToken);
        // let CurrencyId = await AsyncStorage.getItem('CurrencyId');
        // setCurrencyId(CurrencyId);
        let GCSessionID = await AsyncStorage.getItem('GCSessionID');
        let GiftRequestID = await AsyncStorage.getItem('GiftRequestID');
        let Promo = await AsyncStorage.getItem('Promo');
        setPromo(promo == undefined ? "" : Promo);
        var Request = {
            AddressGUID: "00000000-0000-0000-0000-000000000000",
            BasketGUID: CartGuid,
            CouponCode: Promo == undefined ? "" : Promo,
            GCSessionId: GCSessionID == undefined ? "" : GCSessionID,
            GiftCouponRequestId: GiftRequestID == undefined ? "" : GiftRequestID,
            Pincode: "",
        }
        api.postData(Path.viewcartnew, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {

                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        let A = [];
                        let B = [];
                        response.data.Data.Products.forEach(element => {
                            if (element.item_level_onlyklm_promo_name != '' && element.item_level_onlyklm_promo_name != null) {
                                A.push(element);
                            } else {
                                B.push(element);
                            }
                        });
                        let PromoObj = {}
                        A.map((ele) => {
                            if (PromoObj[ele.item_level_onlyklm_promo_name]) {
                                PromoObj[ele.item_level_onlyklm_promo_name].push(ele)
                            } else {
                                PromoObj[ele.item_level_onlyklm_promo_name] = [ele]
                            }
                        })

                        setPromoItems(PromoObj);
                        setMainPromoItems(Object.keys(PromoObj));
                        setNoPromoItems(B);

                        AsyncStorage.setItem('BasketGuid', response.data.Data.BasketGUID);
                        setCartData(response.data.Data.Products);
                        setData(response.data.Data);

                        // setTotalItems(response.data.Data.TotalItems);

                        AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data.TotalItems));
                        AsyncStorage.setItem('CartProducts', JSON.stringify(response.data.Data.Products));
                        getCartGlobalVarsF().showCartCountF();
                        setSummeryLoader(false)

                        setLoader(false);
                        // console.log(data);

                    } else {
                        // setnoData(true);
                        setSummeryLoader(false)

                        AsyncStorage.setItem('CartCount', JSON.stringify(0));

                        setLoader(false);

                    }
                    // setLoadPromoSection(true);

                }
            }
        });
    }
    const getCountry = () => {
        //setLoader(true);
        setResponseMessage('');
        api.getData(Path.getallcountrycodes).then((response) => {

            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        setCountryData(response.data.Data);
                        setLoader(false);

                    }
                }
            }
        });
    }

    const getAllStates = (item) => {
        //setLoader(true);
        setErrorSelectedCountry('');
        let countryid = item.CountryId;
        setCountryid(countryid);
        setCountryId(countryid);
        let countryName = item.CountryName;
        let tempObj = _.cloneDeep(editForm)
        tempObj.Country = countryName;
        setEditForm(tempObj)

        setCountryModal(false);

        api.getData(Path.getallstates + countryid).then((response) => {

            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        setStatesData(response.data.Data);
                        setLoader(false);

                    }
                }
            }
        });
    }

    const getAllCities = async (name) => {
        setErrorSelectedState('');
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        let statName = name;
        let tempObj = _.cloneDeep(editForm)
        tempObj.State = name;
        setEditForm(tempObj)

        setStateModal(false);

        const Request = {
            State: statName,
        }

        api.postData(Path.getallcitiesbystatename, Request).then((response) => {

            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        setCitiesData(response.data.Data);
                        setLoader(false);

                    }
                }
            }
        });
    }

    const getCityName = (item) => {
        setErrorSelectedCity('');
        let tempObj = _.cloneDeep(editForm)
        tempObj.City = item.Name;
        setEditForm(tempObj)

        setCityModal(false);
    }


    const makePaymentCheckout = async (Data) => {

        let cartCount = await AsyncStorage.getItem('CartCount');
        let SessionId = await AsyncStorage.getItem('SessionID');
        let addressGUID = await AsyncStorage.getItem('AddressGUID');
        let basketGuid = await AsyncStorage.getItem('BasketGuid');
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        let gcSessionId = await AsyncStorage.getItem('GCSessionID');
        let paymentType = '';
        let paymenttype = 8;
        if (GCApplied && makePaymentData.PrepaidTotalPrice == 0) {
            paymentType = 'Gift Card';
            paymenttype = 12;
        }
        else if (GVApplied && makePaymentData.PrepaidTotalPrice == 0) {
            paymentType = 'Gift Coupon';
            paymenttype = 21;
        }
        else if (radioChecked == 'cod' || makePaymentData.PrepaidTotalPrice == 0) {
            paymentType = 'cod';
            paymenttype = 'COD';
        }
        else {
            if (makePaymentData.IsValidGiftCoupon && gcSessionId != null && gcSessionId !== '') {
                paymentType = 'Gift Coupon Debit Card';
                paymenttype = 24;
            } else if (gcSessionId != null && gcSessionId !== '') {
                paymentType = 'Gift Card Debit Card';
                paymenttype = 15;
            } else {
                paymentType = 'Debit Card';
                paymenttype = 8;
            }

        }


        // if(Data.TotalItems == parseInt(cartCount)) {

        const Request = {
            AddressGUID: addressGUID,
            BankCode: "",
            BankName: "",
            BannerClickTime: "",
            BasketGUID: basketGuid,
            BillingAddressGUID: addressBilling,
            CouponCode: "",
            DeviceType: 3,
            GCSessionId: gcSessionId || "",
            GiftCouponRequestId: "",
            IsMobileDevice: true,
            JockeyTracking: "",
            Mobile: "",
            OTP: "",
            PGFailure: false,
            PaymentGatewayId: radioChecked,
            PaymentType: paymenttype,
            SessionId: SessionId,
            SiteType: "",
            UtmCampaign: "",
            UtmMedium: "",
            UtmSource: "",


        }

        api.postData('/api/MakePayment', Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    setReturnCode(response.data.ReturnCode)
                    if (response.data.ReturnCode != 0) {
                        if (response.data.ReturnCode === 401 || response.data.ReturnCode === 402 || response.data.ReturnCode === 403 ||
                            response.data.ReturnCode === 404 || response.data.ReturnCode === 405 || response.data.ReturnCode === 406) {
                            setErrorReturnMsg(response.data.ReturnMessage)
                        }
                        // response.data.Data.ErrorMessage != null ? setErrorReturnMsg(response.data.Data.ErrorMessage) : null
                        if (response.data.ReturnCode == 450) {
                            if (response.data.Data.Cards != undefined && response.data.Data.Cards != null && response.data.Data.Cards.length > 0) {
                                setErrorReturnMsg(response.data.Data.Cards[0].ResponseMessage)

                            }

                        }

                    }
                    else {
                        let res = response.data.Data;
                        AsyncStorage.setItem('StoreOrderNumber', res.StoreOrderNumber);
                        if (res.PaymentGateWay !== undefined && res.PaymentGateWay !== null) {
                            if (res.PaymentGateWay.PayU != null && res.PaymentGateWay.PayU !== undefined) {
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     this.storage.setCookieStorage('TotalOrderAmount', res.PaymentGateWay.PayU.amount);
                                //     this.storage.setCookieStorage('FirstName', res.PaymentGateWay.PayU.firstname);
                                //     this.storage.setCookieStorage('PaymentGateway', 'PayU');
                                //   }
                                // PayU form submittion
                                let formStr = '<form action="' + res.PaymentGateWay.PayU.action1 + '" method="POST">';
                                Object.keys(res.PaymentGateWay.PayU).forEach(key => {
                                    const value = res.PaymentGateWay.PayU[key];
                                    if (key !== 'action1' && key !== 'transactionContext' && key !== 'productinfo' && value !== undefined && value != null) {
                                        formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';
                                    } else if (key === 'productinfo') {
                                        formStr = formStr + '<textarea name="' + key + '" style="display:none;">' + value + '</textarea>';
                                    } else if (key === 'transactionContext' && value !== undefined && value != null && value !== '') {
                                        formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';
                                    }
                                });
                                props.navigation.navigate('Payment', { url: formStr, name: 'payu' });
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     if(deviceType == 4){
                                //       $(formStr).appendTo('#PhonePePaymentDiv').submit();
                                //     }
                                //     else{
                                //       $(formStr).appendTo('#selectedAddressesDiv').submit();
                                //     }
                                //   }
                                // this.isPayNow = false;
                            } else if (res.PaymentGateWay.PayTm !== undefined && res.PaymentGateWay.PayTm !== null) {
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     this.storage.setCookieStorage('TotalOrderAmount', res.PaymentGateWay.PayTm.TXN_AMOUNT);
                                //     this.storage.setCookieStorage('FirstName', res.PaymentGateWay.PayTm.firstname);
                                //     this.storage.setCookieStorage('PaymentGateway', 'PayTm');
                                //   }
                                let formStr = '<form action="' + res.PaymentGateWay.PayTm.ACTION_URL + '" method="POST">';
                                Object.keys(res.PaymentGateWay.PayTm).forEach(key => {
                                    const value = res.PaymentGateWay.PayTm[key];
                                    if (key !== 'ACTION_URL' && value !== undefined && value !== null && value !== '') {
                                        if (key === 'BANK_CODE' && res.PaymentGateWay.PayTm.PAYMENT_TYPE_ID !== undefined &&
                                            res.PaymentGateWay.PayTm.PAYMENT_TYPE_ID !== null &&
                                            res.PaymentGateWay.PayTm.PAYMENT_TYPE_ID !== '') {
                                            formStr = formStr + '<input type="hidden" name="BANK_CODE" value="' + value + '" />';
                                        } else {
                                            formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';

                                        }

                                    }
                                });

                                if (res.PaymentGateWay.PayTm.ptype.toLowerCase() === 'internetbanking' &&
                                    (res.PaymentGateWay.PayTm.BANK_CODE === undefined || res.PaymentGateWay.PayTm.BANK_CODE === null ||
                                        res.PaymentGateWay.PayTm.BANK_CODE === '')) {
                                    formStr = formStr + '<input type="hidden" name="BANK_CODE" value="" />';
                                } else {
                                    // if (isPlatformBrowser(this.platformId)) {
                                    //   $(formStr).appendTo('#selectedAddressesDiv').submit();
                                    // }
                                    // this.isPayNow = false;
                                }
                                props.navigation.navigate('Payment', { url: formStr, name: 'paytm' });


                            } else if (res.PaymentGateWay.Paynimo !== undefined && res.PaymentGateWay.Paynimo !== null) {
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     this.storage.setCookieStorage('TotalOrderAmount', res.PaymentGateWay.Paynimo.amount);
                                //     this.storage.setCookieStorage('FirstName', res.PaymentGateWay.Paynimo.firstname);
                                //     this.storage.setCookieStorage('PaymentGateway', 'Paynimo');
                                //   }
                                // PayU form submittion
                                let formStr = '<form action="' + res.PaymentGateWay.Paynimo.Action + '" method="POST">';
                                Object.keys(res.PaymentGateWay.Paynimo).forEach(key => {
                                    const value = res.PaymentGateWay.Paynimo[key];
                                    if (key !== 'Action' && value !== undefined && value != null) {
                                        formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';
                                    }
                                });
                                props.navigation.navigate('Payment', { url: formStr, name: 'paynimo' });
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     $(formStr).appendTo('#selectedAddressesDiv').submit();
                                //   }
                            } else if (res.PaymentGateWay.CCAvenue !== undefined && res.PaymentGateWay.CCAvenue !== null) {
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     this.storage.setCookieStorage('TotalOrderAmount', res.PaymentGateWay.CCAvenue.Amount);
                                //     this.storage.setCookieStorage('FirstName', res.PaymentGateWay.CCAvenue.Name);
                                //     this.storage.setCookieStorage('PaymentGateway', 'CCAvenue');
                                //   }
                                let formStr = '<form action="' + res.PaymentGateWay.CCAvenue.CCAvenuePGUrl + '" method="POST">';
                                Object.keys(res.PaymentGateWay.CCAvenue).forEach(key => {
                                    const value = res.PaymentGateWay.CCAvenue[key];
                                    if (key === 'Enc_request') {
                                        formStr = formStr + '<input type="hidden" id="encRequest" name="encRequest" value="' + value + '" />';
                                    } else if (key === 'Access_code') {
                                        formStr = formStr + '<input type="hidden" id="Hidden1" name="access_code" value="' + value + '" />';
                                    }
                                    // if ((key === 'Enc_request' || key === 'Access_code') && value !== undefined && value != null) {
                                    //   formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';
                                    // }
                                });
                                props.navigation.navigate('Payment', { url: formStr, name: 'ccaenue' });
                                //   if (isPlatformBrowser(this.platformId)) {
                                //     $(formStr).appendTo('#selectedAddressesDiv').submit();
                                //   }
                            } else if (res.PaymentGateWay.AmazonPay !== undefined && res.PaymentGateWay.AmazonPay != null) {
                                //   this.storage.setCookieStorage('PaymentGateway', 'AmazonPay');
                                if (res.PaymentGateWay.AmazonPay.Url !== undefined &&
                                    res.PaymentGateWay.AmazonPay.Url != null && res.PaymentGateWay.AmazonPay.Url !== '') {
                                    props.navigation.navigate('Payment', { url: res.PaymentGateWay.AmazonPay.Url, name: 'amazon' });
                                    //   window.location.href = res.PaymentGateWay.AmazonPay.Url;
                                }
                            } else if (paymenttype === 12 || paymenttype === 21) {
                                //  this.isPayNow = false;
                                if (res.StoreOrderNumber != null && res.StoreOrderNumber !== '') {
                                    props.navigation.navigate('ThankYouPage');
                                    // this.router.navigate(['/thankyou']);
                                } else {
                                    // this.router.navigate(['/carts']);
                                }
                            } else if (paymentType === 'COD') {
                                // this.codLoading = false;
                            } else if (res.PaymentGateWay.HDFC != null && res.PaymentGateWay.HDFC !== undefined) {
                                let formStr = '<form action="' + res.PaymentGateWay.HDFC.action + '" method="post" id="payment" name="payment">';
                                Object.keys(res.PaymentGateWay.HDFC).forEach(key => {
                                    const value = res.PaymentGateWay.HDFC[key];
                                    if (key !== 'action' && value !== undefined && value != null && value != '') { // && key !== 'mode'
                                        formStr = formStr + '<input type="hidden" name="' + key + '" value="' + value + '" />';
                                    } else if (key !== 'action' && value == '') {
                                        formStr = formStr + '<input type="hidden" name="' + key + '" value />';

                                    }

                                });

                            } else {
                                //   this.isPayNow = false;
                            }
                        }
                    }

                }
            }
        });
    }



    const CheckLogin = async () => {
        setLoader(true);
        setResponseMessage('');
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        let countryId = await AsyncStorage.getItem('CountryId');
        let intcurrencyId = await AsyncStorage.getItem('CurrencyId');
        setCurrencyId(intcurrencyId);
        setCountryId(countryId);

        if (customerToken == null || customerToken == '') {
            setshouldOpen([false, false, false])
            setIsOpen([true, false, false]);
            setLoader(false);

        } else {

            setshouldOpen([false, false, false])
            setIsOpen([false, true, false]);

            const Request = {
                AddressType: "Both",
                CurrencyId: 1,
                CustomerToken: customerToken
            }

            api.postData('/api/GetShippingAddress', Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        if (
                            response.data.Data != undefined &&
                            response.data.Data != null &&

                            response.data.Data != ''
                        ) {
                            let BillingData = []
                            let ShippingData = []
                            let addressData = intcurrencyId == 1 ? response.data.Data.filter(x => x.CountryId == 1) : response.data.Data
                            response.data.Data.forEach(element => {
                               /*  if (element.IsDefaultAddress == true) {
                                    setAddress(element.AddressGUID);
                                    AsyncStorage.setItem('AddressGUID', element.AddressGUID);

                                } */ if (element.AddressType === 'Billing') {
                                    // setAddress(element.AddressGUID);
                                    BillingData.push(element);
                                } if (element.AddressType === 'Shipping') {
                                    ShippingData.push(element);
                                    console.log('BillingAddressGUID..............>', element.BillingAddressGUID)

                                }
                            });
                            setBillingData(BillingData);
                            setShippingData(ShippingData);
                            ShippingData.forEach((element, index) => {
                                if (element.IsDefaultAddress == true) {
                                    setAddressIndex(index)
                                }
                            })
                            BillingData.forEach((element, index) => {
                                if (element.IsDefaultAddress == true) {
                                    setAddressBillingIndex(index)
                                }
                            })
                            setLoader(false);
                        }
                        else {
                            setShippingData([]);
                            setBillingData([]);
                            setLoader(false);

                        }
                    }
                }
            });
        }
    }


    const onAddressModalClose = () => {
        setModalVisible(false)
        setEditForm({
            ReceiverName: '',
            Address: '',
            Mobile: '',
            PinCode: '',
            Country: editForm.Country,
            State: '',
            City: '',
            AddressGUID: '',
            Landmark: ''
        })
        setErrorReceiverName('');
        setErrorMobile('');
        setErrorAddress('');
        setErrorPincode('');
    }
    const onBillingAddressModalClose = () => {
        setModalVisible1(false)
        setEditForm({
            ReceiverName: '',
            Address: '',
            Mobile: '',
            PinCode: '',
            Country: editForm.Country,
            State: '',
            City: '',
            AddressGUID: '',
            Landmark: ''
        })
        setErrorReceiverName('');
        setErrorMobile('');
        setErrorAddress('');
        setErrorPincode('');
    }

    const loadMakePayment = async () => {
        console.log('addressBilling---->', addressBilling)
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        let addressGUID = await AsyncStorage.getItem('AddressGUID');
        let basketGuid = await AsyncStorage.getItem('BasketGuid');
        let GCSessionId = await AsyncStorage.getItem('GCSessionID');
        let GiftCouponRequestId = await AsyncStorage.getItem('GiftCouponRequestId')

        const Request = {
            AddressGUID: addressGUID,
            BasketGUID: basketGuid,
            BillingAddressGUID: addressBilling,
            CouponCode: "",
            GCSessionId: GCSessionId || '',
            GiftCouponRequestId: GiftCouponRequestId || "",
            PGFailure: 0,
        }

        api.postData(Path.loadmakepayment, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (response.data.ReturnCode == 0 && (response.data.Data !== null && response.data.Data !== undefined)) {
                        setMakePaymentData(response.data.Data);

                        if (response.data.Data.Cards != null && response.data.Data.Cards.length > 0) {
                            setGCApplied(true);
                        }
                        else {
                            setGCApplied(false);
                        }

                        if (response.data.Data.GiftCouponDetails != null && response.data.Data.GiftCouponDetails != null &&
                            response.data.Data.GiftCouponDetails !== '') {
                            setGVApplied(true);
                            // this.GVApplied = true;
                        }
                        else {
                            setGVApplied(false);
                        }
                        AsyncStorage.setItem('Address', JSON.stringify(response.data.Data.Address));
                        // viewCartNew();

                    }

                }
            }
        });
    }
    const SaveAddress = () => {
        if (validateSaveAddressForm() === true && validateAddress() == true) {
            setErr(null)
            setAddressType('Shipping')
        }
        else {
            console.log('Invalid inputs.')
        }
    }
    const SaveBillingAddress = () => {
        if (validateSaveAddressForm() === true) {
            setErr(null)
            setAddressType('Billing')
        }
        else {
            console.log('Invalid inputs.')
        }
    }

    const validateReceiverName = () => {
        let isFormValidated = true;

        let regex = /^[a-zA-Z ]+$/;
        let isValidName = regex.test(editForm.ReceiverName);

        let errors = {
            name: null,
        }

        if (editForm.ReceiverName == '' || editForm.ReceiverName == null) {
            errors.name = 'Enter Full Name.'
            isFormValidated = false;
            setErrorReceiverName(errors.name);
        } else if (!isValidName || editForm.ReceiverName.length < 3) {
            errors.name = 'Invalid Full Name.'
            isFormValidated = false;
            setErrorReceiverName(errors.name);
        } else {
            setErrorReceiverName('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
    }

    const validateMobile = () => {
        let isFormValidated = true;

        let regexMobile = /^[6-9][0-9]{9}$/;
        let isValidMobile = regexMobile.test(editForm.Mobile);

        let errors = {
            mobile: null,
        }

        if (editForm.Mobile == '' || editForm.Mobile == null) {
            errors.mobile = 'Enter Mobile Number.'
            isFormValidated = false;
            setErrorMobile(errors.mobile);
        } else if (!isValidMobile || editForm.Mobile < 10) {
            errors.mobile = 'Invalid Mobile Number.'
            isFormValidated = false;
            setErrorMobile(errors.mobile);
        } else {
            setErrorMobile('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
    }

    const validateAddress = () => {
        let isFormValidated = true;
        let rejax = /^[a-zA-Z0-9\s,' -]*$/;
        let isValidAddress = rejax.test(editForm.Address);
        let errors = {
            address: null,
        }

        if (editForm.Address == '' || editForm == null) {
            errors.address = 'Enter Address.'
            isFormValidated = false;
            setErrorAddress(errors.address);
        } else if (!isValidAddress) {
            errors.address = 'Invalid Address.'
            isFormValidated = false;
            setErrorAddress(errors.address);
        }
        else {
            setErrorAddress('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
    }


    const validatePincode = () => {
        let isFormValidated = true;
        let regexNumber = /^[0-9]*$/;
        let isValidNumber = regexNumber.test(editForm.PinCode);
        let errors = {
            pincode: null,
        }

        if (editForm.PinCode == '' || editForm.PinCode == null) {
            errors.pincode = 'Enter Pincode.'
            isFormValidated = false;
            setErrorPincode(errors.pincode);
        } else if (!isValidNumber || editForm.PinCode.length < 6) {
            errors.pincode = 'Invalid Pincode.'
            isFormValidated = false;
            setErrorPincode(errors.pincode);
        } else {
            setErrorPincode('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true

    }


    const validateSaveAddressForm = () => {
        let isFormValidated = true;

        let regex = /^[a-zA-Z ]+$/;
        let isValidName = regex.test(editForm.ReceiverName);
        let regexMobile = /^[6-9][0-9]{9}$/;
        let isValidMobile = regexMobile.test(editForm.Mobile);
        let regexNumber = /^[0-9]*$/;
        let isValidNumber = regexNumber.test(editForm.PinCode);

        let errors = {
            name: null,
            mobile: null,
            address: null,
            pincode: null,
            country: null,
            state: null,
            city: null,
        }

        if (editForm.ReceiverName == '' || editForm.ReceiverName == null) {
            errors.name = 'Enter Full Name.'
            isFormValidated = false;
            setErrorReceiverName(errors.name);
        } else if (!isValidName || editForm.ReceiverName.length < 3) {
            errors.name = 'Invalid Full Name.'
            isFormValidated = false;
            setErrorReceiverName(errors.name);
        } else {
            setErrorReceiverName('');
        }
        if (editForm.Mobile == '' || editForm.Mobile == null) {
            errors.mobile = 'Enter Mobile Number.'
            isFormValidated = false;
            setErrorMobile(errors.mobile);
        } else if (!isValidMobile || editForm.Mobile < 10) {
            errors.mobile = 'Invalid Mobile Number.'
            isFormValidated = false;
            setErrorMobile(errors.mobile);
        } else {
            setErrorMobile('');
        }
        if (editForm.Address == '' || editForm == null) {
            errors.address = 'Enter Address.'
            isFormValidated = false;
            setErrorAddress(errors.address);
        } else {
            setErrorAddress('');
        }
        if (editForm.PinCode == '' || editForm.PinCode == null) {
            errors.pincode = 'Enter Pincode.'
            isFormValidated = false;
            setErrorPincode(errors.pincode);
        } else if (!isValidNumber || editForm.PinCode.length < 6) {
            errors.pincode = 'Invalid Pincode.'
            isFormValidated = false;
            setErrorPincode(errors.pincode);
        } else {
            setErrorPincode('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
    }

    const sendSaveAddress = async () => {
        setModalVisible1(false);
        setModalVisible(false);
        let customerToken = await AsyncStorage.getItem('CustomerToken');

        const Request = {
            Address: editForm.Address,
            AddressType: addressType,
            CityName: editForm.City,
            IsDefaultAddress: isDefault,
            Mobile: editForm.Mobile,
            MobileCountryCode: countryId == 0 || countryId == '' || countryId == null ? '1' : countryId,
            Pincode: editForm.PinCode,
            ReceiverName: editForm.ReceiverName,
            StateId: "",
            StateName: editForm.State
        }

        api.postData(Path.addshippingaddress, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (response.data.ReturnCode == 122) {
                        setshouldOpen([false, true, true])
                        setIsOpen([false, false, true]);
                        if (addressType === 'Billing') {
                            setModalVisible1(false);
                        }
                        AsyncStorage.setItem('AddressGUID', response.data.Data[0].AddressGUID);
                        CheckLogin();
                        // GetBillingAddress();
                        setModalVisible1(false)
                        setModalVisible(false)
                        setEditForm('')
                        setResponseMessage(response.data.ReturnMessage);
                        api.getData(Path.loadmakepaymentgateway).then((response) => {
                            if (response != undefined && response != null) {
                                if (
                                    response.data != undefined &&
                                    response.data != null &&
                                    response.data != ''
                                ) {
                                    if (response.data.ReturnCode == 0 && (response.data.Data !== null || response.data.Data !== undefined)) {

                                        setshouldOpen([false, true, true])
                                        setIsOpen([false, false, true]);

                                        setMakePayment(response.data.Data);
                                        loadMakePayment();

                                    }

                                }
                            }
                        });
                    } else {
                        setResponseMessage(response.data.ReturnMessage);

                    }

                }
            }
        });

    }



    const changePinData = async () => {
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        let UserEmail = await AsyncStorage.getItem('UserEmail');

        const Request = {
            Pincode: editForm.PinCode,
        }

        api.postData(Path.checkserviceability, Request).then((response) => {

            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (response.data.ReturnCode === 0 && (response.data.Data !== null || response.data.Data !== undefined)) {

                        setEditForm({
                            ReceiverName: editForm.ReceiverName,
                            Address: editForm.Address,
                            Mobile: editForm.Mobile,
                            PinCode: editForm.PinCode,
                            Country: editForm.Country,
                            State: response.data.Data[0].StateName,
                            City: response.data.Data[0].CityName,
                            UserEmail: UserEmail,
                            AddressGUID: editForm.AddressGUID

                        })


                    } else {
                        setResponseMessage(response.data.ReturnMessage);
                        setEditForm({
                            ReceiverName: editForm.ReceiverName,
                            Address: editForm.Address,
                            Mobile: editForm.Mobile,
                            PinCode: editForm.PinCode,
                            Country: editForm.Country,
                            State: '',
                            City: '',
                            UserEmail: UserEmail,
                            AddressGUID: editForm.AddressGUID

                        })
                    }

                }
            }
        });


    }
    const AddAddressModal = () => {
        return (
            <View>
                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <SafeAreaView style={{ flex: 1, alignItems: 'flex-end' }}>
                        <ScrollView style={{ backgroundColor: '#fff', width: w / 1.06 }}>
                            <View style={{ marginHorizontal: 15 }}>
                                <View style={{ marginHorizontal: 10, marginTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#bbb', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#000', fontSize: 18, fontWeight: '700' }}>Add New Address</Text>
                                    <TouchableOpacity testID={'btnmodalclose'} onPress={() => onAddressModalClose()}>
                                        <Ionicons name='close-outline' size={28} color='#000' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtReceiverName'}
                                        style={styles.InputStyle}
                                        placeholder={'Full Name *'}
                                        placeholderTextColor="#aaa"
                                        onBlur={() => validateReceiverName()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.ReceiverName = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.ReceiverName}
                                    />
                                </View>
                                {errReceiverName != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errReceiverName}</Text>
                                </View>) : (<></>)}
                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtPinCode'}
                                        style={styles.InputStyle}
                                        placeholder={'Pincode *'}
                                        placeholderTextColor="#aaa"
                                        keyboardType={'number-pad'}
                                        onBlur={() => validatePincode()}
                                        maxLength={6}
                                        onEndEditing={() => changePinData()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.PinCode = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.PinCode}
                                    />
                                </View>
                                {errPincode != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errPincode}</Text>
                                </View>) : (<></>)}

                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtMobile'}
                                        style={styles.InputStyle}
                                        placeholder={'Mobile No *'}
                                        placeholderTextColor="#aaa"
                                        onBlur={() => validateMobile()}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.Mobile = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.Mobile}
                                    />
                                </View>
                                {errMobile != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errMobile}</Text>
                                </View>) : (<></>)}

                                <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                    <TextInput
                                        testID={'txtUserEmail'}
                                        style={styles.InputStyle}
                                        placeholder={'Email *'}
                                        placeholderTextColor="#aaa"
                                        editable={false}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.UserEmail = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.UserEmail}
                                    />
                                </View>

                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtAddress'}
                                        style={[styles.InputStyle, { textAlignVertical: 'top' }]}
                                        placeholder={'Address *'}
                                        placeholderTextColor="#aaa"
                                        numberOfLines={3}
                                        textContentType={'streetAddressLine1'}
                                        onBlur={() => validateAddress()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.Address = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.Address}
                                    />
                                </View>
                                {errAddress != '' ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errAddress}</Text>
                                </View>) : (<></>)}


                                <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                    <Text style={[styles.InputStyle, { color: '#aaa' }]}>India</Text>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                        <Text numberOfLines={1} style={[styles.InputStyle, { color: '#aaa' }]}>{editForm.State == '' ? 'State *' : editForm.State}</Text>
                                    </View>


                                    <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                        <Text numberOfLines={1} style={[styles.InputStyle, { color: '#aaa' }]}>{editForm.City == '' ? 'City *' : editForm.City}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginVertical: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>Set as default address </Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#ee6036" }}
                                        thumbColor={isDefault ? "#fff" : "#fff"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => setIsDefault(!isDefault)}
                                        value={isDefault}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => SaveAddress()} testID={'btnAddAddress'} style={{ marginBottom: w / 10, marginHorizontal: 12 }} >
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12 }}>save address</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </View>

        )
    }
    const AddBillingAddressModal = () => {
        return (
            <View>
                <Modal
                    animationType="slide"
                    visible={modalVisible1}
                    transparent={true}
                    onRequestClose={() => setModalVisible1(false)}
                >
                    <SafeAreaView style={{ flex: 1, alignItems: 'flex-end' }}>
                        <ScrollView style={{ backgroundColor: '#fff', width: w / 1.06 }}>
                            <View style={{ marginHorizontal: 15 }}>
                                <View style={{ marginHorizontal: 10, marginTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#bbb', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#000', fontSize: 18, fontWeight: '700' }}>Add New Address</Text>
                                    <TouchableOpacity testID={'btnmodalclose'} onPress={() => onBillingAddressModalClose()}>
                                        <Ionicons name='close-outline' size={28} color='#000' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtReceiverName'}
                                        style={styles.InputStyle}
                                        placeholder={'Full Name *'}
                                        placeholderTextColor="#aaa"
                                        onBlur={() => validateReceiverName()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.ReceiverName = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.ReceiverName}
                                    />
                                </View>
                                {errReceiverName != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errReceiverName}</Text>
                                </View>) : (<></>)}
                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtPinCode'}
                                        style={styles.InputStyle}
                                        placeholder={'Pincode *'}
                                        placeholderTextColor="#aaa"
                                        keyboardType={'number-pad'}
                                        onBlur={() => validatePincode()}
                                        maxLength={6}
                                        onEndEditing={() => changePinData()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.PinCode = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.PinCode}
                                    />
                                </View>
                                {errPincode != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errPincode}</Text>
                                </View>) : (<></>)}

                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtMobile'}
                                        style={styles.InputStyle}
                                        placeholder={'Mobile No *'}
                                        placeholderTextColor="#aaa"
                                        onBlur={() => validateMobile()}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.Mobile = txt;
                                            setEditForm(tempObj)
                                        }}
                                        value={editForm.Mobile}
                                    />
                                </View>
                                {errMobile != "" ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errMobile}</Text>
                                </View>) : (<></>)}

                                <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                    <TextInput
                                        testID={'txtUserEmail'}
                                        style={styles.InputStyle}
                                        placeholder={'Email *'}
                                        placeholderTextColor="#aaa"
                                        editable={false}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.UserEmail = txt;
                                            setEditForm(tempObj)
                                            //  setReceiversName(editForm.ReceiverName + txt)
                                        }}
                                        value={editForm.UserEmail}
                                    />
                                </View>

                                <View style={styles.InputTextVIew}>
                                    <TextInput
                                        testID={'txtAddress'}
                                        style={[styles.InputStyle, { textAlignVertical: 'top' }]}
                                        placeholder={'Address *'}
                                        placeholderTextColor="#aaa"
                                        numberOfLines={3}
                                        textContentType={'streetAddressLine1'}
                                        onBlur={() => validateAddress()}
                                        onChangeText={(txt) => {
                                            let tempObj = _.cloneDeep(editForm)
                                            tempObj.Address = txt;
                                            setEditForm(tempObj)

                                        }}
                                        value={editForm.Address}
                                    />
                                </View>
                                {errAddress != '' ? (<View>
                                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errAddress}</Text>
                                </View>) : (<></>)}

                                <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                    <Text style={[styles.InputStyle, { color: '#aaa' }]}>India</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                        <Text numberOfLines={1} style={[styles.InputStyle, { color: '#aaa' }]}>{editForm.State == '' ? 'State *' : editForm.State}</Text>
                                    </View>

                                    <View style={[styles.InputTextVIew, { backgroundColor: '#ddd' }]}>
                                        <Text numberOfLines={1} style={[styles.InputStyle, { color: '#aaa' }]}>{editForm.City == '' ? 'City *' : editForm.City}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginVertical: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>Set as default address </Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#ee6036" }}
                                        thumbColor={isDefault ? "#fff" : "#fff"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => setIsDefault(!isDefault)}
                                        value={isDefault}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => SaveBillingAddress()} testID={'btnAddBillingAddress'} style={{ marginBottom: w / 10, marginHorizontal: 12 }} >
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12 }}>save address</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </View>
        )
    }

    const pickGuid = (item, index) => {
        setAddressIndex(index)
        setAddress(item.AddressGUID);
        AsyncStorage.setItem('AddressGUID', item.AddressGUID);
        setChecked(checked);
    }
    const pickGuidBilling = (item, index) => {
        setAddressBillingIndex(index)
        setAddressBilling(item.BillingAddressGUID);
        AsyncStorage.setItem('BillingAddressGUID', item.BillingAddressGUID);
        setCheckedBilling(checkedBilling);
    }
    const SetDefaultAddress = async (index) => {
        console.log('indexindexindexindexindex==>', index)
        await setAddressIndex(index)
    }



    const navPayment = async () => {
        setSummeryLoader(false)
        let CartGuid = await AsyncStorage.getItem('BasketGuid');
        let GCSessionID = await AsyncStorage.getItem('GCSessionID');
        let GiftRequestID = await AsyncStorage.getItem('GiftRequestID');
        let Promo = await AsyncStorage.getItem('Promo');
        setPromo(promo == undefined ? "" : Promo);
        var Request = {
            AddressGUID: "00000000-0000-0000-0000-000000000000",
            BasketGUID: CartGuid,
            CouponCode: Promo == undefined ? "" : Promo,
            GCSessionId: GCSessionID == undefined ? "" : GCSessionID,
            GiftCouponRequestId: GiftRequestID == undefined ? "" : GiftRequestID,
            Pincode: "",
        }
        api.postData(Path.viewcartnew, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {

                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        let A = [];
                        let B = [];
                        response.data.Data.Products.forEach(element => {
                            if (element.item_level_onlyklm_promo_name != '' && element.item_level_onlyklm_promo_name != null) {
                                A.push(element);
                            } else {
                                B.push(element);
                            }
                        });
                        let PromoObj = {}
                        A.map((ele) => {
                            if (PromoObj[ele.item_level_onlyklm_promo_name]) {
                                PromoObj[ele.item_level_onlyklm_promo_name].push(ele)
                            } else {
                                PromoObj[ele.item_level_onlyklm_promo_name] = [ele]
                            }
                        })

                        setPromoItems(PromoObj);
                        setMainPromoItems(Object.keys(PromoObj));
                        setNoPromoItems(B);

                        AsyncStorage.setItem('BasketGuid', response.data.Data.BasketGUID);
                        console.log('response.data.Data.Products[0].AvailableQuantity', response.data.Data.Products[0].AvailableQuantity)
                        if (response.data.Data.Products[0].AvailableQuantity == 0) {
                            setOutOfStock(true);
                        } else {
                            if (shippingData.length != 0) {
                                props.navigation.navigate('Payment', { guid: address == 0 ? shippingData[addressIndex].AddressGUID : address, bilingGUID: addressBilling == 0 ? shippingData[addressIndex].AddressGUID : billingData[addressBillingIndex].BillingAddressGUID, })
                            } else {
                                setSelectAddressmsg(true);
                                setTimeout(() => {
                                    setSelectAddressmsg(false)
                                }, 2000);
                            }
                        }
                        setCartData(response.data.Data.Products);
                        setData(response.data.Data);

                        // setTotalItems(response.data.Data.TotalItems);

                        AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data.TotalItems));
                        AsyncStorage.setItem('CartProducts', JSON.stringify(response.data.Data.Products));
                        getCartGlobalVarsF().showCartCountF();
                        setSummeryLoader(false)

                        setLoader(false);
                        // console.log(data);

                    } else {
                        // setnoData(true);
                        setSummeryLoader(false)

                        AsyncStorage.setItem('CartCount', JSON.stringify(0));

                        setLoader(false);

                    }
                    // setLoadPromoSection(true);

                }
            }
        });   }

        const RefreshFC = () => {
            CartDeatils()
            CheckLogin();
            getCountry();
            setResponseMessage('');
            
        }
        const wait = (timeout) => {
            return new Promise(resolve => setTimeout(resolve, timeout));
        }
        const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            RefreshFC()
            wait(1000).then(() => setRefreshing(false));
        }, []);

    if (loader == true) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <CommonHeader navigation={props.navigation} />
                <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color="#900C19" />
            </View>
        )
    } else {

        return (
            <View style={{ flex: 1 }}>
                 <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                <CommonHeader navigation={props.navigation} />

                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#aaa', marginHorizontal: 12 }}>
                        <Text style={{ fontSize: 23, color: '#000', fontWeight: '700', paddingVertical: 15 }}>Choose your Delivery Address</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#aaa', marginHorizontal: 25 }}>
                        <Text style={{ fontSize: 20, color: '#000', fontWeight: '700', paddingVertical: 15 }}>Shipping Address</Text>
                    </View>
                    {shippingData == undefined || shippingData == null || shippingData.length == 0 ? (
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ width: w / 1.5, resizeMode: 'contain' }} source={require('../../asserts/my-address-icon.png')} />
                            <Text style={{ color: '#000', fontSize: 24, fontWeight: '700' }}>We can’t find you!</Text>
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginHorizontal: w / 10, textAlign: 'center', paddingVertical: 15 }}>You have not added an address to your account yet.</Text>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => setModalVisible(true)} testID={'btnAddAddress'} style={{ marginBottom: w / 6 }} >
                                <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 40 }}>Add An address</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ marginBottom: 15 }}>
                            {shippingData.map((item, index) => (
                                <View key={index} style={{ marginBottom: 15 }}>

                                    <TouchableOpacity style={{}} activeOpacity={0.6} onPress={() => pickGuid(item, index)}>

                                        <View style={{ marginHorizontal: 12, marginTop: 15, paddingVertical: 20, borderRadius: 5, borderColor: '#ccc', borderWidth: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15, }}>
                                                    <View style={{ height: 22, width: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: '#888', borderRadius: 15, }}>
                                                    </View>
                                                    {addressIndex == index && (
                                                        <View style={{ position: 'absolute' }}>
                                                            <Octicons style={{ left: 4, top: -4 }} name={'check'} size={26} color={'#ee6036'} />
                                                        </View>
                                                    )}
                                                </View>




                                                {item.IsDefaultAddress == true && (

                                                    <Text style={{ backgroundColor: '#ee6036', fontSize: 13, fontWeight: '500', marginRight: 20, padding: 8, color: '#fff' }}>DEFAULT</Text>
                                                )}

                                            </View>
                                            <View style={{ paddingLeft: 20 }}>
                                                <Text style={{ fontSize: 20, color: '#000', fontWeight: '700', marginBottom: 10, textTransform: 'uppercase' }}>{item.ReceiverName}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={{ height: 20, width: 20 }} source={require('../../asserts/pin.png')} />
                                                    <Text style={{ fontSize: 14, color: '#8a8a8a', marginBottom: 5, paddingLeft: 10, marginRight: w / 5, fontWeight: '700', lineHeight: 20 }}>{item.Address}, {item.City}, {item.State}, {item.Country}, {item.PinCode}</Text>

                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={{ height: 20, width: 20 }} source={require('../../asserts/profile-ph.png')} />
                                                    <Text style={{ fontSize: 14, color: '#8a8a8a', marginBottom: 5, paddingLeft: 10, marginRight: w / 5, fontWeight: '700' }}> +{item.MobileCountryCode} {item.Mobile} </Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>

                                </View>
                            ))}
                            <View>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => setModalVisible(true)} testID={'btnAddAddress'} style={{ marginHorizontal: 12 }} >
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 40 }}>Add An Address</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {AddAddressModal()}
                    {/* Billing Address */}

                    {BillingBtnSelect ? (
                        <TouchableOpacity onPress={() => /* pickGuidBilling(item, index) */setBillingBtnSelect(false)} activeOpacity={0.6} testID={'btnBillingAddress'} style={{ marginHorizontal: 12, paddingVertical: 10, flexDirection: 'row', borderWidth: 1, borderRadius: 5, borderColor: '#ccc' }} >
                            <View style={{ height: 20, width: 20, backgroundColor: '#fff', borderWidth: 2, borderColor: '#888', marginHorizontal: 10 }}>
                                <View style={{ position: 'absolute' }}>
                                    <Octicons style={{ left: 3, top: -8 }} name={'check'} size={26} color={'#ee6036'} />
                                </View>

                            </View>
                            <Text style={{ paddingHorizontal: 10, fontSize: 12, color: '#000' }}>Billing Address Same as Shipping Address </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => /* pickGuidBilling(item, index) */setBillingBtnSelect(true)} activeOpacity={0.6} testID={'btnBillingAddress'} style={{ marginHorizontal: 12, paddingVertical: 10, flexDirection: 'row', borderWidth: 1, borderRadius: 5, borderColor: '#ccc' }} >
                            <View style={{ height: 20, width: 20, backgroundColor: '#fff', borderWidth: 2, borderColor: '#888', marginHorizontal: 10 }}>
                            </View>
                            <Text style={{ paddingHorizontal: 10, fontSize: 12, color: '#000' }}>Billing Address Same as Shipping Address </Text>
                        </TouchableOpacity>
                    )}

                    {!BillingBtnSelect ? (
                        <>
                            {billingData == undefined || billingData == null || billingData.length == 0 ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Image style={{ width: w / 1.5, resizeMode: 'contain' }} source={require('../../asserts/my-address-icon.png')} />
                                    <Text style={{ color: '#000', fontSize: 24, fontWeight: '700' }}>We can’t find you!</Text>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginHorizontal: w / 10, textAlign: 'center', paddingVertical: 15 }}>You have not added an address to your account yet.</Text>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => setModalVisible1(true)} testID={'btnAddAddress'} style={{ marginBottom: w / 6 }} >
                                        <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 40 }}>Add an address</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ paddingVertical: 12 }}>
                                    {!BillingBtnSelect ?
                                        <View style={{/*Billing Address View*/ }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#aaa', marginHorizontal: 20 }}>
                                                <Text style={{ fontSize: 20, color: '#000', fontWeight: '700', paddingVertical: 15 }}>Billing Address</Text>
                                            </View>

                                            {billingData.map((item, index) => (
                                                <View style={{ marginBottom: 15 }}>
                                                    <TouchableOpacity style={{}} activeOpacity={0.6} onPress={() => pickGuidBilling(item, index)}>

                                                        <View style={{ marginHorizontal: 12, marginTop: 15, paddingVertical: 20, borderRadius: 5, borderColor: '#ccc', borderWidth: 1 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', }}>
                                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15, }}>
                                                                    <View style={{ height: 22, width: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: '#888', borderRadius: 15, }}>
                                                                    </View>
                                                                    {addressBillingIndex == index && (
                                                                        <View style={{ position: 'absolute' }}>
                                                                            <Octicons style={{ left: 4, top: -4 }} name={'check'} size={26} color={'#ee6036'} />
                                                                        </View>
                                                                    )}
                                                                </View>
                                                                {item.IsDefaultAddress == true && (
                                                                    <Text style={{ backgroundColor: '#ee6036', fontSize: 13, fontWeight: '500', marginRight: 20, padding: 8, color: '#fff' }}>DEFAULT</Text>
                                                                )}
                                                            </View>
                                                            <View style={{ paddingLeft: 20 }}>
                                                                <Text style={{ fontSize: 20, color: '#000', fontWeight: '700', marginBottom: 10, textTransform: 'uppercase' }}>{item.ReceiverName}</Text>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Image style={{ height: 20, width: 20 }} source={require('../../asserts/pin.png')} />
                                                                    <Text style={{ fontSize: 14, color: '#8a8a8a', marginBottom: 5, paddingLeft: 10, marginRight: w / 5, fontWeight: '700', lineHeight: 20 }}>{item.Address}, {item.City}, {item.State}, {item.Country}, {item.PinCode}</Text>

                                                                </View>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Image style={{ height: 20, width: 20 }} source={require('../../asserts/profile-ph.png')} />
                                                                    <Text style={{ fontSize: 14, color: '#8a8a8a', marginBottom: 5, paddingLeft: 10, marginRight: w / 5, fontWeight: '700' }}> +{item.MobileCountryCode} {item.Mobile} </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                </View>
                                            ))}


                                        </View>
                                        : null}
                                    <View>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => setModalVisible1(true)} testID={'btnAddAddress'} style={{ marginHorizontal: 12 }} >
                                            <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 40 }}>Add an Address</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>)}
                        </>
                    ) : null}
                    {AddBillingAddressModal()}


                    <View style={{ marginVertical: 20 }}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 12, borderBottomWidth: 1, paddingBottom: 8, borderBottomColor: '#aaa', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: '#000', fontWeight: '700' }}>Shopping Cart </Text>
                                <Text style={{ fontSize: 14, color: '#000', fontWeight: '700', textAlignVertical: 'bottom' }}>{data.TotalItems} items</Text>
                            </View>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Cart')} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <Image source={require('../../asserts/Cart.png')} resizeMode="contain" style={{ width: 20, height: 20 }} />
                                <Text style={{ fontSize: 14, color: '#000', fontWeight: '700', paddingLeft: 5, top: 3.5 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        {noPromoItems.map((item, index) => (
                            <View key={parseInt(index)} style={{ marginHorizontal: 12, marginTop: 15, padding: 12, borderWidth: 0.5 }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                    <TouchableOpacity
                                        testID={'btnnavpdp'} onPress={() => props.navigation.push('PDP', { url: item.ProductUrl })}>
                                        <Image source={{ uri: item.ThumbnailImageUrl, }}
                                            style={{ width: 75, height: 113, resizeMode: 'contain' }} />
                                    </TouchableOpacity>
                                    {outOfStock ? 
                                            (<Text style={{ fontSize: 12, color: 'red', fontWeight: '500', paddingTop: 5,paddingHorizontal:5 }}>Out of stock</Text>)
                                            : null}
                                    </View>
                                    

                                    <View style={{ marginLeft: 12, width: w / 1.6 }}>
                                        <TouchableOpacity
                                            testID={'btnnavpdp'} style={{ borderBottomWidth: 0.5 }} onPress={() => props.navigation.push('PDP', { url: item.ProductUrl })}>
                                            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#000', paddingVertical: 8 }}>{item.ProductTitle}</Text>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5 }}>
                                            <View style={{ paddingVertical: 10 }}>
                                                {
                                                    item.MRP != item.UnitPrice && item.DiscountPercentage != 0 ? (
                                                        <View>
                                                            <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                            <Text style={{ fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseInt(item.UnitPrice).toFixed(2)}</Text>
                                                            <View style={{ flexDirection: 'row', alignContent: 'space-around' }} key={'discountviewmsg'}>
                                                                <Text testID={"lblmrp"} style={styles.cardTextStrike}>{data.CurrencySymbol} {parseInt(item.MRP).toFixed(2)}</Text>
                                                                <Text style={styles.DiscountPercentage}> ({parseInt(item.DiscountPercentage)})%</Text>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View>
                                                            <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                            <Text style={{ fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseInt(item.MRP).toFixed(2)}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>

                                            <View style={{ paddingVertical: 10, marginRight: 15 }}>
                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Subtotal</Text>
                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000', textDecorationLine: (item.BillLevelDiscount == '' && item.BillLevelDiscount == 0) ? 'none' : 'line-through', paddingRight: 4, borderRightWidth: (item.BillLevelDiscount == '' && item.BillLevelDiscount == 0) ? 0 : 1 }}>{data.CurrencySymbol} {parseFloat(item.SubTotalPrice).toFixed(2)}</Text>
                                                {(item.BillLevelDiscount != '' && item.BillLevelDiscount != 0) ? (
                                                    <>
                                                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.SubTotalDiscountPrice).toFixed(2)}</Text>
                                                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: 'red' }}>({data.CurrencySymbol} {parseFloat(item.BillLevelDiscount).toFixed(2)})</Text>
                                                    </>
                                                ) : (null)}


                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>Color</Text>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>{item.ColorName}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>Size</Text>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>{item.Size}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>Qty</Text>
                                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#000' }}>{item.StoreQuantity}</Text>
                                            </View>
                                        </View>
                                         
                                    </View>
                                </View>
                            </View>
                        ))}
                        <FlatList
                            data={mainPromoItems}
                            renderItem={({ item, index }) => (
                                <>
                                    <View>
                                        <View style={{ marginHorizontal: 12, marginTop: 15, padding: 12, borderWidth: 1, borderColor: '#dc3545', backgroundColor: '#ddd' }}>
                                            <Text style={{ fontSize: 14, color: '#262626' }}>Promo Applied / <Text style={{ color: '#dc3545' }}>{item}</Text></Text>
                                        </View>
                                        <FlatList
                                            data={promoItems[item]}
                                            renderItem={({ item, index }) => (
                                                <View key={parseInt(index)} style={{ marginHorizontal: 12, padding: 12, borderWidth: 1, borderTopWidth: 0, borderColor: '#dc3545' }}>

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View>
                                                            <TouchableOpacity
                                                                testID={'btnnavpdp'} onPress={() => props.navigation.push('PDP', { url: item.ProductUrl })}>
                                                                <Image source={{ uri: item.ThumbnailImageUrl, }}
                                                                    style={{ width: 75, height: 113, resizeMode: 'contain' }} />
                                                            </TouchableOpacity>
                                                            {outOfStock ?
                                                                (<Text style={{ fontSize: 12, color: 'red', fontWeight: '500', paddingTop: 15 }}>Out of stock</Text>)
                                                                : null}
                                                        </View>
                                                        <View style={{ marginLeft: 12, width: w / 1.6 }}>
                                                            <TouchableOpacity
                                                                testID={'btnnavpdp'} style={{ borderBottomWidth: 0.5 }} onPress={() => props.navigation.push('PDP', { url: item.ProductUrl })}>
                                                                <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#000', paddingVertical: 8 }}>{item.ProductTitle}</Text>
                                                            </TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5 }}>
                                                                <View style={{ paddingVertical: 10 }}>
                                                                    {
                                                                        item.MRP != item.UnitPrice && item.DiscountPercentage != 0 ? (
                                                                            <View>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseInt(item.UnitPrice).toFixed(2)}</Text>
                                                                                <View style={{ flexDirection: 'row', alignContent: 'space-around' }} key={'discountviewmsg'}>
                                                                                    <Text testID={"lblmrp"} style={styles.cardTextStrike}>{data.CurrencySymbol} {parseInt(item.MRP).toFixed(2)}</Text>
                                                                                    <Text style={styles.DiscountPercentage}> ({parseInt(item.DiscountPercentage)})%</Text>
                                                                                </View>
                                                                            </View>
                                                                        ) : (
                                                                            <View>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseInt(item.MRP).toFixed(2)}</Text>
                                                                            </View>
                                                                        )
                                                                    }
                                                                </View>

                                                                <View style={{ paddingVertical: 10, marginRight: 15 }}>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Subtotal</Text>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000', textDecorationLine: (item.SubTotalDiscountPrice == '' && item.SubTotalDiscountPrice == 0) ? 'none' : 'line-through', paddingRight: 4, borderRightWidth: (item.SubTotalDiscountPrice == '' && item.SubTotalDiscountPrice == 0) ? 0 : 1 }}>{data.CurrencySymbol} {parseFloat(item.SubTotalPrice).toFixed(2)}</Text>
                                                                    {(item.SubTotalDiscountPrice != '' && item.SubTotalDiscountPrice != 0) ? (
                                                                        <>
                                                                            <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.SubTotalDiscountPrice).toFixed(2)}</Text>
                                                                            <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: 'red' }}>({data.CurrencySymbol} {parseFloat(item.DiscountOfferValue).toFixed(2)})</Text>
                                                                        </>
                                                                    ) : (null)}
                                                                </View>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'space-between' }}>

                                                                <View>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Color</Text>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{item.ColorName}</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Size</Text>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{item.Size}</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Qty</Text>
                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{item.StoreQuantity}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                            keyExtractor={(Item, index) => index.toString()} />
                                    </View>
                                </>

                            )}
                            keyExtractor={(Item, index) => index.toString()} />


                        <View style={{ backgroundColor: '#eaeaea', marginVertical: 20, marginHorizontal: 12 }}>
                            <View style={{ borderBottomWidth: 1, marginHorizontal: 12, borderBottomColor: '#aaa' }}>
                                <Text style={{ fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '700' }}>SUMMARY</Text>
                            </View>
                            {!SummeryLoader ? <>
                                <View style={{ borderBottomWidth: 1, marginHorizontal: 12, borderBottomColor: '#aaa', paddingVertical: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', fontWeight: '700' }}>SUB TOTAL</Text>
                                        <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>{data.CurrencySymbol} {parseInt(data.CartSubTotalAmount).toFixed(2)}</Text>
                                    </View>
                                    {(data.ShippingCharges != '' && data.ShippingCharges != 0) ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', fontWeight: '700' }}>SHIPPING CHARGES</Text>
                                            <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} {parseFloat(data.ShippingCharges).toFixed(2)}</Text>
                                        </View>
                                    ) : (null)}
                                    {data.pos_total_discount != '' ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', fontWeight: '700' }}>TOTAL DISCOUNT (-)</Text>
                                            <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} (-) {parseFloat(data.pos_total_discount).toFixed(2)}</Text>
                                        </View>
                                    ) : (null)}
                                    {data.CouponDiscountValue != '' && data.CouponDiscountValue != null && data.CouponDiscountValue != undefined && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', fontWeight: '700', paddingVertical: 5 }}>COUPON DISCOUNT (+)</Text>

                                            </View>
                                            <Text style={{ fontSize: 16, color: '#198754', fontWeight: '500', }}>{data.CurrencySymbol} {data.CouponDiscountValue}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={{ marginHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '700' }}>ORDER TOTAL</Text>
                                    <Text testID={"lblOrderTotal"} style={{ fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '600' }}>{data.CurrencySymbol} {parseInt(data.TotalAmount).toFixed(2)}</Text>
                                </View>
                            </>
                                :
                                <View style={{ padding: 40 }}>
                                    <ActivityIndicator size='large' color="#900C19" />
                                </View>
                            }
                            <TouchableOpacity activeOpacity={0.6} onPress={() => navPayment()} testID={'btnAddAddress'} style={{ marginHorizontal: 12, marginVertical: 10 }} >
                                <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', paddingVertical: 12, paddingHorizontal: 40 }}>Continue to payment</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <Footer navigation={props.navigation} />

                </ScrollView>


                {selectAddressmsg ?
                    <View style={styles.addshippingErrmsg}>
                        <View style={{ width: w / 1.1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 10, borderRadius: 10 }}>
                            <AntDesign style={{ padding: 4, paddingHorizontal: 5 }} name={'infocirlceo'} color='#ff5353' size={20} />
                            <Text style={{ color: '#fff', fontSize: 14, paddingHorizontal: 5 }}>PLEASE ADD SHIPPING ADDRESS.</Text>
                        </View>
                    </View>
                    : null
                }
                <Modal
                    animationType="fade"
                    visible={orderSummaryModal}
                    presentationStyle='fullScreen'
                    statusBarTranslucent={false}
                    onRequestClose={() => setOrderSummaryModal(false)}>
                    {/* <OrderSummary {...props} onSelect={() => handleModel()} promoCallbackLoadMakePayment={CallPromoCode} />*/}
                </Modal>
                <View style={{ bottom: 0 }}>
                    <Bottomtaballpages navigation={props.navigation} count={Count} />
                </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", textAlign: 'center' },
    loginText: { marginTop: -20, marginBottom: 20, fontSize: 18, color: '#aa8531', textAlign: 'center', },
    loginEmailTextView: { backgroundColor: '#fff', fontSize: 13, paddingTop: 13, paddingBottom: 13, paddingLeft: 10 },
    loginEmailText: { color: '#7d6224', letterSpacing: 3 },
    InputTextVIew: { borderWidth: 1, borderColor: '#aaa', marginLeft: 10, marginRight: 10, marginTop: 30, borderRadius: 10, flex: 1 },
    ForgotPasswordText: { color: '#87734c', fontSize: 12, paddingLeft: 10 },
    LoginWithOTP: { color: '#87734c', fontSize: 12, paddingRight: 10, },
    LoginButton: { backgroundColor: '#900c19', paddingTop: 10, padding: 10, width: '60%' },
    LoginText: { color: '#f2c452', fontSize: 14, textAlign: 'center', },
    UseText: { textAlign: 'center', color: '#7d6224', fontSize: 18, letterSpacing: 2 },
    RegisterSection: { flexDirection: 'row', paddingTop: 13 },
    NotMemberText: { color: '#9b7c35', fontSize: 14, letterSpacing: 1.4, paddingLeft: 10 },
    RegisterButton: { color: '#900c19', fontSize: 14, letterSpacing: 1.4, paddingLeft: 10, paddingTop: 3, paddingRight: 10 },
    RadioView: { flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingLeft: 15 },
    BtuView: { backgroundColor: '#ffd469', alignItems: 'center' },
    BtuText: { color: '#900c19', fontSize: 18, paddingVertical: 14 },
    QuantityView: { borderWidth: 1, borderColor: '#FFD700', flexDirection: 'row', marginTop: 10, marginBottom: 5 },
    errMsg: { color: '#C00000', fontSize: 13, fontWeight: '500', marginTop: 5, paddingVertical: 5, marginHorizontal: 12, paddingLeft: 5 },
    inputHeadText: { fontSize: 12, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginLeft: 15, marginRight: '60%' },
    inputText: { fontSize: 15, color: '#8c8b8b', },
    InputStyle: { paddingLeft: 12, paddingRight: 10, flex: 1, paddingVertical: 10, fontSize: 16, fontWeight: '500', color: '#000', },
    banner: {
        width: '100%',
        height: 150
    },
    bannerImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    trackOrderWrapper: {
        backgroundColor: '#dcc7a65c',
    },
    trackOrderTitle: {
        paddingVertical: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    decoLine: {
        width: '35%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cfb57b',
        height: 1
    },
    trackOrderInputWrapper: {
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    trackOrderInput: {
        backgroundColor: 'transparent',
        width: '70%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cfb57b',
        borderRadius: 3,
        height: 50
    },
    trackOrderLabel: {
        backgroundColor: 'black',
        position: 'relative',
        top: 10,
        zIndex: 10,
        left: '-15%'
    },
    trackOrderLabelText: {
        color: '#cfb57b',
        paddingHorizontal: 15,
    },
    faqContentWrapper: {
        // flex: 1,
        width: '100%',
        // flexDirection:'column'
        paddingBottom: 100
    },
    scrollPositioner: {
        backgroundColor: 'white',
        minHeight: 10,
        position: 'relative',
        top: -90
    },
    IconSize: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    scrollIcons: {
        marginHorizontal: 15,
        marginVertical: 15,
        alignItems: 'center'
    },
    scrollIconsText: {
        textAlign: 'center'
    },
    FaqTitle: { backgroundColor: '#f5f1e9', fontSize: 23, paddingTop: 13, paddingBottom: 13, width: '80%', marginVertical: 10 },
    Title: { textAlign: 'center', color: '#7d6224', letterSpacing: 3, fontSize: 23 },
    questions: {
        padding: 15,
        backgroundColor: '#f5f1e9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#f1ece2',
        marginTop: 10,
        marginBottom: 10
    },
    questionsText: {
        fontWeight: "700",
        fontSize: 18
    },
    answer: {
        padding: 25
    },
    ansText: {
        fontSize: 16
    },
    addshippingErrmsg: {

        alignItems: 'center', justifyContent: 'center', marginBottom: 20

    }
});

export default Checkout;