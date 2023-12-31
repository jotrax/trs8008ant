import { SendCallback, AntPlusSensor, AntPlusScanner } from './ant';
export declare class FitnessEquipmentSensor extends AntPlusSensor {
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    protected updateState(deviceId: any, data: any): void;
    private _setUserConfiguration;
    setUserConfiguration(cbk: SendCallback): any;
    setUserConfiguration(userWeight: number, cbk?: SendCallback): any;
    setUserConfiguration(userWeight: number, bikeWeight: number, cbk?: SendCallback): any;
    setUserConfiguration(userWeight: number, bikeWeight: number, wheelDiameter: number, cbk?: SendCallback): any;
    setUserConfiguration(userWeight: number, bikeWeight: number, wheelDiameter: number, gearRatio: number, cbk?: SendCallback): any;
    setBasicResistance(resistance: number, cbk?: SendCallback): void;
    setTargetPower(power: number, cbk?: SendCallback): void;
    private _setWindResistance;
    setWindResistance(cbk: SendCallback): any;
    setWindResistance(windCoeff: number, cbk?: SendCallback): any;
    setWindResistance(windCoeff: number, windSpeed: number, cbk?: SendCallback): any;
    setWindResistance(windCoeff: number, windSpeed: number, draftFactor: number, cbk?: SendCallback): any;
    private _setTrackResistance;
    setTrackResistance(cbk: SendCallback): any;
    setTrackResistance(slope: number, cbk?: SendCallback): any;
    setTrackResistance(slope: number, rollingResistanceCoeff: number, cbk?: SendCallback): any;
}
export declare class FitnessEquipmentScanner extends AntPlusScanner {
    protected deviceType(): number;
    private states;
    protected createStateIfNew(deviceId: any): void;
    protected updateRssiAndThreshold(deviceId: any, rssi: any, threshold: any): void;
    protected updateState(deviceId: any, data: any): void;
}
