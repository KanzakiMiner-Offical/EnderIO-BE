ItemRegistry.createItem("platePhotovoltaic", {
  name: "item.item_material.plate_photovoltaic.name",
  icon: "item_material_plate_photovoltaic",
});
ItemRegistry.createItem("dustPhotovoltaic", {
  name: "item.item_material.powder_photovoltaic.name",
  icon: "item_material_powder_photovoltaic",
});

class BlockPhotovoltaic extends BlockBase {
  constructor(id: string, name: string, texture: [string, number][], miningLevel?: number) {
    miningLevel = miningLevel || 1;
    super(id, "other-machine");
    this.addVariation(name, texture, true);
    this.setBlockMaterial("stone", miningLevel);
    this.setDestroyTime(3);
    this.setShape(0, 0, 0, 1, 0.2, 1, -1);

    Item.registerNameOverrideFunction(Block.getNumericId(id), function (item, translation, name) {
      return (
        name +
        "\n" +
        Translation.translate("tile.block_solar_panel.tooltip.common.line1") +
        "\n" +
        Translation.translate("tile.block_solar_panel.tooltip.detailed.line1") +
        "\n" +
        Translation.translate("tile.block_solar_panel.tooltip.detailed.line2")
      );
    });
  }
}

BlockRegistry.registerBlock(
  new BlockPhotovoltaic("photovoltaicCell", "tile.block_solar_panel.name", [
    ["solarPanelSide", 0],
    ["solarPanelTop", 0],
    ["solarPanelSide", 0],
  ]),
);
BlockRegistry.registerBlock(
  new BlockPhotovoltaic("advancedPhotovoltaicCell", "tile.block_solar_panel.advanced.name", [
    ["solarPanelAdvancedSide", 0],
    ["solarPanelAdvancedTop", 0],
    ["solarPanelAdvancedSide", 0],
  ]),
);
BlockRegistry.registerBlock(
  new BlockPhotovoltaic("vibrantPhotovoltaicCell", "tile.block_solar_panel.vibrant.name", [
    ["solarPanelVibrantSide", 0],
    ["solarPanelVibrantTop", 0],
    ["solarPanelVibrantSide", 0],
  ]),
);

Item.addCreativeGroup("photovoltaicCeil", Translation.translate("tile.block_solar_panel.name"), [
  BlockID.photovoltaicCell,
  BlockID.advancedPhotovoltaicCell,
  BlockID.vibrantPhotovoltaicCell,
]);

Callback.addCallback("PreLoaded", function () {
  if (!EnderConfig.oldMode) {
    Recipes.addShaped(
      { id: BlockID.advancedPhotovoltaicCell, count: 1, data: 0 },
      ["aga", "sbs", "epe"],
      ["e", ItemID.basicCapacitor, 0, "a", ItemID.pulsatingIron, 0, "s", ItemID.energeticAlloy, 0, "p", BlockID.photovoltaicCell, 0, "g", BlockID.fusedQuartz, 0, "b", ItemID.dustCoal, 0],
    );

    Recipes.addShaped(
      { id: BlockID.photovoltaicCell, count: 1, data: 0 },
      ["aga", "ppp", "ese"],
      ["e", ItemID.basicCapacitor, 0, "a", ItemID.energeticAlloy, 0, "s", 151, 0, "p", ItemID.platePhotovoltaic, 0, "g", BlockID.fusedQuartz, 0],
    );

    Recipes.addShaped(
      { id: BlockID.photovoltaicCell, count: 1, data: 0 },
      ["aga", " p ", "ese"],
      ["e", ItemID.basicCapacitor, 0, "a", ItemID.energeticAlloy, 0, "s", 151, 0, "p", BlockID.simplePhotovoltaicCell, 0, "g", BlockID.fusedQuartz, 0],
    );

    Recipes.addShaped({ id: ItemID.dustPhotovoltaic, count: 1, data: 0 }, ["   ", "sgp", "   "], ["s", ItemID.silicon, 0, "p", ItemID.dustLapis, 0, "g", ItemID.dustCoal, 0]);
    SmelterRecipe.addRecipe({
      ingredient1: { id: ItemID.dustPhotovoltaic, data: 0, count: 2 },
      //ingredient2: { id: 0, data: 0 },
      //ingredient3: { id: 0, data: 0, count: 0 },
      result: { id: ItemID.platePhotovoltaic, count: 6, data: 0 },
      energy: 15000,
    });
  } else {
    Recipes.addShaped(
      { id: BlockID.photovoltaicCell, count: 1, data: 0 },
      ["aga", "pgp", "ese"],
      ["e", ItemID.electricalSteel, 0, "a", ItemID.energeticAlloy, 0, "s", 151, 0, "p", ItemID.silicon, 0, "g", BlockID.fusedQuartz, 0],
    );

    Recipes.addShaped(
      { id: BlockID.advancedPhotovoltaicCell, count: 1, data: 0 },
      ["aga", "pgp", "ese"],
      ["e", ItemID.pulsatingIron, 0, "a", ItemID.vibrantAlloy, 0, "s", 151, 0, "p", ItemID.vibrantCrystal, 0, "g", BlockID.fusedQuartz, 0],
    );
  }
});

namespace Machine {
  export class PhotovoltaicCell extends Generator {
    defaultValues = {
      energy: 0,
      canSeeSky: false,
    };

    getScreenByName(): UI.IWindow {
      return null;
    }

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
        this.data.energy += 40;
      }
    }
    getEnergyStorage(): number {
      return 40;
    }
    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, 40);
      this.data.energy += src.add(output) - output;
    }
  }

  MachineRegistry.registerPrototype(BlockID.photovoltaicCell, new PhotovoltaicCell());
}

namespace Machine {
  export class AdvancePhotovoltaicCell extends Generator {
    defaultValues = {
      energy: 0,
      canSeeSky: false,
    };

    getScreenByName(): UI.IWindow {
      return null;
    }

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
        this.data.energy += 80;
      }
    }
    getEnergyStorage(): number {
      return 80;
    }
    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, 80);
      this.data.energy += src.add(output) - output;
    }
  }
  MachineRegistry.registerPrototype(BlockID.advancedPhotovoltaicCell, new AdvancePhotovoltaicCell());
}

namespace Machine {
  export class VibrabtPhotovoltaicCell extends Generator {
    defaultValues = {
      energy: 0,
      canSeeSky: false,
    };

    getScreenByName(): UI.IWindow {
      return null;
    }

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
        this.data.energy += 160;
      }
    }
    getEnergyStorage(): number {
      return 160;
    }
    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, 160);
      this.data.energy += src.add(output) - output;
    }
  }
  MachineRegistry.registerPrototype(BlockID.vibrantPhotovoltaicCell, new VibrabtPhotovoltaicCell());
}

// namespace Machine {
//   export class PhotovoltaicCellBase extends Generator {
//     defaultValues = {
//       energy: 0,
//       canSeeSky: false,
//     };
//     id: string;
//     maxGenerator: number;
//     constructor(maxGenerator: number, notUseNow?: any) {
//       super();
//       this.maxGenerator = maxGenerator;
//     }
//     getScreenByName(): UI.IWindow {
//       return null;
//     }

//     onInit(): void {
//       this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
//     }
//     getGenerationRate() {
//       let minuteInTicks = 20 * 60;
//       if (!this.isLoaded) {
//           return 0;
//       }
//       let day = true;
//       let night = false;
//       // if (soulData != null) {
//       //     day = soulData.daytime();
//       //     night = soulData.nighttime();
//       // }

//      let dayTime = parseInt(World.getWorldTime() % (minuteInTicks * 20) +"")
//       // float progress = 0;
//       // if ((day && night) || (day && hasLiquidSunshine())) {
//       //     progress = 1;
//       // } else
//       if (day) {
//           if (dayTime > minuteInTicks * 9) {
//               return 0;
//           }

//           if (dayTime < minuteInTicks) {
//               return 0;
//           }

//           progress = dayTime > minuteInTicks * 5 ? 10 * minuteInTicks - dayTime : dayTime;
//           progress = (progress - minuteInTicks) / (4 * minuteInTicks);
//       } else if (night) {
//           if (dayTime < minuteInTicks * 11) {
//               return 0;
//           }

//           if (dayTime > minuteInTicks * 18) {
//               return 0;
//           }
//           progress = dayTime > minuteInTicks * 15 ? 20 * minuteInTicks - dayTime :  minuteInTicks * 15 - dayTime;
//           progress = (progress - minuteInTicks) / (4 * minuteInTicks);
//       }

//       let easing =this.easing(progress);

//       if (level.isRaining() && !level.isThundering()) {
//           easing -= 0.3;
//       }

//       if (level.isThundering()) {
//           easing -= 0.7;
//       }

//       if (easing < 0) {
//           return 0;
//       }

//       return (int) (easing * tier.getProductionRate());
//   }

//     easing(progress: number) {
//       if (progress > 0.5) {
//         return 1 - Math.pow(-2 * progress + 2, 2) / 2;
//       }
//       return 2 * progress * progress;
//     }

//     onTick(): void {
//       let energyStorage = this.getEnergyStorage();
//       this.data.energy = Math.min(this.data.energy, energyStorage);
//       if (World.getThreadTime() % 100 == 0) {
//         this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
//       }
//       if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) >= 15) {
//         this.data.energy += this.maxGenerator;
//       }
//     }
//     getEnergyStorage(): number {
//       return this.maxGenerator;
//     }
//     energyTick(type: string, src: EnergyTileNode): void {
//       let output = Math.min(this.data.energy, this.maxGenerator);
//       this.data.energy += src.add(output) - output;
//     }
//   }
// }
