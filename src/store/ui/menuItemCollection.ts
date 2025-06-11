import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { MenuItem } from './menuItem'
import {
  type Entity,
  Transform,
  TextShape,
  Font,
  type PBTextShape,
  type TransformType,
  engine,
  GltfContainer,
  TextAlignMode
} from '@dcl/sdk/ecs'
import { type HorizontalScrollMenu } from './horizontalScrollMenu'
import { AnimatedItem } from './simpleAnimator'
import { smallCardHighlightShape, smallCardShape } from './resources/resources'
import { shortenText } from './helperFunctions'

export class CollectionMenuItem extends MenuItem {
  public scale: Vector3
  public scaleMultiplier: number

  collection: any
  wearableMenuReference: HorizontalScrollMenu
  itemRoot: Entity
  cardOffset: Vector3
  title: Entity
  titleText: PBTextShape
  highlightFrame: Entity
  updateWearablesMenu: (_menu: HorizontalScrollMenu, _collection: any) => void

  constructor(
    _transform: TransformType,
    _alphaTexture: string,
    _collection: any,
    _wearableMenu: HorizontalScrollMenu,
    _updateWearablesMenu: (_menu: HorizontalScrollMenu, _collection: any) => void
  ) {
    super()

    this.updateWearablesMenu = _updateWearablesMenu

    this.collection = _collection
    this.wearableMenuReference = _wearableMenu

    Transform.create(this.entity)

    this.scale = Vector3.create(1, 1, 1)
    this.scaleMultiplier = 1.2
    this.defaultItemScale = Vector3.create(1, 1, 1)
    this.highlightItemScale = Vector3.create(1, 1, 1)
    this.cardOffset = Vector3.create(0, 0, 0)

    // selection event animation
    AnimatedItem.create(this.entity, {
      defaultTransform_position: Vector3.create(0, 0, 0),
      defaultTransform_scale: Vector3.create(this.defaultItemScale.x, this.defaultItemScale.y, this.defaultItemScale.z),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(0, 0.0, -0.05),
      highlightTransform_scale: Vector3.create(
        this.highlightItemScale.x,
        this.highlightItemScale.y,
        this.highlightItemScale.z
      ),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      animFraction: 0,
      animVeclocity: 0,
      speed: 2
    })

    // event card root
    this.itemRoot = engine.addEntity()
    Transform.create(this.itemRoot, {
      position: Vector3.create(this.cardOffset.x, this.cardOffset.y, this.cardOffset.z),
      scale: Vector3.create(1, 1, 1)
    })
    GltfContainer.create(this.itemRoot, { src: smallCardShape })
    Transform.getMutable(this.itemRoot).parent = this.entity

    // TITLE
    this.title = engine.addEntity()
    this.titleText = TextShape.create(this.title)
    let rawText: string = _collection.name
    // log("item name: " + rawText)
    //  remove non-UTF-8 characters
    rawText = shortenText(rawText, 30)

    // rawText = wordWrap(rawText,20,3)

    this.titleText.font = Font.F_SANS_SERIF
    this.titleText.height = 20
    this.titleText.width = 2
    // this.titleText.resizeToFit = true;

    this.titleText.fontSize = 2
    this.titleText.textColor = Color4.Black()
    this.titleText.textAlign = TextAlignMode.TAM_MIDDLE_CENTER

    Transform.create(this.title, {
      position: Vector3.create(0, 0, -0.02),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    this.titleText.text = rawText

    Transform.getMutable(this.title).parent = this.itemRoot

    // highlight on click
    this.highlightFrame = engine.addEntity()
    Transform.create(this.highlightFrame)
    GltfContainer.create(this.highlightFrame, { src: smallCardHighlightShape })
    AnimatedItem.create(this.highlightFrame, {
      defaultTransform_position: Vector3.create(0, 0, 0),
      defaultTransform_scale: Vector3.create(0, 0, 0),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(0, 0, 0),
      highlightTransform_scale: Vector3.create(1, 1, 1),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            animFraction: 0,
      animVeclocity: 0,
      speed: 2
    })
    Transform.getMutable(this.highlightFrame).parent = this.entity
  }

  updateItemInfo(_collection: any, _item: any): void {
    // store the collection info
    this.collection = _collection

    // title
    let rawText: string = _collection.name

    //  remove non-UTF-8 characters
    // rawText = cleanString(rawText)
    rawText = shortenText(rawText, 30)
    // rawText = wordWrap(rawText,36,3)
    TextShape.getMutable(this.title).text = rawText
  }

  select(): void {
    if (!this.selected) {
      this.selected = true
      this.updateWearablesMenu(this.wearableMenuReference, this.collection)

      AnimatedItem.getMutable(this.highlightFrame).isHighlighted = true

      this.titleText.textColor = Color4.White()
    }
  }

  deselect(_silent?: boolean): void {
    if (this.selected) {
      this.selected = false
    }

    AnimatedItem.getMutable(this.highlightFrame).isHighlighted = false
    this.titleText.textColor = Color4.Black()
  }

  show(): void {}
  hide(): void {}
}
