/// <reference types="node" />
import { AntPlusSensor, AntPlusScanner } from './ant';
export declare class HeartRateSensor extends AntPlusSensor {
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    private page;
    protected updateState(deviceId: number, data: Buffer): void;
}
export declare class HeartRateScanner extends AntPlusScanner {
    protected deviceType(): number;
    private states;
    private pages;
    protected createStateIfNew(deviceId: any): void;
    protected updateRssiAndThreshold(deviceId: any, rssi: any, threshold: any): void;
    protected updateState(deviceId: any, data: any): void;
}
