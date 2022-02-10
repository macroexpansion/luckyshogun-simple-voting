const { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js')
const { getBalance, PaymentProgram, getKeypair, bnToPubkey } = require('./src')

const accountSubcribe = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    const account = new PublicKey('AApKFUypZrkD1mn3CVFdp3rbznmb6ZtnufpiMA3yRRWs')
    const subcriptionId = connection.onAccountChange(account, (accountInfo, context) => {
        console.log(accountInfo)
        console.log(context)
    }, 'confirmed')
    console.log(await subcriptionId)
}

const logsSubcribe = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    const logsFilter = new PublicKey('AApKFUypZrkD1mn3CVFdp3rbznmb6ZtnufpiMA3yRRWs')
    const subcriptionId = connection.onLogs(logsFilter, (logs, context) => {
        console.log(logs)
        console.log(context)
    }, 'confirmed')
    console.log(await subcriptionId)
}


const programSubcribe = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    const programId = new PublicKey('62d2trqHEKcxVjwsw8FwWXpbcdchmW2FvXdTVz8dfnzh')

    const subcriptionId = connection.onProgramAccountChange(programId, (keyedAccountInfo, context) => {
        // console.log(keyedAccountInfo)
        // console.log(context)
        console.log(keyedAccountInfo.accountId.toString())
        // console.log(keyedAccountInfo.accountInfo.owner.toString())

        const paymentAccount = PaymentProgram.PaymentAccountData.deserialize(keyedAccountInfo.accountInfo.data)
        console.log(paymentAccount)
    }, 'confirmed')
    console.log(await subcriptionId)
}

!(async () => {
    // await accountSubcribe()
    // await logsSubcribe()
    await programSubcribe()
})()
