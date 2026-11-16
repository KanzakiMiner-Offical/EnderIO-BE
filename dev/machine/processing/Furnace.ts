BlockRegistry.createBlock(
  "simplePoweredFurnace",
  [
    {
      name: "tile.block_simple_furnace.name",
      texture: [
        ["simple_machine_bottom", 0],
        ["simple_machine_top", 0],
        ["simple_machine_side", 0],
        ["furnace_simple_front", 0],
        ["simple_machine_side", 0],
        ["simple_machine_side", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.simplePoweredFurnace, 0, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["furnace_simple_front", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.simplePoweredFurnace, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["furnace_simple_front", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.simplePoweredFurnace, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["furnace_simple_front_on", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);

TileRenderer.setRotationFunction(BlockID.simplePoweredFurnace);

let simpleFurnaceUI = MachineRegistry.createInventoryWindow("Simple Powered Furnace", {
  drawing: [
    { type: "bitmap", x: 425, y: 235, bitmap: "fire_scale0", scale: 5 },
    { type: "bitmap", x: 205, y: 235, bitmap: "fire_scale0", scale: 5 },
    { type: "bitmap", x: 76, y: 96, bitmap: "redflux_bar0", scale: 4 },
  ],
  elements: {
    progressScale0: {
      type: "scale",
      x: 425,
      y: 235,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
      bitmap: "fire_scale1",
      direction: 1,
      scale: 5,
    },
    progressScale1: {
      type: "scale",
      x: 205,
      y: 235,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
      bitmap: "fire_scale1",
      direction: 1,
      scale: 5,
    },
    energyScale: { type: "scale", x: 76, y: 96, bitmap: "redflux_bar1", direction: 1, scale: 4 },
    sourceSlot: { type: "slot", x: 310, y: 44, size: 80 },
    slotResult: { type: "slot", x: 310, y: 285, size: 80 },
  },
});
Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.simplePoweredFurnace, count: 1, data: 0 },
    ["ibi", "fmf", "aca"],
    ["i", 265, 0, "f", 98, 0, "m", BlockID.machineChassisSimple, 0, "c", VanillaItemID.bucket, 0, "a", ItemID.stoneGear, 0, "b", 61, 0],
  );
});
namespace Machine {
  export class PoweredFurnace_Simple extends SimpleMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };
    processTime = (Recipes.getFuelBurnDuration(VanillaItemID.coal, -1) * 10) / 8;

    constructor() {
      super(
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_USE,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_BUFFER,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_INTAKE,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_LOSS,
      );
    }

    getScreenByName(): UI.IWindow {
      return simpleFurnaceUI;
    }

    onTick(): void {
      this.lossEnergy();
      StorageInterface.checkHoppers(this);
      let newActive = false;
      const slot = this.container.getSlot("sourceSlot");
      const result = Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron");
      if (result) {
        let resultSlot = this.container.getSlot("slotResult");
        if ((resultSlot.id == result.id && resultSlot.count + result.count <= 64) || !resultSlot.id) {
          if (this.data.energy >= this.energyConsume) {
            this.data.energy -= this.energyConsume;
            this.data.progress += this.energyConsume;
            newActive = true;
          }
          if (this.data.progress >= 3000) {
            slot.setSlot(slot.id, slot.count - 1, slot.data);
            slot.validate();
            resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
            this.container.validateAll();
            this.data.progress = 0;
          }
        }
      } else {
        this.data.progress = 0;
      }

      this.setActive(newActive);
      this.container.setScale("progressScale0", this.data.progress / 3000 || 0);
      this.container.setScale("progressScale1", this.data.progress / 3000 || 0);
      this.container.setScale("energyScale", this.getRelativeEnergy() || 0);
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.simplePoweredFurnace, new PoweredFurnace_Simple());
}
