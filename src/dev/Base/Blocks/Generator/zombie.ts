BlockRegistry.createBlock(
  "zombieGen",
  [
    {
      name: "tile.block_zombie_generator.name",
      texture: [["darkSteelBlock", 0]],
      inCreative: true,
    },
  ],
  "other-machine"
);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.zombieGen, count: 1, data: 0 },
    ["iii", "rmr", "rrr"],
    [
      "i",
      ItemID.electricalSteel,
      0,
      "r",
      BlockID.fusedQuartz,
      0,
      "m",
      ItemID.skullZombieElectrode,
      0,
    ]
  );
});

var zombieGenRender = new ICRender.Model();
var model = BlockRenderer.createModel();

model.addBox(
  1 / 16,
  0 / 16,
  1 / 16,
  15 / 16,
  1 / 16,
  15 / 16,
  "darkSteelBlock",
  0
);
model.addBox(
  1 / 16,
  1 / 16,
  14 / 16,
  2 / 16,
  13 / 16,
  15 / 16,
  "darkSteelBlock",
  0
);
model.addBox(
  14 / 16,
  1 / 16,
  14 / 16,
  15 / 16,
  13 / 16,
  15 / 16,
  "darkSteelBlock",
  0
);
model.addBox(
  14 / 16,
  1 / 16,
  1 / 16,
  15 / 16,
  13 / 16,
  2 / 16,
  "darkSteelBlock",
  0
);
model.addBox(
  1 / 16,
  1 / 16,
  1 / 16,
  2 / 16,
  13 / 16,
  2 / 16,
  "darkSteelBlock",
  0
);
model.addBox(
  1 / 16,
  13 / 16,
  1 / 16,
  15 / 16,
  14 / 16,
  15 / 16,
  "darkSteelBlock",
  0
);

model.addBox(
  4 / 16,
  2 / 16,
  3 / 16,
  13 / 16,
  12 / 16,
  13 / 16,
  "killerJoeZombieOther",
  0
);
model.addBox(
  3 / 16,
  2 / 16,
  3 / 16,
  4 / 16,
  12 / 16,
  13 / 16,
  "killerJoeZombie",
  0
);

model.addBox(1 / 16, 1 / 16, 2 / 16, 2 / 16, 13 / 16, 14 / 16, 20, 0);
model.addBox(2 / 16, 1 / 16, 1 / 16, 14 / 16, 13 / 16, 2 / 16, 20, 0);
model.addBox(2 / 16, 1 / 16, 14 / 16, 14 / 16, 13 / 16, 15 / 16, 20, 0);
model.addBox(14 / 16, 1 / 16, 2 / 16, 15 / 16, 13 / 16, 14 / 16, 20, 0);

zombieGenRender.addEntry(model);
BlockRenderer.setStaticICRender(BlockID.zombieGen, -1, zombieGenRender);

Block.setBlockShape(
  BlockID.zombieGen,
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 1, z: 1 }
);

var guiZombieGen = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_zombie_generator.name"), {
  drawing: [
    { type: "bitmap", x: 470, y: 66, bitmap: "fluid_scale", scale: 3.2 },
    { type: "bitmap", x: 66, y: 135, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
  ],

  elements: {
    text: { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    energyScale: {
      type: "scale",
      x: 335,
      y: 140,
      direction: 1,
      value: 0.5,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    slotCapacitor: { type: "slot", x: 325, y: 320 },
    textInstall: {
      type: "text",
      font: { size: 20, color: Color.YELLOW },
      x: 325,
      y: 50,
      width: 100,
      height: 30,
      text: "",
    },
    burningScale: {
      type: "scale",
      x: 660,
      y: 135,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
    },
    liquidScale: {
      type: "scale",
      x: 470,
      y: 275,
      direction: 1,
      bitmap: "fluid_scale",
      scale: 3.2,
    },
    slotLiquid0: { type: "slot", x: 600, y: 240 },
    slotLiquid1: { type: "slot", x: 600, y: 180 },
  },
});

//
namespace Machine {
  export class ZombieGenerator extends Generator {
    liquidTank: BlockEngine.LiquidTank;
    defaultValues = {
      energy: 0,
      burn: 0,
      burn_max: 0,
    };

    defaultEnergyStorage = 100000;
    defaultBonus = 1;

    getScreenByName(screenName?: string): UI.IWindow {
        return guiZombieGen
    }

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 4000, ["nutrientDistillation"]);
    }
    useCapacitor(): CapacitorAPI.CapacitorSet {
      var upgrades = CapacitorAPI.useCapacitor(this);
      this.bonus = upgrades.getBonusGenerator(this.defaultBonus);
      this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
      return upgrades;
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (Entity.getSneaking(player)) {
        if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
          this.preventClick();
          return true;
        }
      }
      return super.onItemUse(coords, item, player);
    }

    onTick(): void {
      let slot0 = this.container.getSlot("slotLiquid0");
      let slot1 = this.container.getSlot("slotLiquid1");
      let capacitor = this.container.getSlot("slotCapacitor");
      this.liquidTank.updateUiScale("liquidScale");

      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        if (this.liquidTank.getAmount("nutrientDistillation") >= 1400 && this.data.energy <= this.getEnergyStorage() + 80 * this.bonus) {
          this.data.energy += 80 * this.bonus;
          this.liquidTank.getLiquid("nutrientDistillation", 0.08);
          this.setActive(true);
        } else {
          this.setActive(false);
        }
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }

      this.liquidTank.getLiquidFromItem(slot0, slot1);

      var energyStorage = this.getEnergyStorage();
      this.data.energy = Math.min(this.data.energy, energyStorage);
      this.container.setText("text", "RF: " + this.data.energy + "/" + this.getEnergyStorage() + ".Bonus energy: x" + this.bonus + ".0");
      this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
      this.container.sendChanges();
    }
    getEnergyStorage(): number {
      return this.energyStorage;
    }

    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(80 * this.bonus, this.data.energy);
      this.data.energy += src.add(output) - output;
    }
  }
  TileEntity.registerPrototype(BlockID.zombieGen, new ZombieGenerator());
  MachineRegistry.createStorageInterface(BlockID.zombieGen, {
    slots: {
      slotLiquid0: { input: true },
      slotLiquid1: { output: true },
    },
    isValidInput: (item: ItemInstance, side: number, tileEntity: TileEntity): boolean => {
      return LiquidItemRegistry.getItemLiquid(item.id, item.data) == "nutrientDistillation";
    },
    canReceiveLiquid: (liquid: string, side: number): boolean => {
      return liquid == "nutrientDistillation";
    },
    canTransportLiquid: (liquid: string, side: number): boolean => {
      return false
    }
  })
}
