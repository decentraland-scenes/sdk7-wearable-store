import { engine, Transform, type TransformType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { HorizontalScrollMenu } from './horizontalScrollMenu'
import { CollectionMenuItem } from './menuItemCollection'
import { WearableMenuItem } from './menuItemWearable'
import { collectionPlaceholder, wearableItemPlaceholder } from './menuPlaceholders'
import { VerticalScrollMenu } from './verticalScrollMenu'
import { menuTopEventsShape, roundedSquareAlpha, wardrobeShape } from './resources/resources'

// WEARABLES MENU IN WARDROBE
export function createWearablesHorizontalMenu(_transform: TransformType, _visibleItems: number): HorizontalScrollMenu {
  const menuRoot = engine.addEntity()
  const wearablesMenu = new HorizontalScrollMenu(
    {
      position: Vector3.create(0, 0.6, 0),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(-5, 0, 0)
    },
    0.7,
    _visibleItems,
    menuTopEventsShape,
    wardrobeShape,
    'Wearables'
  )
  Transform.create(menuRoot, {
    position: _transform.position,
    rotation: _transform.rotation,
    scale: _transform.scale
  })
  Transform.getMutable(wearablesMenu.entity).parent = menuRoot

  for (let i = 0; i < 10; i++) {
    wearablesMenu.addMenuItem(
      new WearableMenuItem(
        {
          position: Vector3.create(0, 0, 0),
          scale: Vector3.create(1, 1, 1),
          rotation: Quaternion.fromEulerDegrees(0, 0, 0)
        },
        roundedSquareAlpha,
        collectionPlaceholder,
        wearableItemPlaceholder
      )
    )
  }

  wearablesMenu.halveSizeAllExcept(0)

  return wearablesMenu
}

export function updateWearablesMenu(_menu: HorizontalScrollMenu, _collection: any): void {
  console.log('update: Collection= ', _collection)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  _menu.updateTitle(_collection.name)

  for (let i = 0; i < _collection.items.length; i++) {
    // only show wearables wich have purchasable copies left
    // if (_collection.items[i].available > 0) {

    // while there are still existing cards left in the menu (from previous collection) update those
    if (i < _menu.items.length) {
      _menu.items[i].updateItemInfo(_collection, _collection.items[i])
    }
    // otherwise add new cards to the menu
    else {
      // console.log("adding: " + _collection.items[i].metadata.wearable.name);
      _menu.addMenuItem(
        new WearableMenuItem(
          {
            position: Vector3.create(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0)
          },
          roundedSquareAlpha,
          _collection,
          _collection.items[i]
        )
      )
    }

    // }
  }

  if (_collection.items.length < _menu.items.length) {
    removeLastXItems(_menu, _menu.items.length - _collection.items.length)
  }

  _menu.resetScroll()
  _menu.halveSizeAllExcept(0)
}

// COLLECTIONS MENU
export function createCollectionsVerticalMenu(
  _transform: TransformType,
  _wearableMenuRef: HorizontalScrollMenu,
  _visibleItems: number
): VerticalScrollMenu {
  const menuRoot = engine.addEntity()
  const collectionsMenu = new VerticalScrollMenu(
    {
      position: Vector3.create(0, 0, 0.5),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    },
    0.19,
    _visibleItems,
    menuTopEventsShape,
    wardrobeShape,
    'Events'
  )
  Transform.create(menuRoot, {
    position: _transform.position,
    rotation: _transform.rotation,
    scale: _transform.scale
  })
  Transform.getMutable(collectionsMenu.entity).parent = menuRoot
  Transform.getMutable(menuRoot).parent = _wearableMenuRef.entity

  // placeholder menuItems
  // for (let i = 0; i < vertEventMenu.visibleItemCount; i++){
  for (let i = 0; i < 20; i++) {
    collectionsMenu.addMenuItem(
      new CollectionMenuItem(
        {
          position: Vector3.create(0, 0, 0.5),
          scale: Vector3.create(1, 1, 1),
          rotation: Quaternion.fromEulerDegrees(0, 0, 0)
        },
        roundedSquareAlpha,
        collectionPlaceholder,
        _wearableMenuRef,
        updateWearablesMenu
      )
    )
  }

  return collectionsMenu
}

// export async function updateCollectionsMenu(
//   _menu: VerticalScrollMenu,
//   _wearableMenuRef: HorizontalScrollMenu,
//   _count: number,
//   _addLoadMoreButton: boolean,
//   collectionsList?: string[]
// ): Promise<void> {
//   console.log(collectionsList)
//   const { mana, store } = await createComponents()
//   const storeContract = getContract(ContractName.CollectionStore, 137)

//   // console.log("MANA: " + eth.fromWei(await mana.balance(), "ether"))

//   // const isApproved = await mana.isApproved(storeContract.address)

//   // if(isApproved <  +eth.toWei(500, "ether")){
//   // await mana.approve(storeContract.address, 1).catch(() => {});

//   // }
//   let collections: f.Collections = []
//   if (collectionsList) {
//     for (const collectionURN of collectionsList) {
//       const collection = await f.collection(collectionURN)
//       if (collection !== undefined) collections.push(collection)
//     }
//   } else {
//     collections = await f.storeCollections().then((r) => r.collections)
//   }
//   const fromAddress = await getUserAccount()

//   console.log(collections)
//   const cubePosition = -1
//   let itemCount = 0
//   console.log('number of Collections: ' + collections.length)

//   for (const collection of collections) {
//     console.log('number of items in collection: ' + collection.items.length)

//     console.log('adding: ' + collection.name)
//     if (itemCount < _menu.items.length) {
//       _menu.items[itemCount].updateItemInfo(collection)
//     } else {
//       _menu.addMenuItem(
//         new CollectionMenuItem(
//           {
//             position: Vector3.create(0, 0, 0.5),
//             scale: Vector3.create(1, 1, 1),
//             rotation: Quaternion.fromEulerDegrees(0, 0, 0)
//           },
//           roundedSquareAlpha,
//           collection,
//           _wearableMenuRef,
//           updateWearablesMenu
//         )
//       )
//     }
//     itemCount++
//   }

//   if (itemCount <= _menu.items.length) {
//     _menu.removeLastXItems(_menu.items.length - itemCount)
//   }
//   if (collections.length) updateWearablesMenu(_wearableMenuRef, collections[0])
//   _menu.resetScroll()
// }

export async function fillWearablesMenu(_menu: HorizontalScrollMenu): Promise<void> {
  // let events = await getEvents(10)
  // if (events.length <= 0) {
  //   return
  // }
  // for(let i=0; i < events.length; i++){
  //   _menu.addMenuItem(new EventMenuItem({
  //     scale: Vector3.create(2,2,2)
  //   },
  //   new Texture("images/rounded_alpha.png"),
  //   events[i]
  // ))
  // }
}

export function removeLastXItems(_menu: HorizontalScrollMenu, x: number): void {
  if (x >= 1) {
    for (let i = 0; i < x; i++) {
      _menu.removeMenuItem(_menu.items.length - 1)
    }
  }
}
