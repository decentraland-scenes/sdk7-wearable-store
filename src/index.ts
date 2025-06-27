import {
  type TransformType
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  createWearablesHorizontalMenu,
  createCollectionsVerticalMenu,
  updateCollectionsMenu
} from './store/ui/menuMainFunctions'
// import { getCollectionNamesFromServer } from './store/blockchain/fetchWearablesAdapter'

export function main(): void {
  createWearableStore(
    {
      position: Vector3.create(8, 0, 4),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    },
    [
      'urn:decentraland:matic:collections-v2:0x02048643e32f893406dc2012a2f48a3023645612',
      'urn:decentraland:matic:collections-v2:0x01cc9871ef405b71dd797c1423c7771942fd8258',
      'urn:decentraland:matic:collections-v2:0x01b35f5ed8a2d01d5746ec691165eceb64517202',
      'urn:decentraland:matic:collections-v2:0x016a61feb6377239e34425b82e5c4b367e52457f',
      'urn:decentraland:matic:collections-v2:0x0162ba693322bcc4c9198547fe7fbb4fa751db95',
      'urn:decentraland:matic:collections-v2:0x00ea0379451527a5cd56e2c4bb0eac950ccb79fa',
      'urn:decentraland:matic:collections-v2:0x00c1f53e8e1b97e619bdf555fff187521b3e3e17'
    ]
  )
//   executeTask(async () => {
//     const wearables = await crypto.wearable.getListOfWearables({
//       collectionIds: ['urn:decentraland:matic:collections-v2:0xc717713847161131034deb6b7b907e35f2452dd1']
//     })
//     console.log(wearables, 'HERE')
//     wearables.forEach((wearable, index) => {
//       const baseUrl = wearable.baseUrl ?? 'https://peer.decentraland.org/content/contents/'
//       const imageUrl = baseUrl + wearable.thumbnail

//       const position = Vector3.create(index * 3 + 1, 1, 1)
//       const textEntity = engine.addEntity()
//       Transform.create(textEntity, {
//         position: Vector3.create(position.x, position.y + 1.2, position.z)
//       })
//       TextShape.create(textEntity, {
//         text: wearable.i18n[0]?.text ?? wearable.id,
//         fontSize: 2
//       })
//       Billboard.create(textEntity, {})

//       const imageEntity = engine.addEntity()
//       Transform.create(imageEntity, {
//         position,
//         scale: Vector3.create(2, 2, 1)
//       })
//       MeshRenderer.setPlane(imageEntity)
//       Billboard.create(imageEntity, {})
//       Material.setBasicMaterial(imageEntity, {
//         texture: Material.Texture.Common({ src: imageUrl }),
//         alphaTest: 0.5
//       })
//     })
//     // const myCollections = [
//     //   'urn:decentraland:matic:collections-v2:0x02048643e32f893406dc2012a2f48a3023645612',
//     //   'urn:decentraland:matic:collections-v2:0x01cc9871ef405b71dd797c1423c7771942fd8258',
//     //   'urn:decentraland:matic:collections-v2:0x01b35f5ed8a2d01d5746ec691165eceb64517202',
//     //   'urn:decentraland:matic:collections-v2:0x016a61feb6377239e34425b82e5c4b367e52457f',
//     //   'urn:decentraland:matic:collections-v2:0x0162ba693322bcc4c9198547fe7fbb4fa751db95',
//     //   'urn:decentraland:matic:collections-v2:0x00ea0379451527a5cd56e2c4bb0eac950ccb79fa',
//     //   'urn:decentraland:matic:collections-v2:0x00c1f53e8e1b97e619bdf555fff187521b3e3e17'
//     // ]

//     // const names = await getCollectionNamesFromServer(myCollections)
//     // console.log('Matched Collection Names:', names)
//   })
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
