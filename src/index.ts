// We define the empty imports so the auto-complete feature works as expected.
import {
  InputAction,
  MeshCollider,
  MeshRenderer,
  Transform,
  engine,
  executeTask,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
// import { createMANAComponent } from './store/blockchain/mana'
import { createStoreComponent } from './store/blockchain/store'

export function main(): void {
  const box = engine.addEntity()
  const mana = createStoreComponent()
  Transform.create(box, {
    position: Vector3.create(8, 1, 8),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(box)
  MeshCollider.setBox(box)
  pointerEventsSystem.onPointerDown(
    {
      entity: box,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Click' }
    },
    () => {
      executeTask(async () => {
        const balance = await mana.buy('646444', '31412', 'asd')
        console.log('clicked entity', balance)
      })
    }
  )
}
