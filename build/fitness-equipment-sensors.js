"use strict";
/*
 * ANT+ profile: https://www.thisisant.com/developer/ant-plus/device-profiles/#521_tab
 * Spec sheet: https://www.thisisant.com/resources/bicycle-power/
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ant_1 = require("./ant");
var FitnessEquipmentSensorState = /** @class */ (function () {
    function FitnessEquipmentSensorState(deviceID) {
        this.PairedDevices = [];
        this.DeviceID = deviceID;
    }
    return FitnessEquipmentSensorState;
}());
var FitnessEquipmentScanState = /** @class */ (function (_super) {
    __extends(FitnessEquipmentScanState, _super);
    function FitnessEquipmentScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FitnessEquipmentScanState;
}(FitnessEquipmentSensorState));
var FitnessEquipmentSensor = /** @class */ (function (_super) {
    __extends(FitnessEquipmentSensor, _super);
    function FitnessEquipmentSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FitnessEquipmentSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, FitnessEquipmentSensor.deviceType, 0, 255, 8192);
        this.state = new FitnessEquipmentSensorState(deviceID);
    };
    FitnessEquipmentSensor.prototype.updateState = function (deviceId, data) {
        this.state.DeviceID = deviceId;
        updateState(this, this.state, data);
    };
    FitnessEquipmentSensor.prototype._setUserConfiguration = function (userWeight, bikeWeight, wheelDiameter, gearRatio, cbk) {
        var m = userWeight === undefined ? 0xFFFF : Math.max(0, Math.min(65534, Math.round(userWeight * 100)));
        var df = wheelDiameter === undefined ? 0xFF : Math.round(wheelDiameter * 10) % 10;
        var mb = bikeWeight === undefined ? 0xFFF : Math.max(0, Math.min(1000, Math.round(bikeWeight * 20)));
        var d = wheelDiameter === undefined ? 0xFF : Math.max(0, Math.min(254, Math.round(wheelDiameter)));
        var gr = gearRatio === undefined ? 0x00 : Math.max(1, Math.min(255, Math.round(gearRatio / .03)));
        var payload = [0x37, m & 0xFF, (m >> 8) & 0xFF, 0xFF, (df & 0xF) | ((mb & 0xF) << 4), (mb >> 4) & 0xF, d & 0xFF, gr & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    FitnessEquipmentSensor.prototype.setUserConfiguration = function (userWeight, bikeWeight, wheelDiameter, gearRatio, cbk) {
        if (typeof (userWeight) === 'function') {
            return this._setUserConfiguration(undefined, undefined, undefined, undefined, userWeight);
        }
        else if (typeof (bikeWeight) === 'function') {
            return this._setUserConfiguration(userWeight, undefined, undefined, undefined, bikeWeight);
        }
        else if (typeof (wheelDiameter) === 'function') {
            return this._setUserConfiguration(userWeight, bikeWeight, undefined, undefined, wheelDiameter);
        }
        else if (typeof (gearRatio) === 'function') {
            return this._setUserConfiguration(userWeight, bikeWeight, wheelDiameter, undefined, gearRatio);
        }
        else {
            return this._setUserConfiguration(userWeight, bikeWeight, wheelDiameter, gearRatio, cbk);
        }
    };
    FitnessEquipmentSensor.prototype.setBasicResistance = function (resistance, cbk) {
        var res = Math.max(0, Math.min(200, Math.round(resistance * 2)));
        var payload = [0x30, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, res & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    FitnessEquipmentSensor.prototype.setTargetPower = function (power, cbk) {
        var p = Math.max(0, Math.min(4000, Math.round(power * 4)));
        var payload = [0x31, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, p & 0xFF, (p >> 8) & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    FitnessEquipmentSensor.prototype._setWindResistance = function (windCoeff, windSpeed, draftFactor, cbk) {
        var wc = windCoeff === undefined ? 0xFF : Math.max(0, Math.min(186, Math.round(windCoeff * 100)));
        var ws = windSpeed === undefined ? 0xFF : Math.max(0, Math.min(254, Math.round(windSpeed + 127)));
        var df = draftFactor === undefined ? 0xFF : Math.max(0, Math.min(100, Math.round(draftFactor * 100)));
        var payload = [0x32, 0xFF, 0xFF, 0xFF, 0xFF, wc & 0xFF, ws & 0xFF, df & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    FitnessEquipmentSensor.prototype.setWindResistance = function (windCoeff, windSpeed, draftFactor, cbk) {
        if (typeof (windCoeff) === 'function') {
            return this._setWindResistance(undefined, undefined, undefined, windCoeff);
        }
        else if (typeof (windSpeed) === 'function') {
            return this._setWindResistance(windCoeff, undefined, undefined, windSpeed);
        }
        else if (typeof (draftFactor) === 'function') {
            return this._setWindResistance(windCoeff, windSpeed, undefined, draftFactor);
        }
        else {
            return this._setWindResistance(windCoeff, windSpeed, draftFactor, cbk);
        }
    };
    FitnessEquipmentSensor.prototype._setTrackResistance = function (slope, rollingResistanceCoeff, cbk) {
        var s = slope === undefined ? 0xFFFF : Math.max(0, Math.min(40000, Math.round((slope + 200) * 100)));
        var rr = rollingResistanceCoeff === undefined ? 0xFF : Math.max(0, Math.min(254, Math.round(rollingResistanceCoeff * 20000)));
        var payload = [0x33, 0xFF, 0xFF, 0xFF, 0xFF, s & 0xFF, (s >> 8) & 0xFF, rr & 0xFF];
        var msg = ant_1.Messages.acknowledgedData(this.channel, payload);
        this.send(msg, cbk);
    };
    FitnessEquipmentSensor.prototype.setTrackResistance = function (slope, rollingResistanceCoeff, cbk) {
        if (typeof (slope) === 'function') {
            return this._setTrackResistance(undefined, undefined, slope);
        }
        else if (typeof (rollingResistanceCoeff) === 'function') {
            return this._setTrackResistance(slope, undefined, rollingResistanceCoeff);
        }
        else {
            return this._setTrackResistance(slope, rollingResistanceCoeff, cbk);
        }
    };
    FitnessEquipmentSensor.deviceType = 0x11;
    return FitnessEquipmentSensor;
}(ant_1.AntPlusSensor));
exports.FitnessEquipmentSensor = FitnessEquipmentSensor;
var FitnessEquipmentScanner = /** @class */ (function (_super) {
    __extends(FitnessEquipmentScanner, _super);
    function FitnessEquipmentScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.states = {};
        return _this;
    }
    FitnessEquipmentScanner.prototype.deviceType = function () {
        return FitnessEquipmentSensor.deviceType;
    };
    FitnessEquipmentScanner.prototype.createStateIfNew = function (deviceId) {
        if (!this.states[deviceId]) {
            this.states[deviceId] = new FitnessEquipmentScanState(deviceId);
        }
    };
    FitnessEquipmentScanner.prototype.updateRssiAndThreshold = function (deviceId, rssi, threshold) {
        this.states[deviceId].Rssi = rssi;
        this.states[deviceId].Threshold = threshold;
    };
    FitnessEquipmentScanner.prototype.updateState = function (deviceId, data) {
        updateState(this, this.states[deviceId], data);
    };
    return FitnessEquipmentScanner;
}(ant_1.AntPlusScanner));
exports.FitnessEquipmentScanner = FitnessEquipmentScanner;
function resetState(state) {
    delete state.ElapsedTime;
    delete state.Distance;
    delete state.RealSpeed;
    delete state.VirtualSpeed;
    delete state.HeartRate;
    delete state.HeartRateSource;
    delete state.CycleLength;
    delete state.Incline;
    delete state.Resistance;
    delete state.METs;
    delete state.CaloricBurnRate;
    delete state.Calories;
    delete state._EventCount0x19;
    delete state._EventCount0x1A;
    delete state.Cadence;
    delete state.AccumulatedPower;
    delete state.InstantaneousPower;
    delete state.AveragePower;
    delete state.TrainerStatus;
    delete state.TargetStatus;
    delete state.AscendedDistance;
    delete state.DescendedDistance;
    delete state.Strides;
    delete state.Strokes;
    delete state.WheelTicks;
    delete state.WheelPeriod;
    delete state.Torque;
}
function updateState(sensor, state, data) {
    var page = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA);
    switch (page) {
        case 0x01: {
            var temperature = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            if (temperature !== 0xFF) {
                state.Temperature = -25 + temperature * 0.5;
            }
            var calBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            if (calBF & 0x40) {
                state.ZeroOffset = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            }
            if (calBF & 0x80) {
                state.SpinDownTime = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            }
            break;
        }
        case 0x10: {
            var equipmentTypeBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            switch (equipmentTypeBF & 0x1F) {
                case 19:
                    state.EquipmentType = 'Treadmill';
                    break;
                case 20:
                    state.EquipmentType = 'Elliptical';
                    break;
                case 21:
                    state.EquipmentType = 'Reserved';
                    break;
                case 22:
                    state.EquipmentType = 'Rower';
                    break;
                case 23:
                    state.EquipmentType = 'Climber';
                    break;
                case 24:
                    state.EquipmentType = 'NordicSkier';
                    break;
                case 25:
                    state.EquipmentType = 'Trainer/StationaryBike';
                    break;
                default:
                    state.EquipmentType = 'General';
                    break;
            }
            var elapsedTime = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var distance = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var speed = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var heartRate = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var capStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (heartRate !== 0xFF) {
                switch (capStateBF & 0x03) {
                    case 3: {
                        state.HeartRate = heartRate;
                        state.HeartRateSource = 'HandContact';
                        break;
                    }
                    case 2: {
                        state.HeartRate = heartRate;
                        state.HeartRateSource = 'EM';
                        break;
                    }
                    case 1: {
                        state.HeartRate = heartRate;
                        state.HeartRateSource = 'ANT+';
                        break;
                    }
                    default: {
                        delete state.HeartRate;
                        delete state.HeartRateSource;
                        break;
                    }
                }
            }
            elapsedTime /= 4;
            var oldElapsedTime = (state.ElapsedTime || 0) % 64;
            if (elapsedTime !== oldElapsedTime) {
                if (oldElapsedTime > elapsedTime) { //Hit rollover value
                    elapsedTime += 64;
                }
            }
            state.ElapsedTime = (state.ElapsedTime || 0) + elapsedTime - oldElapsedTime;
            if (capStateBF & 0x04) {
                var oldDistance = (state.Distance || 0) % 256;
                if (distance !== oldDistance) {
                    if (oldDistance > distance) { //Hit rollover value
                        distance += 256;
                    }
                }
                state.Distance = (state.Distance || 0) + distance - oldDistance;
            }
            else {
                delete state.Distance;
            }
            if (capStateBF & 0x08) {
                state.VirtualSpeed = speed / 1000;
                delete state.RealSpeed;
            }
            else {
                delete state.VirtualSpeed;
                state.RealSpeed = speed / 1000;
            }
            switch ((capStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (capStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x11: {
            var cycleLen = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var incline = data.readInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var resistance = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var capStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cycleLen !== 0xFF) {
                state.CycleLength = cycleLen / 100;
            }
            if (incline >= -10000 && incline <= 10000) {
                state.Incline = incline / 100;
            }
            if (resistance !== 0xFF) {
                state.Resistance = resistance;
            }
            switch ((capStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (capStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x12: {
            var mets = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var caloricbr = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var calories = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var capStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (mets !== 0xFFFF) {
                state.METs = mets / 100;
            }
            if (caloricbr !== 0xFFFF) {
                state.CaloricBurnRate = caloricbr / 10;
            }
            if (capStateBF & 0x01) {
                state.Calories = calories;
            }
            switch ((capStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (capStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x13: {
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var negDistance = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var posDistance = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (flagStateBF & 0x02) {
                var oldNegDistance = (state.DescendedDistance || 0) % 256;
                if (negDistance !== oldNegDistance) {
                    if (oldNegDistance > negDistance) {
                        negDistance += 256;
                    }
                }
                state.DescendedDistance = (state.DescendedDistance || 0) + negDistance - oldNegDistance;
            }
            if (flagStateBF & 0x01) {
                var oldPosDistance = (state.AscendedDistance || 0) % 256;
                if (posDistance !== oldPosDistance) {
                    if (oldPosDistance > posDistance) {
                        posDistance += 256;
                    }
                }
                state.AscendedDistance = (state.AscendedDistance || 0) + posDistance - oldPosDistance;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x14: {
            var posDistance = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var strides = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (power !== 0xFFFF) {
                state.InstantaneousPower = power;
            }
            if (flagStateBF & 0x02) {
                var oldPosDistance = (state.AscendedDistance || 0) % 256;
                if (posDistance !== oldPosDistance) {
                    if (oldPosDistance > posDistance) {
                        posDistance += 256;
                    }
                }
                state.AscendedDistance = (state.AscendedDistance || 0) + posDistance - oldPosDistance;
            }
            if (flagStateBF & 0x01) {
                var oldStrides = (state.Strides || 0) % 256;
                if (strides !== oldStrides) {
                    if (oldStrides > strides) {
                        strides += 256;
                    }
                }
                state.Strides = (state.Strides || 0) + strides - oldStrides;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x16: {
            var strokes = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (power !== 0xFFFF) {
                state.InstantaneousPower = power;
            }
            if (flagStateBF & 0x01) {
                var oldStrokes = (state.Strokes || 0) % 256;
                if (strokes !== oldStrokes) {
                    if (oldStrokes > strokes) {
                        strokes += 256;
                    }
                }
                state.Strokes = (state.Strokes || 0) + strokes - oldStrokes;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x17: {
            var strides = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (power !== 0xFFFF) {
                state.InstantaneousPower = power;
            }
            if (flagStateBF & 0x01) {
                var oldStrides = (state.Strides || 0) % 256;
                if (strides !== oldStrides) {
                    if (oldStrides > strides) {
                        strides += 256;
                    }
                }
                state.Strides = (state.Strides || 0) + strides - oldStrides;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x18: {
            var strides = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (power !== 0xFFFF) {
                state.InstantaneousPower = power;
            }
            if (flagStateBF & 0x01) {
                var oldStrides = (state.Strides || 0) % 256;
                if (strides !== oldStrides) {
                    if (oldStrides > strides) {
                        strides += 256;
                    }
                }
                state.Strides = (state.Strides || 0) + strides - oldStrides;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x19: {
            var oldEventCount = state._EventCount0x19 || 0;
            var eventCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            var cadence = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var accPower = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var power = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5) & 0xFFF;
            var trainerStatus = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6) >> 4;
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (eventCount !== oldEventCount) {
                state._EventCount0x19 = eventCount;
                if (oldEventCount > eventCount) { //Hit rollover value
                    eventCount += 255;
                }
            }
            if (cadence !== 0xFF) {
                state.Cadence = cadence;
            }
            if (power !== 0xFFF) {
                state.InstantaneousPower = power;
                var oldAccPower = (state.AccumulatedPower || 0) % 65536;
                if (accPower !== oldAccPower) {
                    if (oldAccPower > accPower) {
                        accPower += 65536;
                    }
                }
                state.AccumulatedPower = (state.AccumulatedPower || 0) + accPower - oldAccPower;
                state.AveragePower = (accPower - oldAccPower) / (eventCount - oldEventCount);
            }
            state.TrainerStatus = trainerStatus;
            switch (flagStateBF & 0x03) {
                case 0:
                    state.TargetStatus = 'OnTarget';
                    break;
                case 1:
                    state.TargetStatus = 'LowSpeed';
                    break;
                case 2:
                    state.TargetStatus = 'HighSpeed';
                    break;
                default:
                    delete state.TargetStatus;
                    break;
            }
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x1A: {
            var oldEventCount = state._EventCount0x1A || 0;
            var eventCount = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            var wheelTicks = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var accWheelPeriod = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var accTorque = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 5);
            var flagStateBF = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (eventCount !== oldEventCount) {
                state._EventCount0x1A = eventCount;
                if (oldEventCount > eventCount) { //Hit rollover value
                    eventCount += 255;
                }
            }
            var oldWheelTicks = (state.WheelTicks || 0) % 256;
            if (wheelTicks !== oldWheelTicks) {
                if (oldWheelTicks > wheelTicks) {
                    wheelTicks += 65536;
                }
            }
            state.WheelTicks = (state.WheelTicks || 0) + wheelTicks - oldWheelTicks;
            var oldWheelPeriod = (state.WheelPeriod || 0) % 256;
            if (accWheelPeriod !== oldWheelPeriod) {
                if (oldWheelPeriod > accWheelPeriod) {
                    accWheelPeriod += 65536;
                }
            }
            state.WheelPeriod = (state.WheelPeriod || 0) + accWheelPeriod - oldWheelPeriod;
            var oldTorque = (state.Torque || 0) % 256;
            if (accTorque !== oldTorque) {
                if (oldTorque > accTorque) {
                    accTorque += 65536;
                }
            }
            state.Torque = (state.Torque || 0) + accTorque - oldTorque;
            switch ((flagStateBF & 0x70) >> 4) {
                case 1:
                    state.State = 'OFF';
                    break;
                case 2:
                    state.State = 'READY';
                    resetState(state);
                    break;
                case 3:
                    state.State = 'IN_USE';
                    break;
                case 4:
                    state.State = 'FINISHED';
                    break;
                default:
                    delete state.State;
                    break;
            }
            if (flagStateBF & 0x80) {
                // lap
            }
            break;
        }
        case 0x50: {
            state.HwVersion = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            state.ManId = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            state.ModelNum = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            break;
        }
        case 0x51: {
            var swRevSup = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var swRevMain = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var serial = data.readInt32LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            state.SwVersion = swRevMain;
            if (swRevSup !== 0xFF) {
                state.SwVersion += swRevSup / 1000;
            }
            if (serial !== 0xFFFFFFFF) {
                state.SerialNumber = serial;
            }
            break;
        }
        case 0x56: {
            var idx = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 1);
            var tot = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 2);
            var chState = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 3);
            var devId = data.readUInt16LE(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 4);
            var trType = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 6);
            var devType = data.readUInt8(ant_1.Messages.BUFFER_INDEX_MSG_DATA + 7);
            if (idx === 0) {
                state.PairedDevices = [];
            }
            if (tot > 0) {
                state.PairedDevices.push({ id: devId, type: devType, paired: (chState & 0x80) ? true : false });
            }
            break;
        }
        default:
            return;
    }
    sensor.emit('fitnessData', state);
}
//# sourceMappingURL=fitness-equipment-sensors.js.map