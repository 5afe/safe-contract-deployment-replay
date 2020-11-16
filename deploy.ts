import { ethers, BigNumber, Wallet } from "ethers";
import { config } from "dotenv";
import safe111AndFactoryConfig from "./safe111AndFactoryConfig.json"
import safe120Config from "./safe120Config.json"

config()

const rpcUrl = process.env.RPC_URL!!
const mnemonic = process.env.MNEMONIC!!

const waitForTx = async (provider, singedTx): Promise<string> => {
  const tx = await provider.sendTransaction(singedTx);
  return await tx.wait()
}

const checkCode = async (provider, address, expectedCode): Promise<void> => {
  const code = await provider.getCode(address)
  console.log(`Deployment ${code === expectedCode ? "was successful" : "has failed"}`)
}

const deploy111AndFactory = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const funder = Wallet.fromMnemonic(mnemonic).connect(provider)
  const nonce = await provider.getTransactionCount(safe111AndFactoryConfig.deployer)
  if (nonce != 0) {
    console.warn("Deployment account has been used on this network")
    return
  }
  const deploymentCosts111AndFactory = BigNumber.from(safe111AndFactoryConfig.deploymentCosts)
  const deploymentAccountBalance = await provider.getBalance(safe111AndFactoryConfig.deployer)
  if (deploymentAccountBalance.lt(deploymentCosts111AndFactory)) {
    const tx = await funder.sendTransaction({
      to: safe111AndFactoryConfig.deployer,
      value: deploymentCosts111AndFactory.sub(deploymentAccountBalance)
    })
    await tx.wait()
  }
  console.log("------ Deploy Safe 1.1.1 ------")
  await waitForTx(provider, safe111AndFactoryConfig.deploymentTx)
  await checkCode(provider, safe111AndFactoryConfig.safeAddress, safe111AndFactoryConfig.runtimeCode)
  console.log("------ Execute Config Tx ------")
  await waitForTx(provider, safe111AndFactoryConfig.configTx)
  console.log("------ Deploy Factory ------")
  await waitForTx(provider, safe111AndFactoryConfig.factoryDeploymentTx)
  await checkCode(provider, safe111AndFactoryConfig.factoryAddress, safe111AndFactoryConfig.factoryRuntimeCode)
}

const deploy120 = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const funder = Wallet.fromMnemonic(mnemonic).connect(provider)
  const nonce = await provider.getTransactionCount(safe120Config.deployer)
  if (nonce != 0) {
    console.warn("Deployment account has been used on this network")
    return
  }
  const deploymentCosts120 = BigNumber.from(safe120Config.deploymentCosts)
  const deploymentAccountBalance = await provider.getBalance(safe120Config.deployer)
  if (deploymentAccountBalance.lt(deploymentCosts120)) {
    const tx = await funder.sendTransaction({
      to: safe120Config.deployer,
      value: deploymentCosts120.sub(deploymentAccountBalance)
    })
    await tx.wait()
  }
  console.log("------ Deploy Safe 1.2.0 ------")
  await waitForTx(provider, safe120Config.deploymentTx)
  await checkCode(provider, safe120Config.safeAddress, safe120Config.runtimeCode)
}

deploy111AndFactory()
  .then(deploy120)