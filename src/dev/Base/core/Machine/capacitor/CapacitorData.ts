namespace CapacitorData {
  let data: { [key: number]: ICapacitorData } = {};

  export function getCapacitor(id: number): ICapacitorData {
    return data[id];
  }

  export function isCapacitor(id: number): boolean {
    return !!data[id];
  }

  export function isValidCapacitor(id: number, machine: TileEntity): boolean {
    const capacitor = getCapacitor(id);
    const validCapacitor = machine["capacitors"];
    if (capacitor && (!validCapacitor || validCapacitor.indexOf(capacitor.type) != -1)) {
      return true;
    }
    return false;
  }

  export function registerCapacitor(id: number, capacitor: ICapacitorData): void {
    data[id] = capacitor;
  }

  export function useCapacitor(machine: TileEntity): CapacitorSet {
    return new CapacitorSet(machine);
  }
  export class CapacitorSet {
    level: number
    type: string;
    base_level: number;
    accept_type: string[]
    constructor(protected tileEntity: TileEntity) {
      this.resetRates();
      this.useCapacitor();
    }

    resetRates(): void {
      this.level = this.base_level = 0
      this.type = ""
      this.accept_type = []
    }

    useCapacitor(): void {
      const container = this.tileEntity.container;
      for (let slotName in container.slots) {
        if (slotName.match(/Capacitor/)) {
          const slot = container.getSlot(slotName);
          const capacitor = getCapacitor(slot.id);
          if (capacitor && this.isValidCapacitor(capacitor)) {
            this.executeUprade(capacitor, slot);
          }
        }
      }
    }

    isValidCapacitor(capacitor: ICapacitorData): boolean {
      const validCapacitor = this.tileEntity["capacitors"];
      return (!validCapacitor || validCapacitor.indexOf(capacitor.type) != -1);
    }

    executeUprade(capacitor: ICapacitorData, stack: ItemInstance) {
      const reqires = this.tileEntity["acceptType"] as string[]
      if (capacitor.type == "capacitor") {
        this.level = capacitor.getLevel(stack, this.tileEntity)
        this.type = "capacitor"
      }
      if (capacitor.type == "loot_capacitor") {
        this.type = "loot_capacitor"
        let base = capacitor.getBaseLevel(stack)

        let temp_: string[] = []
        if (capacitor.getMachineLevel(stack)) {
          for (const type in capacitor.getMachineLevel(stack)) {
            temp_.push(type)
          }
        }

        let have: string[] = []
        for (const type of temp_) {
          if (reqires.indexOf(type) > -1) {
            have.push(type)
          }
        }
        this.base_level = base
        if (have.length > 0) {
          this.accept_type = have
        }
      }
    }
    // get data from Tile Entity
    getValue(defaultValue: CapacitorKey): number {
      switch (this.type) {
        case "capacitor":
          return defaultValue.getBaseValue() * this.level
        case "loot_capacitor":
          for (const type of this.accept_type) {
            let level = this.accept_type[type]
            if (defaultValue.owner == type) {
              return level * defaultValue.getBaseValue()
            } else {
              return this.base_level * defaultValue.getBaseValue()
            }
          }
          return;
        default:
          return 0;
      }
    }
  }

}