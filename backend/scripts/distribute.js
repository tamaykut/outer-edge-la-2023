const hre = require("hardhat")
const ethers = hre.ethers
const { Framework } = require("@superfluid-finance/sdk-core")
const TokenSpreaderJSON = require("../artifacts/contracts/NFT.sol/NFTContract.json")
const TokenSpreaderABI = TokenSpreaderJSON.abi
require("dotenv").config()

const deployedTokenSpreaderAddress = process.env.TOKENSPREADER_ADDRESS // INPUT YOUR OWN DEPLOYED TOKENSPREADER ADDRESS IN .ENV FILE

async function main() {
    // Get signer object to use when calling functions
    let alice
    ;[alice] = await ethers.getSigners()

    // Setting up network object - this is set as the MUMBAI url, but can be changed to reflect your RPC URL and network of choice
    const url = `${process.env.MUMBAI_URL}`
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url)
    const network = await customHttpProvider.getNetwork()

    // Getting tokenSpreader contract object
    const tokenSpreader = new ethers.Contract(
        deployedTokenSpreaderAddress,
        TokenSpreaderABI,
        customHttpProvider
    )

    const sf = await Framework.create({
        chainId: network.chainId,
        provider: customHttpProvider
    })

    // Getting the MUMBAI fDAIx Super Token object from the Framework object
    // This is fDAIx on MUMBAI - you can change this token to suit your network and desired token address
    const daix = await sf.loadSuperToken("fDAIx")

    console.log("Running gainShare() script...")

    // View shares that alice has
    console.log(
        `Original ${alice.address} units held:`,
        (
            await daix.getSubscription({
                publisher: tokenSpreader.address,
                indexId: await tokenSpreader.INDEX_ID(),
                subscriber: alice.address,
                providerOrSigner: alice
            })
        ).units
    )

    try {
        // alice will subscribe to tokenSpreader's index so that tokens will successfully go through to them
        // NOTE: if an account is not subscribed, but receives a distribution, its tokens will essentially “hang in limbo” until the account subscribes, after which they will go through
        const subscribeOperation = daix.approveSubscription({
            indexId: await tokenSpreader.INDEX_ID(),
            publisher: tokenSpreader.address
        })
        await subscribeOperation.exec(alice)
    } catch (err) {
        // if alice already approved subscription, carry on past error
        if (
            err.errorObject.errorObject.error.reason ==
            "execution reverted: IDA: E_SUBS_APPROVED"
        ) {
            console.log(
                "alice already approved subscription. moving on ->"
            )
        }
    }


    console.log("Running distribute() script...")

    // Get spreader token object and print out balance of it held by TokenSpreader (fDAIx)
    // const spreaderToken = new ethers.Contract( await tokenSpreader.spreaderToken() , SuperTokenABI , customHttpProvider);
    console.log(
        "Original TokenSpreader spreaderToken Balance:",
        await daix.balanceOf({
            account: tokenSpreader.address,
            providerOrSigner: alice
        })
    )

    // Get outstanding units of tokenSpreader's IDA index
    const indexDataTokenSpreader = await daix.getIndex({
        publisher: tokenSpreader.address,
        indexId: await tokenSpreader.INDEX_ID(),
        providerOrSigner: alice
    })

    console.log(
        "TokenSpreader Units Approved:",
        indexDataTokenSpreader.totalUnitsApproved
    )
    console.log(
        "TokenSpreader Units Pending:",
        indexDataTokenSpreader.totalUnitsPending
    )

    const totalUnitsOutstanding =
        parseInt(indexDataTokenSpreader.totalUnitsApproved) +
        parseInt(indexDataTokenSpreader.totalUnitsPending)
    if (totalUnitsOutstanding != 0) {
        const distributeTx = await tokenSpreader.connect(alice).distribute()
        await distributeTx.wait()
        console.log("Distributed successfully!")
    } else {
        console.log(
            "DID NOT DISTRIBUTE: the sum of Units Approved and Pending is zero and the distribute will fail!"
        )
    }

    console.log(
        "New TokenSpreader spreaderToken Balance:",
        await daix.balanceOf({
            account: tokenSpreader.address,
            providerOrSigner: alice
        })
    )
    console.log("Alices address:", alice.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
