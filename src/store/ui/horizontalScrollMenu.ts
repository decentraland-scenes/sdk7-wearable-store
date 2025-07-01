/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AudioSource,
  engine,
  type Entity,
  Font,
  GltfContainer,
  InputAction,
  inputSystem,
  type PBTextShape,
  PointerEvents,
  PointerEventType,
  Schemas,
  TextShape,
  Transform,
  type TransformType
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { type MenuItem } from './menuItem'
import {
  menuDeselectClip,
  menuDeselectSource,
  menuDownClip,
  menuDownSource,
  menuScrollEndClip,
  menuScrollEndSource,
  menuSelectClip,
  menuSelectSource,
  menuUpClip,
  menuUpSource
} from './resources/sounds'
import { hangerShape, scrollInstructionShape } from './resources/resources'
import { AnimatedItem } from './simpleAnimator'
import { wordWrap } from './helperFunctions'

export const HorizontalScroller = engine.defineComponent('HorizontalScroller', {
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
  const data = HorizontalScroller.getMutable(entity)
  if (data.currentItem < data.stops - 1) {
    data.currentItem += 1
    data.scrollTarget = data.base - data.currentItem * data.scrollStep
  }
}

function scrollDown(entity: Entity): void {
  const data = HorizontalScroller.getMutable(entity)
  if (data.currentItem > 0) {
    data.currentItem -= 1
    data.scrollTarget = data.base - data.currentItem * data.scrollStep
  }
}

function reset(entity: Entity): void {
  HorizontalScroller.getMutable(entity).base = 0
  HorizontalScroller.getMutable(entity).stops = 0
  HorizontalScroller.getMutable(entity).currentItem = 0
  HorizontalScroller.getMutable(entity).scrollTarget = 0
  HorizontalScroller.getMutable(entity).scrollStep = 2.2
  HorizontalScroller.getMutable(entity).scrollFraction = 0
  HorizontalScroller.getMutable(entity).speed = 3
  HorizontalScroller.getMutable(entity).currentMenuVelocity = 0
}

export class HorizontalScrollMenu {
  entity: Entity = engine.addEntity()
  items: MenuItem[]
  visibleItemCount: number = 5
  spacing: number = 1.2
  currentOffset: number = 0
  maxwidth: number = 1
  origin: Vector3
  scrollerRootA: Entity
  // menuFrame:Entity
  topMesh: Entity
  baseMesh: Entity
  clickBoxes: Entity[]
  itemRoots: Entity[]
  instructions: Entity
  topText: Entity
  topTextShape: PBTextShape

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
    const verticalOffset = 2
    this.visibleItemCount = _numOfVisibleItems

    this.items = []
    this.clickBoxes = []
    this.itemRoots = []
    // this.menuFrame = new Entity()
    // this.menuFrame.addComponent(new Transform({
    //     position: new Vector3(0,0,0.05),
    //     scale: new Vector3(1,1,1)
    // }))
    // this.menuFrame.addComponent(resource.menuPillarsShape)
    // this.menuFrame.addComponent(new OnPointerDown( (e) => {

    //     // 'F' to scroll up
    //     if(e.buttonId === 2){
    //         this.scrollUp()
    //     }

    //     // 'E' to scroll down
    //     if(e.buttonId === 1){
    //         this.scrollDown()
    //     }

    // },{distance:20, showFeedback:false} ))

    // this.menuFrame.setParent(this)
    // this.menuFrame.addComponent(sfx.menuDownSource)

    this.topMesh = engine.addEntity()
    Transform.create(this.topMesh, {
      position: Vector3.create(0, this.visibleItemCount * _spacing - 1, 0),
      scale: Vector3.create(4, 4, 4)
    })
    GltfContainer.create(this.topMesh, { src: _topMesh })
    Transform.getMutable(this.topMesh).parent = this.entity

    AudioSource.create(this.entity, {
      audioClipUrl: menuUpClip,
      volume: 1
    })

    Transform.create(this.entity, _transform)

    this.baseMesh = engine.addEntity()
    Transform.create(this.baseMesh, {
      position: Vector3.create(0, 0, -0.4),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.create(this.entity, { src: _baseMesh })
    PointerEvents.create(this.baseMesh, {
      pointerEvents: [
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
      if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, this.baseMesh)) {
        this.scrollDown()
      }
      if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, this.baseMesh)) {
        this.scrollUp()
      }
    })
    Transform.getMutable(this.baseMesh).parent = this.entity

    AudioSource.create(this.baseMesh, {
      audioClipUrl: menuDownClip,
      volume: 1
    })

    this.topText = engine.addEntity()
    this.topTextShape = TextShape.create(this.topText)

    this.topTextShape.text = _baseTitle
    this.topTextShape.textColor = Color4.fromHexString('#FFFFFF')
    this.topTextShape.font = Font.F_SERIF
    this.topTextShape.fontSize = 3

    Transform.create(this.topText, {
      position: Vector3.create(0, 2.45, 0.85),
      scale: Vector3.create(0.4, 0.4, 0.4),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })

    Transform.getMutable(this.topText).parent = this.baseMesh

    this.origin = Vector3.create(0, 0, 0)
    Vector3.copyFrom(Transform.get(this.entity).position, this.origin)
    this.spacing = _spacing

    this.scrollerRootA = engine.addEntity()
    Transform.create(this.scrollerRootA, {
      position: Vector3.create(0, verticalOffset, 0)
    })

    HorizontalScroller.create(this.scrollerRootA, {
      base: 0,
      stops: 0,
      currentItem: 0,
      scrollTarget: 0,
      scrollStep: 2.2,
      scrollFraction: 0,
      speed: 3,
      currentMenuVelocity: 0
    })

    HorizontalScroller.getMutable(this.scrollerRootA).base = Transform.get(this.scrollerRootA).position.x
    HorizontalScroller.getMutable(this.scrollerRootA).scrollStep = this.spacing

    Transform.getMutable(this.scrollerRootA).parent = this.entity

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
            showFeedback: true,
            maxDistance: 20,
            hoverText: 'USE E/F TO SCROLL EVENTS'
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

    this.maxwidth = this.visibleItemCount * this.spacing + 1
    // this.menuFrame.getComponent(Transform).position.x = this.maxwidth/2 - this.spacing
    // this.menuFrame.getComponent(Transform).scale.x = this.maxwidth
    // this.collider.addComponent()

    // sounds
    this.selectSound = engine.addEntity()
    Transform.create(this.selectSound)
    AudioSource.create(this.selectSound, {
      audioClipUrl: menuSelectClip,
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
      position: Vector3.create(this.currentOffset, 0, 0)
    })

    this.itemRoots.push(itemRoot)
    // itemRoot.addComponent(sfx.menuSelectSource)

    // COLLIDER BOX FOR USER INPUT
    const clickBox = engine.addEntity()
    Transform.create(clickBox)
    GltfContainer.create(clickBox, { src: hangerShape })
    Transform.getMutable(clickBox).parent = itemRoot

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
            showFeedback: false
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: false
          }
        }
      ]
    })

    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, clickBox)) {
        if (!_item.selected) {
          this.selectItem(_item)
          PointerEvents.getMutable(clickBox).pointerEvents = [
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_POINTER,
                showFeedback: true,
                maxDistance: 20,
                hoverText: 'DESELECT'
              }
            },
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_PRIMARY,
                showFeedback: false
              }
            },
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_SECONDARY,
                showFeedback: false
              }
            }
          ]
          AudioSource.playSound(menuSelectSource, menuSelectClip)
        } else {
          this.deselectItem(_item, false)
          PointerEvents.getMutable(clickBox).pointerEvents = [
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
                showFeedback: false
              }
            },
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_SECONDARY,
                showFeedback: false
              }
            }
          ]
          AudioSource.playSound(menuDeselectSource, menuDeselectClip)
        }
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

    Transform.getMutable(_item.entity).position.y = this.currentOffset
    this.currentOffset += this.spacing
    // this.maxHeight = this.items.length * this.verticalSpacing + 1
    HorizontalScroller.getMutable(this.scrollerRootA).stops = this.items.length
  }

  removeMenuItem(index: number): void {
    console.log('item removed', index)
    if (index > -1) {
      // engine.removeEntity(this.items[index])
      if (Transform.has(this.itemRoots[index])) {
        Transform.getMutable(this.itemRoots[index]).parent = undefined
      }
      // if (engine.getEntityState(this.itemRoots[index]) === 1) engine.removeEntity(this.itemRoots[index])
      // engine.removeEntity(this.clickBoxes[index])

      this.items.splice(index, 1)
      this.itemRoots.splice(index, 1)
      this.clickBoxes.splice(index, 1)

      HorizontalScroller.getMutable(this.scrollerRootA).stops = this.items.length
      this.currentOffset -= this.spacing
    }
  }

  scrollUp(): void {
    const scrollInfo = HorizontalScroller.getMutable(this.scrollerRootA)

    if (scrollInfo.currentItem < scrollInfo.stops - 1) {
      scrollInfo.currentItem += 1

      // CENTRAMOS correctamente
      scrollInfo.scrollTarget = -scrollInfo.currentItem * this.spacing

      this.deselectAll()
      this.showItem(scrollInfo.currentItem + (this.visibleItemCount - 1))
      this.hideItem(scrollInfo.currentItem - 2)
      this.halveSizeItem(scrollInfo.currentItem - 1)
      this.fullSizeItem(scrollInfo.currentItem + this.visibleItemCount - 2)
      this.halveSizeAllExcept(scrollInfo.currentItem)
      AudioSource.playSound(menuUpSource, menuUpClip)
    } else {
      AudioSource.playSound(menuScrollEndSource, menuScrollEndClip)
    }
  }

  scrollDown(): void {
    const scrollInfo = HorizontalScroller.getMutable(this.scrollerRootA)

    if (scrollInfo.currentItem > 0) {
      scrollInfo.currentItem -= 1

      // CENTRAMOS correctamente
      scrollInfo.scrollTarget = -scrollInfo.currentItem * this.spacing

      this.deselectAll()
      this.showItem(scrollInfo.currentItem - 1)
      this.hideItem(scrollInfo.currentItem + this.visibleItemCount)
      this.halveSizeItem(scrollInfo.currentItem + this.visibleItemCount - 1)
      this.fullSizeItem(scrollInfo.currentItem)
      this.halveSizeAllExcept(scrollInfo.currentItem)

      AudioSource.playSound(menuDownSource, menuDownClip)
    } else {
      AudioSource.playSound(menuScrollEndSource, menuScrollEndClip)
    }
  }

  rotateAll(currentItem: number): void {
    for (let i = 0; i < this.items.length; i++) {
      if (i < currentItem) {
        AnimatedItem.getMutable(this.items[i].entity).defaultTransform_rotation = Quaternion.fromEulerDegrees(0, -45, 0)
      }
      if (i === currentItem) {
        AnimatedItem.getMutable(this.items[i].entity).defaultTransform_rotation = Quaternion.fromEulerDegrees(0, 0, 0)
      }
      if (i > currentItem) {
        AnimatedItem.getMutable(this.items[i].entity).defaultTransform_rotation = Quaternion.fromEulerDegrees(0, 45, 0)
      }
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
            showFeedback: false
          }
        },
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_SECONDARY,
            showFeedback: false
          }
        }
      ]
    }
  }

  hideItem(_id: number): void {
    if (_id < this.itemRoots.length && _id >= 0) {
      if (Transform.has(this.itemRoots[_id])) {
        Transform.getMutable(this.itemRoots[_id]).parent = undefined
      }
    }
  }

  showItem(_id: number): void {
    if (_id < this.itemRoots.length && _id >= 0) {
      const root = this.itemRoots[_id]

      if (!Transform.has(root)) {
        Transform.create(root, {
          position: Vector3.create(this.spacing * _id, 0, 0)
        })
      }

      const item = this.items[_id].entity
      Transform.getMutable(root).parent = this.scrollerRootA
      Transform.getMutable(item).parent = root
      Transform.getMutable(item).position.z = -0.0
    }
  }

  halveSizeItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      if (AnimatedItem.getOrNull(this.items[_id].entity) !== null) {
        const originalTransform = AnimatedItem.getMutable(this.items[_id].entity)
        originalTransform.defaultTransform_scale.x = this.items[_id].defaultItemScale.x * 0.25
        originalTransform.defaultTransform_scale.y = this.items[_id].defaultItemScale.y * 0.25
        originalTransform.defaultTransform_scale.z = this.items[_id].defaultItemScale.z * 0.95 // 1.12 to hide price
      }
    }
  }

  fullSizeItem(_id: number): void {
    if (_id < this.items.length && _id >= 0) {
      Vector3.copyFrom(
        this.items[_id].defaultItemScale,
        AnimatedItem.getMutable(this.items[_id].entity).defaultTransform_scale
      )
      // this.items[_id].getComponent(AnimatedItem).animFraction = 1
    }
  }

  halveSizeAllExcept(_id: number): void {
    for (let i = 0; i < this.items.length; i++) {
      if (i !== _id) {
        this.halveSizeItem(i)
      }
    }
    this.fullSizeItem(_id)
  }

  resetScroll(): void {
    this.deselectAll()

    const scrollInfo = HorizontalScroller.getMutable(this.scrollerRootA)
    scrollInfo.currentItem = 0
    scrollInfo.scrollTarget = 0
    scrollInfo.scrollStep = this.spacing
    scrollInfo.stops = this.items.length

    for (let i = 0; i < this.items.length; i++) {
      if (i < this.visibleItemCount) {
        this.showItem(i)
      } else {
        this.hideItem(i)
      }

      Vector3.copyFrom(
        this.items[i].defaultItemScale,
        AnimatedItem.getMutable(this.items[i].entity).defaultTransform_scale
      )
    }

    Transform.getMutable(this.scrollerRootA).position.x = 0
  }

  updateTitle(_title: string): void {
    TextShape.getMutable(this.topText).text = wordWrap(_title, 40, 2)
  }
}

function clickScrollSystem(dt: number): void {
  // iterate over all entiities with a Transform
  for (const [entity] of engine.getEntitiesWith(Transform, HorizontalScroller)) {
    const scrollInfo = HorizontalScroller.getMutable(entity)
    const scrollTransform = Transform.getMutable(entity)

    scrollTransform.position.x = springPos(
      scrollInfo.scrollTarget,
      scrollTransform.position.x,
      scrollInfo.currentMenuVelocity,
      dt
    )
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function springPos(a_Target: number, a_Current: number, a_currentVelocity: number, a_TimeStep: number): number {
  const currentToTarget = a_Target - a_Current
  const springForce = currentToTarget * 300
  // let dampingForce = -this.currentVelocity * 2 * Math.sqrt( SPRING_CONSTANT );
  const dampingForce = -a_currentVelocity * 2
  const force = springForce + dampingForce
  a_currentVelocity += force * a_TimeStep
  const displacement = a_currentVelocity * a_TimeStep

  return a_Current + displacement
}

engine.addSystem(clickScrollSystem)
