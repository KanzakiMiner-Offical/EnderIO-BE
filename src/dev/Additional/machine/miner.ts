BlockRegistry.createBlock(
  "voidMiner",
  [
    {
      name: "Void Miner",
      texture: [
        ["miner_bottom", 0],
        ["machineTop", 0],
        ["machineSide", 0],
        ["miner", 0],
        ["machineSide", 0],
        ["machineSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.voidMiner, 0, [
  ["miner_bottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["miner", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.voidMiner, 2, [
  ["miner_bottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["miner", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.voidMiner, 2, [
  ["miner_bottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["miner_active", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);

TileRenderer.setRotationFunction(BlockID.voidMiner);

let minerUI = MachineRegistry.createInventoryWindow("Void Miner", {
  drawing: [
    { type: "bitmap", x: 35, y: 100, bitmap: "redflux_bar0", scale: 3.2 },
    { type: "bitmap", x: 300, y: 90, bitmap: "bar_progress0", scale: 3.2 },
  ],
  elements: {
    energyScale: {
      type: "scale",
      x: 35,
      y: 100,
      direction: 1,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    slotCapacitor: { type: "slot", x: 25, y: 200 },
    progressScale: {
      type: "scale",
      x: 200,
      y: 90,
      bitmap: "bar_progress1",
      scale: 3.2,
    },

    slotInput: { type: "slot", x: 100, y: 90 },

    slot_1: { type: "slot", x: 440, y: 30, size: 60 },
    slot_2: { type: "slot", x: 500, y: 30, size: 60 },
    slot_3: { type: "slot", x: 560, y: 30, size: 60 },

    slot_4: { type: "slot", x: 440, y: 90, size: 60 },
    slot_5: { type: "slot", x: 500, y: 90, size: 60 },
    slot_6: { type: "slot", x: 560, y: 90, size: 60 },

    slot_7: { type: "slot", x: 440, y: 150, size: 60 },
    slot_8: { type: "slot", x: 500, y: 150, size: 60 },
    slot_9: { type: "slot", x: 560, y: 150, size: 60 },
  },
});

namespace Machine {
  class VoidMiner extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      canSeeVoid: false,
    };
    processTime = 36000; // 1p

    defaultEnergyStorage = 100000;
    defaultEnergyConsume = 30;
    upgrades: ["capacitor"];

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorAPI.isValidCapacitor(id, this);
        if (name.startsWith("slotInput")) return true;
        return false;
      });
    }

    getScreenByName(): UI.IWindow {
      return minerUI;
    }
    onThread(): void {
      const threadName = "eio_voidminer_" + this.x + ":" + this.y + ":" + this.z;
      const thread = Threading.getThread(threadName);
      if (thread && thread.isAlive()) {
        // Game.message("Thread đang sống khoẻ =)))");
        return;
      }
      let _count = 0;
      Threading.initThread(threadName, () => {
        try {
          if (World.getThreadTime() % 20 == 0) {
            for (let i = 0; i++; i >= this.y) {
              let block = this.blockSource.getBlockId(this.x, i, this.z);
              if (!(block == VanillaBlockID.bedrock || block == VanillaBlockID.air)) _count++;
            }
            if (_count >= 1) {
              this.data.canSeeVoid = false;
            } else {
              this.data.canSeeVoid = true;
            }
          }
        } catch (e) {
          alert("Error Void Miner: " + e);
        }
      });
    }

    mine(): void {
      let newActive = false;
      let slot = this.container.getSlot("slotInput"); // chx thêm lens nên km nó đi <(")
      if (this.data.canSeeVoid && !slot.id) {
        if (this.data.energy >= this.energyConsume) {
          this.data.progress++;
          this.data.energy -= this.energyConsume;
          newActive = true;
        }
        if (this.data.progress >= this.processTime) {
          this.data.progress = 0;
          let result: ItemInstance;
          switch (slot.id) {
            case ItemID["oreChip"]:
              result = VoidMinerAPI.randomResult(VoidMinerAPI.void_ore_random);
              break;
            case ItemID["resourceChip"]:
              result = VoidMinerAPI.randomResult(VoidMinerAPI.void_resource_random);
              break;
          }
          this.addItemToSlot(result);
        }
      } else {
        this.data.progress = 0;
      }
      this.setActive(newActive);
    }

    onTick(): void {
      // this.useCapacitor();
      StorageInterface.checkHoppers(this);

      this.onThread();
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.mine();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
      this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.setScale("energyScale", this.data.energy / this.energyStorage || 0);
      this.container.sendChanges();
    }

    addItemToSlot(item: ItemInstance): void {
      for (let i = 1; i <= 9; i++) {
        let slot = this.container.getSlot("slot_" + i);
        this.container.validateSlot("slot_" + i);
        if (slot.id == 0 || (slot.id == item.id && slot.data == item.data && slot.count < Item.getMaxStack(item.id))) {
          slot.id = item.id;
          slot.data = item.data;
          slot.count++;
          slot.markDirty();
          break;
        }
      }
    }
  }
  MachineRegistry.registerPrototype(BlockID.voidMiner, new VoidMiner());
  StorageInterface.createInterface(BlockID.voidMiner, {
    slots: {
      "slot_^1-9": { output: true },
    },
  });
}
