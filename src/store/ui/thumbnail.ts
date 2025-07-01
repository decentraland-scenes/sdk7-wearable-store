import { engine, Material, MaterialTransparencyMode, MeshRenderer, Transform, type TransformType } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export class ThumbnailPlane {
  public entity = engine.addEntity()
  public texture: string
  public alphaImage: string
  constructor(_image: string, _transform: TransformType, _alphaImage: string) {
    this.alphaImage = _alphaImage
    MeshRenderer.setPlane(
      this.entity,
      [
        0, 0, 1, 0, 1, 1, 0, 1,
        // ----
        1, 0, 0, 0, 0, 1, 1, 1
      ]
    )
    this.texture = _image
    Material.setPbrMaterial(this.entity, {
      texture: Material.Texture.Common({
        src: this.texture
      }),
      alphaTexture: Material.Texture.Common({
        src: _alphaImage
      }),
      specularIntensity: 0,
      metallic: 0,
      roughness: 1,
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
    })
    Transform.create(this.entity, {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      position: _transform.position || Vector3.Zero(),
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      scale: _transform.scale || Vector3.One(),
      rotation: Quaternion.fromEulerDegrees(180, 0, 90)
    })

    // engine.addEntity(this)
  }

  updateImage(texture: string): void {
    const imageUrl = texture
    Material.deleteFrom(this.entity)
    Material.setPbrMaterial(this.entity, {
      texture: Material.Texture.Common({
        src: imageUrl
      }),
      alphaTexture: Material.Texture.Common({
        src: this.alphaImage
      }),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
      specularIntensity: 0,
      metallic: 0,
      roughness: 1
    })
  }
}
