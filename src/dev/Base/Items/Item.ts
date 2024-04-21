EnderCore.registerDust(["Copper", "Wheat", "Iron", "Tin", "Coal", "Gold", "Ender", "Obsidian", "Sulfur"]);

EnderCore.createResourceItem("endSteel", "End Steel");
EnderCore.createResourceItem("darkSteel", "Dark Steel");
EnderCore.createResourceItem("conductiveIron", "Conductive Iron");
EnderCore.createResourceItem("pulsatingIron", "Pulsating Iron");
EnderCore.createResourceItem("soularium", "Soularium Alloy");
EnderCore.createResourceItem("electricalSteel", "Electrical Steel");
EnderCore.createResourceItem("energeticAlloy", "Energetic Alloy");
EnderCore.createResourceItem("redstoneAlloy", "Redstone Alloy");

ItemRegistry.createItem("pulsatingCrystal", { name: "item.item_material.pulsating_crystal.name", icon: "pulsatingCrystal", stack: 64 });
ItemRegistry.createItem("dustPulsating", { name: "item.item_material.pulsating_powder.name", icon: "pulsatingPowder", stack: 64 });
ItemRegistry.createItem("dustInfinity", { name: "item.item_material.powder_infinity.name", icon: "dustInfinity", stack: 64 });

// ModAPI.addAPICallback("KernelExtension", function (api: KEXAPI) {
//   if (typeof api.getKEXVersionCode === "function" && api.getKEXVersionCode() >= 300) {
//     KEX.ItemsModule.setFireResistant(ItemID.dustInfinity, true);
//   }
// });
ItemRegistry.createItem("binderComposite", { name: "item.item_material.binder_composite.name", icon: "binderComposite", stack: 64 });
ItemRegistry.createItem("conduitBinder", { name: "item.item_material.conduit_binder.name", icon: "conduitBinder", stack: 64 });
ItemRegistry.createItem("silicon", { name: "item.item_material.silicon.name", icon: "silicon", stack: 64 });
EnderCore.createResourceItem("vibrantAlloy", "Vibrant Alloy");
ItemRegistry.createItem("vibrantCrystal", { name: "item.item_material.vibrant_crystal.name", icon: "vibrantCrystal", stack: 64 });

ItemRegistry.createItem("dustVibrant", { name: "item.item_material.vibrant_powder.name", icon: "vibrantPowder", stack: 64 });

ItemRegistry.createItem("enderCrystal", { name: "item.item_material.ender_crystal.name", icon: "enderCrystal", stack: 64, glint: true });
ItemRegistry.createItem("dustEnderCrystal", { name: "item.item_material.ender_crystal_powder.name", icon: "enderCrystalPowder", stack: 64, glint: true });

ItemRegistry.createItem("weatherCrystal", { name: "item.item_material.weather_crystal.name", icon: "weatherCrystal", stack: 64, glint: true });

ItemRegistry.createItem("zombieSkull", { name: "Zombie Skull", icon: "zombieSkull", stack: 64 });
ItemRegistry.createItem("endermanSkull", { name: "Enderman Skull", icon: "endermanSkull", stack: 64 });
ItemRegistry.createItem("creeperSkull", { name: "Creeper Skull", icon: "creeperSkull", stack: 64 });
ItemRegistry.createItem("skeletonSkull", { name: "Skeleton Skull", icon: "skeletonSkull", stack: 64 });


Callback.addCallback("PreLoaded", function () {

  Recipes.addShapeless({ id: VanillaBlockID.skull, count: 1, data: 0 }, [{ id: ItemID.skeletonSkull, data: 0 }]);
  Recipes.addShapeless({ id: VanillaBlockID.skull, count: 1, data: 2 }, [{ id: ItemID.zombieSkull, data: 0 }]);
  Recipes.addShapeless({ id: VanillaBlockID.skull, count: 1, data: 4 }, [{ id: ItemID.creeperSkull, data: 0 }]);

  Recipes.addShapeless({ id: ItemID.skeletonSkull, count: 1, data: 0 }, [{ id: VanillaBlockID.skull, data: 0 }]);
  Recipes.addShapeless({ id: ItemID.zombieSkull, count: 1, data: 0 }, [{ id: VanillaBlockID.skull, data: 2 }]);
  Recipes.addShapeless({ id: ItemID.creeperSkull, count: 1, data: 0 }, [{ id: VanillaBlockID.skull, data: 4 }]);

  Recipes.addShaped({ id: ItemID.itemYetaWrench, count: 1, data: 0 }, [
    "e e",
    " a ",
    " e "
  ], ['a', ItemID.stoneGear, 0, 'e', ItemID.electricalSteel, 0]);

  Recipes.addShaped({ id: ItemID.weatherCrystal, count: 1, data: 0 }, [
    " a ",
    "beb",
    " a "
  ], ['a', ItemID.pulsatingCrystal, 0, 'e', ItemID.enderCrystal, 0, 'b', ItemID.vibrantCrystal, 0]);


  Recipes.addShaped({ id: ItemID.vibrantCrystal, count: 1, data: 0 }, [
    "aaa",
    "aea",
    "aaa"
  ], ['a', ItemID.vibrantAlloyNugget, 0, 'e', 388, 0]);

  Recipes.addShaped({ id: ItemID.pulsatingCrystal, count: 1, data: 0 }, [
    "aaa",
    "aea",
    "aaa"
  ], ['a', ItemID.pulsatingIronNugget, 0, 'e', VanillaItemID.diamond, 0]);

  Recipes.addShaped({ id: ItemID.basicCapacitor, count: 1, data: 0 }, [
    " rn",
    "rir",
    "nr "
  ], ['r', VanillaItemID.gold_nugget, 0, 'n', ItemID.dustInfinity, 0, 'i', VanillaItemID.redstone, 0]);


  Recipes.addShaped({ id: ItemID.doublelayerCapacitor, count: 1, data: 0 }, [
    " a ",
    "cpc",
    " a "
  ], ['a', ItemID.energeticAlloy, 0, 'c', ItemID.basicCapacitor, 0, 'p', ItemID.dustCoal, 0]);

  Recipes.addShaped({ id: ItemID.octadicCapacitor, count: 1, data: 0 }, [
    " a ",
    "cpc",
    " a "
  ], ['a', ItemID.vibrantAlloy, 0, 'c', ItemID.doublelayerCapacitor, 0, 'p', 89, 0]);

  Recipes.addShaped({ id: ItemID.binderComposite, count: 8, data: 0 }, [
    "csc",
    "scs",
    "csc"
  ], ['c', 337, 0, 's', 12, 0]);
  Recipes.addFurnace(ItemID.binderComposite, ItemID.conduitBinder, 0);

  EnderCore.addIngotRecipe(ItemID.dustCopper, "ingotCopper");
  EnderCore.addIngotRecipe(ItemID.dustTin, "ingotTin");
  EnderCore.addIngotRecipe(ItemID.dustIron, 265);
  EnderCore.addIngotRecipe(ItemID.dustGold, 266);

});

ItemRegistry.createItem("skullZombieController", { name: "item.item_material.skull_zombie_controller.name", icon: "skullZombieController", stack: 64 });
ItemRegistry.createItem("skullZombieElectrode", { name: "item.item_material.skull_zombie_electrode.name", icon: "skullZombieElectrode", stack: 64 });

Callback.addCallback("ItemUse", function (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number): void {
  let region = BlockSource.getDefaultForActor(player)
  if (region.getBlockId(coords.x, coords.y, coords.z) == VanillaBlockID.bedrock && item.id == VanillaItemID.flint_and_steel && coords.side == EBlockSide.UP) {
    if (Math.random() <= 0.5) {
      region.spawnDroppedItem(coords.x, coords.y + 1, coords.z, ItemID.dustInfinity, 1, 0);
    }
  }
});

class XpTransfer extends ItemCommon {
  max_store: number = 10000 // xp
  constructor() {
    super("itemXpTransfer", "item.item_xp_transfer.name", "item_xp_transfer");
    this.setMaxStack(1)
  }

  onNameOverride(item: ItemInstance, name: string): string {
    let extra = item.extra;
    if (extra) {
      name += `\n§7Xp stored: ${extra.getInt("xp_stored")}`;
    }
    return name;
  }
  onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
    let xp_stored: number = 0
    let extra = item.extra || null;
    if (!extra) {
      extra = new ItemExtraData();
    }

    const tileEntity = WorldRegion.getForActor(player).getTileEntity(coords.x, coords.y, coords.z)
    if (tileEntity) return;

    if (!Entity.getSneaking(player)) {// add xp
      let playerActor = new PlayerActor(player)
      let player_xp = playerActor.getExperience()
      let old_xp = extra.getInt("xp_stored");
      let need_xp = this.max_store - old_xp
      let xp = Math.min(Math.min(player_xp, this.max_store), need_xp)
      ObeliskCore.setPlayerXp(playerActor, player_xp - xp)
      extra.putInt("xp_stored", xp)
    } else {// take xp
      let playerActor = new PlayerActor(player)
      let player_xp = playerActor.getExperience()
      let xp = extra.getInt("xp_stored");
      if (!xp) return;
      ObeliskCore.setPlayerXp(playerActor, player_xp + xp);
      extra.putInt("xp_stored", 0)
    }

    Entity.setCarriedItem(player, item.id, item.count, item.data, extra)
  }
}
ItemRegistry.registerItem(new XpTransfer());

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id:  ItemID.itemXpTransfer, count: 1, data: 0 }, [
    "  e",
    " a ",
    "e"
  ], ['a', ItemID.energeticAlloy, 0, 'e', ItemID.soularium]
  );
});