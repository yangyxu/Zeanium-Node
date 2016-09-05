zn.define([
    './Merchant',
    './MerchantDishes',
    './MerchantMenu',
    './MerchantUser',
    './Coupon',
    './Message',
    './Order',
    './OrderDetail',
    './User'
],function (Merchant, MerchantDishes, MerchantMenu, MerchantUser, Coupon, Message, Order, OrderDetail, User){

    return {
        Merchant: Merchant,
        MerchantDishes: MerchantDishes,
        MerchantMenu: MerchantMenu,
        MerchantUser: MerchantUser,
        Coupon: Coupon,
        Message: Message,
        Order: Order,
        OrderDetail: OrderDetail,
        User: User
    }

});
