import { AntPlusSensor, AntPlusScanner } from './ant';
export declare class BicyclePowerSensor extends AntPlusSensor {
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    protected updateState(deviceId: any, data: any): void;
}
export declare class BicyclePowerScanner extends AntPlusScanner {
    protected deviceType(): number;
    private states;
    protected createStateIfNew(deviceId: any): void;
    protected updateRssiAndThreshold(deviceId: any, rssi: any, threshold: any): void;
    protected updateState(deviceId: any, data: any): void;
}
