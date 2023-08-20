BlockRegistry.createBlock("simpleStirlingGen", [
  {
    name: "tile.block_simple_stirling_generator.name",
    texture: [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_stirling_gen_simple_front_off", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]],
    inCreative: true
  }
], "machine");


TileRenderer.setStandardModelWithRotation(BlockID.simpleStirlingGen, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_stirling_gen_simple_front_off", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.simpleStirlingGen, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_stirling_gen_simple_front_on", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);

TileRenderer.setRotationPlaceFunction(BlockID.simpleStirlingGen);

Callback.addCallback("PreLoaded", function() {

  Recipes.addShaped({ id: BlockID.simpleStirlingGen, count: 1, data: 0 },
    ["sas",
     "sfs",
     "gpg"],
    ['s', VanillaBlockID.stonebrick, 0, 'f', BlockID.machineChassiSimple, 0, 'g', ItemID.ironGear, 0, "p", VanillaBlockID.piston, 0, "a", 61, 0]);

});
var simpleStirlingGenGUI = MachineRegistry.createInventoryWindow("Simple Stirling Generator", {
  drawing: [
    { type: "bitmap", x: 450, y: 135, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
	],

  elements: {
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2 },
    "burningScale": { type: "scale", x: 450, y: 135, direction: 1, bitmap: "fire_scale1", scale: 3.2 },
    "slotFuel": { type: "slot", x: 441, y: 180 },
    //  "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" }
  }
});

namespace Machine {
  export class SimpleStirlingGenerator extends Generator {
    defaultValues = {
      energy: 0,
      burn: 0,
      burnMax: 0
    };

    bonus = 1;
    energyStorage = 2000;


    getScreenByName(): UI.IWindow {
      return simpleStirlingGenGUI;
    };

    setupContainer(): void {
      StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
        return Recipes.getFuelBurnDuration(id, data) > 0;
      });
    };

    consumeFuel(slotName: string): number {
      let fuelSlot = this.container.getSlot(slotName);
      if (fuelSlot.id > 0) {
        let burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
        if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
          this.decreaseSlot(fuelSlot, 1);
          return burn;
        };
      };
      return 0;
    };

    onTick(): void {
      StorageInterface.checkHoppers(this);
      if (this.data.energy >= 0.1)
        this.data.energy -= 0.1;
        
      let newActive = false;
      const energyStorage = 2000;
      if (this.data.energy + 30 <= energyStorage) {
        if (this.data.burn <= 0) {
          this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4;
        };
        if (this.data.burn > 0) {
          this.data.energy = Math.min(this.data.energy + 30, energyStorage);
          this.data.burn--;
          newActive = true;
        };
      };
      this.setActive(newActive);

      this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
      this.container.setScale("energyScale", this.data.energy/2000);
      this.container.sendChanges();
    };
  };

  MachineRegistry.registerPrototype(BlockID.simpleStirlingGen, new SimpleStirlingGenerator());

  StorageInterface.createInterface(BlockID.simpleStirlingGen, {
    slots: {
      "slotFuel": { input: true }
    },
    isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0
  });
};