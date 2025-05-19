import { executeTask } from '@dcl/sdk/ecs'
import * as EthConnect from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { getPlayer } from '@dcl/sdk/src/players'
import { abi } from './abi'

const MANA_ADDRESS = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' // MANA in Polygon

export function createMANAComponent() {
  async function getDependencies() {
    const provider = await createEthereumProvider()
    const player = await getPlayer()
    const userAddress = player?.userId

    if (!userAddress) throw new Error('No wallet connected')

    const requestManager = new EthConnect.RequestManager(provider)
    const factory = new EthConnect.ContractFactory(requestManager, abi)
    const contract = (await factory.at(MANA_ADDRESS)) as any

    return { contract, userAddress }
  }

  async function balance() {
    const { contract, userAddress } = await getDependencies()
    const res = await contract.balanceOf(userAddress)
    return res
  }

  async function isApproved(spenderAddress: string) {
    const { contract, userAddress } = await getDependencies()
    const res = await contract.allowance(userAddress, spenderAddress)
    return +res
  }

  async function approve(spenderAddress: string, amount: number = 0) {
    const { contract, userAddress } = await getDependencies()

    const maxAmount = amount === 0 ? '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' : amount

    const tx = await contract.approve(spenderAddress, maxAmount, {
      from: userAddress
    })

    return tx
  }

  return { balance, isApproved, approve }
}
