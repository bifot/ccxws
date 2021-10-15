/// <reference types="node" />
import { BasicClient } from "../BasicClient";
import { ClientOptions } from "../ClientOptions";
export declare type MexcClientOptions = ClientOptions;
export declare class MexcClient extends BasicClient {
    protected _pingIntervalTime: number;
    protected _pingInterval: NodeJS.Timeout;
    constructor({ wssPath, watcherMs, }?: MexcClientOptions);
    protected _beforeConnect(): void;
    protected _startPing(): void;
    protected _stopPing(): void;
    protected _sendPing(): void;
    protected _onMessage(raw: string): void;
    protected _processMessage(msg: {
        channel: string;
        symbol: string;
        data: any;
    }): void;
    protected _processTrades(msg: any): void;
    protected _sendSubTrades(remoteId: string): void;
    protected _sendUnsubTrades(remoteId: string): void;
    protected _sendSubTicker(): void;
    protected _sendUnsubTicker(): void;
    protected _sendSubCandles(): void;
    protected _sendUnsubCandles(): void;
    protected _sendSubLevel2Snapshots(): void;
    protected _sendUnsubLevel2Snapshots(): void;
    protected _sendSubLevel2Updates(): void;
    protected _sendUnsubLevel2Updates(): void;
    protected _sendSubLevel3Snapshots(): void;
    protected _sendUnsubLevel3Snapshots(): void;
    protected _sendSubLevel3Updates(): void;
    protected _sendUnsubLevel3Updates(): void;
}
