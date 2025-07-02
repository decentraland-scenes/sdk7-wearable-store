import * as crypto from 'dcl-crypto-toolkit'

export async function buyWearable(nftAddress: string, assetId: number, price: number): Promise<void> {
  try {
    const isAuthorized = await crypto.marketplace.isAuthorizedAndHasBalance(String(price))
    if (!isAuthorized) {
      console.log('Permisos insuficientes o saldo insuficiente. Solicitando aprobación...')

      await crypto.currency.setApproval(crypto.contract.mainnet.MANAToken, crypto.contract.mainnet.Marketplace, true)
    }

    await crypto.marketplace.executeOrder(nftAddress, assetId, price)

    console.log('Compra realizada con éxito!')
  } catch (error) {
    console.error('Error comprando wearable:', error)
  }
}
