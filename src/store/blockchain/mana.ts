import * as EthConnect from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { getPlayer } from '@dcl/sdk/src/players'
import { abi } from './abi'

const MANA_ADDRESS = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942' // MANA Mainnet

export function createMANAComponent(): any {
  async function getDependencies(): Promise<any> {
    const provider = createEthereumProvider()
    const player = getPlayer()
    const userAddress = player?.userId

    if (userAddress == null) throw new Error('No wallet connected')

    const requestManager = new EthConnect.RequestManager(provider)
    const factory = new EthConnect.ContractFactory(requestManager, abi)
    const contract = (await factory.at(MANA_ADDRESS)) as any

    return { contract, userAddress }
  }

  async function balance(): Promise<any> {
    const { contract, userAddress } = await getDependencies()
    const res = await contract.balanceOf(userAddress)
    return res
  }

  async function isApproved(spenderAddress: string): Promise<any> {
    const { contract, userAddress } = await getDependencies()
    const res = await contract.allowance(userAddress, spenderAddress)
    return +res
  }

  async function approve(spenderAddress: string, amount: number = 0): Promise<any> {
    const { contract, userAddress } = await getDependencies()

    const maxAmount = amount === 0 ? '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' : amount

    const tx = await contract.approve(spenderAddress, maxAmount, {
      from: userAddress
    })

    return tx
  }

  return { balance, isApproved, approve }
}
