"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const mexc = new src_1.MexcClient();
mexc.subscribeTrades({
    id: "BTC_USDT",
    base: "BTC",
    quote: "USDT",
});
mexc.on("trade", console.log);
//# sourceMappingURL=Mexc.spec.js.map