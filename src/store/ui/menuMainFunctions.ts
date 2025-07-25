import { engine, Transform, type TransformType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { HorizontalScrollMenu } from './horizontalScrollMenu'
import { CollectionMenuItem } from './menuItemCollection'
import { WearableMenuItem } from './menuItemWearable'
import { collectionPlaceholder, wearableItemPlaceholder } from './menuPlaceholders'
import { VerticalScrollMenu } from './verticalScrollMenu'
import { menuTopEventsShape, roundedSquareAlpha, wardrobeShape } from './resources/resources'
import { createMANAComponent } from '../blockchain/mana'
import * as f from '../blockchain/fetchWearablesAdapter'
// import { getPlayer } from '@dcl/sdk/src/players'

export type Collection = {
  id: string
  name: string
  isApproved: boolean
  owner: string
  urn: string
  items: Array<{
    metadata: {
      wearable?: { name: string }
      emote?: { name: string }
    }
    image: string
    price: string
    rarity: string
    available: string
    maxSupply: string
    blockchainId: string
    urn: string
  }>
}

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

  // 1️⃣ Primero quitamos todos los ítems viejos
  while (_menu.items.length > 0) {
    _menu.removeMenuItem(_menu.items.length - 1)
  }

  // 2️⃣ Ahora agregamos todos nuevos
  for (let i = 0; i < _collection.items.length; i++) {
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

  // 3️⃣ Finalmente reseteamos scroll y tamaño
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
          position: Vector3.create(0, 0, 0),
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
export async function updateCollectionsMenu(
  _menu: VerticalScrollMenu,
  _wearableMenuRef: HorizontalScrollMenu,
  _count: number,
  _addLoadMoreButton: boolean,
  collectionsList?: string[]
): Promise<void> {
  console.log(collectionsList)
  const mana = createMANAComponent()
  console.log(mana)
  const collections: Collection[] = []

  if (collectionsList != null && collectionsList.length > 0) {
    const fetchedCollections = await f.buildCollectionsFromMarketplaceAPI(collectionsList)
    collections.push(...fetchedCollections)
  }
  console.log(collections, 'Everything to display')
  let itemCount = 0
  console.log('number of Collections: ' + collections.length)
  for (const collection of collections) {
    console.log('number of items in collection: ' + collection.items.length)
    console.log('adding: ' + collection.name)
    if (itemCount < _menu.items.length) {
      _menu.items[itemCount].updateItemInfo(collection)
    } else {
      _menu.addMenuItem(
        new CollectionMenuItem(
          {
            position: Vector3.create(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0)
          },
          roundedSquareAlpha,
          collection,
          _wearableMenuRef,
          updateWearablesMenu
        )
      )
    }
    itemCount++
  }
  if (itemCount <= _menu.items.length) {
    // missing method removeLAstXItems
    // _menu.removeLastXItems(_menu.items.length - itemCount)
  }
  if (collections.length > 0) {
    updateWearablesMenu(_wearableMenuRef, collections[0])
  }
  _menu.resetScroll()
}
