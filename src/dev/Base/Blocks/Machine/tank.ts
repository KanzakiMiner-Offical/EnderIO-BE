BlockRegistry.createBlock("eioTank", [
  {
    name: "tile.block_tank.name",
    texture: [
	["basic_tank", 0]],
    inCreative: true
  }
], "machine");


ICRender.getGroup("liquid_pipe").add(BlockID.eioTank, -1);

Item.registerNameOverrideFunction(BlockID.eioTank, function(item, name) {
  if (item.extra) {
    let name_fluid = item.extra.getString("fluid")
    let amount_fluid = item.extra.getInt("amount")
    return name + "\n§7" + Translation.translate("Liquid: ") + name_fluid + "\n§7" + Translation.translate("Amount: ") + "§a" + amount_fluid * 1000 + " mB";
  }
});
namespace Machine {
  export function setStoragePlaceFunction(id: string): void {
    Block.registerPlaceFunction(BlockID[id], function(coords, item, block, player, blockSource) {
      let worldRegion = new WorldRegion(blockSource);
      let place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
      blockSource.setBlock(place.x, place.y, place.z, item.id, 0);
      worldRegion.playSound(place.x, place.y, place.z, "dig.stone", 1, 0.8)
      let tile = worldRegion.addTileEntity(place.x, place.y, place.z);
      if (item.extra) {
        let name_fluid = item.extra.getString("fluid")
        let amount_fluid = item.extra.getInt("amount")
        if (amount_fluid > 0) {
          tile.liquidTank.addLiquid(name_fluid, amount_fluid);
        }
      }
    });
  }
}

Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.eioTank, count: 1, data: 0 }, [
      	"iri",
      	"rmr",
	     "iri"
    ], ['i', VanillaItemID.iron_ingot, 0, "r", VanillaTileID.iron_bars, 0, "m", VanillaBlockID.glass, -1
  ]);
});

let guiTank = MachineRegistry.createInventoryWindow(Translation.translate("enderio.gui.tank.tank"), {
  drawing: [
    { type: "bitmap", x: 611, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE },
	],

  elements: {
    "liquidScale": { type: "scale", x: 400 + 70 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, direction: 1, value: 0.5, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
    "slotLiquid1": {
      type: "slot",
      x: 400 + 94 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      /* isValid: function(id, count, data) {
         return !!LiquidItemRegistry.getEmptyItem(item.id, item.data);
       }*/
    },
    "slotLiquid2": {
      type: "slot",
      x: 470 + 94 * GUI_SCALE,
      y: 50 + 16 * GUI_SCALE,
      /* isValid: function(id, count, data) {
         return !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");
       }*/
    },
    "slotOut": {
      type: "slot",
      x: 400 + 94 * GUI_SCALE,
      y: 50 + 40 * GUI_SCALE,

    },
  }
})

MachineRegistry.createStorageInterface(BlockID.tank, {
  slots: {
    "slotLiquid2": {
      input: true,
      isValid: function(item) {
        return !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");
      }
    },
    "slotLiquid1": {
      input: true,
      isValid: function(item) {
        return !!LiquidItemRegistry.getEmptyItem(item.id, item.data);
      }
    },
    "slotOut": {
      output: true,
    },
  },
  canReceiveLiquid: () => true,
  canTransportLiquid: () => true
});

namespace Machine {
  export class Tank extends MachineBase {

    liquidTank: BlockEngine.LiquidTank;

    getScreenByName(): UI.IWindow {
      return guiTank;
    }

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 16000);
      StorageInterface.setGlobalValidatePolicy(this.container, function(name, id, amount, data) {
        if (name == "slotLiquid1")
          return !!LiquidItemRegistry.getEmptyItem(id, data);
        if (name == "slotLiquid2")
          return !!LiquidRegistry.getFullItem(id, data, "water");
        if (name == "slotOutput")
          return false;
        return false
      });
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (Entity.getSneaking(player)) {
        MachineRegistry.fillTankOnClick(this.liquidTank, item, player)
        this.preventClick();
        return true;
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

    destroyBlock(coords, player): void {
      let extra;
      let region = BlockSource.getDefaultForActor(player)
      let liquid = this.liquidTank.getLiquidStored()
      if (liquid) {
        extra = new ItemExtraData();
        extra.putString("fluid", liquid);
        extra.putInt("amount", this.liquidTank.getAmount(liquid));
      }
      BlockSource.getDefaultForActor(player).spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.eioTank, 1, 0, extra);
    }
  }
  MachineRegistry.registerPrototype(BlockID.eioTank, new Tank());
}
MachineRegistry.setStoragePlaceFunction("eioTank");