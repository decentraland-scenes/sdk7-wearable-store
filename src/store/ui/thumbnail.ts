import { engine, Material, MeshRenderer, Transform, type TextureUnion, type TransformType } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export class ThumbnailPlane {
  public entity = engine.addEntity()
  public texture: string

  constructor(_image: string, _transform: TransformType, _alphaImage?: TextureUnion) {
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
      specularIntensity: 0,
      metallic: 0,
      roughness: 1,
      alphaTexture: _alphaImage
    })
    Transform.create(this.entity, {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      position: _transform.position || Vector3.Zero(),
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      scale: _transform.scale || Vector3.One()
    })

    // engine.addEntity(this)
  }

  updateImage(texture: string): void {
    this.texture = texture
  }
}
