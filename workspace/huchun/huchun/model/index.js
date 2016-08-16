zn.define([
    './Merchant',
    './MerchantDishes',
    './MerchantMenu',
    './Order',
    './OrderDetail',
    './User'
],function (Merchant, MerchantDishes, MerchantMenu, Order, OrderDetail, User){

    return {
        Merchant: Merchant,
        MerchantDishes: MerchantDishes,
        MerchantMenu: MerchantMenu,
        Order: Order,
        OrderDetail: OrderDetail,
        User: User
    }

});
