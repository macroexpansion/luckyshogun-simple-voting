import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
} from '@solana/web3.js'
import {
    TOKEN_PROGRAM_ID,
    Token,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import BN = require('bn.js')
import { InstructionData, VotingAccountData } from './layout'
const borsh = require('borsh')
import { findAssociatedAccount, getAssociatedTokenAccount } from './utils'

export const createVotingInstruction = async ({
    connection,
    programId = new PublicKey('9UWacH64UhTeqm7zA8g1umf2evxMKwPnekzazZs8bik3'),
    senderPubkey,
    option,
}: {
    connection: Connection
    programId?: PublicKey
    senderPubkey: PublicKey
    option: number
}): Promise<TransactionInstruction> => {
    const [votingAssociatedAccountPubkey, bumpSeed]: [PublicKey, number] =
        await findAssociatedAccount(programId, senderPubkey)
    const instructionData: InstructionData = new InstructionData({
        option: new BN(option),
        bump_seed: bumpSeed,
        exempt_lamports: new BN(
            await connection.getMinimumBalanceForRentExemption(40)
        ),
    })
    const instructionDataBuffer: Buffer =
        InstructionData.serialize(instructionData)
    const votingIx: TransactionInstruction = new TransactionInstruction({
        programId,
        keys: [
            {
                pubkey: senderPubkey,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: votingAssociatedAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            { pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: instructionDataBuffer,
    })

    return votingIx
}
