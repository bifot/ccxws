"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MexcClient = void 0;
const crypto = __importStar(require("crypto"));
const BasicClient_1 = require("../BasicClient");
const Trade_1 = require("../Trade");
class MexcClient extends BasicClient_1.BasicClient {
    constructor({ wssPath = "wss://wbs.mexc.com/raw/ws", watcherMs, } = {}) {
        super(wssPath, "MEXC", undefined, watcherMs);
        this._pingIntervalTime = 5000;
        this.hasTickers = false; // TODO
        this.hasTrades = true;
    }
    _beforeConnect() {
        this._wss.on("connected", this._startPing.bind(this));
    }
    _startPing() {
        clearInterval(this._pingInterval);
        this._pingInterval = setInterval(this._sendPing.bind(this), this._pingIntervalTime);
    }
    _stopPing() {
        clearInterval(this._pingInterval);
    }
    _sendPing() {
        if (this._wss) {
            this._wss.send("ping");
        }
    }
    _onMessage(raw) {
        if (raw === "pong")
            return;
        try {
            this._processMessage(JSON.parse(raw));
        }
        catch (ex) {
            this._onError(ex);
        }
    }
    _processMessage(msg) {
        if (msg.channel === "push.symbol") {
            this._processTrades(msg);
            return;
        }
    }
    _processTrades(msg) {
        if (!msg.data || !msg.data.deals || !msg.data.deals.length)
            return;
        const market = this._tradeSubs.get(msg.symbol);
        if (!market)
            return;
        msg.data.deals.forEach((deal) => {
            const { t: timestamp, p: price, q: amount, T: side } = deal;
            const id = crypto
                .createHash("sha1")
                .update(`${timestamp}_${price}_${amount}_${side}`)
                .digest("base64");
            const trade = new Trade_1.Trade({
                exchange: this.name,
                base: market.base,
                quote: market.quote,
                tradeId: id,
                side: side === 1 ? "buy" : "sell",
                unix: timestamp,
                price: +price,
                amount: +amount,
                buyOrderId: null,
                sellOrderId: null,
            });
            this.emit("trade", trade, market);
        });
    }
    _sendSubTrades(remoteId) {
        this._wss.send(JSON.stringify({
            op: "sub.symbol",
            symbol: remoteId,
        }));
    }
    _sendUnsubTrades(remoteId) {
        this._wss.send(JSON.stringify({
            op: "unsub.symbol",
            symbol: remoteId,
        }));
    }
    _sendSubTicker() { }
    _sendUnsubTicker() { }
    _sendSubCandles() { }
    _sendUnsubCandles() { }
    _sendSubLevel2Snapshots() { }
    _sendUnsubLevel2Snapshots() { }
    _sendSubLevel2Updates() { }
    _sendUnsubLevel2Updates() { }
    _sendSubLevel3Snapshots() { }
    _sendUnsubLevel3Snapshots() { }
    _sendSubLevel3Updates() { }
    _sendUnsubLevel3Updates() { }
}
exports.MexcClient = MexcClient;
//# sourceMappingURL=MexcClient.js.map