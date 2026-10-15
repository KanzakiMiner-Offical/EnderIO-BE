BlockRegistry.createBlock(
  "simpleStirlingGen",
  [
    {
      name: "tile.block_simple_stirling_generator.name",
      texture: [
        ["simple_machine_bottom", 0],
        ["simple_machine_top", 0],
        ["simple_machine_side", 0],
        ["block_stirling_gen_simple_front_off", 0],
        ["simple_machine_side", 0],
        ["simple_machine_side", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.simpleStirlingGen, 0, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["block_stirling_gen_simple_front_off", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.simpleStirlingGen, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["block_stirling_gen_simple_front_off", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.simpleStirlingGen, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["block_stirling_gen_simple_front_on", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);

TileRenderer.setRotationFunction(BlockID.simpleStirlingGen);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.simpleStirlingGen, count: 1, data: 0 },
    ["sas", "sfs", "gpg"],
    ["s", VanillaBlockID.stonebrick, 0, "f", BlockID.machineChassisSimple, 0, "g", ItemID.ironGear, 0, "p", VanillaBlockID.piston, 0, "a", 61, 0],
  );
});
var simpleStirlingGenGUI = MachineRegistry.createInventoryWindow("Simple Stirling Generator", {
  drawing: [
    { type: "bitmap", x: 450, y: 135, bitmap: "fire_scale0", scale: 3.2 },
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
    burningScale: {
      type: "scale",
      x: 450,
      y: 135,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
    },
    slotFuel: { type: "slot", x: 441, y: 180 },
  },
});

namespace Machine {
  export class SimpleStirlingGenerator extends Generator {
    defaultValues = {
      energy: 0,
      burn: 0,
      burnMax: 0,
    };

    generator = 0;
    efficiency = 1;

    bonus = 1;
    energyStorage = CapacitorKey.SIMPLE_STIRLING_POWER_BUFFER.getBaseValue();

    getScreenByName(): UI.IWindow {
      return simpleStirlingGenGUI;
    }

    setupContainer(): void {
      StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
        return Recipes.getFuelBurnDuration(id, data) > 0;
      });
    }

    getBurnTime(name: string): number {
      let item = this.container.getSlot(name);
      let base = (Recipes.getFuelBurnDuration(item.id, item.data) / (this.generator / CapacitorKey.SIMPLE_STIRLING_POWER_GEN.getBaseValue())) * this.efficiency;
      if (LiquidRegistry.getItemLiquid(item.id, item.data)) {
        // Lava and other fluid buckets are nerfed, prefer combustion engine for those
        base /= 5;
      }
      // The vanilla burn time results in 24,000FE for a piece of coal at 15FE/t output.
      // So we hardcode 15 as a baseline to keep that density consistent
      let amount = Math.round((base /= CapacitorKey.SIMPLE_STIRLING_POWER_GEN.getBaseValue() / 15));
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

    lossEnergy(): void {
      if (this.data.energy >= CapacitorKey.SIMPLE_STIRLING_POWER_LOSS.getBaseValue()) this.data.energy -= CapacitorKey.SIMPLE_STIRLING_POWER_LOSS.getBaseValue();
    }

    onTick(): void {
      StorageInterface.checkHoppers(this);
      this.lossEnergy();
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

      this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
      this.container.setScale("energyScale", this.data.energy / 2000);
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.simpleStirlingGen, new SimpleStirlingGenerator());

  StorageInterface.createInterface(BlockID.simpleStirlingGen, {
    slots: {
      slotFuel: { input: true },
    },
    isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0,
  });
}
