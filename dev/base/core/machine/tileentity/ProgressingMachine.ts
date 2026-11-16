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
      if (energyStorage > 0) this.data.energy = Math.min(energyCurrent, energyStorage);
      return energyStorage;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }
    getMaxIntake(): number {
      return 0;
    }

    chargeSlot(slotName: string) {
      let item = this.container.getSlot(slotName);
      if (!item || item.id == 0) return;
      let tier = ChargeItemRegistry.getItemData(item.id).tier;
      this.data.energy -= ChargeItemRegistry.addEnergyToSlot(item, "Rf", this.data.energy, tier);
    }

    dischargeSlot(slotName: string) {
      let item = this.container.getSlot(slotName);
      if (!item || item.id == 0) return;
      let amount = this.getEnergyStorage() - this.data.energy;
      let tier = ChargeItemRegistry.getItemData(item.id).tier;
      this.data.energy += ChargeItemRegistry.getEnergyFromSlot(item, "Rf", amount, tier);
    }

    consumeSlot(inputSlot: ItemContainerSlot) {
      inputSlot.count--;
      inputSlot.validate();
      inputSlot.markDirty();
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      return super.onItemUse(coords, item, player);
    }

    energyTick(type: string, src: EnergyTileNode): void {}

    energyReceive(type: string, amount: number, power: number): number {
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

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      let region = BlockSource.getDefaultForActor(player);
      let item = this.getDemontaged();
      region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, item.id, item.count, item.data, item.extra);
    }

    // Default function for Energy Machine drop
    getDemontaged(): ItemInstance {
      let item = new ItemStack(this.blockID, 1, 0);
      let extra = new ItemExtraData();
      if (this.data.energy && this.data.energy > 0) {
        extra.putInt("energy", this.data.energy);
      }
      if (this.getTankName().length > 0) {
        let data: { [name: string]: { fluid: string; amount: number } } = {};
        this.getTankName().forEach((tank_name) => {
          if (this[tank_name]) {
            let liquidTank = this[tank_name] as BlockEngine.LiquidTank;
            let liquid = liquidTank.getLiquidStored();
            let amount = liquidTank.getAmount(liquid);
            data[tank_name] = {
              fluid: liquid,
              amount: amount,
            };
          }
        });
        extra.putSerializable("liquid_tank", data);
      }
      if (this.container && this.container.slots) {
        let items: { [slots: string]: ItemInstance } = {};
        for (let name in this.container.slots) {
          if (name.startsWith("slotVisual")) continue;
          let slot = this.container.getSlot(name);
          if (slot.id && slot.count > 0) {
            items[name] = new ItemStack(slot);
          }
        }
        extra.putSerializable("saved_container", items);
      }
      if (extra) item.extra = extra;
      return item;
    }
  }
}
/*
energy: 0

{
    tank_1: {
      fluid: fluid,
      amount: 0
    },
    tank_2: {
      fluid: fluid,
      amount: 0
    }
}
*/
