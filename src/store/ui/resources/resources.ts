import { engine, Material } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
const modelFolder = 'models/menu/'

export const roundedSquareAlpha = 'images/rounded_alpha_square.png'
export const dummySceneBG = 'images/dummy_scene.png'

// MENU
export const wardrobeShape = modelFolder + 'wardrobe.glb'
export const smallCardShape = modelFolder + 'small_card.glb'
export const smallCardHighlightShape = modelFolder + 'collection_highlight.glb'
export const cardClickableShape = modelFolder + 'card_clickable.glb'
export const collectionMenuShape = modelFolder + 'collection_menu_bg.glb'
export const menuPillarsShape = modelFolder + 'menu_pillars.glb'
export const menuBaseShape = modelFolder + 'menu_base.glb'
export const menuTopEventsShape = modelFolder + 'menu_top_events.glb'
export const menuTopCrowdShape = modelFolder + 'menu_top_crowd.glb'
export const menuTopClassicsShape = modelFolder + 'menu_top_classics.glb'
export const dateBGShape = modelFolder + 'date_bg.glb'
export const hangerShape = modelFolder + 'hanger_clickable.glb'
export const shelvesShape = modelFolder + 'shelves.glb'
export const buyButtonShape = modelFolder + 'buy_btn.glb'
export const detailsBGShape = modelFolder + 'details_bg.glb'
export const highlightFrameShape = modelFolder + 'highlight_frame.glb'
export const highlightRaysShape = modelFolder + 'highlight_rays.glb'
export const readMoreBtnShape = modelFolder + 'read_more_btn.glb'
export const coordsPanelShape = modelFolder + 'coords_panel.glb'
export const detailsCardShape = modelFolder + 'wearable_details_card.glb'
export const liveSignShape = modelFolder + 'live_bg.glb'
export const timePanelShape = modelFolder + 'time_panel.glb'
export const scrollInstructionShape = modelFolder + 'scroll_instructions.glb'
export const refreshShape = modelFolder + 'refresh_button.glb'
export const loadMoreShape = modelFolder + 'load_more_btn.glb'

// RARITY BG
export const commonBGShape = modelFolder + 'rarity_bg_common.glb'
export const uncommonBGShape = modelFolder + 'rarity_bg_uncommon.glb'
export const rareBGShape = modelFolder + 'rarity_bg_rare.glb'
export const epicBGShape = modelFolder + 'rarity_bg_epic.glb'
export const legendaryBGShape = modelFolder + 'rarity_bg_legendary.glb'
export const mythicBGShape = modelFolder + 'rarity_bg_mythic.glb'
export const uniqueBGShape = modelFolder + 'rarity_bg_unique.glb'

export const dateBGColor: Color4 = Color4.fromHexString('#cdcdcd')
export const dateMonthColor: Color4 = Color4.fromHexString('#ff3333')
export const dateDayColor: Color4 = Color4.fromHexString('#000000')

// RARITY COLORS
export const commonColor: Color4 = Color4.fromHexString('#ABC1C1') // Color4.FromHexString("#37d17a")
export const uncommonColor: Color4 = Color4.fromHexString('#ED6D4F') // Color4.FromHexString("#37d17a")
export const rareColor: Color4 = Color4.fromHexString('#36CF75') // Color4.FromHexString("#37d17a")
export const epicColor: Color4 = Color4.fromHexString('#3D85E6') // Color4.FromHexString("#4f8eec")
export const legendaryColor: Color4 = Color4.fromHexString('#842DDA') // Color4.FromHexString("#923ee2")
export const mythicColor: Color4 = Color4.fromHexString('#FF63E1') // Color4.FromHexString("#fe6ce2")
export const uniqueColor: Color4 = Color4.fromHexString('#FFB626') // Color3.FromHexString("#fdc648")

export const dateUIBGMaterial = engine.addEntity()
Material.setPbrMaterial(dateUIBGMaterial, {
  albedoColor: dateBGColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// rare material
export const commonMat = engine.addEntity()
Material.setPbrMaterial(commonMat, {
  albedoColor: commonColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// uncommon material
export const uncommonMat = engine.addEntity()
Material.setPbrMaterial(uncommonMat, {
  albedoColor: uncommonColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// rare material
export const rareMat = engine.addEntity()
Material.setPbrMaterial(rareMat, {
  albedoColor: rareColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// epic material
export const epicMat = engine.addEntity()
Material.setPbrMaterial(epicMat, {
  albedoColor: epicColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// legendary material
export const legendaryMat = engine.addEntity()
Material.setPbrMaterial(legendaryMat, {
  albedoColor: legendaryColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// mythic material
export const mythicMat = engine.addEntity()
Material.setPbrMaterial(mythicMat, {
  albedoColor: mythicColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})

// unique material
export const uniqueMat = engine.addEntity()
Material.setPbrMaterial(uniqueMat, {
  albedoColor: uniqueColor,
  texture: Material.Texture.Common({
    src: roundedSquareAlpha
  }),
  transparencyMode: 2,
  metallic: 0,
  roughness: 1,
  specularIntensity: 0
})
