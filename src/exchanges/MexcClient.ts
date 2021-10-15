import * as crypto from "crypto";
import { BasicClient } from "../BasicClient";
import { ClientOptions } from "../ClientOptions";
import { Trade } from "../Trade";

export type MexcClientOptions = ClientOptions;

export class MexcClient extends BasicClient {
    protected _pingIntervalTime: number;
    protected _pingInterval: NodeJS.Timeout;

    constructor({
        wssPath = "wss://wbs.mexc.com/raw/ws",
        watcherMs,
    }: MexcClientOptions = {}) {
        super(wssPath, "MEXC", undefined, watcherMs);

        this._pingIntervalTime = 5000;

        this.hasTickers = false; // TODO
        this.hasTrades = true;
    }

    protected _beforeConnect() {
        this._wss.on("connected", this._startPing.bind(this));
    }

    protected _startPing() {
        clearInterval(this._pingInterval);

        this._pingInterval = setInterval(
            this._sendPing.bind(this),
            this._pingIntervalTime,
        );
    }

    protected _stopPing() {
        clearInterval(this._pingInterval);
    }

    protected _sendPing() {
        if (this._wss) {
            this._wss.send("ping");
        }
    }

    protected _onMessage(raw: string) {
        if (raw === "pong") return;

        try {
            this._processMessage(JSON.parse(raw));
        } catch (ex) {
            this._onError(ex);
        }
    }

    protected _processMessage(msg: {
        channel: string;
        symbol: string;
        data: any;
    }) {
        if (msg.channel === "push.symbol") {
            this._processTrades(msg);
            return;
        }
    }

    protected _processTrades(msg) {
        if (!msg.data || !msg.data.deals || !msg.data.deals.length) return;

        const market = this._tradeSubs.get(msg.symbol);

        if (!market) return;

        msg.data.deals.forEach((deal: {
            t: number;
            p: string;
            q: string;
            T: 1 | 2
        }) => {
            const { t: timestamp, p: price, q: amount, T: side } = deal;

            const id = crypto
                .createHash("sha1")
                .update(`${timestamp}_${price}_${amount}_${side}`)
                .digest("base64");

            const trade = new Trade({
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

    protected _sendSubTrades(remoteId: string) {
        this._wss.send(JSON.stringify({
            op: "sub.symbol",
            symbol: remoteId,
        }));
    }

    protected _sendUnsubTrades(remoteId: string) {
        this._wss.send(JSON.stringify({
            op: "unsub.symbol",
            symbol: remoteId,
        }));
    }

    protected _sendSubTicker() {}
    protected _sendUnsubTicker() {}

    protected _sendSubCandles() {}
    protected _sendUnsubCandles() {}

    protected _sendSubLevel2Snapshots() {}
    protected _sendUnsubLevel2Snapshots() {}

    protected _sendSubLevel2Updates() {}
    protected _sendUnsubLevel2Updates() {}

    protected _sendSubLevel3Snapshots() {}
    protected _sendUnsubLevel3Snapshots() {}

    protected _sendSubLevel3Updates() {}
    protected _sendUnsubLevel3Updates() {}
}
