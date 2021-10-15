export class Order {
    public exchange: string;
    public base: string;
    public quote: string;
    public orderId: string;
    public status: string;
    public type: string;
    public orderSide: string;
    public orderType: string;
    public orderTime: number;
    public unix: number;
    public size: string;
    public price: string;
    public remainSize: string;
    public filledSize: string;

    constructor(props: Partial<Order> | any) {
        this.exchange = props.exchange;
        this.base = props.base;
        this.quote = props.quote;
        this.orderId = props.orderId;
        this.status = props.status;
        this.type = props.type;
        this.orderSide = props.orderSide;
        this.orderType = props.orderType;
        this.orderTime = props.orderTime;
        this.unix = props.unix;
        this.size = props.size;
        this.price = props.price;
        this.remainSize = props.remainSize;
        this.filledSize = props.filledSize;

        // attach any extra props
        for (const key in props) {
            if (!this[key]) this[key] = props[key];
        }
    }

    public get marketId() {
        return `${this.base}/${this.quote}`;
    }
}
