/// <reference path="Base.ts" />

namespace Machine {
  export abstract class ProgressingMachine extends MachineBase implements EnergyTile {
    energyNode: EnergyTileNode;
    readonly energyTypes: { [energyName: string]: EnergyType };

    defaultValues = {
      energy: 0,
    };

    getEnergyStorage(): number {
      return 0;
    }
    // Capacitor logic
    updateEnergyStorage(newStorage: number): number {
      const energyStorage = newStorage || 0;
      const energyCurrent = this.data.energy;
      this.data.energy = Math.min(energyCurrent, energyStorage);
      return newStorage;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }
    getMaxIntake(): number {
      return 0;
    }

    chargeSlot(slotName: string) {
      let item = this.container.getSlot(slotName);
      let tier = ChargeItemRegistry.getItemData(item.id).tier;
      this.data.energy -= ChargeItemRegistry.addEnergyToSlot(item, "Rf", this.data.energy, tier);
    }

    dischargeSlot(slotName: string) {
      let amount = this.getEnergyStorage() - this.data.energy;
      let item = this.container.getSlot(slotName);
      let tier = ChargeItemRegistry.getItemData(item.id).tier;
      this.data.energy += ChargeItemRegistry.getEnergyFromSlot(item, "Rf", amount, tier);
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      return super.onItemUse(coords, item, player);
    }

    energyTick(type: string, src: EnergyTileNode): void {}

    energyReceive(type: string, amount: number, voltage: number): number {
      return 0;
    }

    getFreeEnergyAmount(): number {
      const storage = this.getEnergyStorage();
      if (storage > this.data.energy) {
        return Math.floor(storage - this.data.energy);
      }
      return 0;
    }

    canReceiveEnergy(side: number, type: string): boolean {
      return true;
    }

    canEmitEnergy(side: number, type: string): boolean {
      return false;
    }

    isGenerator(): boolean {
      return false;
    }

    isConductor(type: string): boolean {
      return false;
    }

    rebuildGrid(): void {
      this.energyNode.resetConnections();
      EnergyGridBuilder.buildGridForTile(this);
    }
  }
}
