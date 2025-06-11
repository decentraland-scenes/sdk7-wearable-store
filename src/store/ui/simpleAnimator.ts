/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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
    if (!info.isHighlighted) {
      if (info.animFraction > 0) {
        info.animFraction -= info.speed * dt
        if (info.defaultTransform_scale && info.highlightTransform_scale) {
          transform.scale = Vector3.lerp(
            info.defaultTransform_scale,
            info.highlightTransform_scale,
            1 - easeOutExp(1 - info.animFraction)
          )
        }
        if (info.defaultTransform_position && info.highlightTransform_position) {
          transform.position = Vector3.lerp(
            info.defaultTransform_position,
            info.highlightTransform_position,
            1 - easeOutExp(1 - info.animFraction)
          )
        }
        if (info.defaultTransform_rotation && info.highlightTransform_rotation) {
          transform.rotation = Quaternion.slerp(
            info.defaultTransform_rotation,
            info.highlightTransform_rotation,
            1 - easeOutExp(1 - info.animFraction)
          )
        }
      } else {
        info.animFraction = 0
        if (info.defaultTransform_scale) transform.scale = info.defaultTransform_scale
        if (info.defaultTransform_position) transform.position = info.defaultTransform_position
        if (info.defaultTransform_rotation) transform.rotation = info.defaultTransform_rotation
      }
    } else {
      if (info.animFraction < 1) {
        info.animFraction += info.speed * dt

        if (info.defaultTransform_scale && info.highlightTransform_scale)
          transform.scale = Vector3.lerp(
            info.defaultTransform_scale,
            info.highlightTransform_scale,
            easeOutExp(info.animFraction)
          )
        if (info.defaultTransform_position && info.highlightTransform_position)
          transform.position = Vector3.lerp(
            info.defaultTransform_position,
            info.highlightTransform_position,
            easeOutExp(info.animFraction)
          )
        if (info.defaultTransform_rotation && info.highlightTransform_rotation)
          transform.rotation = Quaternion.slerp(
            info.defaultTransform_rotation,
            info.highlightTransform_rotation,
            easeOutExp(info.animFraction)
          )
        // transform.scale = this.springVec3(info.highlightTransform_scale, transform.scale, info.animVeclocity, info.speed*dt)
        // transform.position = this.springVec3(info.highlightTransform_position, transform.position, info.animVeclocity, info.speed*dt)
      } else {
        info.animFraction = 1
        if (info.highlightTransform_scale) transform.scale = info.highlightTransform_scale
        if (info.highlightTransform_position) transform.position = info.highlightTransform_position
        if (info.highlightTransform_rotation) transform.rotation = info.highlightTransform_rotation
      }

      // transform.scale = this.springVec3(info.defaultTransform_scale, transform.scale, info.animVeclocity, info.speed*dt)
      // transform.position = this.springVec3(info.defaultTransform_position, transform.position, info.animVeclocity, info.speed*dt)
    }
  }
}

engine.addSystem(itemAnimationSystem)

function easeOutExp(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}
