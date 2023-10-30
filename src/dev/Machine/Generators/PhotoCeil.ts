BlockRegistry.registerBlock(new BlockPhotovoltaic("simplePhotovoltaicCell", "tile.block_solar_panel.simple.name", [["solar_panel_simple_side", 0], ["solar_panel_simple_top", 0], ["solar_panel_simple_side", 0]]))

namespace Machine {
  export class SimplePhotovoltaicCell extends Generator {
    defaultValues = {
      energy: 0,
      canSeeSky: false
    }

    getScreenByName(): UI.IWindow {
      return;
    };

    onInit(): void {
      this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
    }

    onTick(): void {
      let energyStorage = this.getEnergyStorage();
      this.data.energy = Math.min(this.data.energy, energyStorage);
      if (World.getThreadTime() % 100 == 0) {
        this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
      }
      if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) >= 14) {
        this.data.energy += 20;
      }
    }
    getEnergyStorage(): number {
      return 20;
    }
  }
  MachineRegistry.registerPrototype(BlockID.simplePhotovoltaicCell, new SimplePhotovoltaicCell());
}

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id: BlockID.simplePhotovoltaicCell, count: 1, data: 0 },
    ["aga",
      "sss",
      "epe"],
    ['e', ItemID.dustInfinity, 0, 'a', ItemID.electricalSteel, 0, 's', ItemID.platePhotovoltaic, 0, 'p', ItemID.ironGear, 0, 'g', BlockID.fusedQuartz, 0]);

});