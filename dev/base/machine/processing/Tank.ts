BlockRegistry.createBlock(
  "eioTank",
  [
    {
      name: "tile.block_tank.name",
      texture: [["basic_tank", 0]],
      inCreative: true,
    },
  ],
  "other-machine",
);

ICRender.getGroup("liquid_pipe").add(BlockID.eioTank, -1);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.eioTank, count: 1, data: 0 },
    ["iri", "rmr", "iri"],
    ["i", VanillaItemID.iron_ingot, 0, "r", VanillaTileID.iron_bars, 0, "m", VanillaBlockID.glass, -1],
  );
});

let guiTank = MachineRegistry.createInventoryWindow(Translation.translate("enderio.gui.tank.tank"), {
  drawing: [
    {
      type: "bitmap",
      x: 100 + 70 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      bitmap: "liquid_bar",
      scale: GUI_SCALE,
    },
  ],

  elements: {
    liquidScale: {
      type: "scale",
      x: 100 + 70 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      direction: 1,
      value: 0.5,
      bitmap: "gui_water_scale",
      overlay: "gui_liquid_storage_overlay",
      scale: GUI_SCALE,
    },
    slotLiquid1: {
      type: "slot",
      x: 100 + 94 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      /* isValid: function(id, count, data) {
         return !!LiquidItemRegistry.getEmptyItem(item.id, item.data);
       }*/
    },
    slotLiquid2: {
      type: "slot",
      x: 170 + 94 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      /* isValid: function(id, count, data) {
         return !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");
       }*/
    },
    slotOut: {
      type: "slot",
      x: 100 + 94 * GUI_SCALE,
      y: 50 + 40 * GUI_SCALE,
    },
  },
});

namespace Machine {
  export class Tank extends MachineBase {
    liquidTank: BlockEngine.LiquidTank;

    getScreenByName(): UI.IWindow {
      return guiTank;
    }

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 16000);
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
        if (name == "slotLiquid1") {
          let liquid = LiquidItemRegistry.getItemLiquid(id, data, extra);
          if (this.liquidTank.getLiquidStored()) return liquid == this.liquidTank.getLiquidStored();
          else return !!liquid;
        }
        if (name == "slotLiquid2") return LiquidItemRegistry.canBeFilledWithLiquid(id, data, extra, this.liquidTank.getLiquidStored() || "water");
        if (name == "slotOutput") return false;
        return false;
      });
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (Entity.getSneaking(player)) {
        if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player) || MachineRegistry.emptyTankOnClick(this.liquidTank, item, player)) {
          this.preventClick();
          return true;
        }
      }
      return super.onItemUse(coords, item, player);
    }

    onTick(): void {
      let slot1 = this.container.getSlot("slotLiquid1");
      let slot2 = this.container.getSlot("slotLiquid2");
      let out = this.container.getSlot("slotOut");
      this.liquidTank.getLiquidFromItem(slot1, out);
      this.liquidTank.addLiquidToItem(slot2, out);
      this.liquidTank.updateUiScale("liquidScale");
      this.container.sendChanges();
    }
  }
  MachineRegistry.registerPrototype(BlockID.eioTank, new Tank());

  MachineRegistry.createStorageInterface(BlockID.eioTank, {
    slots: {
      slotLiquid2: {
        input: true,
        isValid: (item, side, tileEntity: Tank) => {
          return LiquidItemRegistry.canBeFilledWithLiquid(item.id, item.data, item.extra, tileEntity.liquidTank.getLiquidStored() || "water");
        },
      },
      slotLiquid1: {
        input: true,
        isValid: (item, side, tileEntity: Tank) => {
          let liquid = LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra);
          if (tileEntity.liquidTank.getLiquidStored()) return liquid == tileEntity.liquidTank.getLiquidStored();
          else return !!liquid;
        },
      },
      slotOut: {
        output: true,
      },
    },
    canReceiveLiquid: () => true,
    canTransportLiquid: () => true,
  });
}
