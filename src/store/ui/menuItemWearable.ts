/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ThumbnailPlane } from './thumbnail'
import { AnimatedItem } from './simpleAnimator'
import * as resource from './resources/resources'
import { MenuItem } from './menuItem'
import {
  engine,
  type Entity,
  Font,
  GltfContainer,
  TextAlignMode,
  TextShape,
  Transform,
  type TransformType,
  type PBTextShape,
  type Vector3Type,
  PointerEvents,
  PointerEventType,
  InputAction,
  inputSystem
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { cleanString, ethClean, wordWrap } from './helperFunctions'
import { item } from '../blockchain/fetch'

// const clickableGroup = engine.getComponentGroup(ClickableItem, Transform)

export class WearableMenuItem extends MenuItem {
  public thumbNail: ThumbnailPlane
  public scale: Vector3Type
  public scaleMultiplier: number

  itemCard: Entity
  cardOffset: Vector3Type
  cardPadding: number
  row1Height: number
  row2Height: number
  row3Height: number
  rowPriceHeight: number

  title: Entity
  collectionText: Entity
  priceTextRoot: Entity
  priceTextShape: PBTextShape
  rarityBG: Entity
  rarityTextRoot: Entity
  rarityTextShape: PBTextShape
  rarityLabel: Entity
  rarityLabelText: PBTextShape
  leftDetailsRoot: Entity
  detailsRoot: Entity
  detailsCard: Entity
  buyButton: Entity
  buyButtonText: PBTextShape
  buyButtonTextRoot: Entity
  availableCounter: Entity
  availableText: PBTextShape
  availableLabel: Entity
  availableLabelText: PBTextShape

  highlightRays: Entity
  highlightFrame: Entity

  // detailEventTitle:Entity
  // detailTitle:TextShape
  // detailTextContent:TextShape
  // detailText:Entity
  // detailTextPanel:Entity

  constructor(_transform: TransformType, _alphaTexture: string, _collection: any, _item: any) {
    super()
    Transform.create(this.entity, _transform)
    this.scale = Vector3.create(1, 0.5, 1)
    this.scaleMultiplier = 1.2
    this.defaultItemScale = Vector3.create(1, 1, 1)
    this.cardOffset = Vector3.create(0, -0.5, 0.3)
    this.cardPadding = 0.45
    this.row1Height = 0.1
    this.row2Height = 0.25
    this.row3Height = 0.4
    this.rowPriceHeight = 0.58

    const textColor1 = Color4.Black()

    // selection event animation
    AnimatedItem.create(this.entity, {
      defaultTransform_position: Vector3.create(0, 0, 0),
      defaultTransform_scale: Vector3.create(this.defaultItemScale.x, this.defaultItemScale.y, this.defaultItemScale.z),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(0, 0.3, -0.7),
      highlightTransform_scale: Vector3.create(
        this.defaultItemScale.x * this.scaleMultiplier,
        this.defaultItemScale.y * this.scaleMultiplier,
        this.defaultItemScale.z * this.scaleMultiplier
      ),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      speed: 2,
      animFraction: 0,
      animVeclocity: 0
    })

    // event card root
    this.itemCard = engine.addEntity()
    Transform.create(this.itemCard, {
      position: Vector3.create(this.cardOffset.x, this.cardOffset.y, this.cardOffset.z),
      scale: Vector3.create(1, 1, 1)
    })
    Transform.getMutable(this.itemCard).parent = this.entity
    // this.itemCard.addComponent(resource.detailsCardShape)

    this.thumbNail = new ThumbnailPlane(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      _item.image,
      {
        position: Vector3.create(0, 0.0, -0.05),
        scale: Vector3.create(1, 1, 1),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
      },
      _alphaTexture
    )

    Transform.getMutable(this.thumbNail.entity).parent = this.itemCard

    this.leftDetailsRoot = engine.addEntity()
    Transform.create(this.leftDetailsRoot, {
      position: Vector3.create(-0.32, 0.28, -0.02),
      scale: Vector3.create(0.9, 0.9, 0.9)
    })
    Transform.getMutable(this.leftDetailsRoot).parent = this.itemCard

    this.collectionText = engine.addEntity()
    TextShape.create(this.collectionText)

    // DETAILS APPEARING ON SELECTION EVENT
    this.detailsRoot = engine.addEntity()
    Transform.create(this.detailsRoot)
    Transform.getMutable(this.detailsRoot).parent = this.entity
    // -- DETAILS CARD
    this.detailsCard = engine.addEntity()
    Transform.create(this.detailsCard, {
      position: Vector3.create(this.cardOffset.x, this.cardOffset.y - 0.2, this.cardOffset.z),
      scale: Vector3.create(0.4, 0.4, 0.4)
    })
    GltfContainer.create(this.detailsCard, { src: resource.detailsCardShape })
    Transform.getMutable(this.detailsCard).parent = this.detailsRoot
    AnimatedItem.create(this.detailsCard, {
      defaultTransform_position: Vector3.create(this.cardOffset.x, this.cardOffset.y, this.cardOffset.z + 0.05),
      defaultTransform_scale: Vector3.create(1, 1, 1),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(this.cardOffset.x, this.cardOffset.y - 0.51, this.cardOffset.z),
      highlightTransform_scale: Vector3.create(1, 1, 1),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      speed: 1.5,
      animFraction: 0,
      animVeclocity: 0
    })
    Transform.getMutable(this.detailsCard).parent = this.detailsRoot

    const detailFontSize = 1

    // TITLE
    this.title = engine.addEntity()
    TextShape.create(this.title)
    let rawText: string = ''
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (_item.metadata.wearable) rawText = _item.metadata.wearable.name
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (_item.metadata.emote) rawText = _item.metadata.emote.name
    console.log('item name: ' + rawText)
    //  remove non-UTF-8 characters
    rawText = cleanString(rawText)

    rawText = wordWrap(rawText, 20, 3)
    TextShape.getMutable(this.title).text = rawText
    TextShape.getMutable(this.title).font = Font.F_SANS_SERIF
    TextShape.getMutable(this.title).height = 20
    TextShape.getMutable(this.title).width = 2

    TextShape.getMutable(this.title).fontSize = 2
    TextShape.getMutable(this.title).textColor = textColor1
    TextShape.getMutable(this.title).textAlign = TextAlignMode.TAM_MIDDLE_CENTER

    Transform.create(this.title, {
      position: Vector3.create(0, -this.row1Height, -0.01),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    Transform.getMutable(this.title).parent = this.detailsCard

    // PRICE
    this.priceTextRoot = engine.addEntity()
    Transform.create(this.priceTextRoot, {
      position: Vector3.create(0, -this.rowPriceHeight, 0)
    })

    this.priceTextShape = TextShape.create(this.priceTextRoot)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (ethClean(_item.price) === '0') this.priceTextShape.text = 'Free'
    else this.priceTextShape.text = ethClean(_item.price) + ' MANA'

    this.priceTextShape.fontSize = detailFontSize
    this.priceTextShape.font = Font.F_SANS_SERIF

    Transform.getMutable(this.priceTextRoot).parent = this.detailsCard

    // RARITY
    this.rarityTextRoot = engine.addEntity()
    Transform.create(this.rarityTextRoot, {
      position: Vector3.create(this.cardPadding, -this.row2Height, 0)
    })

    this.rarityTextShape = TextShape.create(this.rarityTextRoot)
    this.rarityTextShape.text = typeof _item.rarity === 'string' ? _item.rarity : ''
    this.rarityTextShape.textColor = textColor1
    this.rarityTextShape.fontSize = detailFontSize
    this.rarityTextShape.font = Font.F_SANS_SERIF
    this.rarityTextShape.textAlign = TextAlignMode.TAM_MIDDLE_RIGHT

    Transform.getMutable(this.rarityTextRoot).parent = this.detailsCard

    // RARITY LABEL
    this.rarityLabel = engine.addEntity()
    this.rarityLabelText = TextShape.create(this.rarityLabel)
    this.rarityLabelText.text = 'Rarity:'
    this.rarityLabelText.textColor = textColor1
    this.rarityLabelText.fontSize = 1
    this.rarityLabelText.font = Font.F_SANS_SERIF
    this.rarityLabelText.textAlign = TextAlignMode.TAM_MIDDLE_LEFT

    Transform.create(this.rarityLabel, {
      position: Vector3.create(-this.cardPadding, -this.row2Height, 0),
      scale: Vector3.create(0.65, 0.65, 0.65)
    })
    Transform.getMutable(this.rarityLabel).parent = this.detailsCard

    // RARITY BG
    this.rarityBG = engine.addEntity()
    Transform.create(this.rarityBG)
    // this.rarityBG.addComponent(new PlaneShape())

    switch (_item.rarity) {
      case 'common': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.commonBGShape })
        this.rarityTextShape.textColor = resource.commonColor
        break
      }
      case 'uncommon': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.uncommonBGShape })
        this.rarityTextShape.textColor = resource.uncommonColor
        break
      }
      case 'rare': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.rareBGShape })
        this.rarityTextShape.textColor = resource.rareColor
        break
      }
      case 'epic': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.epicBGShape })
        this.rarityTextShape.textColor = resource.epicColor
        break
      }
      case 'legendary': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.legendaryBGShape })
        this.rarityTextShape.textColor = resource.legendaryColor
        break
      }
      case 'mythic': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.mythicBGShape })
        this.rarityTextShape.textColor = resource.mythicColor
        break
      }
      case 'unique': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.uniqueBGShape })
        this.rarityTextShape.textColor = resource.uniqueColor
        break
      }
    }

    Transform.getMutable(this.rarityBG).parent = this.itemCard
    // this.rarityBG.getComponent(GLTFShape).isPointerBlocker = false
    // this.rarityBG.getComponent(PlaneShape).visible = true

    // AVAILABLE COUNT
    this.availableCounter = engine.addEntity()
    Transform.create(this.availableCounter, {
      position: Vector3.create(this.cardPadding, -this.row3Height, 0),
      scale: Vector3.create(0.75, 0.75, 0.75)
    })

    this.availableText = TextShape.create(this.availableCounter)
    this.availableText.text = _item.available + "/" + _item.maxSupply;

    this.availableText.textColor = textColor1
    this.availableText.fontSize = detailFontSize
    this.availableText.font = Font.F_SANS_SERIF
    this.availableText.textAlign = TextAlignMode.TAM_MIDDLE_RIGHT

    Transform.getMutable(this.availableCounter).parent = this.detailsCard

    this.availableLabel = engine.addEntity()
    this.availableLabelText = TextShape.create(this.availableLabel)
    this.availableLabelText.text = 'Available:'
    this.availableLabelText.textColor = textColor1
    this.availableLabelText.fontSize = 1
    this.availableLabelText.font = Font.F_SANS_SERIF
    this.availableLabelText.textAlign = TextAlignMode.TAM_MIDDLE_LEFT

    Transform.create(this.availableLabel, {
      position: Vector3.create(-this.cardPadding, -this.row3Height, 0),
      scale: Vector3.create(0.65, 0.65, 0.65)
    })
    Transform.getMutable(this.availableLabel).parent = this.detailsCard

    // -- BUY BUTTON
    this.buyButton = engine.addEntity()
    Transform.create(this.buyButton, {
      position: Vector3.create(this.cardOffset.x, this.cardOffset.y - 0.2, this.cardOffset.z),
      scale: Vector3.create(0.1, 0.1, 0.1)
    })
    GltfContainer.create(this.buyButton, { src: resource.buyButtonShape })

    Transform.getMutable(this.buyButton).parent = this.detailsCard
    AnimatedItem.create(this.buyButton, {
      defaultTransform_position: Vector3.create(0, 0, 0.1),
      defaultTransform_scale: Vector3.create(0.1, 0.1, 0.1),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(0.52, 0, -0.05),
      highlightTransform_scale: Vector3.create(0.75, 0.75, 0.75),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      speed: 1.8,
      animFraction: 0,
      animVeclocity: 0
    })

    this.buyButtonTextRoot = engine.addEntity()
    this.buyButtonText = TextShape.create(this.buyButtonTextRoot)

    
    TextShape.getMutable(this.buyButtonTextRoot).textColor = Color4.fromHexString('#FFFFFF')
    TextShape.getMutable(this.buyButtonTextRoot).font = Font.F_SANS_SERIF
    TextShape.getMutable(this.buyButtonTextRoot).textAlign = TextAlignMode.TAM_MIDDLE_CENTER

    Transform.create(this.buyButtonTextRoot, {
      position: Vector3.create(0, 0.0, -0.05),
      scale: Vector3.create(0.1, 0.1, 0.1)
    })

    Transform.getMutable(this.buyButtonTextRoot).parent = this.buyButton
    this.buyButtonText.text = 'BUY'
    if (_item.available > 1) {
      PointerEvents.createOrReplace(this.buyButton, {
        pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: InputAction.IA_POINTER,
              hoverText: 'BUY'
            }
          }
        ]
      })
      engine.addSystem(() => {
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buyButton)) {
          // buy(_collection.id, _item.blockchainId, _item.price, this)
        }
      })
    } else {
      PointerEvents.createOrReplace(this.buyButton, {
        pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: InputAction.IA_POINTER,
              hoverText: 'OUT OF STOCK'
            }
          }
        ]
      })
      engine.addSystem(() => {
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buyButton)) {
          /* empty */
        }
      })
    }

    // highlights BG on selection
    this.highlightRays = engine.addEntity()
    Transform.create(this.highlightRays)
    GltfContainer.create(this.highlightRays, { src: resource.highlightRaysShape })
    Transform.getMutable(this.highlightRays).parent = this.detailsRoot
    AnimatedItem.create(this.highlightRays, {
      defaultTransform_position: Vector3.create(this.cardOffset.x, this.cardOffset.y, this.cardOffset.z + 0.05),
      defaultTransform_scale: Vector3.create(0, 0, 0),
      defaultTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      highlightTransform_position: Vector3.create(this.cardOffset.x, this.cardOffset.y, this.cardOffset.z + 0.05),
      highlightTransform_scale: Vector3.create(1, 1, 1),
      highlightTransform_rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      speed: 6,
      animFraction: 0,
      animVeclocity: 0
    })

    this.highlightFrame = engine.addEntity()
    Transform.create(this.highlightFrame)
    GltfContainer.create(this.highlightFrame, { src: resource.highlightFrameShape })
    Transform.getMutable(this.highlightFrame).parent = this.highlightRays
  }

  boughtOne(): void {
    const [available, maxSupply] = this.availableText.text.split('/')
    if (+available > 0) this.availableText.text = +available - 1 + '/' + maxSupply
  }

  updateItemInfo(_collection: any, _item: any): void {
    // image
    if (_item.image === 'images/dummy_scene.png') {
      this.thumbNail.updateImage(_item.image)
    } else {
      // this.thumbNail.updateImage(new Texture(fixImageUrl(_item.image)))
      this.thumbNail.updateImage(_item.image)
    }

    // price
    if (_item.available > 1) {
       
      if (ethClean(_item.price) === '0') TextShape.getMutable(this.priceTextRoot).text = 'Free'
      else TextShape.getMutable(this.priceTextRoot).text = ethClean(_item.price) + ' MANA'
    } else {
      TextShape.getMutable(this.priceTextRoot).text = 'Out of stock'
    }
    // rarity
    TextShape.getMutable(this.rarityTextRoot).text = _item.rarity;
    switch (_item.rarity) {
      case 'common': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.commonBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.commonColor
        break
      }
      case 'uncommon': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.uncommonBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.uncommonColor
        break
      }
      case 'rare': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.rareBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.rareColor
        break
      }
      case 'epic': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.epicBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.epicColor
        break
      }
      case 'legendary': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.legendaryBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.legendaryColor
        break
      }
      case 'mythic': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.mythicBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.mythicColor
        break
      }
      case 'unique': {
        GltfContainer.createOrReplace(this.rarityBG, { src: resource.uniqueBGShape })
        TextShape.getMutable(this.rarityTextRoot).textColor = resource.uniqueColor
        break
      }
    }

    // available
    TextShape.getMutable(this.availableCounter).text = _item.available + "/" + _item.maxSupply;

    // update buy button
    this.buyButtonText.text = 'BUY'
    PointerEvents.getMutable(this.buyButton).pointerEvents = [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_POINTER,
          hoverText: 'BUY'
        }
      }
    ]
    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.buyButton)) {
        // buy(_collection.id, _item.blockchainId, _item.price, this)
      }
    })
    // title
    let rawText: string = ''
    if (_item.metadata.wearable) rawText = _item.metadata.wearable
    if (_item.metadata.emote) rawText = _item.metadata.emote

    //  remove non-UTF-8 characters
    rawText = cleanString(rawText)
    rawText = wordWrap(rawText, 25, 2)
    TextShape.getMutable(this.title).text = rawText

    // detail text
    // remove non-UTF-8 characters and wrap
    // this.detailTitle.value = wordWrap( cleanString(_item.metadata.wearable.name ),45,3)

    // remove non-UTF-8 characters and wrap
    // this.detailTextContent.value = ("\n\n" + wordWrap(cleanString("details"), 75, 11) + "</cspace>")
  }

  select(): void {
    if (!this.selected) {
      // engine.addEntity(this.detailsRoot)
      this.selected = true
      AnimatedItem.getMutable(this.buyButton).isHighlighted = true
      AnimatedItem.getMutable(this.detailsCard).isHighlighted = true
      AnimatedItem.getMutable(this.highlightRays).isHighlighted = true
    }
  }

  deselect(_silent?: boolean): void {
    if (this.selected) {
      this.selected = false
    }
    AnimatedItem.getMutable(this.buyButton).isHighlighted = false
    AnimatedItem.getMutable(this.detailsCard).isHighlighted = false
    AnimatedItem.getMutable(this.highlightRays).isHighlighted = false
  }

  show(): void {}
  hide(): void {}
}
