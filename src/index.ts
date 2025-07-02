import {
  executeTask,
  type TransformType
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  createWearablesHorizontalMenu,
  createCollectionsVerticalMenu,
  updateCollectionsMenu
} from './store/ui/menuMainFunctions'
// import { getCollectionNamesFromServer } from './store/blockchain/fetchWearablesAdapter'
import crypto from 'dcl-crypto-toolkit'

import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'

export function main(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ReactEcsRenderer.setUiRenderer(ui.render)
  createWearableStore(
    {
      position: Vector3.create(8, 0, 4),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    },
    [
      '0x6b47e7066c7db71aa04a1d5872496fe05c4c331f',
      '0x6a99abebb48819d2abe92c5e4dc4f48dc09a3ee8',
      '0xe9a6c59953065091a47cff205966a5757e38457e',
      '0xf81d923511b29134cfdbcee205b9b2228e9f8e80',
      '0x40b244c0ef698f1fa6a6963770ca891df98fc0a9',
      '0xefc9b75eb2b969ba103a3a78e639409f0c696dae',
      '0xf65a56e0b73c3e774d7d7401727927a22982ea01'
    ]
  )

  executeTask(async () => {
    const someWearables = await crypto.wearable.getListOfWearables({
      collectionIds: ['urn:decentraland:ethereum:collections-v1:mf_sammichgamer']
    })
    console.log(someWearables, 'yeeeeeeeee')
  })
}
export function createWearableStore(transform: TransformType, collectionsList?: string[]): void {
  // -- wearables menu
  const wearablesMenu = createWearablesHorizontalMenu(transform, 2)

  // -- Collections Menu
  const collectionsMenu = createCollectionsVerticalMenu(
    {
      // position: new Vector3(posVec.x -1.6, posVec.y +2.2, posVec.z-0.6),
      position: Vector3.create(1.6, 2.05, 0.4),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    },
    wearablesMenu,
    7
  )
  void updateCollectionsMenu(collectionsMenu, wearablesMenu, 10, true, collectionsList)
}

export async function buyWearable(nftAddress: string, assetId: number, price: number): Promise<void> {
  try {
    // 1. Verificar si el usuario tiene permisos y saldo suficiente
    const isAuthorized = await crypto.marketplace.isAuthorizedAndHasBalance(String(price))
    if (!isAuthorized) {
      console.log('Permisos insuficientes o saldo insuficiente. Solicitando aprobación...')
      // 2. Solicitar aprobación para que Marketplace pueda gastar MANA
      await crypto.currency.setApproval(crypto.contract.mainnet.MANAToken, crypto.contract.mainnet.Marketplace, true)
    }

    // 3. Ejecutar la orden para comprar el wearable
    await crypto.marketplace.executeOrder(nftAddress, assetId, price)

    console.log('Compra realizada con éxito!')
  } catch (error) {
    console.error('Error comprando wearable:', error)
  }
}
