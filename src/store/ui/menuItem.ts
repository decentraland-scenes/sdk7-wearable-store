import { engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export class MenuItem {
  entity = engine.addEntity()
  selected: boolean = false
  defaultItemScale: Vector3
  highlightItemScale: Vector3

  constructor() {
    this.defaultItemScale = Vector3.create(1, 1, 1)
    this.highlightItemScale = Vector3.create(1, 1, 1)
  }

  updateItemInfo(_info: any, _secondaryInfo?: any): void {}

  select(): void {}

  deselect(_silent?: boolean): void {
    // this.selected = false
  }

  show(): void {}

  hide(): void {}
}
