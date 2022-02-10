import BN = require('bn.js')
const borsh = require('borsh')
import {bnToPubkey} from './utils'

type DecodeFunction = (de: any) => object

class BorshDerive {
    static get schema(): Map<any, any> {
        return new Map()
    }

    static get bnDecode(): DecodeFunction | undefined {
        return undefined
    }

    static serialize(self: any): Buffer {
        return borsh.serialize(this.schema, self)
    }

    static deserialize(buffer: Buffer | undefined) {
        if (!buffer) throw new Error('undefined buffer')

        const de = borsh.deserialize(this.schema, this, buffer)

        const callback = this.bnDecode
        if (callback != undefined) return callback(de)

        return de
    }
}

export class VotingAccountData extends BorshDerive {
    option: BN
    signer: BN

    static get schema(): Map<any, any> {
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
        ])
    }

    static get bnDecode() {
        return (de: any) => {
            return {
                option: de.option.toNumber(),
                signer: bnToPubkey(de.signer).toString(),
            }
        }
    }

    constructor(data: {
        option: BN
        signer: BN
    }) {
        super()
        this.option = data.option
        this.signer = data.signer
    }
}

export class InstructionData extends BorshDerive {
    option: BN
    bump_seed: number
    exempt_lamports: BN

    static get schema(): Map<any, any> {
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
        ])
    }

    constructor(data: {
        option: BN
        bump_seed: number
        exempt_lamports: BN
    }) {
        super()
        this.option = data.option
        this.bump_seed = data.bump_seed
        this.exempt_lamports = data.exempt_lamports
    }
}
