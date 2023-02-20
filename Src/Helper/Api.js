const Path={
   // homePageData:'https://imgklm01.revalweb.com/LandingPageData.json',
    homePageData:'https://imgklm01.revalweb.com/uploads/LandingPageData.json',
   jwtToken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwMmQxOTUwMC02NDFjLTQ0ZmItOWI2MC00NDJiYmViMmM2MDYiLCJhaWQiOiI4QjQ4MTgzRC03QzQ5LTRDREUtQTk2OC0wNEExRjg3MEEwNUQiLCJkaWQiOiIxRUFGRUQ4MS0zOTc2LTQzOUYtODk2RC0wMUQxNEEzMjM1NEIiLCJuYmYiOjE2MTc2ODkxMTgsImV4cCI6MTYxNzc3NTUxOCwiaWF0IjoxNjE3Njg5MTE4fQ.Ug4nVb0JFeGAP2OSRyuEV0DndA6Uqv9-jxn6nyLpGHA',
   // mainPath:'https://webapi.manyavar.com/getapi/GetBanners',
    //home_Data:'https://webapi.manyavar.com/getapi/GetTemplate?DeviceType=1&TemplateURL=mobile&TemplateType=homepage',
    menu_data: '/getapi/CategoryMenu?Hierarchy=1&DeviceType=2',
    PromoOffers: 'getapi/PromoOffers',
    
    get_list:'/getapi/Products?cat1=',
    get_similar_list:'/getapi/GetSimilarProducts?sn=CPIW509-306&cn=Blue&nop=1&cat1=',
    get_offers:'/getapi/GetOfferSlotTemplate?pn=list%20page&cat1=',
    get_particular_category : '/getapi/Products?cat1=',
    //product_page:'https://webapi.manyavar.com/getapi/Products?cat1=manyavar&cat2=men&cat3=only-kurta&cat4=&pno=1&ps=12&by=popular&ctkn=&dir=&f=&nuid=&nbtid=898d0a6c-cfbb-4860-b1e7-06b97d44c0c4',
    //category page
    getmenulink:'/api/getmenulink',
    //cart page
    viewcartnew:'api/ViewCartv1',
    gccheckbalance:'/api/GCCheckBalance',
    togglegiftcard:'/api/ToggleGiftCard',
    validategiftcouponotp:'/api/ValidateGiftCouponOTP',
    updatecart:'/api/UpdateCart',
    removecartitem:'/api/RemoveCartItem',
    addwishlist:'api/AddWishList',
    applycouponnew:'/api/ApplyCouponNew',
    //checkout
    getallcountrycodes:'/getapi/GetAllCountryCodes',
    getallstates:'/api/GetAllStates?CountryId=',
    getallcitiesbystatename:'/api/GetAllCitiesByStateName',
    getcarttotalitemcount:'/api/GetCartTotalItemsCount',
    makepayment:'/api/MakePayment',
    getshippingaddress:'/api/GetShippingAddress',
    register:'/api/register',
    removeshippingaddress:'/api/RemoveShippingAddress',
    addshippingaddress:'/api/AddShippingAddress',
    loadmakepaymentgateway:'/getapi/LoadMakePaymenyGateway',
    loadmakepayment:'/api/LoadMakePayment',
    checkserviceability:'/api/CheckServiceability',
    //drawer design
    logout:'/api/Logout',
    //forgot password
    forgotpassword:'/api/ForgotPassword',
    //login page
    login:'api/Login',
    //login with otp
    generateloginotp:'/api/GenerateLoginOTP',
    verifyloginotp:'/api/VerifyLoginOTP',
    //Mainslider
    getbanners:'getapi/GetBanners',
    getnewarrivalproducts:'/getapi/GetNewArrivalProducts',
    gettrendingproducts:'/getapi/GetTrendingProducts',
    //orderdetails
    getorderdetails:'/api/GetOrderDetails',
    addcart:'/api/AddCart',
    trackorder:'/api/TrackOrder?awb=',
    //orders
    getmyorders:'/api/GetMyOrders',
    //payment
    loadmakepaymentv1:'/api/LoadMakePaymentV1?cid=1',
    //PDP
    getstorecity:'api/GetStoreCity?Ctry=',
    bookanappointment:'/api/BookanAppointment',
    getproductdetails:'/getapi/GetProductDetails?url=',
    getshopthelookdetails:'/api/GetShopTheLookDetails',
    page:'/api/Page',
    getstandarddeliverydate:'/api/GetStandardDeliveryDate',
    //Profile
    getpersonaldetails:'/api/GetPersonalDetails',
    updatepersonaldetails:'/api/UpdatePersonalDetails',
    //Searchlistpage
    searchproducts:'/getapi/SearchProducts?ctkn=',
    //storelocator
    getstorescountries:'api/GetStoresCountries?Brand=KLM&IsCountries=false',
    getstorecity:'/api/GetStoreCity',
    getstores:'/api/getStores',
    //Thankyou
    getstoreorderdetails:'/api/GetStoreOrderDetails',
    //Wishlist
    getwishlist:'/api/GetWishList',
    removewishlist:'/api/RemoveWishList',
    ProductDetailPromotions:"api/ProductDetailPromotions",

    //newapi in payment page
    viewcartv1:'/api/ViewCartv1',
    //notify
    notifyme:'/api/NotifyMe',
    //FAQ page image
    faqimg:'https://imgklm01.revalweb.com/uploads/images/',
}

export default Path
