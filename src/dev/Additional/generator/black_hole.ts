BlockRegistry.createBlock(
  "blackholeControler",
  [
    {
      name: "Black Hole Controler",
      texture: [
        ["machineBottom", 0],
        ["bh_controler_top", 0],
        ["bh_controler", 0],
        ["bh_controler", 0],
        ["bh_controler", 0],
        ["bh_controler", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

Block.setShape(BlockID.blackholeControler, 0, 0, 0, 1, 20 / 32, 1, -1);

let controlerUI = MachineRegistry.createInventoryWindow("Black Hole Controler", {
  drawing: [{ type: "bitmap", x: 135, y: 140, bitmap: "redflux_bar0", scale: 3.2 }],
  elements: {
    energyScale: {
      type: "scale",
      x: 135,
      y: 140,
      direction: 1,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    liquidScale: {
      type: "scale",
      x: 270,
      y: 275,
      direction: 1,
      bitmap: "fluid_scale",
      overlay: "fluid_scale",
      scale: 3.2,
    },
    slotCapacitor: { type: "slot", x: 125, y: 320, maxStackSize: 1 },

    slotInput: { type: "slot", x: 190, y: 90, maxStackSize: 1 },

    slotLiquid0: { type: "slot", x: 400, y: 240 },
    slotLiquid1: { type: "slot", x: 400, y: 180 },
  },
});

namespace Machine {
  class Controler extends Generator {
    defaultValues = {
      energy: 0,
      progress: 0,
      stabilizer: 0,
    };

    defaultEnergyStorage = 1000000000;
    defaultBonus = 1;

    upgrades: ["capacitor"];
    liquidTank: BlockEngine.LiquidTank;

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorAPI.isValidCapacitor(id, this);
        if (name.startsWith("slotInput")) return id == ItemID.blackhole;
        return false;
      });
    }

    useCapacitor(): CapacitorAPI.CapacitorSet {
      let upgrades = CapacitorAPI.useCapacitor(this);
      this.bonus = upgrades.getBonusGenerator(this.defaultBonus) / 10 + 1;
      this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
      return upgrades;
    }

    onInit(): void {
      this.liquidTank = this.addLiquidTank("fluid", 100000, ["enderDistillation"]);
      this.getStabilizer();
    }

    getScreenByName(): UI.IWindow {
      return controlerUI;
    }
    getStabilizer(): void {
      if (this.region.getBlockId(this.x + 2, this.y + 1, this.z) === BlockID.blockSoularium) this.data.stabilizer++;
      if (this.region.getBlockId(this.x - 2, this.y + 1, this.z) === BlockID.blockSoularium) this.data.stabilizer++;
      if (this.region.getBlockId(this.x, this.y + 1, this.z + 2) === BlockID.blockSoularium) this.data.stabilizer++;
      if (this.region.getBlockId(this.x, this.y + 1, this.z - 2) === BlockID.blockSoularium) this.data.stabilizer++;
    }

    chargeBlackHole(): void {
      let slot = this.container.getSlot("slotInput");
      if (slot.id == ItemID["blackhole"]) {
        let extra = slot.extra || new ItemExtraData();
        if (!extra.getInt("quantity") || extra.getInt("quantity") <= 2500000 * Math.max(1, this.data.stabilizer)) {
          let quantity = !!extra.getInt("quantity") ? extra.getInt("quantity") : 0;
          extra.putInt("quantity", quantity + this.liquidTank.getAmount() / 1000);
        }
      }
    }

    generator(): void {
      let slot = this.container.getSlot("slotInput");
      if (slot.id == ItemID["blackhole"]) {
        let extra = slot.extra || new ItemExtraData();
        if (extra.getInt("quantity")) {
          let quantity = extra.getInt("quantity");
          if (quantity <= 2500000 * (1 + this.data.stabilizer)) {
            this.data.energy += 400 * quantity * (1 + this.data.stabilizer) * this.bonus; // base value x quantity x stabilizer count x bonus from capacitor
          } else if (quantity <= 2500000 * (1 + this.data.stabilizer) + 1) {
            slot.count = 0;
            this.explode();
          }
        }
        slot.extra = extra;
      }
    }

    onTick(): void {
      this.useCapacitor();
      StorageInterface.checkHoppers(this);

      this.getStabilizer();
      let slot0 = this.container.getSlot("slotLiquid0");
      let slot1 = this.container.getSlot("slotLiquid1");
      this.liquidTank.getLiquidFromItem(slot0, slot1);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.generator();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
      this.container.setScale("energyScale", this.data.energy / this.energyStorage || 0);
      this.liquidTank.updateUiScale("liquidScale");
      this.container.sendChanges();
    }

    explode(radius: number = 50): void {
      let height = radius / 2;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -height; dy <= height; dy++) {
          for (let dz = -radius; dz <= radius; dz++) {
            if (Math.sqrt(dx * dx + dy * dy * 4 + dz * dz) <= radius) {
              let xx = this.x + dx,
                yy = this.y + dy,
                zz = this.z + dz;
              let block = this.blockSource.getBlock(xx, yy, zz);
              if (block.id > 0) {
                if (Math.random() < 0.01) {
                  let drop = this.blockSource.breakBlockForJsResult(xx, yy, zz, -1, new ItemStack());
                  for (let item of drop.items) {
                    this.blockSource.spawnDroppedItem(xx + 0.5, yy + 0.5, zz + 0.5, item.id, item.count, item.data, item.extra || null);
                  }
                } else {
                  this.blockSource.setBlock(xx, yy, zz, 0, 0);
                }
              }
            }
          }
        }
      }
    }
  }
  MachineRegistry.registerPrototype(BlockID.blackholeControler, new Controler());
}
