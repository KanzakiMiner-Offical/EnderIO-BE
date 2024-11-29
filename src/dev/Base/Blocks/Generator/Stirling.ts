BlockRegistry.createBlock(
  "stirlingGen",
  [
    {
      name: "tile.block_stirling_generator.name",
      texture: [
        ["machineBottom", 0],
        ["machineTop", 0],
        ["machineSide", 0],
        ["stirlingGenFront", 0],
        ["machineSide", 0],
        ["machineSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setStandardModelWithRotation(BlockID.stirlingGen, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["stirlingGenFront", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.stirlingGen, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["stirlingGenFrontOn", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);

TileRenderer.setRotationFunction(BlockID.stirlingGen);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.stirlingGen, count: 1, data: 0 },
    ["   ", "sfs", "gpg"],
    ["s", ItemID.darkSteel, 0, "f", BlockID.machineChassi, 0, "g", ItemID.darkSteelGear, 0, "p", BlockID.simpleStirlingGen, 0],
  );
});

let stirlingGenGUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_stirling_generator.name"), {
  drawing: [
    { type: "bitmap", x: 445, y: 90, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
  ],

  elements: {
    energyScale: {
      type: "scale",
      x: 335,
      y: 140,
      direction: 1,
      value: 0.5,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    textInstall: {
      type: "text",
      font: { size: 20, color: Color.YELLOW },
      x: 325,
      y: 50,
      width: 50,
      height: 30,
      text: "",
    },
    burningScale: {
      type: "scale",
      x: 440,
      y: 90,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
    },
    slotFuel: { type: "slot", x: 440, y: 150 },
    //"text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    slotCapacitor: { type: "slot", x: 325, y: 320 },
  },
});

namespace Machine {
  export class StirlingGenerator extends Generator {
    defaultValues = {
      energy: 0,
      burn: 0,
      burnMax: 0,
    };

    // defaultBonus = 1
    // defaultEnergyStorage = 100000
    efficiency = 0;
    generator = 0;
    capacitors = ["capacitor"];
    acceptType = ["red", "buffer"];

    getScreenByName(): UI.IWindow {
      return stirlingGenGUI;
    }

    initCapacitor(): void {
      let capacitors = CapacitorData.useCapacitor(this);
      this.efficiency = capacitors.getValue(CapacitorKey.STIRLING_POWER_EFFICIENCY);
      this.generator = capacitors.getValue(CapacitorKey.STIRLING_POWER_GEN);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.STIRLING_POWER_BUFFER));
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return !!CapacitorData.isValidCapacitor(id, this);
        return false;
      });
      StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
        return Recipes.getFuelBurnDuration(id, data) > 0;
      });
    }

    getBurnTime(name: string): number {
      let item = this.container.getSlot(name);
      let base = (Recipes.getFuelBurnDuration(item.id, item.data) / (this.generator / CapacitorKey.STIRLING_POWER_GEN.getBaseValue())) * this.efficiency;
      if (LiquidRegistry.getItemLiquid(item.id, item.data)) {
        // Lava and other fluid buckets are nerfed, prefer combustion engine for those
        base /= 5;
      }
      // The vanilla burn time results in 24,000FE for a piece of coal at 15FE/t output.
      // So we hardcode 15 as a baseline to keep that density consistent
      let amount = Math.round((base /= CapacitorKey.STIRLING_POWER_GEN.getBaseValue() / 15));
      if (amount > 0) {
        if (!LiquidItemRegistry.getItemLiquid(item.id, item.data)) {
          item.count -= 1;
        } else {
          item.id = LiquidItemRegistry.getEmptyItem(item.id, item.data).id;
        }
        item.validate();
        item.markDirty();
      }
      return amount;
    }

    run(): void {
      let newActive = false;
      let energyStorage = this.getEnergyStorage();
      if (this.data.energy + this.generator <= energyStorage) {
        if (this.data.burn <= 0) {
          this.data.burn = this.data.burnMax = this.getBurnTime("slotFuel");
        }
        if (this.data.burn > 0) {
          this.data.energy = Math.min(this.data.energy + this.generator, energyStorage);
          this.data.burn--;
          newActive = true;
        }
      }
      this.setActive(newActive);
    }

    onTick(): void {
      this.initCapacitor();
      StorageInterface.checkHoppers(this);

      let capacitor = this.container.getSlot("slotCapacitor");
      if (!!CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }

      this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      Game.message(this.data.energy + "/" + this.energyStorage + " Ratio: " + this.getRelativeEnergy());
      this.container.sendChanges();
    }

    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, 60);
      this.data.energy += src.add(output) - output;
    }

    canRotate(side: number): boolean {
      return side > 1;
    }
  }

  MachineRegistry.registerPrototype(BlockID.stirlingGen, new StirlingGenerator());

  StorageInterface.createInterface(BlockID.stirlingGen, {
    slots: {
      slotFuel: { input: true },
    },
    isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0,
  });
}
