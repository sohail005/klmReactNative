import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Dimensions, Text, TextInput, SafeAreaView, ActivityIndicator, ScrollView, Modal, Platform, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeHeader from '../CommonDesign/HomeHeader';
import api from '../Helper/helperModule';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import cryptoJS from 'react-native-crypto-js';
import InformationPopup from '../CommonDesign/InformationPopup';
import { RadioButton } from 'react-native-paper';
// import ShippingT_C from '../Component/ShippingT&C';
import LinearGradient from 'react-native-linear-gradient';
import Footer from '../CommonDesign/Footer';
import Path from '../Helper/Api';
//import analytics from '@react-native-firebase/analytics';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';
import Bottomtaballpages from '../CommonDesign/Bottomtaballpages';
import { RotateInUpLeft } from 'react-native-reanimated';

const generateGCid = uuid.v4();
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const CartPage = ({ navigation, route }, props) => {
    const [loader, setLoader] = useState(true);
    const [cartData, setCartData] = useState([]);
    const [data, setData] = useState({});
    const [SummeryLoader, setSummeryLoader] = useState(false);

    const [showPromo, setShowPromo] = useState(false);
    const [radioPromo, setRadioPromo] = useState('first');
    const [giftCard, setGiftCard] = useState('');
    const [cardPin, setCardPin] = useState('');
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState("");
    const [mobile, setMobile] = useState('');
    const [coupon, setCoupon] = useState('');
    const [noData, setnoData] = useState(false);
    const [showQuantityError, setShowQuantityError] = useState('');
    const [CartGuid, setCartGuid] = useState('');
    const [havePromo, setHavePromo] = useState(false);
    const [selectIndex, setSelectIndex] = useState();
    const [selectName, setSelectName] = useState('');
    const [customerToken, setCustomerToken] = useState('');
    const [GCCheckError, setGCCheckError] = useState(false);
    const [GCCheckMessage, setGCCheckMessage] = useState('');
    const [pinError, setPinError] = useState(0);
    const [removepromo, setRemovepromo] = useState(false);
    const [removeCardModal, setRemoveCardModal] = useState(false);
    const [otpGift, setOtpGift] = useState(false);
    const [OTPNumber, setOTPNumber] = useState('');
    const [giftRequestId, setGiftRequestId] = useState('');
    const [giftSessionId, setGiftSessionId] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [qtyErrMessage, setQtyErrMessage] = useState('');
    const [sizeModal, setSizeModal] = useState(false);
    const [quantityModal, setQuantityModal] = useState(false);
    const [errorGC, setErrorGC] = useState('');
    const [errorCP, setErrorCP] = useState('');
    const [errorM, setErrorM] = useState('');
    const [errorC, setErrorC] = useState('');
    const [errorOTP, setErrorOTP] = useState('');
    const [err, setErr] = useState(null);
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [CurrencyId, setCurrencyId] = useState(0);
    const [shippingTCModal, setShippingTCModal] = useState(false);
    const [storeGCSessionID, setGCSessionId] = useState('');
    const [removeItemCartModal, setRemoveItemCartModal] = useState(false);
    const [RemoveItem, setRemoveItem] = useState([]);
    const [loadPromoSection, setLoadPromoSection] = useState(false);
    const [totalItems, setTotalItems] = useState('')
    const [quantityData, setQuantityData] = useState([]);
    const [offerSelect, setOfferSelect] = useState([]);
    const [offerSelectData, setOfferSelectData] = useState([]);
    const [PromoDetails, setPromoDetails] = useState([]);
    const [wishlistIndex, setWishlistIndex] = useState([]);
    const [heart, setHeart] = useState(false);
    const [promoItems, setPromoItems] = useState([]);
    const [noPromoItems, setNoPromoItems] = useState([]);
    const [mainPromoItems, setMainPromoItems] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [removeFromCart, setRemoveFromCart] = useState('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            CartDeatils();
            QuantityData();
            //AddWishListAfterLogin();
            // GoogleAnalytics();
        });
        return () => unsubscribe;

    }, []);
    useEffect(() => { if (heart) { CartDeatils(); QuantityData(); setHeart(false); } }, [heart]);

    const checkStockStatus = (cartDetails) => {
        // console.log('check stock', cartDetails)
        if (cartDetails != undefined && cartDetails != null && cartDetails.Products != undefined && cartDetails.Products != null) {
            const products = cartDetails.Products;
            for (let i = 0; i < products.length; i++) {
                setSelectName(products[i].ProductTitle)
                if (products[i].StockMessage !== undefined && products[i].StockMessage !== null &&
                    products[i].StockMessage !== '' && products[i].AvailableQuantity < products[i].StoreQuantity) {
                    setIsOutOfStock(true);
                    return;
                } else {
                    setIsOutOfStock(false);
                }
            }
        }
        console.log(isOutOfStock)
    }

    const CartDeatils = async () => {
        //setLoader(true);
        setLoadPromoSection(false);
        setResponseMessage('');
        setSummeryLoader(true);

        // setLoader(true);
        let Promo = await AsyncStorage.getItem('Promo');
        let CartGuid = await AsyncStorage.getItem('BasketGuid');
        setCartGuid(CartGuid);
        let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        setCustomerToken(CustomerToken);
        let CurrencyId = await AsyncStorage.getItem('CurrencyId');
        setCurrencyId(CurrencyId);
        let GCSessionID = await AsyncStorage.getItem('GCSessionID');
        let GiftRequestID = await AsyncStorage.getItem('GiftRequestID');

        var Request = {
            CustomerToken: CustomerToken,
            AddressGUID: "00000000-0000-0000-0000-000000000000",
            BasketGUID: CartGuid,
            CouponCode: Promo || "",
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
                            if (element.AvailableQuantity == 0) {
                                setIsOutOfStock(true);
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
                        setTotalItems(response.data.Data.TotalItems);
                        AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data.TotalItems));
                        AsyncStorage.setItem('CartProducts', JSON.stringify(response.data.Data.Products));
                        getCartGlobalVarsF().showCartCountF();
                        if (response.data.Data.promo_suggestions != null) {
                            setPromoDetails(response.data.Data.promo_suggestions)
                        } else {
                            setPromoDetails([])
                        }
                        setLoader(false);
                        setSummeryLoader(false);

                    } else {
                        setnoData(true);
                        AsyncStorage.setItem('CartCount', JSON.stringify(0));
                        getCartGlobalVarsF().showCartCountF();
                        setLoader(false);
                        setSummeryLoader(false);


                    }
                    setLoadPromoSection(true);
                    // console.log(response.data.Data, 'cart page data')

                }
            }
        });
    }

    //#region Promo Section Starts

    const PromocodeCheck = (ApplyId) => {
        if (giftCard == '' && cardPin == '' && amount == '') {
            setGCCheckMessage('')
            setPinError(3);
        } else {
            let cardPin = cryptoJS.AES.encrypt(cardPin, "RevalKey");
            cardPin = cardPin.toString();

            var Request = {
                CardNumber: giftCard,
                CardPIN: cardPin,
            }
            api.postData(Path.gccheckbalance, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        ToggleGiftCard(response.data.Data, ApplyId);
                        setGCCheckError(false);
                    } else {
                        setPinError('');
                        setGCCheckMessage(response.data.ReturnMessage);
                    }
                }
            });

        }
    }
    const ToggleGiftCard = (Check, id) => {
        if (cardPin == "") {
            setPinError(1);
        } else if (amount == "") {
            setPinError(2)
        } else if (amount > parseFloat(data.CartSubTotalAmount)) {
            setPinError(4)
        }
        else {
            let CardPin = cryptoJS.AES.encrypt(cardPin, "RevalKey");
            let amtInCard = cryptoJS.AES.encrypt(Check.Amount.toString(), "RevalKey");
            let amt = cryptoJS.AES.encrypt(amount, "RevalKey");
            CardPin = CardPin.toString();
            AmtInCard = amtInCard.toString();
            Amt = amt.toString();
            GCGUID = generateGCid;
            AsyncStorage.setItem('GCSessionID', GCGUID);
            setGCSessionId(GCGUID);
            var Request = {
                AmountInCard: AmtInCard,
                AmountToBeRedeemed: Amt,
                CardExpiry: Check.CardExpiry,
                CardNumber: Check.Cardnumber,
                CardPIN: CardPin,
                GCSessionId: GCGUID,
                GiftCardApplyId: id == 2 ? 2 : 1,
            }
            api.postData(Path.togglegiftcard, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        if (response.data.ReturnMessage == 'Success.') {
                            if (id == 2) {
                                setRemoveCardModal(false);
                                setRemovepromo(false);
                                setShowPromo(false);
                                setRadioPromo('first');
                                setGiftCard('');
                                setCardPin('');
                                setAmount('');
                                setAmountError("");
                                setMobile('');
                                setCoupon('');
                                setPinError(0);
                                setGCCheckError(false);
                            } else {
                                setRemovepromo(true);
                            }

                            setShowPromo(false);
                            CartDeatils(GCGUID, id);

                        } else {
                            setAmountError(response.data.ReturnMessage);
                        }


                    }
                }
            });
        }
    }
    const GenerateOTP = () => {
        if (mobile == '') {
            setErrorM('Mobile No Required');
            setErr('Mobile No Required')
        } if (coupon == '') {
            setErrorC('Coupon Code Required');
            setErr('Mobile No Required')
        } else {
            AsyncStorage.setItem('CouponCode', coupon);
            let Coupon = cryptoJS.AES.encrypt(coupon, "RevalKey");

            var CouponCode = Coupon.toString();

            var GCGUID = generateGCid;
            AsyncStorage.setItem('GCSessionID', GCGUID);

            var Request = {
                CouponCode: CouponCode,
                GCSessionId: GCGUID,
                GiftCouponApplyId: 1,
                GiftCouponRequestId: "",
                Mobile: mobile,
            }
            api.postData(Path.togglegiftcard, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        if (response.data.ReturnMessage == 'Success.') {
                            setGiftRequestId(response.data.Data.GiftCouponRequestId);
                            AsyncStorage.setItem('GiftCouponRequestId', response.data.Data.GiftCouponRequestId);
                            setGiftSessionId(response.data.Data.SessionId);
                            setOtpGift(true);
                            // setShowPromo(false);
                            // CartDeatils(GCGUID);
                        } else {
                            setErrorOTP(response.data.ReturnMessage)
                        }
                    }
                }
            });
        }
    }
    const ValidateOTP = () => {
        // if (cardPin == "") {
        //     setPinError(1);
        // } else if (amount == "") {
        //     setPinError(2)
        // } else {
        if (OTPNumber == '') {
            setErrorOTP('OTP Required.');
            setErr('error');
        } else if (OTPNumber.length < 6) {
            setErrorOTP('Invalied OTP.');
            setErr('error');
        } else {
            var Request = {
                GCSessionId: giftSessionId,
                GiftCouponRequestId: giftRequestIds,
                OTP: OTPNumber,
            }
            api.postData(Path.validategiftcouponotp, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        if (response.data.ReturnMessage == 'Success.') {
                            setShowPromo(false);
                            CartDeatils(GCGUID);
                        }
                        else {
                            setErrorOTP(response.data.ReturnMessage);
                            setErr('err');
                        }
                    }
                }
            });
        }
    }
    const validateGiftCard = () => {
        let isFormValidated = true;

        let errors = {
            GiftCardErr: '',
        }


        if (giftCard == '' || giftCard == null) {
            errors.GiftCardErr = 'Enter Gift Card.'
            isFormValidated = false;
            setErrorGC(errors.GiftCardErr);
        } else if (giftCard.length < 16) {
            errors.GiftCardErr = 'Invalid Gift Card.'
            isFormValidated = false;
            setErrorGC(errors.GiftCardErr);
        } else {
            setErrorGC('');
        }
        if (isFormValidated == false) {

            setErr(errors)
            return false
        }
        return true
    }
    const validateCardPin = () => {
        let isFormValidated = true;
        let errors = {
            CardPinErr: '',
        }
        if (cardPin == '' || cardPin == null) {
            errors.CardPinErr = 'Enter Card Pin.'
            isFormValidated = false;
            setErrorCP(errors.CardPinErr);
        } else if (cardPin.length < 6) {
            errors.CardPinErr = 'Invalid Card Pin.'
            isFormValidated = false;
            setErrorCP(errors.CardPinErr);
        } else {
            setErrorCP('');
        }
        if (isFormValidated == false) {

            setErr(errors)
            return false
        }
        return true
    }
    const validatemobile = () => {
        let isFormValidated = true;
        let errors = {
            MobileErr: '',
        }
        if (mobile == '' || mobile == null) {
            errors.MobileErr = 'Enter Mobile No.'
            isFormValidated = false;
            setErrorM(errors.MobileErr);
        } else if (mobile.length < 10) {
            errors.MobileErr = 'Invalid Mobile No.'
            isFormValidated = false;
            setErrorM(errors.MobileErr);
        } else {
            setErrorM('');
        }
        if (isFormValidated == false) {
            setErr(errors)
            return false
        }
        return true
    }

    const validatecoupon = () => {
        let isFormValidated = true;
        let errors = {
            CouponErr: '',
        }
        if (coupon == '' || coupon == null) {
            errors.CouponErr = 'Enter Coupon Code.'
            isFormValidated = false;
            setErrorC(errors.CouponErr);
        } else if (coupon.length < 6) {
            errors.CouponErr = 'Invalid Coupon Code.'
            isFormValidated = false;
            setErrorC(errors.CouponErr);
        } else {
            setErrorC('');
        }
        if (isFormValidated == false) {

            setErr(errors)
            return false
        }
        return true
    }
    const validateOTP = () => {
        let isFormValidated = true;
        let errors = {
            OTPErr: '',
        }
        if (OTPNumber == '' || OTPNumber == null) {
            errors.OTPErr = 'Enter OTP.'
            isFormValidated = false;
            setErrorOTP(errors.OTPErr);
        } else if (OTPNumber.length < 6) {
            errors.OTPErr = 'Invalid OTP.'
            isFormValidated = false;
            setErrorOTP(errors.OTPErr);
        } else {
            setErrorOTP('');
        }
        if (isFormValidated == false) {

            setErr(errors)
            return false
        }
        return true
    }

    const closePromo = () => {
        setShowPromo(false);
        setRadioPromo('first');
        setGiftCard('');
        setCardPin('');
        setAmount('');
        setAmountError("");
        setMobile('');
        setCoupon('');
        setPinError(0);
        setGCCheckError(false);
    }
    const PromoModel = () => {
        return (
            <Modal animationType={'slide'}
                onRequestClose={() => setShowPromo(false)}
                visible={showPromo}
                transparent={true}>
                <SafeAreaView style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15 }}>
                        <Text style={{ fontFamily: 'Roboto', color: '#876618', textAlign: 'center', paddingVertical: 10, backgroundColor: '#f5f1e8', fontSize: 20, }}>Apply Promo Code</Text>
                        <TouchableOpacity
                            testID={'btnmodalclose'} onPress={() => closePromo()} style={{ right: -16, top: -16, position: 'absolute' }}>
                            <Ionicons color={'#900c19'} size={40} name={'ios-close-circle-sharp'} />
                        </TouchableOpacity>
                        {otpGift == false ?
                            (
                                <View>
                                    {/* <View>

                                        <TouchableOpacity
                                            testID={'btnradio'} onPress={() => setRadioPromo('first')} style={styles.RadioView}>
                                            <RadioButton color={'#876618'}
                                                value="first"
                                                status={radioPromo === 'first' ? 'checked' : 'unchecked'}
                                                onPress={() => setRadioPromo('first')}
                                            />
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 20,  color: '#212529' }}>Manyavar E-Gift Card</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            testID={'btnradio'} onPress={() => setRadioPromo('second')} style={styles.RadioView}>
                                            <RadioButton color={'#876618'}
                                                value="second"
                                                status={radioPromo === 'second' ? 'checked' : 'unchecked'}
                                                onPress={() => setRadioPromo('second')}
                                            />
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 20,  color: '#212529' }}>Gift-Voucher</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                    {
                                        radioPromo === 'first' && (
                                            <>
                                                <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between' }}>
                                                    <View style={styles.inputView}>
                                                        <Text style={styles.inputHeadText}>GIFT CARD*</Text>
                                                        <TextInput
                                                            testID={'txtgiftCard'}
                                                            style={styles.inputText}
                                                            onChangeText={(Txt) => setGiftCard(Txt)}
                                                            value={giftCard}
                                                            keyboardType={'number-pad'}
                                                            maxLength={16}
                                                            onBlur={() => validateGiftCard()}
                                                        />
                                                        {GCCheckError == true && (
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}>{GCCheckMessage}</Text>
                                                        )
                                                        }
                                                        {err && GCCheckError == false && <View>
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}>{errorGC}</Text>
                                                        </View>}
                                                    </View>
                                                    <View style={styles.inputView1}>
                                                        <Text style={styles.inputHeadText1}>CARDPIN*</Text>
                                                        <TextInput
                                                            testID={'txtcardPin'}
                                                            style={styles.inputText}
                                                            onChangeText={(Txt) => setCardPin(Txt)}
                                                            value={cardPin}
                                                            keyboardType={'phone-pad'}
                                                            maxLength={6}
                                                            onBlur={() => validateCardPin()}
                                                        />
                                                        {
                                                            pinError == 3 || pinError == 1 ? (
                                                                <Text testID={'lblerrormsg'} style={styles.errMsg}>Enter Gift Card Pin</Text>
                                                            ) : (<></>)
                                                        }
                                                        {
                                                            err && pinError == 0 && (
                                                                <Text testID={'lblerrormsg'} style={styles.errMsg}>{errorCP}</Text>
                                                            )
                                                        }
                                                    </View>

                                                </View>
                                                <View style={styles.inputAmtView}>
                                                    <Text style={styles.inputAmtHeadText}>REEDEM AMT*</Text>
                                                    <TextInput
                                                        testID={'txtamount'}
                                                        style={styles.inputText}
                                                        onChangeText={(Txt) => setAmount(Txt)}
                                                        value={amount}
                                                        keyboardType={'number-pad'}
                                                    />
                                                    {
                                                        pinError == 3 || pinError == 2 ? (
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}>Enter Amount</Text>
                                                        ) : (<></>)
                                                    }
                                                    {
                                                        pinError == 4 ? (
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}> Gift Card Amount cannot be greater than cart amount.</Text>
                                                        ) : (<></>)
                                                    }

                                                </View>
                                                <TouchableOpacity
                                                    testID={'btngiftcard'} style={{ marginVertical: 20 }} onPress={() => PromocodeCheck()} >

                                                    {/* <ButtonCustom Title={'REDEEM GIFT CARD'} /> */}
                                                </TouchableOpacity>
                                                {amountError != "" && (
                                                    <Text style={{ fontFamily: 'Roboto', color: 'red', fontSize: 12, textAlign: 'center', top: -25 }}>{amountError}</Text>
                                                )}
                                            </>
                                        )
                                    }
                                    {
                                        radioPromo === 'second' && (
                                            <>
                                                <View style={[styles.inputAmtView, { marginVertical: 30 }]}>
                                                    <Text style={styles.inputAmtHeadText}>MOBILE NO.*</Text>
                                                    <TextInput
                                                        testID={'txtmobile'}
                                                        style={styles.inputText}
                                                        onChangeText={(Txt) => setMobile(Txt)}
                                                        value={mobile}
                                                        maxLength={10}
                                                        keyboardType={'number-pad'}
                                                        onBlur={() => validatemobile()}
                                                    />
                                                    {
                                                        err && (
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}>{errorM}</Text>
                                                        )
                                                    }
                                                </View>


                                                <View style={styles.inputAmtView}>
                                                    <Text style={styles.inputAmtHeadText}>COUPON CODE</Text>
                                                    <TextInput
                                                        testID={'txtcouponCode'}
                                                        style={styles.inputText}
                                                        onChangeText={(Txt) => setCoupon(Txt)}
                                                        value={coupon}
                                                        keyboardType={'default'}
                                                        onBlur={() => validatecoupon()}
                                                    />
                                                    {
                                                        err && (
                                                            <Text testID={'lblerrormsg'} style={styles.errMsg}>{errorC}</Text>
                                                        )
                                                    }
                                                </View>
                                                <TouchableOpacity
                                                    testID={'btngenerateOTP'} style={{ marginVertical: 20 }} onPress={() => GenerateOTP()}>
                                                    {/* <ButtonCustom Title={'GENERATE OTP & REDEEM'} /> */}
                                                </TouchableOpacity>
                                            </>
                                        )
                                    }
                                </View>
                            ) :
                            (
                                <View>
                                    <Text style={{ fontFamily: 'Roboto', paddingVertical: 15, textAlign: 'center', color: '#212529', }}>Gift-Voucher</Text>
                                    <View style={styles.inputAmtView}>
                                        <Text style={[styles.inputAmtHeadText, { marginRight: w / 2.5 }]}>SEND OTP & REDEEM</Text>
                                        <TextInput
                                            testID={'txtOTPNumber'}
                                            style={styles.inputText}
                                            onChangeText={(Txt) => setOTPNumber(Txt)}
                                            value={OTPNumber}
                                            maxLength={6}
                                            keyboardType={'number-pad'}
                                            onBlur={() => validateOTP()}
                                        />
                                        {
                                            err && (
                                                <Text testID={'lblerrormsg'} style={styles.errMsg}>{errorOTP}</Text>
                                            )
                                        }
                                    </View>
                                    <TouchableOpacity
                                        testID={'btnsendOTP'} style={{ marginVertical: 20 }} onPress={() => ValidateOTP()}>
                                        {/* <ButtonCustom Title={'SEND OTP & REDEEM'} /> */}
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        );

    }

    const selectSizeModal = (item) => {
        return (
            <Modal animationType={'slide'}
                onRequestClose={() => setSizeModal(false)}
                visible={sizeModal}
                transparent={true}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15, height: 'auto' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: '#000', fontWeight: '700' }}>Select Size*</Text>
                                <TouchableOpacity
                                    testID={'btnclosemodal'} onPress={() => setSizeModal(false)} style={{ right: -16, top: -16, position: 'absolute' }}>
                                    <Ionicons color={'#000'} size={40} name={'ios-close-circle-sharp'} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {item.Sizes != '' && item.Sizes != null && item.Sizes != undefined && (
                                    <>
                                        {item.Sizes.map((sizes) => (
                                            <TouchableOpacity
                                                testID={'btnSizeChange'} onPress={() => SizeChange(sizes, item)}>
                                                <Text style={{ fontFamily: 'Roboto', paddingVertical: 10, paddingHorizontal: 20, color: '#000', fontWeight: '500' }}>{sizes.SizeName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        )
    }
    const QuantityData = () => {
        let Data = Array.from({ length: 10 }, (_, i) => i + 1)
        setQuantityData(Data)
    }
    const selectQuantityModal = (cartData) => {
        return (
            <Modal animationType={'slide'}
                onRequestClose={() => setQuantityModal(false)}
                visible={quantityModal}
                transparent={true}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15, height: 'auto' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: '#000', fontWeight: '700' }}>Select Quantity*</Text>
                                <TouchableOpacity
                                    testID={'btnclosemodal'} onPress={() => setQuantityModal(false)} style={{ right: -16, top: -16, position: 'absolute' }}>
                                    <Ionicons color={'#000'} size={40} name={'ios-close-circle-sharp'} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {quantityData != '' && quantityData != null && quantityData != undefined && (
                                    <>
                                        {quantityData.map((item) => (
                                            <TouchableOpacity
                                                testID={'btnSizeChange'} onPress={() => quantityAdd(item, cartData)}>
                                                <Text style={{ fontFamily: 'Roboto', paddingVertical: 10, paddingHorizontal: 20, color: '#000', fontWeight: '500' }}>{item}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        )
    }
    //#endregion Promo Section Close

    const SelectedEvent = (name, index, item) => {
        if (item.AvailableQuantity == 0) {
            console.log('AvailableQuantity------------->', item.AvailableQuantity)
            null
        } else {
            console.log('AvailableQuantity------------->', item.AvailableQuantity)
            if (name !== 'itemSelected') return;
            setSelectIndex(cartData[index]);
            setSelectName(cartData[index].ProductTitle);
            setSizeModal(true);
        }
    }
    const SizeChange = (sizes, item) => {
        let Name = sizes.SizeName;
        var Request = {
            BasketGUID: CartGuid,
            BasketProductId: item.BasketProductId,
            CurrentProductQuantity: item.StoreQuantity,
            DeviceType: 1,
            IsMobileDevice: true,
            OfferId: "",
            PreviousProductQuantity: item.StoreQuantity,
            ProductUrl: item.ProductUrl,
            SKU: item.SKU,
            Sizename: Name
        }
        api.postData(Path.updatecart, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    CartDeatils();
                    setSizeModal(false);
                }
            }
        });

    }
    const SelectedquantityEvent = (name, index, item) => {
        if (item.AvailableQuantity == 0) {
            null
            console.log('item.AvailableQuantity====>', item.AvailableQuantity)
        } else {
            if (name !== 'itemSelected') return;
            setSelectIndex(cartData[index]);
            setSelectName(cartData[index].ProductTitle);
            let Data = Array.from({ length: cartData[index].AvailableQuantity }, (_, i) => i + 1)
            setQuantityData(Data)
            setQuantityModal(true);

        }
    }

    const quantityAdd = (item, data) => {
        setQuantityModal(false);
        setShowQuantityError('');
        setSelectName(data.ProductTitle);
        let qty = parseFloat(data.StoreQuantity);
        // console.log(qty)
        if (data.AvailableQuantity >= item) {
            // let updataqty = qty + 1;
            var Request = {
                BasketGUID: CartGuid,
                BasketProductId: data.BasketProductId,
                CurrentProductQuantity: item,
                DeviceType: 1,
                IsMobileDevice: true,
                OfferId: "",
                PreviousProductQuantity: qty,
                ProductUrl: data.ProductUrl,
                SKU: data.SKU,
                Sizename: data.Size
            }
            api.postData(Path.updatecart, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        CartDeatils();
                    }
                }
            });
        } else {
            setShowQuantityError('');
        }

    }
    const RemoveCart = async () => {
        // setRemoveItemCartModal(true);

        var Request = {
            BasketGUID: CartGuid,
            BasketProductId: RemoveItem.BasketProductId,
            CurrentProductQuantity: RemoveItem.StoreQuantity,
            CustomerToken: customerToken,
            DeviceType: 2,
            IsMobileDevice: true,
            OfferId: "",
            PreviousProductQuantity: RemoveItem.TotalPreviousQuantity,
            ProductUrl: RemoveItem.ProductUrl,
            SKU: RemoveItem.SKU,
            Sizename: RemoveItem.Size,

        }
        api.postData(Path.removecartitem, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    setHeart(true);
                    setResponseMessage(response.data.ReturnMessage);
                    setRemoveItemCartModal(false);
                    setRemoveFromCart(response.data.ReturnMessage)
                    setTimeout(() => {
                        setRemoveFromCart('')
                    }, 5000);
                }
            }
        });
        // }

    }

    const AddWishListAfterLogin = async () => {
        let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        if (CustomerToken != null) {
            let productURL = await AsyncStorage.getItem('wishlistProductURL');
            let sizeProduct = await AsyncStorage.getItem('ProductSize');
            let basketProductId = await AsyncStorage.getItem('BasketProductId');
            let basketGUID = await AsyncStorage.getItem('BasketGuid');

            var Request = {
                ProductUrl: productURL,
                Sizename: sizeProduct,
            }
            api.postData(Path.addwishlist, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data.ReturnMessage == 'Please login or register\r\n.'
                    ) {
                        navigation.navigate('Loginwithotp', { pagefrom: 'Cart' })
                    } else {
                        var Request = {
                            BasketGUID: basketGUID,
                            BasketProductId: basketProductId,
                            ProductUrl: productURL,
                            SizeName: sizeProduct,
                        }
                        api.postData(Path.removecartitem, Request).then((response) => {
                            if (response != undefined && response != null) {
                                if (
                                    response.data != undefined &&
                                    response.data != null &&
                                    response.data != ''
                                ) {
                                    CartDeatils();
                                    //setResponseMessage(response.data.ReturnMessage);

                                }
                            }
                        });
                        setResponseMessage(response.data.ReturnMessage);

                    }
                }
            });
        }
    }
    const MoveToWishlist = (item) => {
        AsyncStorage.setItem('ProductSize', item.Size);
        AsyncStorage.setItem('BasketProductId', JSON.stringify(item.BasketProductId));

        var Request = {
            ProductUrl: item.ProductUrl,
            Sizename: item.Size,
        }
        api.postData(Path.addwishlist, Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data.ReturnMessage == 'Please login or register\r\n.'
                ) {
                    navigation.navigate('LoginScreen', { pagefrom: 'Cart' })
                } else if (response.data.ReturnCode == 116 || response.data.ReturnCode == 114) {
                    var Request = {
                        BasketGUID: CartGuid,
                        BasketProductId: item.BasketProductId,
                        ProductUrl: item.ProductUrl,
                        SizeName: item.Size,
                    }
                    var Request = {
                        BasketGUID: CartGuid,
                        BasketProductId: item.BasketProductId,
                        CurrentProductQuantity: item.StoreQuantity,
                        CustomerToken: customerToken,
                        DeviceType: 2,
                        IsMobileDevice: true,
                        OfferId: "",
                        PreviousProductQuantity: item.TotalPreviousQuantity,
                        ProductUrl: item.ProductUrl,
                        SKU: item.SKU,
                        Sizename: item.Size,

                    }
                    api.postData(Path.removecartitem, Request).then((response) => {
                        if (response != undefined && response != null) {
                            if (
                                response.data != undefined &&
                                response.data != null &&
                                response.data != ''
                            ) {
                                setHeart(true);
                            }
                        }
                    });
                    setResponseMessage('This product added to wishlist.');

                } else {
                    setResponseMessage('This product added to wishlist.');
                }
            }
        });
    }
    const cartItemRemove = (item) => {
        setRemoveItemCartModal(true);
        // return(
        //     <>
        // {ButtonToRemove(item)};
        {/* </> */ }
        setRemoveItem(item)
    }
    const ButtonToRemove = () => {
        return (
            <Modal
                onRequestClose={() => setRemoveItemCartModal(false)}
                visible={removeItemCartModal}
                transparent={true}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15 }}>
                            <Text style={{ fontFamily: 'Roboto', color: '#876618', textAlign: 'center', paddingVertical: 10, backgroundColor: '#f5f1e8', fontSize: 20, }}>Remove Item From The Shopping Cart</Text>
                            <TouchableOpacity
                                testID={'btnmodalclose'} onPress={() => setRemoveItemCartModal(false)} style={{ right: -16, top: -16, position: 'absolute' }}>
                                <Ionicons color={'#000'} size={40} name={'ios-close-circle-sharp'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'Roboto', padding: 15, paddingBottom: 0, fontSize: 16, color: '#212529', }}>Are you sure you would like to remove this item from the shopping cart?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <TouchableOpacity
                                    testID={'btnok'} style={{ marginVertical: 15 }} onPress={() => { RemoveCart() }}>
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ fontFamily: 'Roboto', color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'capitalize', paddingVertical: 10, paddingHorizontal: 20 }}>  OK  </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    testID={'btncancel'} style={{ marginVertical: 15 }} onPress={() => setRemoveItemCartModal(false)}>
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ fontFamily: 'Roboto', color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'capitalize', paddingVertical: 10, paddingHorizontal: 20 }}>Cancel</Text>
                                    </LinearGradient>
                                    {/* <ButtonCustom Title={'Cancel'} /> */}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        )
    }
    const RemoveCoupon = () => {
        return (
            <Modal animationType={'slide'}
                onRequestClose={() => setRemoveCardModal(false)}
                visible={removeCardModal}
                transparent={true}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15 }}>
                            <Text style={{ fontFamily: 'Roboto', color: '#876618', textAlign: 'center', paddingVertical: 10, backgroundColor: '#f5f1e8', fontSize: 20, }}>Remove Gift Card</Text>
                            <TouchableOpacity
                                testID={'btnmodalclose'} onPress={() => setRemoveCardModal(false)} style={{ right: -16, top: -16, position: 'absolute' }}>
                                <Ionicons color={'#900c19'} size={40} name={'ios-close-circle-sharp'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'Roboto', padding: 15, fontSize: 16, color: '#212529', }}>Are you sure you want to remove gift card</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <TouchableOpacity
                                    testID={'btnyes'} style={{ marginVertical: 20 }} onPress={() => PromocodeCheck(2)}>
                                    {/* <ButtonCustom Title={'YES'} /> */}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    testID={'btnno'} style={{ marginVertical: 20 }} onPress={() => setRemoveCardModal(false)}>
                                    {/* <ButtonCustom Title={'NO'} /> */}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }

    const ShippingModal = () => {
        return (
            <Modal animationType={'slide'}
                onRequestClose={() => setShippingTCModal(false)}
                visible={shippingTCModal}
                transparent={true}>
                <SafeAreaView style={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex: 1, justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', marginBottom: 50, marginHorizontal: 15 }}>
                        <Text style={{ fontFamily: 'Roboto', color: '#876618', textAlign: 'center', paddingVertical: 10, backgroundColor: '#f5f1e8', fontSize: 20, }}>Shipping T & C</Text>
                        <TouchableOpacity
                            testID={'btnShippingTC'} onPress={() => setShippingTCModal(false)} style={{ right: -16, top: -16, position: 'absolute' }}>
                            <Ionicons color={'#900c19'} size={40} name={'ios-close-circle-sharp'} />
                        </TouchableOpacity>
                        {/* <View style={{ padding: 5 }}>
                            <Paragraph style={{ paddingRightLeft: 5 }}>. Few countries have local taxes applicable on the products delivered from other countries. Such local taxes are in addition to the price charged by us.</Paragraph>
                            <Paragraph style={{ paddingRightLeft: 5 }}>. Such duties / taxes are paid by the courier partners with receipt from local authorities. You are requested to pay the same to courier partners at the time of delivery.</Paragraph>
                        </View> */}
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }

    const proceedToCheckOut = async () => {
        let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        if (isOutOfStock) {

        }
        else if (data != undefined && data != null && data.TotalQuantity > 25) {
            setResponseMessage('You cannot order more than 25 products (total quantity) per order.');
            setQtyErrMessage('You cannot order more than 25 products (total quantity) per order.')
        }
        else {
            navigation.push('Checkout');
            if (customerToken == null || customerToken == '') {
                navigation.navigate('Loginwithotp', { pagefrom: 'Checkout' });

            } else {
                navigation.push('Checkout');
            }
        }
        // if (!isOutOfStock) {
        //     navigation.navigate('Checkout');
        // }
    }

    const PromoCode = async () => {
        if (giftCard == '') {
            setPinError(3);
            setGCCheckMessage('')
        } else {
            let CustomerToken = await AsyncStorage.getItem('CustomerToken');
            let basketGUID = await AsyncStorage.getItem('BasketGuid');

            var Request = {
                BasketGUID: basketGUID,
                CouponCode: giftCard,
                CurrencyId: "1",
                CustomerToken: CustomerToken,
            }
            api.postData(Path.applycouponnew, Request).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        CartDeatils();
                        AsyncStorage.setItem('Promo', giftCard);
                        setGCCheckMessage('');
                        setHavePromo(true);
                    } else {
                        setPinError();
                        setGCCheckMessage(response.data.ReturnMessage);
                    }
                }
            });

        }
    }
    const PromoCodeRemove = () => {
        AsyncStorage.removeItem('Promo');
        CartDeatils();
    }
    const CallPromoCode = (callback) => {
        CartDeatils();
    }
    const navListPage = (item) => {
        navigation.push('SearchListPage', {
            search: 'Promo|' + item.promotion_id
        });
    }
    const AddWishList = async (url, size) => {
        setResponseMessage('');
        let userToken = await AsyncStorage.getItem('CustomerToken');

        let productURL = url

        if (userToken == null || userToken == '') {
            navigation.navigate('Loginwithotp', { pagefrom: 'Cart' });
            AsyncStorage.setItem('wishlistProductURL', url);

        } else {
            const RequestData = {
                "ProductUrl": productURL,
                "CustomerToken": customerToken,
                "Sizename": size,
            }

            api.postData(Path.addwishlist, RequestData).then((response) => {
                if (response != undefined && response != null) {
                    if (
                        response.data != undefined &&
                        response.data != null &&
                        response.data != ''
                    ) {
                        if (response.data.ReturnCode == 116) {
                            setWishlistIndex([...wishlistIndex, url]);
                            //setLoader(false);
                            setResponseMessage(response.data.ReturnMessage);
                            setHeart(true)
                        } else {
                            setResponseMessage(response.data.ReturnMessage);
                        }

                    }
                }
            });
        }

    }
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const RefreshFC = () => {
        CartDeatils();
        QuantityData();
        
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        RefreshFC()
        wait(1000).then(() => setRefreshing(false));
    }, []);


    if (loader == true) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <HomeHeader navigation={navigation} cart={'Cart'} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#900C19" />
                </View>
            </View>
        )
    } if (noData == true) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <HomeHeader navigation={navigation} cart={'Cart'} />
                    <Image style={{ resizeMode: 'contain', width: w, height: h / 3 }} source={require('../../asserts/empty-cart.png')} />
                    <Text style={{ fontFamily: 'Roboto', fontSize: 22, color: '#000', textAlign: 'center', fontWeight: '700' }}>Your Cart is Empty.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginTop: 30, marginHorizontal: w / 8 }} >
                        <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0 }} colors={['#EC4E43', '#F28211']}>
                            <Text style={{ fontFamily: 'Roboto', color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'capitalize', paddingVertical: 10 }}>Continue Shopping</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ paddingTop: 25 }}>
                        <Footer navigation={navigation} />
                    </View>
                   
                    {responseMessage != '' && (
                        <View style={{ height: 0 }}>
                            <InformationPopup message={responseMessage} />
                        </View>
                    )}
                </ScrollView>
                {/* {removeFromCart === 'Product is removed from cart.' ?
                    <View style={styles.addshippingErrmsg}>
                        <View style={{ width: w / 1.1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 10, borderRadius: 10 }}>
                            <AntDesign style={{ padding: 4, paddingHorizontal: 5 }} name={'infocirlceo'} color='#ff5353' size={20} />
                            <Text style={{ color: '#fff', fontSize: 14, paddingHorizontal: 5 }}>{removeFromCart}</Text>
                        </View>
                    </View>
                    : null
                } */}
                 {route.params?.wish ? (
                        <View style={{ bottom: 0 }}>
                            <Bottomtaballpages navigation={navigation} count={totalItems} />
                        </View>
                    ) : (null)}
                {
                    removeFromCart != '' && (
                        <InformationPopup message={'Product is removed from cart.'} />
                    )
                }
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
                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                        <HomeHeader navigation={navigation} cart={'Cart'} />

                        <ScrollView

                        >
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 12, borderBottomWidth: 0.5, marginHorizontal: 12 }}>
                                <Text style={{ fontFamily: 'Roboto', fontSize: 22, color: '#000', fontWeight: '700', }}>Shopping Cart </Text>
                                <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: '#000', fontWeight: '700', paddingBottom: 3 }}>{totalItems} items</Text>
                            </View>
                            {noPromoItems.map((item, index) => (
                                <View key={parseFloat(index)} style={{ marginHorizontal: 12, marginTop: 15, padding: 12, borderWidth: 1, borderColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <TouchableOpacity style={{ marginBottom:8}} 
                                                testID={'btnnavpdp'} onPress={() => navigation.push('PDP', { url: item.ProductUrl })}>
                                                <Image source={{ uri: item.ThumbnailImageUrl, }}
                                                    style={{ width: 75, height: 113, resizeMode: 'contain' }} />
                                            </TouchableOpacity>
                                            {item.AvailableQuantity == 0 ? (
                                                <Text style={{ fontSize: 12, color: 'red', fontWeight: '500' }}>Out of stock</Text>
                                            ) : (null)}
                                        </View>

                                        <View style={{ marginLeft: 12, width: w / 1.75 }}>
                                            <TouchableOpacity
                                                testID={'btnnavpdp'} style={{ borderBottomWidth: 0.5 }} onPress={() => navigation.push('PDP', { url: item.ProductUrl })}>
                                                <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#000', paddingVertical: 8 }}>{item.ProductTitle}</Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5 }}>
                                                <View style={{ paddingVertical: 10 }}>
                                                    {
                                                        item.MRP != item.UnitPrice && item.DiscountPercentage != 0 ? (
                                                            <View>
                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.UnitPrice).toFixed(2)}</Text>
                                                                <View style={{ flexDirection: 'row', alignContent: 'space-around' }} key={'discountviewmsg'}>
                                                                    <Text testID={"lblmrp"} style={styles.cardTextStrike}>{data.CurrencySymbol} {parseFloat(item.MRP).toFixed(2)}</Text>
                                                                    <Text style={styles.DiscountPercentage}> ({parseFloat(item.DiscountPercentage)})%</Text>
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <View>
                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.MRP).toFixed(2)}</Text>
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
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Color</Text>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>{item.ColorName}</Text>
                                                </View>
                                                <View >
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Size</Text>
                                                    <View>
                                                        <TouchableOpacity
                                                            testID={'btnselectsize'} onPress={() => SelectedEvent('itemSelected', index, item)} style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000', fontWeight: '500' }}>{item.Size}</Text>
                                                            <Ionicons style={{ paddingHorizontal: 5 }} color={'#000'} name={'chevron-down'} size={18} />
                                                        </TouchableOpacity>
                                                        {selectName == item.ProductTitle && (
                                                            <>
                                                                {selectSizeModal(item)}
                                                            </>
                                                        )}
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Qty</Text>
                                                    <View >
                                                        <TouchableOpacity
                                                            testID={'btnselectsize'} onPress={() => SelectedquantityEvent('itemSelected', index, item)} style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{item.AvailableQuantity >= item.StoreQuantity ? item.StoreQuantity : ''}</Text>
                                                            <Ionicons style={{ paddingHorizontal: 5 }} color={'#000'} name={'chevron-down'} size={18} />
                                                        </TouchableOpacity>
                                                        {selectName == item.ProductTitle && (
                                                            <>
                                                                {selectQuantityModal(item)}
                                                            </>
                                                        )}
                                                    </View>

                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                testID={'btnnavwishlist'} style={{ flexDirection: 'row' }} onPress={() => MoveToWishlist(item)} >
                                                {
                                                    item.AddedToWishlist == 1 ? (
                                                        <>
                                                            <FontAwesome name={'heart'} size={20} color='red' />
                                                            <Text style={{ fontSize: 12, color: '#262626', fontFamily: 'Roboto', textAlignVertical: 'center', paddingLeft: 5 }}>Move to Wishlist</Text>
                                                        </>

                                                    ) : (
                                                        <>
                                                            <FontAwesome name={'heart-o'} size={20} color='gray' />
                                                            <Text style={{ fontSize: 12, color: '#262626', fontFamily: 'Roboto', textAlignVertical: 'center', paddingLeft: 5 }}>Move to Wishlist</Text>
                                                        </>
                                                    )
                                                }
                                            </TouchableOpacity>

                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => cartItemRemove(item)} style={{ backgroundColor: '#ededed', borderRadius: 20 }}>
                                                <Ionicons style={{ padding: 3 }} name={'close-outline'} size={18} color={'#000'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {ButtonToRemove(item)}
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
                                                    <View key={parseFloat(index)} style={{ marginHorizontal: 12, padding: 12, borderWidth: 1, borderTopWidth: 0, borderColor: '#dc3545' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableOpacity
                                                                testID={'btnnavpdp'} onPress={() => navigation.push('PDP', { url: item.ProductUrl })}>
                                                                <Image source={{ uri: item.ThumbnailImageUrl, }}
                                                                    style={{ width: 75, height: 113, resizeMode: 'contain' }} />
                                                            </TouchableOpacity>
                                                            <View style={{ marginLeft: 12, width: w / 1.75 }}>
                                                                <TouchableOpacity
                                                                    testID={'btnnavpdp'} style={{ borderBottomWidth: 0.5 }} onPress={() => navigation.push('PDP', { url: item.ProductUrl })}>
                                                                    <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#000', paddingVertical: 8 }}>{item.ProductTitle}</Text>
                                                                </TouchableOpacity>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5 }}>
                                                                    <View style={{ paddingVertical: 10 }}>
                                                                        {
                                                                            item.MRP != item.UnitPrice && item.DiscountPercentage != 0 ? (
                                                                                <View>
                                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.UnitPrice).toFixed(2)}</Text>
                                                                                    <View style={{ flexDirection: 'row', alignContent: 'space-around' }} key={'discountviewmsg'}>
                                                                                        <Text testID={"lblmrp"} style={styles.cardTextStrike}>{data.CurrencySymbol} {parseFloat(item.MRP).toFixed(2)}</Text>
                                                                                        <Text style={styles.DiscountPercentage}> ({parseFloat(item.DiscountPercentage)})%</Text>
                                                                                    </View>
                                                                                </View>
                                                                            ) : (
                                                                                <View>
                                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>MRP</Text>
                                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{data.CurrencySymbol} {parseFloat(item.MRP).toFixed(2)}</Text>
                                                                                </View>
                                                                            )
                                                                        }
                                                                    </View>

                                                                    <View style={{ paddingVertical: 10, marginRight: 15 }}>
                                                                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Subtotal</Text>
                                                                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000', textDecorationLine: item.SubTotalDiscountPrice == '' ? 'none' : 'line-through', paddingRight: 4, borderRightWidth: item.SubTotalDiscountPrice == '' ? 0 : 1 }}>{data.CurrencySymbol} {parseFloat(item.SubTotalPrice).toFixed(2)}</Text>
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
                                                                        <View>
                                                                            <TouchableOpacity
                                                                                testID={'btnselectsize'} onPress={() => SelectedEvent('itemSelected', index, item)} style={{ flexDirection: 'row' }}>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000', fontWeight: '500' }}>{item.Size}</Text>
                                                                                <Ionicons style={{ paddingHorizontal: 5 }} color={'#000'} name={'chevron-down'} size={18} />
                                                                            </TouchableOpacity>
                                                                            {selectName == item.ProductTitle && (
                                                                                <>
                                                                                    {selectSizeModal(item)}
                                                                                </>
                                                                            )}
                                                                        </View>

                                                                    </View>
                                                                    <View>
                                                                        <Text style={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: '500', color: '#000' }}>Qty</Text>
                                                                        <View>
                                                                            <TouchableOpacity
                                                                                testID={'btnselectsize'} onPress={() => SelectedquantityEvent('itemSelected', index, item)} style={{ flexDirection: 'row' }}>
                                                                                <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#000' }}>{item.AvailableQuantity >= item.StoreQuantity ? item.StoreQuantity : ''}</Text>
                                                                                <Ionicons style={{ paddingHorizontal: 5 }} color={'#000'} name={'chevron-down'} size={18} />
                                                                            </TouchableOpacity>
                                                                            {selectName == item.ProductTitle && (
                                                                                <>
                                                                                    {selectQuantityModal(item)}
                                                                                </>
                                                                            )}
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                                <TouchableOpacity
                                                                    testID={'btnnavwishlist'} style={{ flexDirection: 'row' }} onPress={() => MoveToWishlist(item)} >
                                                                    {
                                                                        item.AddedToWishlist == 1 ? (
                                                                            <>
                                                                                <FontAwesome name={'heart'} size={20} color='red' />
                                                                                <Text style={{ fontSize: 12, color: '#262626', fontFamily: 'Roboto', textAlignVertical: 'center', paddingLeft: 5 }}>Move to Wishlist</Text>
                                                                            </>

                                                                        ) : (
                                                                            <>
                                                                                <FontAwesome name={'heart-o'} size={20} />
                                                                                <Text style={{ fontSize: 12, color: '#262626', fontFamily: 'Roboto', textAlignVertical: 'center', paddingLeft: 5 }}>Move to Wishlist</Text>
                                                                            </>
                                                                        )
                                                                    }
                                                                </TouchableOpacity>

                                                            </View>
                                                            <View style={{ alignItems: 'flex-end' }}>
                                                                <TouchableOpacity onPress={() => cartItemRemove(item)} style={{ backgroundColor: '#ededed', borderRadius: 20 }}>
                                                                    <Ionicons style={{ padding: 3 }} name={'close-outline'} size={18} color={'#000'} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        {/* {item.AvailableQuantity == 0 ? (
                                                            <Text style={{ fontSize: 12, color: 'red', fontWeight: '500' }}>Out of stock</Text>
                                                        ) : (null)} */}
                                                        {ButtonToRemove(item)}
                                                    </View>
                                                )}
                                                keyExtractor={(Item, index) => index.toString()} />
                                        </View>
                                    </>

                                )}
                                keyExtractor={(Item, index) => index.toString()} />

                            {data.CouponDiscountValue != '' && data.CouponDiscountValue != null && data.CouponDiscountValue != undefined ?
                                (<></>) : (
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', textAlign: 'center', fontWeight: '500', paddingVertical: 15 }}>Have a Coupon Code?</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ borderWidth: 1, borderStyle: 'dashed', width: w / 1.5, flexDirection: 'row', alignItems: 'center' }}>
                                                <TextInput
                                                    testID={'txtgiftCard'}
                                                    style={{ paddingVertical: 12, paddingLeft: 12, fontSize: 16, fontWeight: '700', flex: 1,color:'#000' }}
                                                    onChangeText={(Txt) => setGiftCard(Txt)}
                                                    placeholder={'Promo Code'}
                                                    placeholderTextColor={'#ccc'}
                                                    value={giftCard}
                                                    onBlur={() => validateGiftCard()}
                                                />
                                                {
                                                    (pinError == 3 && GCCheckMessage == "") ? (
                                                        <AntDesign style={{ paddingRight: 8 }} name={'exclamationcircleo'} size={18} color={'#c00000'} />
                                                    ) : (<></>)
                                                }
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => PromoCode()} style={{ backgroundColor: '#f4f4f4', marginLeft: 15, justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#000', fontWeight: 'bold', paddingHorizontal: 20 }}>APPLY</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            (pinError == 3 && GCCheckMessage == "") ? (
                                                <Text testID={'lblerrormsg'} style={styles.errMsg}>Please enter coupon code. </Text>
                                            ) : (<></>)
                                        }
                                        {
                                            GCCheckMessage != "" ? (
                                                <Text testID={'lblerrormsg'} style={styles.errMsg}>{GCCheckMessage}</Text>
                                            ) : (<></>)
                                        }
                                    </View>
                                )}
                            {PromoDetails.length != 0 ? (
                                <View style={{ flex: 1, marginVertical: 20, borderWidth: 1, borderColor: '#ddd', margin: 12 }}>
                                    <Text style={{ fontFamily: 'Roboto', fontSize: 20, color: '#000', fontWeight: '700', padding: 20 }}>Available Offers</Text>
                                    <View style={{ alignItems: 'center', paddingBottom: 25 }}>
                                        <View style={{ marginHorizontal: 12, borderBottomWidth: 1.5, borderBottomColor: '#ddd' }}>
                                            <View>
                                                <FlatList
                                                    data={PromoDetails}
                                                    renderItem={({ item, index }) => (
                                                        <TouchableOpacity style={{ marginTop: 6 }} testID={'btnaddtocart'} onPress={() => navListPage(item)}>
                                                            <LinearGradient style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 6, justifyContent: 'space-between', width: w / 1.25, paddingHorizontal: 15, }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ec4d46', '#f2840e']}>
                                                                <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                                                                    <Text style={{ paddingHorizontal: 2, color: '#fff', fontSize: 15 }}>Add</Text>
                                                                    <Text style={{ color: '#fff', fontSize: 15 }}>{item.extra_puchase_qty}</Text>
                                                                    <Text style={{ color: '#fff', fontSize: 15 }}> for </Text>
                                                                    <Text style={{ color: '#fff', fontSize: 15 }}>₹</Text>
                                                                    <Text style={{ color: '#fff', fontSize: 15 }}>{item.total_items_mrp}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ color: '#fff', fontSize: 15 }}>View Items</Text>
                                                                    <Ionicons name='chevron-forward' size={26} color='#fff' />
                                                                </View>
                                                            </LinearGradient>
                                                        </TouchableOpacity>
                                                    )}
                                                    keyExtractor={(Item, index) => index.toString()} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ) : (null)}
                            <View style={{ backgroundColor: '#f4f4f4', marginVertical: 20, marginHorizontal: 12 }}>
                                <View style={{ borderBottomWidth: 1, marginHorizontal: 12, borderBottomColor: '#aaa' }}>
                                    <Text style={{ fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '700' }}>SUMMARY</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, marginHorizontal: 12, borderBottomColor: '#aaa', paddingVertical: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 18, color: '#000', fontWeight: '700' }}>SUB TOTAL</Text>
                                        <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>{data.CurrencySymbol} {parseFloat(data.CartSubTotalAmount).toFixed(2)}</Text>
                                    </View>
                                    {(data.ShippingCharges != '' && data.ShippingCharges != 0) ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '700' }}>SHIPPING CHARGES</Text>
                                            <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} {parseFloat(data.ShippingCharges).toFixed(2)}</Text>
                                        </View>
                                    ) : (null)}
                                    {(data.pos_total_discount != '' && data.pos_total_discount != 0) ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '700' }}>TOTAL DISCOUNT (-)</Text>
                                            <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} (-) {parseFloat(data.pos_total_discount).toFixed(2)}</Text>
                                        </View>
                                    ) : (null)}
                                    {data.CouponDiscountValue != '' && data.CouponDiscountValue != null && data.CouponDiscountValue != undefined && (

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '700', paddingVertical: 5 }}>COUPON DISCOUNT (+)</Text>
                                                <TouchableOpacity onPress={() => PromoCodeRemove()}>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '700' }}>Remove Coupon</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {(data.ShippingCharges != '' && data.ShippingCharges != 0) ? (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '600' }}>SHIPPING CHARGES</Text>
                                                    <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} {parseFloat(data.ShippingCharges).toFixed(2)}</Text>
                                                </View>
                                            ) : (null)}
                                            {(data.pos_total_discount != '' && data.pos_total_discount != 0) ? (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 18, color: '#000', fontWeight: '600' }}>TOTAL DISCOUNT (-)</Text>
                                                    <Text testID={"lblSubtotalamount"} style={{ fontSize: 16, color: '#198754', fontWeight: '600' }}>{data.CurrencySymbol} (-) {parseFloat(data.pos_total_discount).toFixed(2)}</Text>
                                                </View>
                                            ) : (null)}

                                            {data.CouponDiscountValue != '' && data.CouponDiscountValue != null && data.CouponDiscountValue != undefined && (

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View>
                                                        <Text style={{ fontSize: 18, color: '#000', fontWeight: '600', paddingVertical: 5 }}>COUPON DISCOUNT (+)</Text>
                                                        <TouchableOpacity onPress={() => PromoCodeRemove()}>
                                                            <Text style={{ fontSize: 16, color: '#000', fontWeight: '600' }}>Remove Coupon</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text style={{ fontSize: 16, color: '#198754', fontWeight: '500', paddingTop: 12 }}>{data.CurrencySymbol} {data.CouponDiscountValue}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                                <View style={{ borderBottomWidth: 1, marginHorizontal: 12, borderBottomColor: '#aaa', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '700' }}>ORDER TOTAL</Text>
                                    <Text testID={"lblOrderTotal"} style={{ fontSize: 18, color: '#000', paddingVertical: 15, fontWeight: '600' }}>{data.CurrencySymbol} {parseFloat(data.TotalAmount).toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ marginVertical: 20, marginHorizontal: 12 }} testID={'btnnavcheckout'} onPress={() => proceedToCheckOut()}>
                                    <LinearGradient style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EC4E43', '#F28211']}>
                                        <Text style={{ fontFamily: 'Roboto', color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'capitalize', paddingVertical: 10 }}>proceed to checkout</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            {qtyErrMessage == '' ? (
                                <></>
                            ) :
                                (
                                    <View>
                                        <Text style={{ fontSize: 16, color: 'red', fontFamily: 'Roboto', fontWeight: '500', paddingHorizontal: 12 }}>{qtyErrMessage}</Text>
                                    </View>
                                )}
                            <View style={{ paddingTop: 25 }}>
                                <Footer navigation={navigation} />
                            </View>

                            {responseMessage != '' && (
                                <View style={{ height: 0, marginBottom: 60 }}>
                                    <InformationPopup message={responseMessage} />
                                </View>
                            )}


                        </ScrollView>

                        {PromoModel()}
                        {RemoveCoupon()}
                        {ShippingModal()}

                    </View>
                </ScrollView>
                {/* {route.params?.wish ? (
                    <View style={{ bottom: 0 }}>
                        <Bottomtaballpages navigation={navigation} count={totalItems} />
                    </View>
                ) : (null)} */}
                {/* {removeFromCart === 'Product is removed from cart.' ?
                    <View style={styles.addshippingErrmsg}>
                        <View style={{ width: w / 1.1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 10, borderRadius: 10 }}>
                            <AntDesign style={{ padding: 4, paddingHorizontal: 5 }} name={'infocirlceo'} color='#ff5353' size={20} />
                            <Text style={{ color: '#fff', fontSize: 14, paddingHorizontal: 5 }}>{removeFromCart}</Text>
                        </View>
                    </View>
                    : null
                } */}
                {
                    removeFromCart != '' && (
                        <InformationPopup message={'Product is removed from cart.'} />
                    )
                }
                {route.params?.wish ? (
                    <View style={{ bottom: 0 }}>
                        <Bottomtaballpages navigation={navigation} count={totalItems} />
                    </View>
                ) : (null)}

            </View>

        );
    }
}
export default CartPage;
const styles = StyleSheet.create({
    cardText: { fontSize: 13, },
    SumView: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingVertical: 12, borderBottomWidth: 0.8, borderBottomColor: '#aa8531' },
    PromoRemove: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
    SumText: { fontSize: 14, },
    Promo: { fontSize: 18, color: '#900c19', textDecorationLine: 'underline', textDecorationColor: '#900c19' },
    OrderSumView: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingVertical: 12, marginBottom: 10 },
    OrderSum: { fontSize: 18, color: '#42515b' },
    OrderSumPrice: { fontSize: 18, color: '#42515b', textAlign: 'right' },
    TaxText: { fontSize: 12, color: '#42515b', marginTop: 8 },
    BtuView: { backgroundColor: '#900c19', alignItems: 'center' },
    BtuText: { color: '#f2c452', fontSize: 18, paddingVertical: 14, },
    RadioView: { flexDirection: 'row', paddingLeft: 12, paddingTop: 10 },
    inputView: { borderWidth: 1, margin: 15, borderColor: '#89681f', width: w / 2.2, height: h / 14 },
    inputHeadText: { fontSize: 12, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginLeft: 15, marginRight: w / 5.5 },
    inputText: { fontSize: 15, color: '#000', top: Platform.OS === 'ios' ? 5 : -10, paddingLeft: 5 },
    inputView1: { borderWidth: 1, margin: 15, borderColor: '#89681f', width: w / 3.2, height: h / 14 },
    inputHeadText1: { fontSize: 12, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginHorizontal: 20 },
    inputAmtView: { borderWidth: 1, borderColor: '#89681f', height: h / 14, margin: 15 },
    inputAmtHeadText: { fontSize: 12, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginLeft: 15, marginRight: w / 2 },
    ErrorText: { marginLeft: 15, color: 'red' },
    QuantityInput: { flex: 1, textAlign: 'center', fontSize: 18, color: '#000' },
    QuantityView: { borderWidth: 1, borderColor: '#FFD700', flexDirection: 'row', marginTop: 10, marginBottom: 5 },
    errMsg: { color: '#c00000', fontSize: 13, marginTop: 10, marginHorizontal: 12, paddingVertical: 5, borderRadius: 4, paddingLeft: 12 },
    cardTextStrike: { fontSize: 12, textDecorationLine: 'line-through', color: '#000' },
    DiscountPercentage: { fontSize: 12, color: 'red' },
    OutOfStockMessage: { fontSize: 12, color: 'red', alignContent: 'center' },
    addshippingErrmsg: {
        alignItems: 'center', justifyContent: 'center', marginBottom: 20
    }

})
