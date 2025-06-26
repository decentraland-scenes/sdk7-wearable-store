import { type TransformType } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  createWearablesHorizontalMenu,
  createCollectionsVerticalMenu,
  updateCollectionsMenu
} from './store/ui/menuMainFunctions'

export function main(): void {
  createWearableStore(
    {
      position: Vector3.create(8, 0, 4),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    },
    [
      'urn:decentraland:matic:collections-v2:0xb5b31765f355e75b3e468dbb742aa0a87db2f425',
      'urn:decentraland:matic:collections-v2:0x2e78cd7edcc3364724620c511355b27deaff56b3',
      'urn:decentraland:matic:collections-v2:0x793b73e9f7c8d3df3fb16f4a23568838baf2eb0a',
      'urn:decentraland:matic:collections-v2:0xc494f4cdcf95de946a3e36d4cee7baf9c87f08de',
      'urn:decentraland:matic:collections-v2:0xfe91e9cec6e477c7275a956b6995ea0ca571abb8',
      'urn:decentraland:matic:collections-v2:0xc717713847161131034deb6b7b907e35f2452dd1',
      'urn:decentraland:matic:collections-v2:0xd76e40795875297dbc46b06c0c75a51613bfb0cc' // OctoberFest 2022 added to test emotes
    ]
  )
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
