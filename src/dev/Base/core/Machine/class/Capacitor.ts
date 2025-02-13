/// <reference path="ProgressingMachine.ts" />

const TransferMode = {
  IN: 0,
  OUT: 1,
  NONE: 2,
};

namespace Machine {
  export class CapacitorBlock extends ProgressingMachine {
    readonly tier: number;
    readonly capacity: number;
    readonly guiScreen: UI.StandardWindow;
    readonly maxOutputPower: number;

    constructor(tier: number, maxOutputPower: number, capacity: number, guiScreen: UI.StandardWindow) {
      super();
      this.tier = tier;
      this.capacity = capacity;
      this.maxOutputPower = maxOutputPower;
      this.guiScreen = guiScreen;
    }

    defaultValues = {
      energy: 0,
      config: 0,
    };

    onInit(): void {
      this.networkData.putInt("config", this.data.config);
      super.onInit();
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, playerUid: number): boolean {
      const client = Network.getClientForPlayer(playerUid);
      if (Entity.getSneaking(playerUid)) {
        const config = this.getMode();
        config[coords.side]++;
        config[coords.side] %= 3;
        this.setMode(config);
        this.renderModel();
        BlockEngine.sendMessage(client, `${["Input", "Output", "None"][config[coords.side]]} RF`);
        return true;
      }
      return super.onItemUse(coords, item, playerUid);
    }

    setMode(config: number[]): void {
      const code = parseInt(config.join(""), 3);
      this.data.config = code;
      this.networkData.putInt("config", code);
    }

    getMode(): number[] {
      const config = ("000000" + this.data.config.toString(3)).slice(-6);
      return [+config[0], +config[1], +config[2], +config[3], +config[4], +config[5]];
    }

    getScreenByName(): UI.StandardWindow {
      return this.guiScreen;
    }

    getTier(): number {
      return this.tier;
    }

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
      this.container.setText("textInfo", Math.floor(this.data.energy) + "/" + this.getEnergyStorage());
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

    energyReceive(type: string, amount: number, voltage: number): number {
      let maxVoltage = this.maxOutputPower * 1.5;
      if (voltage > maxVoltage) {
        amount = Math.min(amount, maxVoltage);
      }
      let add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
      this.data.energy += add;
      return add;
    }

    canReceiveEnergy(side: number): boolean {
      return this.getMode()[side] === TransferMode.IN;
    }

    canExtractEnergy(side: number): boolean {
      return this.getMode()[side] === TransferMode.OUT;
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
    drawing: [{ type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 }],
    elements: {
      energyScale: {
        type: "scale",
        x: 335,
        y: 140,
        direction: 1,
        bitmap: "redflux_bar1",
        scale: 3.2,
      },
      textInfo: {
        type: "text",
        x: 500,
        y: 140,
        width: 350,
        height: 30,
        text: "0/0 RF",
      },
      slot1: { type: "slot", x: 480, y: 300, bitmap: "chargeSlot" },
      slot2: { type: "slot", x: 580, y: 300, bitmap: "chargeSlot" },
      slot3: { type: "slot", x: 680, y: 300, bitmap: "chargeSlot" },
      slot4: { type: "slot", x: 780, y: 300, bitmap: "chargeSlot" },
    },
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
