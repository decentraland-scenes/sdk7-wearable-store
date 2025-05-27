import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { getPlayer } from '@dcl/sdk/src/players'
import * as EthConnect from 'eth-connect'
import { collectionStoreAbi as storeAbi } from './collectionStoreAbi'

const STORE_CONTRACT_ADDRESS = '0xf64Dc33a192e056bb5f0e5049356a0498B502D50'

type StoreComponent = {
  buy: (collectionId: string, blockchainId: string, price: string) => Promise<boolean>
  buyMultipleItems: (collectionId: string, items: Array<{ blockchainId: string; price: string }>) => Promise<boolean>
}
type StoreDependencies = {
  contract: any
  userAddress: string
}

export function createStoreComponent(): StoreComponent {
  async function getDependencies(): Promise<StoreDependencies> {
    const provider = createEthereumProvider()
    const player = getPlayer()
    const userAddress = player?.userId

    if (userAddress == null) throw new Error('No wallet connected')

    const requestManager = new EthConnect.RequestManager(provider)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const factory = new EthConnect.ContractFactory(requestManager, storeAbi)
    const contract = (await factory.at(STORE_CONTRACT_ADDRESS)) as any

    return { contract, userAddress }
  }

  async function buy(collectionId: string, blockchainId: string, price: string): Promise<boolean> {
    try {
      const { contract, userAddress } = await getDependencies()
      const tx = await contract.buy([[collectionId, [blockchainId], [price], [userAddress]]], {
        from: userAddress
      })
      console.log('Buy tx:', tx)
      return true
    } catch (error) {
      console.error('Buy failed:', error)
      return false
    }
  }

  async function buyMultipleItems(
    collectionId: string,
    items: Array<{ blockchainId: string; price: string }>
  ): Promise<boolean> {
    try {
      const { contract, userAddress } = await getDependencies()
      const bIds = items.map((item) => item.blockchainId)
      const prices = items.map((item) => item.price)

      const tx = await contract.buy([[collectionId, bIds, prices, [userAddress]]], {
        from: userAddress
      })
      console.log('Buy multiple tx:', tx)
      return true
    } catch (error) {
      console.error('Buy multiple failed:', error)
      return false
    }
  }

  return {
    buy,
    buyMultipleItems
  }
}
