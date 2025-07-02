import { executeTask, type TransformType } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  createWearablesHorizontalMenu,
  createCollectionsVerticalMenu,
  updateCollectionsMenu
} from './store/ui/menuMainFunctions'
// import { getCollectionNamesFromServer } from './store/blockchain/fetchWearablesAdapter'

import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'

// import { openNftDialog } from '~system/RestrictedActions'

export function main(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  void fetchMarketplaceItem()
  ReactEcsRenderer.setUiRenderer(ui.render)
  createWearableStore(
    {
      position: Vector3.create(8, 0, 4),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    },
    [
      // '0x50012c57dc25e3666532d92e486038337e04fa88'
      '0x6b47e7066c7db71aa04a1d5872496fe05c4c331f',
      '0x304a2d14b22801dafee057629627d5c51ddbaa8f',
      '0x32b7495895264ac9d0b12d32afd435453458b1c6'
    ]
  )
  executeTask(async () => {
    // const isa = await openNftDialog({
    //   urn: 'urn:decentraland:matic:collections-v2:0x50012c57dc25e3666532d92e486038337e04fa88:0'
    // })
    // const nft = engine.addEntity()
    // Transform.create(nft, {
    //   position: Vector3.create(15.13, 1.88, 19.22)
    // })
    // NftShape.create(nft, {
    //   urn: 'urn:decentraland:matic:collections-v2:0x50012c57dc25e3666532d92e486038337e04fa88:0'
    // })
    // const result = await getPriceFromCollections(
    //   'urn:decentraland:matic:collections-v2:0x02048643e32f893406dc2012a2f48a3023645612'
    // )
    // console.log(result, 'HERE')
    // const wearable = crypto.nft.checkTokens(
    //   'urn:decentraland:matic:collections-v2:0x00ea0379451527a5cd56e2c4bb0eac950ccb79fa'
    // )
    // console.log('¡----------------', crypto.contract.mainnet.MANAToken)
    // console.log('¡----------------', wearable)
    // const wearables = await getListOfWearables({
    //   collectionIds: ['urn:decentraland:matic:collections-v2:0x0162ba693322bcc4c9198547fe7fbb4fa751db95']
    // })
    // wearables.forEach((wearable, index) => {
    //   const imageUrl = wearable.thumbnail
    //   console.log(imageUrl, 'url de la imagen')
    //   const position = Vector3.create(2, 2, 2)
    //   const textEntity = engine.addEntity()
    //   Transform.create(textEntity, {
    //     position: Vector3.create(position.x, position.y + 1.2, position.z)
    //   })
    //   TextShape.create(textEntity, {
    //     text: wearable.i18n[0]?.text ?? wearable.id,
    //     fontSize: 2
    //   })
    //   Billboard.create(textEntity, {})
    //   const imageEntity = engine.addEntity()
    //   Transform.create(imageEntity, {
    //     position,
    //     scale: Vector3.create(2, 2, 1)
    //   })
    //   MeshRenderer.setPlane(imageEntity)
    //   Billboard.create(imageEntity, {})
    //   Material.setBasicMaterial(imageEntity, {
    //     texture: Material.Texture.Common({ src: imageUrl }),
    //     alphaTest: 0.5
    //   })
    // })
    // // const myCollections = [
    // //   'urn:decentraland:matic:collections-v2:0x02048643e32f893406dc2012a2f48a3023645612',
    // //   'urn:decentraland:matic:collections-v2:0x01cc9871ef405b71dd797c1423c7771942fd8258',
    // //   'urn:decentraland:matic:collections-v2:0x01b35f5ed8a2d01d5746ec691165eceb64517202',
    // //   'urn:decentraland:matic:collections-v2:0x016a61feb6377239e34425b82e5c4b367e52457f',
    // //   'urn:decentraland:matic:collections-v2:0x0162ba693322bcc4c9198547fe7fbb4fa751db95',
    // //   'urn:decentraland:matic:collections-v2:0x00ea0379451527a5cd56e2c4bb0eac950ccb79fa',
    // //   'urn:decentraland:matic:collections-v2:0x00c1f53e8e1b97e619bdf555fff187521b3e3e17'
    // // ]
    // // const names = await getCollectionNamesFromServer(myCollections)
    // // console.log('Matched Collection Names:', names)
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
async function fetchMarketplaceItem(): Promise<void> {
  // try {
  //   const response = await fetch(
  //     'https://marketplace-api.decentraland.org/v1/items?contractAddress=0x50012c57dc25e3666532d92e486038337e04fa88'
  //   )
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`)
  //   }
  //   ReactEcsRenderer.setUiRenderer(ui.render)
  //   const data = await response.json()
  //   const item = data.data[0]
  //   const announcement = ui.createComponent(ui.Announcement, {
  //     value: item?.name,
  //     startHidden: false,
  //     duration: 500,
  //     color: Color4.Red(),
  //     size: 50,
  //     xOffset: 100,
  //     yOffset: -50
  //   })
  //   announcement.show()
  //   console.log('Marketplace Item Response:', response)
  // } catch (error) {
  //   console.error('Error fetching marketplace item:', error)
  // }
}
