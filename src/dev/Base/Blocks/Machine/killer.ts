BlockRegistry.createBlock(
  "killerJoe",
  [
    {
      name: "tile.block_killer_joe.name",
      texture: [["machineBottom", 0]],
      inCreative: true,
    },
  ],
  "other-machine",
);

function setKillerJoeRender(): void {
  let killerJoeRender = new ICRender.Model();
  let model = BlockRenderer.createModel();

  model.addBox(1 / 16, 0 / 16, 1 / 16, 15 / 16, 1 / 16, 15 / 16, "machineBottom", 0);
  model.addBox(1 / 16, 1 / 16, 14 / 16, 2 / 16, 13 / 16, 15 / 16, "machineBottom", 0);
  model.addBox(14 / 16, 1 / 16, 14 / 16, 15 / 16, 13 / 16, 15 / 16, "machineBottom", 0);
  model.addBox(14 / 16, 1 / 16, 1 / 16, 15 / 16, 13 / 16, 2 / 16, "machineBottom", 0);
  model.addBox(1 / 16, 1 / 16, 1 / 16, 2 / 16, 13 / 16, 2 / 16, "machineBottom", 0);
  model.addBox(1 / 16, 13 / 16, 1 / 16, 15 / 16, 14 / 16, 15 / 16, "machineBottom", 0);

  model.addBox(4 / 16, 2 / 16, 3 / 16, 13 / 16, 12 / 16, 13 / 16, "killerJoeZombieOther", 0);
  model.addBox(3 / 16, 2 / 16, 3 / 16, 4 / 16, 12 / 16, 13 / 16, "killerJoeZombie", 0);

  model.addBox(1 / 16, 1 / 16, 2 / 16, 2 / 16, 13 / 16, 14 / 16, 20, 0);
  model.addBox(2 / 16, 1 / 16, 1 / 16, 14 / 16, 13 / 16, 2 / 16, 20, 0);
  model.addBox(2 / 16, 1 / 16, 14 / 16, 14 / 16, 13 / 16, 15 / 16, 20, 0);
  model.addBox(14 / 16, 1 / 16, 2 / 16, 15 / 16, 13 / 16, 14 / 16, 20, 0);

  killerJoeRender.addEntry(model);
  BlockRenderer.setStaticICRender(BlockID.killerJoe, -1, killerJoeRender);
}
setKillerJoeRender();
let guiKillerJoe = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_killer_joe.name"), {
  drawing: [{ type: "bitmap", x: 470, y: 66, bitmap: "fluid_scale", scale: 3.2 }],

  elements: {
    liquidScale: {
      type: "scale",
      x: 470,
      y: 66,
      direction: 1,
      bitmap: "fluid_scale",
      scale: 3.2,
    },
    slotSword: { type: "slot", x: 600, y: 60 },
    slotLiquid1: { type: "slot", x: 600, y: 240 },
    slotLiquid0: { type: "slot", x: 600, y: 180 },
  },
});

let MOBS: number[] = [
  EEntityType.BAT,
  EEntityType.CHICKEN,
  EEntityType.COW,
  EEntityType.MUSHROOM_COW,
  EEntityType.OCELOT,
  EEntityType.PIG,
  EEntityType.RABBIT,
  EEntityType.SHEEP,
  EEntityType.SNOW_GOLEM,
  EEntityType.SQUID,
  EEntityType.VILLAGER,
  EEntityType.WOLF,
  23,
  24,
  25,
  26,
  27,
  EEntityType.BLAZE,
  EEntityType.CAVE_SPIDER,
  EEntityType.CREEPER,
  EEntityType.ENDERMAN,
  EEntityType.GHAST,
  EEntityType.IRON_GOLEM,
  EEntityType.LAVA_SLIME,
  EEntityType.PIG_ZOMBIE,
  EEntityType.SILVERFISH,
  EEntityType.SKELETON,
  EEntityType.SLIME,
  EEntityType.SPIDER,
  EEntityType.ZOMBIE,
  EEntityType.ZOMBIE_VILLAGER,
  45,
  46,
  47,
  48,
  49,
  52,
  55,
];

namespace Machine {
  export class KillerJoe extends MachineBase {
    getScreenByName(): UI.IWindow {
      return guiKillerJoe;
    }
    liquidTank: BlockEngine.LiquidTank;

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 16000, ["nutrientDistillation"]);
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (Entity.getSneaking(player)) {
        MachineRegistry.fillTankOnClick(this.liquidTank, item, player);
      } else if (Entity.getSneaking(player) && item.id == ItemID.itemYetaWrench) {
        let extra: ItemExtraData;
        let liquid = this.liquidTank.getLiquidStored();
        if (liquid == "nutrientDistillation") {
          extra = new ItemExtraData();
          extra.putString("fluid", liquid);
          extra.putInt("amount", this.liquidTank.getAmount(liquid));
          return true;
        }
        this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID.killerJoe, 1, 0);
        this.blockSource.destroyBlock(this.x, this.y, this.z, false);
      }
      return false;
    }

    applyDamage(slot: any): void {
      let damage = 1;
      if (ChargeItemRegistry.isValidItem(slot.id, "Rf", 5)) {
        ChargeItemRegistry.getEnergyFrom(slot.id, "Rf", 500, 5);
      } else if (ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)) {
        ChargeItemRegistry.getEnergyFrom(slot.id, "Eu", 500, 5);
      } else if (slot.extra && !ChargeItemRegistry.isValidItem(slot.id, "Rf", 5) && !ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)) {
        let unbreakingLevel = slot.extra.getEnchantLevel(EEnchantment.UNBREAKING);
        if (Math.random() < 1 / (unbreakingLevel + 1)) {
          slot.data += damage;
        }
      } else {
        slot.data += damage;
      }
      if (
        slot.data >= Item.getMaxDamage(slot.id) &&
        !ChargeItemRegistry.isValidItem(slot.id, "Rf", 5) &&
        !ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)
      ) {
        slot.id = slot.data = slot.count = 0;
        slot.extra = null;
      }
    }

    onTick(): void {
      let storage = this.liquidTank;
      let slot1 = this.container.getSlot("slotLiquid0");
      let slot2 = this.container.getSlot("slotLiquid1");

      this.liquidTank.getLiquidFromItem(slot1, slot2);
      this.liquidTank.updateUiScale("liquidScale");

      let slotSword = this.container.getSlot("slotSword");
      if (slotSword.id) {
        let dataTool = ToolAPI.getToolData(slotSword.id);
        if (dataTool) {
          let damageTool = dataTool.damage + dataTool.toolMaterial.damage;
          if (damageTool > 0) {
            for (let i in MOBS) {
              let ent = Entity.findNearest({ x: this.x, y: this.y, z: this.z }, MOBS[i], 7);
              if (ent && storage.getAmount("nutrientDistillation") >= 0.02 && World.getThreadTime() % 10 == 0) {
                Entity.damageEntity(ent, damageTool);
                this.applyDamage(slotSword);
                storage.getLiquid("nutrientDistillation", 250);
              }
            }
          }
        }
      }
      this.container.sendChanges();
    }

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      let extra;
      let _region = BlockSource.getDefaultForActor(player);
      let liquid = this.liquidTank.getLiquidStored();
      if (liquid == "nutrientDistillation") {
        extra = new ItemExtraData();
        extra.putString("fluid", liquid);
        extra.putInt("amount", this.liquidTank.getAmount(liquid));
      }
      if (extra) _region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, BlockID.killerJoe, 1, 0, extra);
      else _region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, BlockID.killerJoe, 1, 0);
      //debug;
    }
  }
  MachineRegistry.registerPrototype(BlockID.killerJoe, new KillerJoe());
  MachineRegistry.setTankPlaceFunction("killerJoe");
  MachineRegistry.addTankTooltip(BlockID.eioTank);
}

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.killerJoe, count: 1, data: 0 },
    ["sss", "qzq", "qqq"],
    ["s", ItemID.darkSteel, 0, "q", 20, 0, "z", ItemID.skullZombieController, 0],
  );
});
