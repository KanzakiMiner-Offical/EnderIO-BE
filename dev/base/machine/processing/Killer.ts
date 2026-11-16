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
  drawing: [{ type: "bitmap", x: 175, y: 33, bitmap: "fluid_bg", scale: 6 }],

  elements: {
    liquidScale: { type: "scale", x: 175, y: 33, bitmap: "fluid_bg", direction: 1, scale: 6 },
    slotSword: { type: "slot", x: 455, y: 73.57, size: 90 },
    slotLiquid1: { type: "slot", x: 290, y: 195, size: 90, bitmap: "slot_fluid_empty" },
    slotLiquid0: { type: "slot", x: 290, y: 73.57, size: 90, bitmap: "slot_fluid_full" },
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
  EEntityType.HORSE,
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

      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
        if (name == "slotLiquid0") {
          let liquid = LiquidItemRegistry.getItemLiquid(id, data, extra);
          return liquid == "nutrientDistillation";
        }
        if (name == "slotOutput") return false;
        return false;
      });
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (Entity.getSneaking(player) && item.id != ItemID.itemYetaWrench) {
        MachineRegistry.fillTankOnClick(this.liquidTank, item, player);
      }
      return false;
    }

    applyDamage(slot: ItemContainerSlot): void {
      let damage = 1;
      if (ChargeItemRegistry.isValidItem(slot.id, "Rf", 5)) {
        ChargeItemRegistry.getEnergyFrom(slot, "Rf", 500, 5);
      } else if (ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)) {
        ChargeItemRegistry.getEnergyFrom(slot, "Eu", 500, 5);
      } else if (slot.extra && !ChargeItemRegistry.isValidItem(slot.id, "Rf", 5) && !ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)) {
        let unbreakingLevel = slot.extra.getEnchantLevel(EEnchantment.UNBREAKING);
        if (Math.random() < 1 / (unbreakingLevel + 1)) {
          slot.data += damage;
        }
      } else {
        slot.data += damage;
      }
      if (slot.data >= Item.getMaxDamage(slot.id) && !ChargeItemRegistry.isValidItem(slot.id, "Rf", 5) && !ChargeItemRegistry.isValidItem(slot.id, "Eu", 5)) {
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
          if (damageTool > 0 && World.getThreadTime() % 10 == 0) {
            for (let i in MOBS) {
              let ent = Entity.findNearest({ x: this.x, y: this.y, z: this.z }, MOBS[i], 7);
              if (ent && storage.getAmount("nutrientDistillation") >= 0.25 && World.getThreadTime() % 10 == 0) {
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
      let region = BlockSource.getDefaultForActor(player);
      let item = this.getDemontaged();
      region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, item.id, item.count, item.data, item.extra);
    }

    // Default function for  Machine drop
    getDemontaged(): ItemInstance {
      let item = new ItemStack(this.blockID, 1, 0);
      let extra = new ItemExtraData();
      if (this.getTankName().length > 0) {
        let data: { [name: string]: { fluid: string; amount: number } } = {};
        this.getTankName().forEach((tank_name) => {
          if (this[tank_name]) {
            let liquidTank = this[tank_name] as BlockEngine.LiquidTank;
            let liquid = liquidTank.getLiquidStored();
            let amount = liquidTank.getAmount(liquid);
            data[tank_name] = {
              fluid: liquid,
              amount: amount,
            };
          }
        });
        extra.putSerializable("liquid_tank", data);
      }
      if (this.container) {
        extra.putSerializable("container", this.container);
      }
      if (extra) item.extra = extra;
      return item;
    }
  }
  MachineRegistry.registerPrototype(BlockID.killerJoe, new KillerJoe());
  MachineRegistry.createStorageInterface(BlockID.killerJoe, {
    slots: {
      slotLiquid0: {
        input: true,
        isValid: (item, side, tileEntity: KillerJoe) => {
          let liquid = LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra);
          return liquid == "nutrientDistillation";
        },
      },
    },
    canReceiveLiquid: (liquid: string, side: number, tileEntity: TileEntity) => {
      return VatRecipe.getLiquidInput().indexOf(liquid) !== -1;
    },
    canTransportLiquid: () => true,
  });
}

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id: BlockID.killerJoe, count: 1, data: 0 }, ["sss", "qzq", "qqq"], ["s", ItemID.darkSteel, 0, "q", 20, 0, "z", ItemID.skullZombieController, 0]);
});
