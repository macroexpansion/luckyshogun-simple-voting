"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWrappedNativeAccountInstructions = exports.getAssociatedTokenAccount = exports.bnToPubkey = exports.findAssociatedAccount = exports.getTokenBalance = exports.getKeypair = void 0;
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var fs = require("fs");
var getKeypair = function (path) {
    var secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(path)));
    return web3_js_1.Keypair.fromSecretKey(secretKey);
};
exports.getKeypair = getKeypair;
var getTokenBalance = function (pubkey, connection) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = parseInt;
                return [4 /*yield*/, connection.getTokenAccountBalance(pubkey)];
            case 1: return [2 /*return*/, _a.apply(void 0, [(_b.sent()).value.amount])];
        }
    });
}); };
exports.getTokenBalance = getTokenBalance;
var findAssociatedAccount = function (programId, pubkey) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, associatedPubkey, bumpSeed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('luckyshogun_voting_account'), pubkey.toBuffer()], programId)];
            case 1:
                _a = _b.sent(), associatedPubkey = _a[0], bumpSeed = _a[1];
                return [2 /*return*/, [associatedPubkey, bumpSeed]];
        }
    });
}); };
exports.findAssociatedAccount = findAssociatedAccount;
var bnToPubkey = function (bn) {
    return new web3_js_1.PublicKey(bn.toArrayLike(Buffer, 'le', 32));
};
exports.bnToPubkey = bnToPubkey;
var getAssociatedTokenAccount = function (_a) {
    var connection = _a.connection, mint = _a.mint, owner = _a.owner;
    return __awaiter(void 0, void 0, void 0, function () {
        var pubkey;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, owner)];
                case 1:
                    pubkey = _b.sent();
                    return [2 /*return*/, pubkey];
            }
        });
    });
};
exports.getAssociatedTokenAccount = getAssociatedTokenAccount;
var createWrappedNativeAccountInstructions = function (_a) {
    var connection = _a.connection, newAccount = _a.newAccount, owner = _a.owner, amount = _a.amount;
    return __awaiter(void 0, void 0, void 0, function () {
        var balanceNeeded, createAccountIx, wrapIx, initAccountIx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, spl_token_1.Token.getMinBalanceRentForExemptAccount(connection)];
                case 1:
                    balanceNeeded = _b.sent();
                    createAccountIx = web3_js_1.SystemProgram.createAccount({
                        fromPubkey: owner,
                        newAccountPubkey: newAccount,
                        lamports: balanceNeeded,
                        space: spl_token_1.AccountLayout.span,
                        programId: spl_token_1.TOKEN_PROGRAM_ID
                    });
                    wrapIx = web3_js_1.SystemProgram.transfer({
                        fromPubkey: owner,
                        toPubkey: newAccount,
                        lamports: amount,
                    });
                    initAccountIx = spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.NATIVE_MINT, newAccount, owner);
                    return [2 /*return*/, [createAccountIx, wrapIx, initAccountIx]];
            }
        });
    });
};
exports.createWrappedNativeAccountInstructions = createWrappedNativeAccountInstructions;
