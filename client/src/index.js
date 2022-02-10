const { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js')
const { createVotingInstruction } = require('./js/main.js')
const { getTokenBalance, findAssociatedAccount, getKeypair, bnToPubkey, getAssociatedTokenAccount, createWrappedNativeAccountInstructions } = require('./js/utils.js')
const { VotingAccountData } = require('./js/layout.js')

const connectPhantomWallet = async () => {
    /* const isPhantomInstalled = window.solana && window.solana.isPhantom
    console.log('is phantom installed?', isPhantomInstalled) */

    const provider = getProvider()
    if (provider) {
        provider.on('connect', () => console.log('connected'))
        provider.on('disconnect', () => console.log('disconnectd'))
        provider.on('accountChanged', () => console.log('account changed'))
    }

    try {
        const resp = await provider.connect({ onlyIfTrusted: false })
        console.log('pubkey:', resp.publicKey.toString())
    } catch (err) {
        console.error(err.message)
    }
    return provider
}

const getProvider = () => {
    if ('solana' in window) {
        const provider = window.solana
        if (provider.isPhantom) {
            return provider
        }
    }
    window.open('https://phantom.app/', '_blank')
}

const walletSignAndSendTransaction = async transaction => {
    if (window.solana.isConnected && window.solana.isPhantom) {
        const { signature } = await window.solana.signAndSendTransaction(
            transaction
        )
        return signature
    } else {
        throw new Error('Phantom wallet is not connected')
    }
}

const requestAirdrop = async ({ network, quantity }) => {
    network = network || 'devnet'
    const connection = new Connection(clusterApiUrl(network), 'confirmed')
    if (window.solana.isConnected) {
        try {
            const signature = await connection.requestAirdrop(
                window.solana.publicKey,
                LAMPORTS_PER_SOL * quantity
            )
            await connection.confirmTransaction(signature)
        } catch (err) {
            console.error(err)
        }
    }
    return true
}

exports.getBalance = async (pubkey) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // const balance = await connection.getBalance(new PublicKey('3dWiifJoksACfhp5U6PVW51posMa5ukjDNXchrc3rh58'))
    const balance = await connection.getBalance(pubkey)
    console.log(balance / 1e9)
}

exports.getKeypair = getKeypair
exports.bnToPubkey = bnToPubkey
exports.getAssociatedTokenAccount = getAssociatedTokenAccount
exports.createWrappedNativeAccountInstructions = createWrappedNativeAccountInstructions

exports.VotingProgram = { createVotingInstruction, findAssociatedAccount, VotingAccountData }
