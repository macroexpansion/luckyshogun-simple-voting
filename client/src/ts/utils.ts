import {
    TOKEN_PROGRAM_ID,
    Token,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    AccountLayout
} from '@solana/spl-token'
import { SystemProgram, Connection, Keypair, PublicKey, TransactionInstruction  } from '@solana/web3.js'
import * as fs from 'fs'
import BN = require('bn.js')

export const getKeypair = (path: string): Keypair => {
    const secretKey = Uint8Array.from(
        JSON.parse(fs.readFileSync(path) as unknown as string)
    )
    return Keypair.fromSecretKey(secretKey)
}

export const getTokenBalance = async (
    pubkey: PublicKey,
    connection: Connection
): Promise<number> => {
    return parseInt(
        (await connection.getTokenAccountBalance(pubkey)).value.amount
    )
}

export const findAssociatedAccount = async (
    programId: PublicKey,
    pubkey: PublicKey
): Promise<[PublicKey, number]> => {
    const [associatedPubkey, bumpSeed] = await PublicKey.findProgramAddress(
        [Buffer.from('luckyshogun_voting_account'), pubkey.toBuffer()],
        programId
    )
    return [associatedPubkey, bumpSeed]
}

export const bnToPubkey = (bn: BN): PublicKey => {
    return new PublicKey(bn.toArrayLike(Buffer, 'le', 32))
}

export const getAssociatedTokenAccount = async ({
    connection,
    mint,
    owner,
}: {
    connection: Connection
    mint: PublicKey
    owner: PublicKey
}): Promise<PublicKey> => {
    const pubkey: PublicKey = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        owner
    )

    return pubkey
}

export const createWrappedNativeAccountInstructions = async ({
    connection,
    newAccount,
    owner,
    amount
}: {
    connection: Connection
    newAccount: PublicKey
    owner: PublicKey
    amount: number
}): Promise<[TransactionInstruction, TransactionInstruction, TransactionInstruction]> => {
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection,
    )
    const createAccountIx: TransactionInstruction = SystemProgram.createAccount({
        fromPubkey: owner,
        newAccountPubkey: newAccount,
        lamports: balanceNeeded,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID
    })
    const wrapIx: TransactionInstruction = SystemProgram.transfer({
        fromPubkey: owner,
        toPubkey: newAccount,
        lamports: amount,
    })
    const initAccountIx: TransactionInstruction = Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        NATIVE_MINT,
        newAccount,
        owner,
    )
    return [createAccountIx, wrapIx, initAccountIx]
}
