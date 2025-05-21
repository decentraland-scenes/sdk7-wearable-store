import { engine, Schemas, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

export const AnimatedItem = engine.defineComponent('AnimatedItem', {
  wasClicked: Schemas.Boolean,
  isHighlighted: Schemas.Boolean,
  defaultTransform_position: Schemas.Vector3,
  defaultTransform_scale: Schemas.Vector3,
  defaultTransform_rotation: Schemas.Quaternion,
  highlightTransform_position: Schemas.Vector3,
  highlightTransform_scale: Schemas.Vector3,
  highlightTransform_rotation: Schemas.Quaternion,
  animFraction: Schemas.Number,
  animVeclocity: Schemas.Number,
  speed: Schemas.Number
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPRING_CONSTANT = 50

export function itemAnimationSystem(dt: number): void {
  for (const [entity] of engine.getEntitiesWith(AnimatedItem, Transform)) {
    const info = AnimatedItem.getMutable(entity)
    const transform = Transform.getMutable(entity)

    const fraction = info.animFraction
    const speed = info.speed

    if (!info.isHighlighted) {
      if (fraction > 0) {
        info.animFraction = Math.max(0, fraction - speed * dt)
        const t = 1 - easeOutExp(1 - info.animFraction)

        transform.position = Vector3.lerp(info.defaultTransform_position, info.highlightTransform_position, t)
        transform.scale = Vector3.lerp(info.defaultTransform_scale, info.highlightTransform_scale, t)
        transform.rotation = Quaternion.slerp(info.defaultTransform_rotation, info.highlightTransform_rotation, t)
      }
    } else {
      if (fraction < 1) {
        info.animFraction = Math.min(1, fraction + speed * dt)
        const t = easeOutExp(info.animFraction)

        transform.position = Vector3.lerp(info.defaultTransform_position, info.highlightTransform_position, t)
        transform.scale = Vector3.lerp(info.defaultTransform_scale, info.highlightTransform_scale, t)
        transform.rotation = Quaternion.slerp(info.defaultTransform_rotation, info.highlightTransform_rotation, t)
      }
    }
  }
}

engine.addSystem(itemAnimationSystem)

function easeOutExp(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}
