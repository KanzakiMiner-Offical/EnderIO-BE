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
    type: string;
    level: number;
    base_level: number;
    accept_type: { [key: string]: number };
    constructor(protected tileEntity: TileEntity) {
      this.resetRates();
      this.useCapacitor();
    }

    resetRates(): void {
      this.type = "";
      this.level = this.base_level = 0;
      this.accept_type = {};
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
      return !validCapacitor || validCapacitor.indexOf(capacitor.type) != -1;
    }

    executeUprade(capacitor: ICapacitorData, stack: ItemInstance) {
      if (capacitor.type == "capacitor") {
        this.level = capacitor.getLevel(stack, this.tileEntity);
        this.type = "capacitor";
      }
      const reqires = this.tileEntity["acceptType"] as string[];
      if (capacitor.type == "loot_capacitor") {
        this.type = "loot_capacitor";
        let base = capacitor.getBaseLevel(stack);
        this.base_level = base;

        // get all Capacitor types
        let capacitorTypeList: string[] = [];
        if (capacitor.getMachineLevel(stack)) {
          for (const type in capacitor.getMachineLevel(stack)) {
            capacitorTypeList.push(type);
          }
        }

        // find accept type from all Capacitor types
        for (const type of capacitorTypeList) {
          if (reqires.indexOf(type) > -1) {
            this.accept_type[type] = capacitor.getMachineLevel(stack)[type];
          }
        }
      }
    }
    // get data from Tile Entity
    getValue(defaultValue: CapacitorKey): number {
      switch (this.type) {
        case "capacitor":
          let value = 0;
          if (defaultValue) value = defaultValue.getBaseValue() * this.level;
          return value;
        case "loot_capacitor":
          let value_ = 0;
          if (defaultValue) {
            for (const type in this.accept_type) {
              let level = this.accept_type[type];
              if (defaultValue.owner == type) {
                value_ = level * defaultValue.getBaseValue();
              } else {
                value_ = this.base_level * defaultValue.getBaseValue();
              }
            }
          }
          return value_;
        default:
          return 0;
      }
    }
  }
}
