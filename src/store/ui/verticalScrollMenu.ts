/* eslint-disable @typescript-eslint/no-useless-constructor */
import {
  AudioSource,
  engine,
  type Entity,
  GltfContainer,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Schemas,
  Transform,
  type TransformType
} from '@dcl/sdk/ecs'
import { type MenuItem } from './menuItem'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import {
  menuDeselectClip,
  menuDownClip,
  menuDownSource,
  menuScrollEndClip,
  menuScrollEndSource,
  menuSelectClip,
  menuUpClip,
  menuUpSource
} from './resources/sounds'
import { cardClickableShape, collectionMenuShape, scrollInstructionShape } from './resources/resources'
import { AnimatedItem } from './simpleAnimator'

export const VerticalScroller = engine.defineComponent('VerticalScroller', {
  base: Schemas.Number,
  stops: Schemas.Number,
  currentItem: Schemas.Number,
  scrollTarget: Schemas.Number,
  scrollStep: Schemas.Number,
  scrollFraction: Schemas.Number,
  speed: Schemas.Number,
  currentMenuVelocity: Schemas.Number
})

function scrollUp(entity: Entity): void {
  const data = VerticalScroller.getMutable(entity)
  if (data.currentItem > 0) {
    data.currentItem -= 1
    data.scrollTarget = data.base + data.currentItem * data.scrollStep
  }
}

function scrollDown(entity: Entity): void {
  const data = VerticalScroller.getMutable(entity)
  if (data.currentItem < data.stops - 1) {
    data.currentItem += 1
    data.scrollTarget = data.base + data.currentItem * data.scrollStep
  }
}

function reset(entity: Entity): void {
  VerticalScroller.getMutable(entity).base = 0
  VerticalScroller.getMutable(entity).stops = 0
  VerticalScroller.getMutable(entity).currentItem = 0
  VerticalScroller.getMutable(entity).scrollTarget = 0
  VerticalScroller.getMutable(entity).scrollStep = 2.2
  VerticalScroller.getMutable(entity).scrollFraction = 0
  VerticalScroller.getMutable(entity).speed = 3
  VerticalScroller.getMutable(entity).currentMenuVelocity = 0
}

export class VerticalScrollMenu {
  entity: Entity = engine.addEntity()
  items: MenuItem[]
  visibleItemCount: number = 5
  verticalSpacing: number = 1.2
  currentOffset: number = 0
  maxHeight: number = 1
  origin: Vector3
  scrollerRootA: Entity
  menuFrame: Entity
  // topMesh:Entity
  // baseMesh:Entity
  clickBoxes: Entity[]
  itemRoots: Entity[]
  instructions: Entity
  // baseText:Entity
  // baseTextShape:TextShape

  selectSound: Entity
  deselectSound: Entity
  scrollEndSound: Entity
  constructor(
    _transform: TransformType,
    _spacing: number,
    _numOfVisibleItems: number,
    _topMesh: string,
    _baseMesh: string,
    _baseTitle: string
  ) {
    this.visibleItemCount = _numOfVisibleItems

    this.items = []
    this.clickBoxes = []
    this.itemRoots = []

    AudioSource.create(this.entity, {
      audioClipUrl: menuUpClip,
      volume: 1
    })
    Transform.create(this.entity)

    this.origin = Vector3.create(0, 0, 0)
    Vector3.copyFrom(Transform.get(this.entity).position, this.origin)

    this.verticalSpacing = _spacing

    this.scrollerRootA = engine.addEntity()
    Transform.create(this.scrollerRootA)

    VerticalScroller.create(this.scrollerRootA)
    VerticalScroller.getMutable(this.scrollerRootA)
    VerticalScroller.getMutable(this.scrollerRootA).base = Transform.get(this.scrollerRootA).position.y
    VerticalScroller.getMutable(this.scrollerRootA).scrollStep = this.verticalSpacing
    Transform.getMutable(this.scrollerRootA).parent = this.entity

    this.menuFrame = engine.addEntity()
    Transform.create(this.menuFrame)
    GltfContainer.create(this.menuFrame, { src: collectionMenuShape })
    PointerEvents.create(this.menuFrame, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'SELECT'
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'SELECT'
          }
        }
      ]
    })

    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, this.menuFrame)) {
        this.scrollDown()
      }
      if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, this.menuFrame)) {
        this.scrollUp()
      }
    })
    Transform.getMutable(this.menuFrame).parent = this.entity

    this.instructions = engine.addEntity()
    Transform.create(this.instructions, {
      position: Vector3.create(-3, 0.25, -0.3),
      scale: Vector3.create(1.5, 1.5, 1.5),
      rotation: Quaternion.fromEulerDegrees(0, -10, 0)
    })
    GltfContainer.create(this.instructions, { src: scrollInstructionShape })
    PointerEvents.create(this.instructions, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'USE E/F TO SCROLL EVENTS'
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: false,
            maxDistance: 20
          }
        }
      ]
    })

    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, this.instructions)) {
        this.scrollDown()
      }
      if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, this.instructions)) {
        this.scrollUp()
      }
    })
    Transform.getMutable(this.instructions).parent = this.entity

    this.maxHeight = this.visibleItemCount * this.verticalSpacing + 1
    // this.menuFrame.getComponent(Transform).position.y = this.maxHeight/2 - this.verticalSpacing
    // this.menuFrame.getComponent(Transform).scale.y = this.maxHeight
    // this.collider.addComponent()

    // sounds
    this.selectSound = engine.addEntity()
    Transform.create(this.selectSound)
    AudioSource.create(this.selectSound, {
      audioClipUrl: menuUpClip,
      volume: 1
    })
    Transform.getMutable(this.selectSound).parent = this.entity

    this.deselectSound = engine.addEntity()
    Transform.create(this.deselectSound)
    AudioSource.create(this.deselectSound, {
      audioClipUrl: menuDeselectClip,
      volume: 1
    })
    Transform.getMutable(this.deselectSound).parent = this.entity

    this.scrollEndSound = engine.addEntity()
    Transform.create(this.scrollEndSound)
    AudioSource.create(this.scrollEndSound, {
      audioClipUrl: menuScrollEndClip,
      volume: 1
    })
    Transform.getMutable(this.scrollEndSound).parent = this.entity
  }

  addMenuItem(_item: MenuItem): void {
    const itemRoot = engine.addEntity()
    Transform.create(itemRoot, {
      position: Vector3.create(0, this.currentOffset, 0)
    })

    this.itemRoots.push(itemRoot)
    // itemRoot.addComponent(sfx.menuSelectSource)

    // COLLIDER BOX FOR USER INPUT
    const clickBox = engine.addEntity()
    Transform.create(clickBox)

    Transform.getMutable(clickBox).parent = itemRoot
    GltfContainer.create(clickBox, { src: cardClickableShape })
    PointerEvents.create(clickBox, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'SELECT'
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            showFeedback: false,
            maxDistance: 20
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: false,
            maxDistance: 20
          }
        }
      ]
    })

    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, clickBox)) {
        if (!_item.selected) {
          this.selectItem(_item)
          // clickBox.getComponent(OnPointerDown).hoverText = "DESELECT"
          AudioSource.playSound(this.selectSound, menuSelectClip)
        }
        // else{
        //     this.deselectItem(_item, false)
        //     clickBox.getComponent(OnPointerDown).hoverText = "SELECT"
        //     sfx.menuDeselectSource.playOnce()
        // }
      }
      if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, clickBox)) {
        this.scrollDown()
      }
      if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, clickBox)) {
        this.scrollUp()
      }
    })

    this.items.push(_item)
    this.clickBoxes.push(clickBox)

    if (this.itemRoots.length <= this.visibleItemCount) {
      Transform.getMutable(itemRoot).parent = this.scrollerRootA
      Transform.getMutable(_item.entity).parent = itemRoot
    }

    // _item.getComponent(Transform).position.y = this.currentOffset
    this.currentOffset -= this.verticalSpacing
    // this.maxHeight = this.items.length * this.verticalSpacing + 1

    if (this.items.length > this.visibleItemCount) {
      VerticalScroller.getMutable(this.scrollerRootA).stops = this.items.length - this.visibleItemCount
    }
  }

  scrollUp(): void {
    console.log('up')
    // F
    const scrollInfo = VerticalScroller.get(this.scrollerRootA)

    // scrollable
    if (scrollInfo.currentItem > 0) {
      // show new bottom item
      this.showItem(scrollInfo.currentItem - 1)

      // hide topmost item
      this.hideItem(scrollInfo.currentItem + this.visibleItemCount)

      scrollUp(this.scrollerRootA)
      // this.deselectAll()
      // //make the top item smaller (avoid clipping through base)
      this.fullSizeItem(scrollInfo.currentItem)

      // make second item from the bottom full size
      this.halveSizeItem(scrollInfo.currentItem + this.visibleItemCount)

      AudioSource.playSound(menuUpSource, menuUpClip)
    }
    // reached the end
    else {
      Transform.getMutable(this.scrollerRootA).position.y -= this.verticalSpacing * 0.2
      AudioSource.playSound(menuScrollEndSource, menuScrollEndClip)
    }
  }

  scrollDown(): void {
    console.log('down')
    // E
    const scrollInfo = VerticalScroller.get(this.scrollerRootA)

    // scrollable
    if (this.items.length > scrollInfo.currentItem + this.visibleItemCount) {
      // this.deselectAll()

      // // show new topmost item
      this.showItem(scrollInfo.currentItem + this.visibleItemCount)

      // // hide bottom item
      this.hideItem(scrollInfo.currentItem - 1)

      // //make the top item smaller (avoid clipping through base)
      this.halveSizeItem(scrollInfo.currentItem)

      // make second item from the bottom full size
      this.fullSizeItem(scrollInfo.currentItem + this.visibleItemCount)

      scrollDown(this.scrollerRootA)
      AudioSource.playSound(menuDownSource, menuDownClip)
    }
    // reached the end
    else {
      Transform.getMutable(this.scrollerRootA).position.y += this.verticalSpacing * 0.2
      AudioSource.playSound(menuScrollEndSource, menuScrollEndClip)
    }
  }

  selectItem(_item: MenuItem): void {
    // if(_id < this.items.length){
    // this.items[_id].select()
    if (AnimatedItem.getOrNull(_item.entity) != null) {
      if (!_item.selected) {
        this.deselectAll()
        AnimatedItem.getMutable(_item.entity).isHighlighted = true
        _item.select()
      }
    } else {
      _item.select()
    }
  }

  deselectItem(_item: MenuItem, _silent: boolean): void {
    if (AnimatedItem.getOrNull(_item.entity) != null) {
      if (_item.selected) {
        AnimatedItem.getMutable(_item.entity).isHighlighted = false
        _item.deselect(_silent)
      }
    } else {
      _item.deselect(_silent)
    }
  }

  deselectAll(): void {
    for (let i = 0; i < this.items.length; i++) {
      AnimatedItem.getMutable(this.items[i].entity).isHighlighted = false
      this.deselectItem(this.items[i], true)
      PointerEvents.getMutable(this.clickBoxes[i]).pointerEvents = [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'SELECT'
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            showFeedback: false,
            maxDistance: 20
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: false,
            maxDistance: 20
          }
        }
      ]
    }
  }

  hideItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      if (Transform.has(this.itemRoots[_id])) {
        const transform = Transform.getMutable(this.itemRoots[_id])
        transform.scale = Vector3.create(0, 0, 0) // oculta visualmente
      }
    }
  }

  showItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      if (!Transform.has(this.itemRoots[_id])) {
        Transform.create(this.itemRoots[_id], {
          position: Vector3.create(0, this.verticalSpacing * _id, 0),
          scale: Vector3.create(1, 1, 1)
        })
      } else {
        const transform = Transform.getMutable(this.itemRoots[_id])
        transform.scale = Vector3.create(1, 1, 1) // vuelve a hacer visible
      }

      if (!Transform.has(this.items[_id].entity)) {
        Transform.create(this.items[_id].entity)
      }

      Transform.getMutable(this.items[_id].entity).parent = this.itemRoots[_id]
      Transform.getMutable(this.itemRoots[_id]).parent = this.scrollerRootA
    }
  }

  halveSizeItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      if (!this.items[_id].selected) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const originalTransform_scale = AnimatedItem.getMutable(this.items[_id].entity).defaultTransform_scale

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (originalTransform_scale) {
          originalTransform_scale.x = this.items[_id].defaultItemScale.x * 0.5
          originalTransform_scale.y = this.items[_id].defaultItemScale.y * 0.5
          originalTransform_scale.z = this.items[_id].defaultItemScale.z * 0.5
        }
        AnimatedItem.getMutable(this.items[_id].entity).animFraction = 1
      } else {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const originalTransform_scale = AnimatedItem.getMutable(this.items[_id].entity).highlightTransform_scale
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (originalTransform_scale) {
          originalTransform_scale.x = this.items[_id].highlightItemScale.x * 0.5
          originalTransform_scale.y = this.items[_id].highlightItemScale.y * 0.5
          originalTransform_scale.z = this.items[_id].highlightItemScale.z * 0.5
        }
        AnimatedItem.getMutable(this.items[_id].entity).animFraction = 0
      }
    }
  }

  fullSizeItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      Vector3.copyFrom(
        this.items[_id].defaultItemScale,
        AnimatedItem.getMutable(this.items[_id].entity).defaultTransform_scale
      )
      Vector3.copyFrom(
        this.items[_id].highlightItemScale,
        AnimatedItem.getMutable(this.items[_id].entity).highlightTransform_scale
      )

      if (!this.items[_id].selected) {
        AnimatedItem.getMutable(this.items[_id].entity).animFraction = 1
      } else {
        AnimatedItem.getMutable(this.items[_id].entity).animFraction = 0
      }
    }
  }

  resetScroll(): void {
    this.deselectAll()
    reset(this.scrollerRootA)
    // this.scrollerRootA.getComponent(VerticalScroller).base = 0
    VerticalScroller.getMutable(this.scrollerRootA)
    VerticalScroller.getMutable(this.scrollerRootA).scrollStep = this.verticalSpacing
    VerticalScroller.getMutable(this.scrollerRootA).stops = this.items.length

    for (let i = 0; i < this.items.length; i++) {
      if (i < this.visibleItemCount) {
        this.showItem(i)
      } else {
        this.hideItem(i)
      }
      // reset menu item scaling
      AnimatedItem.getMutable(this.items[i].entity)
      Vector3.copyFrom(
        this.items[i].defaultItemScale,
        AnimatedItem.getMutable(this.items[i].entity).defaultTransform_scale
      )
    }
  }
}

function clickScrollSystem(dt: number): void {
  // iterate over all entiities with a Transform
  for (const [entity] of engine.getEntitiesWith(Transform, VerticalScroller)) {
    const scrollInfo = VerticalScroller.getMutable(entity)
    const scrollTransform = Transform.getMutable(entity)

    scrollTransform.position.y = springPos(
      scrollInfo.scrollTarget,
      scrollTransform.position.y,
      scrollInfo.currentMenuVelocity,
      dt
    )
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function springPos(a_Target: number, a_Current: number, a_currentVelocity: number, a_TimeStep: number): number {
  const currentToTarget = a_Target - a_Current
  const springForce = currentToTarget * 150
  // let dampingForce = -this.currentVelocity * 2 * Math.sqrt( SPRING_CONSTANT );
  const dampingForce = -a_currentVelocity * 2
  const force = springForce + dampingForce
  a_currentVelocity += force * a_TimeStep
  const displacement = a_currentVelocity * a_TimeStep

  return a_Current + displacement
}

engine.addSystem(clickScrollSystem)
