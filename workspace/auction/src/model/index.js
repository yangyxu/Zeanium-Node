zn.define([
    './Merchant',
    './MerchantUser',
    './Coupon',
    './Message',
    './Order',
    './OrderDetail',
    './User',
    './Product',
    './ProductType'
], function (Merchant, MerchantUser, Coupon, Message, Order, OrderDetail, User, Product, ProductType){

    return {
        Merchant: Merchant,
        MerchantUser: MerchantUser,
        Coupon: Coupon,
        Message: Message,
        Order: Order,
        OrderDetail: OrderDetail,
        User: User,
        Product: Product,
        ProductType: ProductType
    }

});
