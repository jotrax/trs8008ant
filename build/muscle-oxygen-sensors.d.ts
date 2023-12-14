import { SendCallback, AntPlusSensor, AntPlusScanner } from './ant';
export declare class MuscleOxygenSensor extends AntPlusSensor {
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    protected updateState(deviceId: any, data: any): void;
    private _sendTimeCmd;
    setUTCTime(cbk?: SendCallback): void;
    startSession(cbk?: SendCallback): void;
    stopSession(cbk?: SendCallback): void;
    setLap(cbk?: SendCallback): void;
}
export declare class MuscleOxygenScanner extends AntPlusScanner {
    protected deviceType(): number;
    private states;
    protected createStateIfNew(deviceId: any): void;
    protected updateRssiAndThreshold(deviceId: any, rssi: any, threshold: any): void;
    protected updateState(deviceId: any, data: any): void;
}
