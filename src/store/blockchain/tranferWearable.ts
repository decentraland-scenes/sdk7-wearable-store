import * as crypto from 'dcl-crypto-toolkit'

export async function buyWearable(nftAddress: string, assetId: number, price: number): Promise<void> {
  try {
    // Check if the user has authorized the marketplace contract and has sufficient balance
    const isAuthorized = await crypto.marketplace.isAuthorizedAndHasBalance(String(price))
    if (!isAuthorized) {
      console.log('Insufficient permissions or balance. Requesting approval...')

      // Request approval for the marketplace contract to spend the user's MANA tokens
      await crypto.currency.setApproval(crypto.contract.mainnet.MANAToken, crypto.contract.mainnet.Marketplace, true)
    }

    // Execute the purchase order on the marketplace for the specified NFT
    await crypto.marketplace.executeOrder(nftAddress, assetId, price)
    console.log('execute')

    console.log('Purchase successful!')
  } catch (error) {
    // Handle any errors during the purchase process
    console.error('Error buying wearable:', error)
  }
}
