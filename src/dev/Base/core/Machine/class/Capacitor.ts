/// <reference path="ProgressingMachine.ts" />

namespace Machine {
  export class CapacitorBlock extends ProgressingMachine {

    readonly tier: number;
    readonly capacity: number;
    readonly guiScreen: UI.StandardWindow;
    readonly maxOutputPower: number

    constructor(tier: number, maxOutputPower: number, capacity: number, guiScreen: UI.StandardWindow) {
      super();
      this.tier = tier;
      this.capacity = capacity;
      this.maxOutputPower = maxOutputPower;
      this.guiScreen = guiScreen;
    }

    getScreenByName(): UI.StandardWindow {
      return this.guiScreen;
    }

    getTier(): number {
      return this.tier;
    }
    /*
        setupContainer(): void {
          StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id) => {
            return ChargeItemRegistry.isValidItem(id, "RF", this.getTier());
          });
          StorageInterface.setSlotValidatePolicy(this.container, "slot2", (name, id) => {
            return ChargeItemRegistry.isValidStorage(id, "RF", this.getTier());
          });
        }
    */
    canRotate(): boolean {
      return true;
    }

    setFacing(side: number): boolean {
      if (super.setFacing(side)) {
        this.rebuildGrid();
        return true;
      }
      return false;
    }

    onTick(): void {
      StorageInterface.checkHoppers(this);

      this.chargeSlot("slot1");
      this.chargeSlot("slot2");
      this.chargeSlot("slot3");
      this.chargeSlot("slot4");

      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.setText("textInfo1", Math.floor(this.data.energy) + "/");
      this.container.setText("textInfo2", this.getEnergyStorage());
      this.container.sendChanges();
    }

    energyTick(type: string, src: EnergyTileNode): void {
      let output = this.maxOutputPower;
      if (this.data.energy >= output) {
        this.data.energy += src.add(output) - output;
      }
    }

    getEnergyStorage(): number {
      return this.capacity;
    }

    canReceiveEnergy(side: number): boolean {
      return side != this.getFacing();
    }

    canExtractEnergy(side: number): boolean {
      return side == this.getFacing();
    }

    adjustDrop(item: ItemInstance): ItemInstance {
      if (item.id == this.blockID && this.data.energy > 0) {
        let extra = new ItemExtraData();
        item.extra = extra.putInt("energy", this.data.energy);
      }
      return item;
    }
  }
}

function CapacitorBlockWindow(header: string) {
  return MachineRegistry.createInventoryWindow(header, {
    drawing: [
      { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
      ],
    elements: {
      "energyScale": { type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
      "textInfo": { type: "text", x: 500, y: 140, width: 350, height: 30, text: "0/0 RF" },
      "slot1": { type: "slot", x: 480, y: 300, bitmap: "chargeSlot" },
      "slot2": { type: "slot", x: 580, y: 300, bitmap: "chargeSlot" },
      "slot3": { type: "slot", x: 680, y: 300, bitmap: "chargeSlot" },
      "slot4": { type: "slot", x: 780, y: 300, bitmap: "chargeSlot" },
    }
  });
}
/*
const CapacitorBlockInterface = {
	slots: {
		"slot1": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.CapacitorBlock) {
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Rf", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.CapacitorBlock) {
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Rf", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) <= 0;
			}
		}
	}
}*/