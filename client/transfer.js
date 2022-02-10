const BN = require('bn.js')
const { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Keypair, Transaction } = require('@solana/web3.js')
const { getBalance, VotingProgram, getKeypair, getAssociatedTokenAccount, createWrappedNativeAccountInstructions, sendAndConfirmTransaction } = require('./src')
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID, NATIVE_MINT } = require('@solana/spl-token')

const test = async () => { 
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    // const connection = new Connection('http://localhost:8899', 'confirmed')

    const keypair = getKeypair('./sender.json')
    const senderPubkey = keypair.publicKey

    const votingIx = await VotingProgram.createVotingInstruction({
        connection,
        programId: new PublicKey('DYQ7YqPAoPGJemkKncvcnMDsQxaTTZ5fuYDgvJzYhG2L'),
        senderPubkey,
        option: 1234,
    })

    const tx = new Transaction({
        feePayer: senderPubkey,
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
    }).add(votingIx)

    const signature = await connection.sendTransaction(tx, [keypair], {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
    })
    console.log({ signature })
}

test().then(() => {})
