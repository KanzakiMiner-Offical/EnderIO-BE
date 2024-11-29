// old

/** @deprecated */
namespace CapacitorAPI {
  let data = {};

  export function getCapacitor(id: number): ICapacitor {
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

  export function registerCapacitor(id: number, capacitor: ICapacitor): void {
    data[id] = capacitor;
  }

  export function useCapacitor(machine: TileEntity): CapacitorSet {
    return new CapacitorSet(machine);
  }

  export class CapacitorSet {
    bonusGeneratorMultiplier: number;
    energyConsumeMultiplier: number;
    extraEnergyStorage: number;
    maxRangeMultiplier: number;

    constructor(protected tileEntity: TileEntity) {
      this.resetRates();
      this.useCapacitor();
    }

    resetRates(): void {
      this.bonusGeneratorMultiplier = 1;
      this.energyConsumeMultiplier = 1;
      this.extraEnergyStorage = 1;
      this.maxRangeMultiplier = 1;
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

    isValidCapacitor(capacitor: ICapacitor): boolean {
      const validCapacitor = this.tileEntity["capacitors"];
      return !validCapacitor || validCapacitor.indexOf(capacitor.type) != -1;
    }

    executeUprade(capacitor: ICapacitor, stack: ItemInstance) {
      if (capacitor.type == "capacitor") {
        this.bonusGeneratorMultiplier *= capacitor.getBonusGenerator(stack, this.tileEntity);
        this.energyConsumeMultiplier += capacitor.getEnergyConsumeMultiplier(stack, this.tileEntity);
        this.extraEnergyStorage *= capacitor.getExtraEnergyStorage(stack, this.tileEntity);
        this.maxRangeMultiplier += capacitor.getRange(stack, this.tileEntity);
      }
      if ("onTick" in capacitor) {
        capacitor.onTick(stack, this.tileEntity);
      }
    }
    // get data from Tile Entity
    getBonusGenerator(defaultBonus: number): number {
      return defaultBonus * this.bonusGeneratorMultiplier;
    }

    getEnergyConsume(defaultEnergy: number): number {
      return defaultEnergy * this.energyConsumeMultiplier;
    }

    getEnergyStorage(defaultEnergyStorage: number): number {
      const energyStorage = defaultEnergyStorage * this.extraEnergyStorage;
      const tileData = this.tileEntity.data;
      tileData.energy = Math.min(tileData.energy, energyStorage);
      return energyStorage;
    }

    getRange(defaultRange: number): number {
      return defaultRange + this.maxRangeMultiplier;
    }
  }
}
