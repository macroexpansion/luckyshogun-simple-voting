"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionData = exports.VotingAccountData = void 0;
var borsh = require('borsh');
var utils_1 = require("./utils");
var BorshDerive = /** @class */ (function () {
    function BorshDerive() {
    }
    Object.defineProperty(BorshDerive, "schema", {
        get: function () {
            return new Map();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BorshDerive, "bnDecode", {
        get: function () {
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    BorshDerive.serialize = function (self) {
        return borsh.serialize(this.schema, self);
    };
    BorshDerive.deserialize = function (buffer) {
        if (!buffer)
            throw new Error('undefined buffer');
        var de = borsh.deserialize(this.schema, this, buffer);
        var callback = this.bnDecode;
        if (callback != undefined)
            return callback(de);
        return de;
    };
    return BorshDerive;
}());
var VotingAccountData = /** @class */ (function (_super) {
    __extends(VotingAccountData, _super);
    function VotingAccountData(data) {
        var _this = _super.call(this) || this;
        _this.option = data.option;
        _this.signer = data.signer;
        return _this;
    }
    Object.defineProperty(VotingAccountData, "schema", {
        get: function () {
            return new Map([
                [
                    VotingAccountData,
                    {
                        kind: 'struct',
                        fields: [
                            ['option', 'u64'],
                            ['signer', 'u256'],
                        ],
                    },
                ],
            ]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VotingAccountData, "bnDecode", {
        get: function () {
            return function (de) {
                return {
                    option: de.option.toNumber(),
                    signer: (0, utils_1.bnToPubkey)(de.signer).toString(),
                };
            };
        },
        enumerable: false,
        configurable: true
    });
    return VotingAccountData;
}(BorshDerive));
exports.VotingAccountData = VotingAccountData;
var InstructionData = /** @class */ (function (_super) {
    __extends(InstructionData, _super);
    function InstructionData(data) {
        var _this = _super.call(this) || this;
        _this.option = data.option;
        _this.bump_seed = data.bump_seed;
        _this.exempt_lamports = data.exempt_lamports;
        return _this;
    }
    Object.defineProperty(InstructionData, "schema", {
        get: function () {
            return new Map([
                [
                    InstructionData,
                    {
                        kind: 'struct',
                        fields: [
                            ['option', 'u64'],
                            ['bump_seed', 'u8'],
                            ['exempt_lamports', 'u64'],
                        ],
                    },
                ],
            ]);
        },
        enumerable: false,
        configurable: true
    });
    return InstructionData;
}(BorshDerive));
exports.InstructionData = InstructionData;
