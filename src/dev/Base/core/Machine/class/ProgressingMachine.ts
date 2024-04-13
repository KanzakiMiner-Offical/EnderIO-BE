/// <reference path="Base.ts" /> 

namespace Machine {
  export abstract class ProgressingMachine extends MachineBase implements EnergyTile {
    energyNode: EnergyTileNode;
    energyTypes: object;

    defaultValues = {
      energy: 0
    };

    tier: number;

    getTier(): number {
      return this.tier || 1;
    }

    getEnergyStorage(): number {
      return 0;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage()
    }

    getMaxIntake(): number { // replace getMaxPacketSize
      return this.getTier() * 15 + this.getTier();
    }

    chargeSlot(slotName: string) {
      this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot(slotName), "Rf", this.data.energy, this.getTier());
    }

    dischargeSlot(slotName: string) {
      let amount = this.getEnergyStorage() - this.data.energy;
      this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot(slotName), "Rf", amount, this.getTier());
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      return super.onItemUse(coords, item, player);
    }

    energyTick(type: string, src: EnergyTileNode): void { }

    energyReceive(type: string, amount: number, voltage: number): number {
      return 0;
    }

    canReceiveEnergy(side: number, type: string): boolean {
      return true;
    }

    canExtractEnergy(side: number, type: string): boolean {
      return false;
    }

    rebuildGrid(): void {
      this.energyNode.resetConnections();
      EnergyGridBuilder.buildGridForTile(this);
    }

    isConductor(type: string): boolean {
      return false;
    }

  }
}