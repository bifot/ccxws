"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(props) {
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
            if (!this[key])
                this[key] = props[key];
        }
    }
    get marketId() {
        return `${this.base}/${this.quote}`;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map