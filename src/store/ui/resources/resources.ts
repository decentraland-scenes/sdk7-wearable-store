import { engine, GltfContainer, Material, PBMaterial } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
const modelFolder = 'models/menu/'

export let roundedSquareAlpha = 'images/rounded_alpha_square.png'
export let dummySceneBG = 'images/dummy_scene.png'

//MENU
export let wardrobeShape = modelFolder + 'wardrobe.glb'
export let smallCardShape = modelFolder + 'small_card.glb'
export let smallCardHighlightShape = modelFolder + 'collection_highlight.glb'
export let cardClickableShape = modelFolder + 'card_clickable.glb'
export let collectionMenuShape = modelFolder + 'collection_menu_bg.glb'
export let menuPillarsShape = modelFolder + 'menu_pillars.glb'
export let menuBaseShape = modelFolder + 'menu_base.glb'
export let menuTopEventsShape = modelFolder + 'menu_top_events.glb'
export let menuTopCrowdShape = modelFolder + 'menu_top_crowd.glb'
export let menuTopClassicsShape = modelFolder + 'menu_top_classics.glb'
export let dateBGShape = modelFolder + 'date_bg.glb'
export let hangerShape = modelFolder + 'hanger_clickable.glb'
export let shelvesShape = modelFolder + 'shelves.glb'
export let buyButtonShape = modelFolder + 'buy_btn.glb'
export let detailsBGShape = modelFolder + 'details_bg.glb'
export let highlightFrameShape = modelFolder + 'highlight_frame.glb'
export let highlightRaysShape = modelFolder + 'highlight_rays.glb'
export let readMoreBtnShape = modelFolder + 'read_more_btn.glb'
export let coordsPanelShape = modelFolder + 'coords_panel.glb'
export let detailsCardShape = modelFolder + 'wearable_details_card.glb'
export let liveSignShape = modelFolder + 'live_bg.glb'
export let timePanelShape = modelFolder + 'time_panel.glb'
export let scrollInstructionShape = modelFolder + 'scroll_instructions.glb'
export let refreshShape = modelFolder + 'refresh_button.glb'
export let loadMoreShape = modelFolder + 'load_more_btn.glb'

//RARITY BG
export let commonBGShape = modelFolder + 'rarity_bg_common.glb'
export let uncommonBGShape = modelFolder + 'rarity_bg_uncommon.glb'
export let rareBGShape = modelFolder + 'rarity_bg_rare.glb'
export let epicBGShape = modelFolder + 'rarity_bg_epic.glb'
export let legendaryBGShape = modelFolder + 'rarity_bg_legendary.glb'
export let mythicBGShape = modelFolder + 'rarity_bg_mythic.glb'
export let uniqueBGShape = modelFolder + 'rarity_bg_unique.glb'

export const dateBGColor: Color4 = Color4.fromHexString('#cdcdcd')
export const dateMonthColor: Color4 = Color4.fromHexString('#ff3333')
export const dateDayColor: Color4 = Color4.fromHexString('#000000')

//RARITY COLORS
export const commonColor: Color4 = Color4.fromHexString('#ABC1C1') //Color4.FromHexString("#37d17a")
export const uncommonColor: Color4 = Color4.fromHexString('#ED6D4F') //Color4.FromHexString("#37d17a")
export const rareColor: Color4 = Color4.fromHexString('#36CF75') //Color4.FromHexString("#37d17a")
export const epicColor: Color4 = Color4.fromHexString('#3D85E6') //Color4.FromHexString("#4f8eec")
export const legendaryColor: Color4 = Color4.fromHexString('#842DDA') //Color4.FromHexString("#923ee2")
export const mythicColor: Color4 = Color4.fromHexString('#FF63E1') //Color4.FromHexString("#fe6ce2")
export const uniqueColor: Color4 = Color4.fromHexString('#FFB626') //Color3.FromHexString("#fdc648")

export let dateUIBGMaterial = engine.addEntity()
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

//rare material
export let commonMat = engine.addEntity()
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

//uncommon material
export let uncommonMat = engine.addEntity()
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

//rare material
export let rareMat = engine.addEntity()
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

//epic material
export let epicMat = engine.addEntity()
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

//legendary material
export let legendaryMat = engine.addEntity()
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

//mythic material
export let mythicMat = engine.addEntity()
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

//unique material
export let uniqueMat = engine.addEntity()
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
