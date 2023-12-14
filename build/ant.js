"use strict";
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
var events = require("events");
var usb = require("usb");
var Constants;
(function (Constants) {
    Constants[Constants["MESSAGE_RF"] = 1] = "MESSAGE_RF";
    Constants[Constants["MESSAGE_TX_SYNC"] = 164] = "MESSAGE_TX_SYNC";
    Constants[Constants["DEFAULT_NETWORK_NUMBER"] = 0] = "DEFAULT_NETWORK_NUMBER";
    // Configuration messages
    Constants[Constants["MESSAGE_CHANNEL_UNASSIGN"] = 65] = "MESSAGE_CHANNEL_UNASSIGN";
    Constants[Constants["MESSAGE_CHANNEL_ASSIGN"] = 66] = "MESSAGE_CHANNEL_ASSIGN";
    Constants[Constants["MESSAGE_CHANNEL_ID"] = 81] = "MESSAGE_CHANNEL_ID";
    Constants[Constants["MESSAGE_CHANNEL_PERIOD"] = 67] = "MESSAGE_CHANNEL_PERIOD";
    Constants[Constants["MESSAGE_CHANNEL_SEARCH_TIMEOUT"] = 68] = "MESSAGE_CHANNEL_SEARCH_TIMEOUT";
    Constants[Constants["MESSAGE_CHANNEL_FREQUENCY"] = 69] = "MESSAGE_CHANNEL_FREQUENCY";
    Constants[Constants["MESSAGE_CHANNEL_TX_POWER"] = 96] = "MESSAGE_CHANNEL_TX_POWER";
    Constants[Constants["MESSAGE_NETWORK_KEY"] = 70] = "MESSAGE_NETWORK_KEY";
    Constants[Constants["MESSAGE_TX_POWER"] = 71] = "MESSAGE_TX_POWER";
    Constants[Constants["MESSAGE_PROXIMITY_SEARCH"] = 113] = "MESSAGE_PROXIMITY_SEARCH";
    Constants[Constants["MESSAGE_ENABLE_RX_EXT"] = 102] = "MESSAGE_ENABLE_RX_EXT";
    Constants[Constants["MESSAGE_LIB_CONFIG"] = 110] = "MESSAGE_LIB_CONFIG";
    Constants[Constants["MESSAGE_CHANNEL_OPEN_RX_SCAN"] = 91] = "MESSAGE_CHANNEL_OPEN_RX_SCAN";
    // Notification messages
    Constants[Constants["MESSAGE_STARTUP"] = 111] = "MESSAGE_STARTUP";
    // Control messages
    Constants[Constants["MESSAGE_SYSTEM_RESET"] = 74] = "MESSAGE_SYSTEM_RESET";
    Constants[Constants["MESSAGE_CHANNEL_OPEN"] = 75] = "MESSAGE_CHANNEL_OPEN";
    Constants[Constants["MESSAGE_CHANNEL_CLOSE"] = 76] = "MESSAGE_CHANNEL_CLOSE";
    Constants[Constants["MESSAGE_CHANNEL_REQUEST"] = 77] = "MESSAGE_CHANNEL_REQUEST";
    // Data messages
    Constants[Constants["MESSAGE_CHANNEL_BROADCAST_DATA"] = 78] = "MESSAGE_CHANNEL_BROADCAST_DATA";
    Constants[Constants["MESSAGE_CHANNEL_ACKNOWLEDGED_DATA"] = 79] = "MESSAGE_CHANNEL_ACKNOWLEDGED_DATA";
    Constants[Constants["MESSAGE_CHANNEL_BURST_DATA"] = 80] = "MESSAGE_CHANNEL_BURST_DATA";
    // Channel event messages
    Constants[Constants["MESSAGE_CHANNEL_EVENT"] = 64] = "MESSAGE_CHANNEL_EVENT";
    // Requested response messages
    Constants[Constants["MESSAGE_CHANNEL_STATUS"] = 82] = "MESSAGE_CHANNEL_STATUS";
    //MESSAGE_CHANNEL_ID = 0x51,
    Constants[Constants["MESSAGE_VERSION"] = 62] = "MESSAGE_VERSION";
    Constants[Constants["MESSAGE_CAPABILITIES"] = 84] = "MESSAGE_CAPABILITIES";
    Constants[Constants["MESSAGE_SERIAL_NUMBER"] = 97] = "MESSAGE_SERIAL_NUMBER";
    // Message parameters
    Constants[Constants["CHANNEL_TYPE_TWOWAY_RECEIVE"] = 0] = "CHANNEL_TYPE_TWOWAY_RECEIVE";
    Constants[Constants["CHANNEL_TYPE_TWOWAY_TRANSMIT"] = 16] = "CHANNEL_TYPE_TWOWAY_TRANSMIT";
    Constants[Constants["CHANNEL_TYPE_SHARED_RECEIVE"] = 32] = "CHANNEL_TYPE_SHARED_RECEIVE";
    Constants[Constants["CHANNEL_TYPE_SHARED_TRANSMIT"] = 48] = "CHANNEL_TYPE_SHARED_TRANSMIT";
    Constants[Constants["CHANNEL_TYPE_ONEWAY_RECEIVE"] = 64] = "CHANNEL_TYPE_ONEWAY_RECEIVE";
    Constants[Constants["CHANNEL_TYPE_ONEWAY_TRANSMIT"] = 80] = "CHANNEL_TYPE_ONEWAY_TRANSMIT";
    Constants[Constants["RADIO_TX_POWER_MINUS20DB"] = 0] = "RADIO_TX_POWER_MINUS20DB";
    Constants[Constants["RADIO_TX_POWER_MINUS10DB"] = 1] = "RADIO_TX_POWER_MINUS10DB";
    Constants[Constants["RADIO_TX_POWER_0DB"] = 2] = "RADIO_TX_POWER_0DB";
    Constants[Constants["RADIO_TX_POWER_PLUS4DB"] = 3] = "RADIO_TX_POWER_PLUS4DB";
    Constants[Constants["RESPONSE_NO_ERROR"] = 0] = "RESPONSE_NO_ERROR";
    Constants[Constants["EVENT_RX_SEARCH_TIMEOUT"] = 1] = "EVENT_RX_SEARCH_TIMEOUT";
    Constants[Constants["EVENT_RX_FAIL"] = 2] = "EVENT_RX_FAIL";
    Constants[Constants["EVENT_TX"] = 3] = "EVENT_TX";
    Constants[Constants["EVENT_TRANSFER_RX_FAILED"] = 4] = "EVENT_TRANSFER_RX_FAILED";
    Constants[Constants["EVENT_TRANSFER_TX_COMPLETED"] = 5] = "EVENT_TRANSFER_TX_COMPLETED";
    Constants[Constants["EVENT_TRANSFER_TX_FAILED"] = 6] = "EVENT_TRANSFER_TX_FAILED";
    Constants[Constants["EVENT_CHANNEL_CLOSED"] = 7] = "EVENT_CHANNEL_CLOSED";
    Constants[Constants["EVENT_RX_FAIL_GO_TO_SEARCH"] = 8] = "EVENT_RX_FAIL_GO_TO_SEARCH";
    Constants[Constants["EVENT_CHANNEL_COLLISION"] = 9] = "EVENT_CHANNEL_COLLISION";
    Constants[Constants["EVENT_TRANSFER_TX_START"] = 10] = "EVENT_TRANSFER_TX_START";
    Constants[Constants["CHANNEL_IN_WRONG_STATE"] = 21] = "CHANNEL_IN_WRONG_STATE";
    Constants[Constants["CHANNEL_NOT_OPENED"] = 22] = "CHANNEL_NOT_OPENED";
    Constants[Constants["CHANNEL_ID_NOT_SET"] = 24] = "CHANNEL_ID_NOT_SET";
    Constants[Constants["CLOSE_ALL_CHANNELS"] = 25] = "CLOSE_ALL_CHANNELS";
    Constants[Constants["TRANSFER_IN_PROGRESS"] = 31] = "TRANSFER_IN_PROGRESS";
    Constants[Constants["TRANSFER_SEQUENCE_NUMBER_ERROR"] = 32] = "TRANSFER_SEQUENCE_NUMBER_ERROR";
    Constants[Constants["TRANSFER_IN_ERROR"] = 33] = "TRANSFER_IN_ERROR";
    Constants[Constants["MESSAGE_SIZE_EXCEEDS_LIMIT"] = 39] = "MESSAGE_SIZE_EXCEEDS_LIMIT";
    Constants[Constants["INVALID_MESSAGE"] = 40] = "INVALID_MESSAGE";
    Constants[Constants["INVALID_NETWORK_NUMBER"] = 41] = "INVALID_NETWORK_NUMBER";
    Constants[Constants["INVALID_LIST_ID"] = 48] = "INVALID_LIST_ID";
    Constants[Constants["INVALID_SCAN_TX_CHANNEL"] = 49] = "INVALID_SCAN_TX_CHANNEL";
    Constants[Constants["INVALID_PARAMETER_PROVIDED"] = 51] = "INVALID_PARAMETER_PROVIDED";
    Constants[Constants["EVENT_QUEUE_OVERFLOW"] = 53] = "EVENT_QUEUE_OVERFLOW";
    Constants[Constants["USB_STRING_WRITE_FAIL"] = 112] = "USB_STRING_WRITE_FAIL";
    Constants[Constants["CHANNEL_STATE_UNASSIGNED"] = 0] = "CHANNEL_STATE_UNASSIGNED";
    Constants[Constants["CHANNEL_STATE_ASSIGNED"] = 1] = "CHANNEL_STATE_ASSIGNED";
    Constants[Constants["CHANNEL_STATE_SEARCHING"] = 2] = "CHANNEL_STATE_SEARCHING";
    Constants[Constants["CHANNEL_STATE_TRACKING"] = 3] = "CHANNEL_STATE_TRACKING";
    Constants[Constants["CAPABILITIES_NO_RECEIVE_CHANNELS"] = 1] = "CAPABILITIES_NO_RECEIVE_CHANNELS";
    Constants[Constants["CAPABILITIES_NO_TRANSMIT_CHANNELS"] = 2] = "CAPABILITIES_NO_TRANSMIT_CHANNELS";
    Constants[Constants["CAPABILITIES_NO_RECEIVE_MESSAGES"] = 4] = "CAPABILITIES_NO_RECEIVE_MESSAGES";
    Constants[Constants["CAPABILITIES_NO_TRANSMIT_MESSAGES"] = 8] = "CAPABILITIES_NO_TRANSMIT_MESSAGES";
    Constants[Constants["CAPABILITIES_NO_ACKNOWLEDGED_MESSAGES"] = 16] = "CAPABILITIES_NO_ACKNOWLEDGED_MESSAGES";
    Constants[Constants["CAPABILITIES_NO_BURST_MESSAGES"] = 32] = "CAPABILITIES_NO_BURST_MESSAGES";
    Constants[Constants["CAPABILITIES_NETWORK_ENABLED"] = 2] = "CAPABILITIES_NETWORK_ENABLED";
    Constants[Constants["CAPABILITIES_SERIAL_NUMBER_ENABLED"] = 8] = "CAPABILITIES_SERIAL_NUMBER_ENABLED";
    Constants[Constants["CAPABILITIES_PER_CHANNEL_TX_POWER_ENABLED"] = 16] = "CAPABILITIES_PER_CHANNEL_TX_POWER_ENABLED";
    Constants[Constants["CAPABILITIES_LOW_PRIORITY_SEARCH_ENABLED"] = 32] = "CAPABILITIES_LOW_PRIORITY_SEARCH_ENABLED";
    Constants[Constants["CAPABILITIES_SCRIPT_ENABLED"] = 64] = "CAPABILITIES_SCRIPT_ENABLED";
    Constants[Constants["CAPABILITIES_SEARCH_LIST_ENABLED"] = 128] = "CAPABILITIES_SEARCH_LIST_ENABLED";
    Constants[Constants["CAPABILITIES_LED_ENABLED"] = 1] = "CAPABILITIES_LED_ENABLED";
    Constants[Constants["CAPABILITIES_EXT_MESSAGE_ENABLED"] = 2] = "CAPABILITIES_EXT_MESSAGE_ENABLED";
    Constants[Constants["CAPABILITIES_SCAN_MODE_ENABLED"] = 4] = "CAPABILITIES_SCAN_MODE_ENABLED";
    Constants[Constants["CAPABILITIES_PROX_SEARCH_ENABLED"] = 16] = "CAPABILITIES_PROX_SEARCH_ENABLED";
    Constants[Constants["CAPABILITIES_EXT_ASSIGN_ENABLED"] = 32] = "CAPABILITIES_EXT_ASSIGN_ENABLED";
    Constants[Constants["CAPABILITIES_FS_ANTFS_ENABLED"] = 64] = "CAPABILITIES_FS_ANTFS_ENABLED";
    Constants[Constants["TIMEOUT_NEVER"] = 255] = "TIMEOUT_NEVER";
})(Constants = exports.Constants || (exports.Constants = {}));
var Messages = /** @class */ (function () {
    function Messages() {
    }
    Messages.resetSystem = function () {
        var payload = [];
        payload.push(0x00);
        return this.buildMessage(payload, Constants.MESSAGE_SYSTEM_RESET);
    };
    Messages.requestMessage = function (channel, messageID) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload.push(messageID);
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_REQUEST);
    };
    Messages.setNetworkKey = function () {
        var payload = [];
        payload.push(Constants.DEFAULT_NETWORK_NUMBER);
        payload.push(0xB9);
        payload.push(0xA5);
        payload.push(0x21);
        payload.push(0xFB);
        payload.push(0xBD);
        payload.push(0x72);
        payload.push(0xC3);
        payload.push(0x45);
        return this.buildMessage(payload, Constants.MESSAGE_NETWORK_KEY);
    };
    Messages.assignChannel = function (channel, type) {
        if (type === void 0) { type = 'receive'; }
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        if (type === 'receive') {
            payload.push(Constants.CHANNEL_TYPE_TWOWAY_RECEIVE);
        }
        else if (type === 'receive_only') {
            payload.push(Constants.CHANNEL_TYPE_ONEWAY_RECEIVE);
        }
        else if (type === 'receive_shared') {
            payload.push(Constants.CHANNEL_TYPE_SHARED_RECEIVE);
        }
        else if (type === 'transmit') {
            payload.push(Constants.CHANNEL_TYPE_TWOWAY_TRANSMIT);
        }
        else if (type === 'transmit_only') {
            payload.push(Constants.CHANNEL_TYPE_ONEWAY_TRANSMIT);
        }
        else if (type === 'transmit_shared') {
            payload.push(Constants.CHANNEL_TYPE_SHARED_TRANSMIT);
        }
        else {
            throw 'type not allowed';
        }
        payload.push(Constants.DEFAULT_NETWORK_NUMBER);
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_ASSIGN);
    };
    Messages.setDevice = function (channel, deviceID, deviceType, transmissionType) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload = payload.concat(this.intToLEHexArray(deviceID, 2));
        payload = payload.concat(this.intToLEHexArray(deviceType));
        payload = payload.concat(this.intToLEHexArray(transmissionType));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_ID);
    };
    Messages.searchChannel = function (channel, timeout) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload = payload.concat(this.intToLEHexArray(timeout));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_SEARCH_TIMEOUT);
    };
    Messages.setPeriod = function (channel, period) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload = payload.concat(this.intToLEHexArray(period));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_PERIOD);
    };
    Messages.setFrequency = function (channel, frequency) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload = payload.concat(this.intToLEHexArray(frequency));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_FREQUENCY);
    };
    Messages.setRxExt = function () {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(0));
        payload = payload.concat(this.intToLEHexArray(1));
        return this.buildMessage(payload, Constants.MESSAGE_ENABLE_RX_EXT);
    };
    Messages.libConfig = function (channel, how) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        payload = payload.concat(this.intToLEHexArray(how));
        return this.buildMessage(payload, Constants.MESSAGE_LIB_CONFIG);
    };
    Messages.openRxScan = function () {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(0));
        payload = payload.concat(this.intToLEHexArray(1));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_OPEN_RX_SCAN);
    };
    Messages.openChannel = function (channel) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_OPEN);
    };
    Messages.closeChannel = function (channel) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_CLOSE);
    };
    Messages.unassignChannel = function (channel) {
        var payload = [];
        payload = payload.concat(this.intToLEHexArray(channel));
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_UNASSIGN);
    };
    Messages.acknowledgedData = function (channel, payload) {
        payload = this.intToLEHexArray(channel).concat(payload);
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA);
    };
    Messages.broadcastData = function (channel, payload) {
        payload = this.intToLEHexArray(channel).concat(payload);
        return this.buildMessage(payload, Constants.MESSAGE_CHANNEL_BROADCAST_DATA);
    };
    Messages.buildMessage = function (payload, msgID) {
        if (payload === void 0) { payload = []; }
        if (msgID === void 0) { msgID = 0x00; }
        var m = [];
        m.push(Constants.MESSAGE_TX_SYNC);
        m.push(payload.length);
        m.push(msgID);
        payload.forEach(function (byte) {
            m.push(byte);
        });
        m.push(this.getChecksum(m));
        return Buffer.from(m);
    };
    Messages.intToLEHexArray = function (int, numBytes) {
        if (numBytes === void 0) { numBytes = 1; }
        numBytes = numBytes || 1;
        var a = [];
        var b = Buffer.from(this.decimalToHex(int, numBytes * 2), 'hex');
        var i = b.length - 1;
        while (i >= 0) {
            a.push(b[i]);
            i--;
        }
        return a;
    };
    Messages.decimalToHex = function (d, numDigits) {
        var hex = Number(d).toString(16);
        numDigits = numDigits || 2;
        while (hex.length < numDigits) {
            hex = '0' + hex;
        }
        // console.log(hex);
        return hex;
    };
    Messages.getChecksum = function (message) {
        var checksum = 0;
        message.forEach(function (byte) {
            checksum = (checksum ^ byte) % 0xFF;
        });
        return checksum;
    };
    Messages.BUFFER_INDEX_MSG_LEN = 1;
    Messages.BUFFER_INDEX_MSG_TYPE = 2;
    Messages.BUFFER_INDEX_CHANNEL_NUM = 3;
    Messages.BUFFER_INDEX_MSG_DATA = 4;
    Messages.BUFFER_INDEX_EXT_MSG_BEGIN = 12;
    return Messages;
}());
exports.Messages = Messages;
var CancellationTokenListener = /** @class */ (function () {
    function CancellationTokenListener(fn, cb) {
        this.fn = fn;
        this.cb = cb;
        this._completed = false;
    }
    CancellationTokenListener.prototype.cancel = function () {
        if (!this._completed) {
            this._completed = true;
            // @ts-ignore
            usb.removeListener('attach', this.fn);
            this.cb(new Error('Canceled'));
        }
    };
    return CancellationTokenListener;
}());
var USBDriver = /** @class */ (function (_super) {
    __extends(USBDriver, _super);
    function USBDriver(idVendor, idProduct, dbgLevel) {
        if (dbgLevel === void 0) { dbgLevel = 0; }
        var _this = _super.call(this) || this;
        _this.idVendor = idVendor;
        _this.idProduct = idProduct;
        _this.detachedKernelDriver = false;
        _this.usedChannels = 0;
        _this.attachedSensors = [];
        _this.maxChannels = 0;
        _this.canScan = false;
        _this.setMaxListeners(50);
        usb.setDebugLevel(dbgLevel);
        return _this;
    }
    USBDriver.prototype.getDevices = function () {
        var _this = this;
        var allDevices = usb.getDeviceList();
        return allDevices
            .filter(function (d) { return d.deviceDescriptor.idVendor === _this.idVendor && d.deviceDescriptor.idProduct === _this.idProduct; })
            .filter(function (d) { return USBDriver.deviceInUse.indexOf(d) === -1; });
    };
    USBDriver.prototype.is_present = function () {
        return this.getDevices().length > 0;
    };
    USBDriver.prototype.open = function () {
        var _this = this;
        var devices = this.getDevices();
        while (devices.length) {
            try {
                this.device = devices.shift();
                this.device.open();
                this.iface = this.device.interfaces[0];
                try {
                    if (this.iface.isKernelDriverActive()) {
                        this.detachedKernelDriver = true;
                        this.iface.detachKernelDriver();
                    }
                }
                catch (_a) {
                    // Ignore kernel driver errors;
                }
                this.iface.claim();
                break;
            }
            catch (_b) {
                // Ignore the error and try with the next device, if present
                this.device.close();
                this.device = undefined;
                this.iface = undefined;
            }
        }
        if (!this.device) {
            return false;
        }
        USBDriver.deviceInUse.push(this.device);
        this.inEp = this.iface.endpoints[0];
        this.inEp.on('data', function (data) {
            if (!data.length) {
                return;
            }
            if (_this.leftover) {
                data = Buffer.concat([_this.leftover, data]);
                _this.leftover = undefined;
            }
            if (data.readUInt8(0) !== 0xA4) {
                throw 'SYNC missing';
            }
            var len = data.length;
            var beginBlock = 0;
            while (beginBlock < len) {
                if (beginBlock + 1 === len) {
                    _this.leftover = data.slice(beginBlock);
                    break;
                }
                var blockLen = data.readUInt8(beginBlock + 1);
                var endBlock = beginBlock + blockLen + 4;
                if (endBlock > len) {
                    _this.leftover = data.slice(beginBlock);
                    break;
                }
                var readData = data.slice(beginBlock, endBlock);
                _this.read(readData);
                beginBlock = endBlock;
            }
        });
        this.inEp.on('error', function (err) {
            //console.log('ERROR RECV: ', err);
        });
        this.inEp.on('end', function () {
            //console.log('STOP RECV');
        });
        this.inEp.startPoll();
        this.outEp = this.iface.endpoints[1];
        this.reset();
        return true;
    };
    USBDriver.prototype.openAsync = function (cb) {
        var _this = this;
        var ct;
        var doOpen = function () {
            try {
                var result = _this.open();
                if (result) {
                    ct._completed = true;
                    try {
                        cb(undefined);
                    }
                    catch (_a) {
                        // ignore errors
                    }
                }
                else {
                    return false;
                }
            }
            catch (err) {
                cb(err);
            }
            return true;
        };
        var fn = function (d) {
            if (!d || (d.deviceDescriptor.idVendor === _this.idVendor && d.deviceDescriptor.idProduct === _this.idProduct)) {
                if (doOpen()) {
                    // @ts-ignore
                    usb.removeListener('attach', fn);
                }
            }
        };
        usb.on('attach', fn);
        if (this.is_present()) {
            // @ts-ignore
            setImmediate(function () { return usb.emit('attach', _this.device); });
        }
        return ct = new CancellationTokenListener(fn, cb);
    };
    USBDriver.prototype.close = function () {
        var _this = this;
        this.detach_all();
        this.inEp.stopPoll(function () {
            // @ts-ignore
            _this.iface.release(true, function () {
                if (_this.detachedKernelDriver) {
                    _this.detachedKernelDriver = false;
                    try {
                        _this.iface.attachKernelDriver();
                    }
                    catch (_a) {
                        // Ignore kernel driver errors;
                    }
                }
                _this.iface = undefined;
                _this.device.reset(function () {
                    _this.device.close();
                    _this.emit('shutdown');
                    var devIdx = USBDriver.deviceInUse.indexOf(_this.device);
                    if (devIdx >= 0) {
                        USBDriver.deviceInUse.splice(devIdx, 1);
                    }
                    // @ts-ignore
                    if (usb.listenerCount('attach')) {
                        // @ts-ignore
                        usb.emit('attach', _this.device);
                    }
                    _this.device = undefined;
                });
            });
        });
    };
    USBDriver.prototype.reset = function () {
        this.detach_all();
        this.maxChannels = 0;
        this.usedChannels = 0;
        this.write(Messages.resetSystem());
    };
    USBDriver.prototype.isScanning = function () {
        return this.usedChannels === -1;
    };
    USBDriver.prototype.attach = function (sensor, forScan) {
        if (this.usedChannels < 0) {
            return false;
        }
        if (forScan) {
            if (this.usedChannels !== 0) {
                return false;
            }
            this.usedChannels = -1;
        }
        else {
            if (this.maxChannels <= this.usedChannels) {
                return false;
            }
            ++this.usedChannels;
        }
        this.attachedSensors.push(sensor);
        return true;
    };
    USBDriver.prototype.detach = function (sensor) {
        var idx = this.attachedSensors.indexOf(sensor);
        if (idx < 0) {
            return false;
        }
        if (this.usedChannels < 0) {
            this.usedChannels = 0;
        }
        else {
            --this.usedChannels;
        }
        this.attachedSensors.splice(idx, 1);
        return true;
    };
    USBDriver.prototype.detach_all = function () {
        var copy = this.attachedSensors;
        copy.forEach(function (sensor) { return sensor.detach(); });
    };
    USBDriver.prototype.write = function (data) {
        //console.log('DATA SEND: ', data);
        this.outEp.transfer(data, function (error) {
            if (error) {
                //console.log('ERROR SEND: ', error);
            }
        });
    };
    USBDriver.prototype.read = function (data) {
        //console.log('DATA RECV: ', data);
        var messageID = data.readUInt8(2);
        if (messageID === Constants.MESSAGE_STARTUP) {
            this.write(Messages.requestMessage(0, Constants.MESSAGE_CAPABILITIES));
        }
        else if (messageID === Constants.MESSAGE_CAPABILITIES) {
            this.maxChannels = data.readUInt8(3);
            this.canScan = (data.readUInt8(7) & 0x06) === 0x06;
            this.write(Messages.setNetworkKey());
        }
        else if (messageID === Constants.MESSAGE_CHANNEL_EVENT && data.readUInt8(4) === Constants.MESSAGE_NETWORK_KEY) {
            this.emit('startup', data);
        }
        else {
            this.emit('read', data);
        }
    };
    USBDriver.deviceInUse = [];
    return USBDriver;
}(events.EventEmitter));
exports.USBDriver = USBDriver;
var GarminStick2 = /** @class */ (function (_super) {
    __extends(GarminStick2, _super);
    function GarminStick2(dbgLevel) {
        if (dbgLevel === void 0) { dbgLevel = 0; }
        return _super.call(this, 0x0fcf, 0x1008, dbgLevel) || this;
    }
    return GarminStick2;
}(USBDriver));
exports.GarminStick2 = GarminStick2;
var GarminStick3 = /** @class */ (function (_super) {
    __extends(GarminStick3, _super);
    function GarminStick3(dbgLevel) {
        if (dbgLevel === void 0) { dbgLevel = 0; }
        return _super.call(this, 0x0fcf, 0x1009, dbgLevel) || this;
    }
    return GarminStick3;
}(USBDriver));
exports.GarminStick3 = GarminStick3;
var BaseSensor = /** @class */ (function (_super) {
    __extends(BaseSensor, _super);
    function BaseSensor(stick) {
        var _this = _super.call(this) || this;
        _this.stick = stick;
        _this.msgQueue = [];
        stick.on('read', _this.handleEventMessages.bind(_this));
        return _this;
    }
    BaseSensor.prototype.scan = function (type, frequency) {
        var _this = this;
        if (this.channel !== undefined) {
            throw 'already attached';
        }
        if (!this.stick.canScan) {
            throw 'stick cannot scan';
        }
        var channel = 0;
        var onStatus = function (status) {
            switch (status.msg) {
                case Constants.MESSAGE_RF:
                    switch (status.code) {
                        case Constants.EVENT_CHANNEL_CLOSED:
                        case Constants.EVENT_RX_FAIL_GO_TO_SEARCH:
                            _this.write(Messages.unassignChannel(channel));
                            return true;
                        case Constants.EVENT_TRANSFER_TX_COMPLETED:
                        case Constants.EVENT_TRANSFER_TX_FAILED:
                        case Constants.EVENT_RX_FAIL:
                        case Constants.INVALID_SCAN_TX_CHANNEL:
                            var mc = _this.msgQueue.shift();
                            if (mc && mc.cbk) {
                                mc.cbk(status.code === Constants.EVENT_TRANSFER_TX_COMPLETED);
                            }
                            if (_this.msgQueue.length) {
                                _this.write(_this.msgQueue[0].msg);
                            }
                            return true;
                        default:
                            break;
                    }
                    break;
                case Constants.MESSAGE_CHANNEL_ASSIGN:
                    _this.write(Messages.setDevice(channel, 0, 0, 0));
                    return true;
                case Constants.MESSAGE_CHANNEL_ID:
                    _this.write(Messages.setFrequency(channel, frequency));
                    return true;
                case Constants.MESSAGE_CHANNEL_FREQUENCY:
                    _this.write(Messages.setRxExt());
                    return true;
                case Constants.MESSAGE_ENABLE_RX_EXT:
                    _this.write(Messages.libConfig(channel, 0xE0));
                    return true;
                case Constants.MESSAGE_LIB_CONFIG:
                    _this.write(Messages.openRxScan());
                    return true;
                case Constants.MESSAGE_CHANNEL_OPEN_RX_SCAN:
                    process.nextTick(function () { return _this.emit('attached'); });
                    return true;
                case Constants.MESSAGE_CHANNEL_CLOSE:
                    return true;
                case Constants.MESSAGE_CHANNEL_UNASSIGN:
                    _this.statusCbk = undefined;
                    _this.channel = undefined;
                    process.nextTick(function () { return _this.emit('detached'); });
                    return true;
                case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
                    return (status.code === Constants.TRANSFER_IN_PROGRESS);
                default:
                    break;
            }
            return false;
        };
        if (this.stick.isScanning()) {
            this.channel = channel;
            this.deviceID = 0;
            this.transmissionType = 0;
            this.statusCbk = onStatus;
            process.nextTick(function () { return _this.emit('attached'); });
        }
        else if (this.stick.attach(this, true)) {
            this.channel = channel;
            this.deviceID = 0;
            this.transmissionType = 0;
            this.statusCbk = onStatus;
            this.write(Messages.assignChannel(channel, type));
        }
        else {
            throw 'cannot attach';
        }
    };
    BaseSensor.prototype.attach = function (channel, type, deviceID, deviceType, transmissionType, timeout, period, frequency) {
        var _this = this;
        if (this.channel !== undefined) {
            throw 'already attached';
        }
        if (!this.stick.attach(this, false)) {
            throw 'cannot attach';
        }
        this.channel = channel;
        this.deviceID = deviceID;
        this.transmissionType = transmissionType;
        var onStatus = function (status) {
            switch (status.msg) {
                case Constants.MESSAGE_RF:
                    switch (status.code) {
                        case Constants.EVENT_CHANNEL_CLOSED:
                        case Constants.EVENT_RX_FAIL_GO_TO_SEARCH:
                            _this.write(Messages.unassignChannel(channel));
                            return true;
                        case Constants.EVENT_TRANSFER_TX_COMPLETED:
                        case Constants.EVENT_TRANSFER_TX_FAILED:
                        case Constants.EVENT_RX_FAIL:
                        case Constants.INVALID_SCAN_TX_CHANNEL:
                            var mc = _this.msgQueue.shift();
                            if (mc && mc.cbk) {
                                mc.cbk(status.code === Constants.EVENT_TRANSFER_TX_COMPLETED);
                            }
                            if (_this.msgQueue.length) {
                                _this.write(_this.msgQueue[0].msg);
                            }
                            return true;
                        default:
                            break;
                    }
                    break;
                case Constants.MESSAGE_CHANNEL_ASSIGN:
                    _this.write(Messages.setDevice(channel, deviceID, deviceType, transmissionType));
                    return true;
                case Constants.MESSAGE_CHANNEL_ID:
                    _this.write(Messages.searchChannel(channel, timeout));
                    return true;
                case Constants.MESSAGE_CHANNEL_SEARCH_TIMEOUT:
                    _this.write(Messages.setFrequency(channel, frequency));
                    return true;
                case Constants.MESSAGE_CHANNEL_FREQUENCY:
                    _this.write(Messages.setPeriod(channel, period));
                    return true;
                case Constants.MESSAGE_CHANNEL_PERIOD:
                    _this.write(Messages.libConfig(channel, 0xE0));
                    return true;
                case Constants.MESSAGE_LIB_CONFIG:
                    _this.write(Messages.openChannel(channel));
                    return true;
                case Constants.MESSAGE_CHANNEL_OPEN:
                    process.nextTick(function () { return _this.emit('attached'); });
                    return true;
                case Constants.MESSAGE_CHANNEL_CLOSE:
                    return true;
                case Constants.MESSAGE_CHANNEL_UNASSIGN:
                    _this.statusCbk = undefined;
                    _this.channel = undefined;
                    process.nextTick(function () { return _this.emit('detached'); });
                    return true;
                case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
                    return (status.code === Constants.TRANSFER_IN_PROGRESS);
                default:
                    break;
            }
            return false;
        };
        this.statusCbk = onStatus;
        this.write(Messages.assignChannel(channel, type));
    };
    BaseSensor.prototype.detach = function () {
        if (this.channel === undefined) {
            return;
        }
        this.write(Messages.closeChannel(this.channel));
        if (!this.stick.detach(this)) {
            throw 'error detaching';
        }
    };
    BaseSensor.prototype.write = function (data) {
        this.stick.write(data);
    };
    BaseSensor.prototype.handleEventMessages = function (data) {
        var messageID = data.readUInt8(Messages.BUFFER_INDEX_MSG_TYPE);
        var channel = data.readUInt8(Messages.BUFFER_INDEX_CHANNEL_NUM);
        if (channel === this.channel) {
            if (messageID === Constants.MESSAGE_CHANNEL_EVENT) {
                var status_1 = {
                    msg: data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA),
                    code: data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 1),
                };
                var handled = this.statusCbk && this.statusCbk(status_1);
                if (!handled) {
                    console.log('Unhandled event: ' + data.toString('hex'));
                    this.emit('eventData', {
                        message: data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA),
                        code: data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 1),
                    });
                }
            }
            else if (this.decodeDataCbk) {
                this.decodeDataCbk(data);
            }
        }
    };
    BaseSensor.prototype.send = function (data, cbk) {
        this.msgQueue.push({ msg: data, cbk: cbk });
        if (this.msgQueue.length === 1) {
            this.write(data);
        }
    };
    return BaseSensor;
}(events.EventEmitter));
exports.BaseSensor = BaseSensor;
var AntPlusBaseSensor = /** @class */ (function (_super) {
    __extends(AntPlusBaseSensor, _super);
    function AntPlusBaseSensor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AntPlusBaseSensor.prototype.scan = function (type) {
        return _super.prototype.scan.call(this, type, 57);
    };
    AntPlusBaseSensor.prototype.attach = function (channel, type, deviceID, deviceType, transmissionType, timeout, period) {
        return _super.prototype.attach.call(this, channel, type, deviceID, deviceType, transmissionType, timeout, period, 57);
    };
    return AntPlusBaseSensor;
}(BaseSensor));
exports.AntPlusBaseSensor = AntPlusBaseSensor;
var AntPlusSensor = /** @class */ (function (_super) {
    __extends(AntPlusSensor, _super);
    function AntPlusSensor(stick) {
        var _this = _super.call(this, stick) || this;
        _this.decodeDataCbk = _this.decodeData.bind(_this);
        return _this;
    }
    AntPlusSensor.prototype.scan = function () {
        throw 'scanning unsupported';
    };
    AntPlusSensor.prototype.attach = function (channel, type, deviceID, deviceType, transmissionType, timeout, period) {
        return _super.prototype.attach.call(this, channel, type, deviceID, deviceType, transmissionType, timeout, period);
    };
    AntPlusSensor.prototype.decodeData = function (data) {
        switch (data.readUInt8(Messages.BUFFER_INDEX_MSG_TYPE)) {
            case Constants.MESSAGE_CHANNEL_BROADCAST_DATA:
            case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
            case Constants.MESSAGE_CHANNEL_BURST_DATA:
                if (this.deviceID === 0) {
                    this.write(Messages.requestMessage(this.channel, Constants.MESSAGE_CHANNEL_ID));
                }
                this.updateState(this.deviceID, data);
                break;
            case Constants.MESSAGE_CHANNEL_ID:
                this.deviceID = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA);
                this.transmissionType = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                break;
            default:
                break;
        }
    };
    return AntPlusSensor;
}(AntPlusBaseSensor));
exports.AntPlusSensor = AntPlusSensor;
var AntPlusScanner = /** @class */ (function (_super) {
    __extends(AntPlusScanner, _super);
    function AntPlusScanner(stick) {
        var _this = _super.call(this, stick) || this;
        _this.decodeDataCbk = _this.decodeData.bind(_this);
        return _this;
    }
    AntPlusScanner.prototype.scan = function () {
        return _super.prototype.scan.call(this, 'receive');
    };
    AntPlusScanner.prototype.attach = function () {
        throw 'attach unsupported';
    };
    AntPlusScanner.prototype.send = function () {
        throw 'send unsupported';
    };
    AntPlusScanner.prototype.decodeData = function (data) {
        if (data.length <= (Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 3) || !(data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN) & 0x80)) {
            console.log('wrong message format', data.toString('hex'));
            return;
        }
        var deviceId = data.readUInt16LE(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 1);
        var deviceType = data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 3);
        if (deviceType !== this.deviceType()) {
            return;
        }
        this.createStateIfNew(deviceId);
        if (data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN) & 0x40) {
            if (data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 5) === 0x20) {
                this.updateRssiAndThreshold(deviceId, data.readInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 6), data.readInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 7));
            }
        }
        switch (data.readUInt8(Messages.BUFFER_INDEX_MSG_TYPE)) {
            case Constants.MESSAGE_CHANNEL_BROADCAST_DATA:
            case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
            case Constants.MESSAGE_CHANNEL_BURST_DATA:
                this.updateState(deviceId, data);
                break;
            default:
                break;
        }
    };
    return AntPlusScanner;
}(AntPlusBaseSensor));
exports.AntPlusScanner = AntPlusScanner;
//# sourceMappingURL=ant.js.map