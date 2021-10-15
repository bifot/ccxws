export declare class Order {
    exchange: string;
    base: string;
    quote: string;
    orderId: string;
    status: string;
    type: string;
    orderSide: string;
    orderType: string;
    orderTime: number;
    unix: number;
    size: string;
    price: string;
    remainSize: string;
    filledSize: string;
    constructor(props: Partial<Order> | any);
    get marketId(): string;
}
