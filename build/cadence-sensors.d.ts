import { AntPlusSensor, AntPlusScanner } from './ant';
export declare class CadenceSensor extends AntPlusSensor {
    static deviceType: number;
    wheelCircumference: number;
    setWheelCircumference(wheelCircumference: number): void;
    attach(channel: any, deviceID: any): void;
    private state;
    protected updateState(deviceId: any, data: any): void;
}
export declare class CadenceScanner extends AntPlusScanner {
    protected deviceType(): number;
    wheelCircumference: number;
    setWheelCircumference(wheelCircumference: number): void;
    private states;
    protected createStateIfNew(deviceId: any): void;
    protected updateRssiAndThreshold(deviceId: any, rssi: any, threshold: any): void;
    protected updateState(deviceId: any, data: any): void;
}
