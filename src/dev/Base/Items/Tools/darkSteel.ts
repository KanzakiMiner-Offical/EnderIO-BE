//Pickaxe


//enchantType: Native.EnchantType.pickaxe,
/*
ToolType.darkPick = {

   isWeapon: false,
   damage: 2,
   baseDamage: 4,
   enchantability: 14,
   blockTypes: ["stone", "dirt"],
   onDestroy: function(item) {
      let energyStored = ChargeItemRegistry.getEnergyStored(item);
      if (energyStored >= 80) {
         if (Block.getDestroyTime(block.id) > 0) {
            ChargeItemRegistry.setEnergyStored(item, energyStored - 80);
         }
         return true;
      } else {
         return false;
      }
   },

   onAttack: function(item, mob) {
      let energyStored = ChargeItemRegistry.getEnergyStored(item);
      if (energyStored >= 80) {
         if (Block.getDestroyTime(block.id) > 0) {
            ChargeItemRegistry.setEnergyStored(item, energyStored - 80);
            return true;
         }
      } else {
         return false;
      }
   },

   onBroke: function(item) {
      return true;
   },
   calcDestroyTime: function(item, coords, block, params, destroyTime, enchant) {
      let energyStored = ChargeItemRegistry.getEnergyStored(item);
      if (energyStored >= 80) {
         if (block.id == 49) {
            return 1
         }
         let material = ToolAPI.getBlockMaterial(block.id) || {};
         material = material.name;
         if (material == "stone") {
            return destroyTime * 5
         }
      }
      return params.base / 5
   }
};
*/
ItemRegistry.addToolMaterial("darkSteel", {
  durability: 765,
  level: 4,
  efficiency: 8,
  damage: 5,
  enchantability: 15,
  repairMaterial: ItemID.darkSteel
});
ItemRegistry.createTool("pickaxeDarkSteel", { name: "dark_steel_pickaxe", icon: "darkSteel_pickaxe", material: "darkSteel" }, ToolType.PICKAXE);
ItemRegistry.createTool("swordDarkSteel", { name: "The Ender", icon: "darkSteel_sword", material: "darkSteel" }, ToolType.SWORD);

Item.registerNameOverrideFunction(ItemID.pickaxeDarkSteel, function(item, name) {
  return name + "\n" + "§7You can empower this\nwith Vibrant Crystal in Dark Anvil"
});

Item.registerNameOverrideFunction(ItemID.swordDarkSteel, function(item, name) {

  return name + "\n" + "§7Increased skull and ender pearl drops"

});

Callback.addCallback("PlayerAttack", function(attacker, victim) {
  var playerEntity = new PlayerEntity(attacker);
  let c = Entity.getPosition(victim);
  let item = playerEntity.getCarriedItem()
  let region = BlockSource.getDefaultForActor(attacker);
  if (item.id == ItemID.swordDarkSteel) {
    if (Entity.getType(victim) == 32 && Math.random() <= 0.4) {
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, ItemID.zombieSkull, 1, 0);
    }
    if (Entity.getType(victim) == 33 && Math.random() <= 0.4) {
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, ItemID.creeperSkull, 1, 0);
    }
    if (Entity.getType(victim) == 34 && Math.random() <= 0.4) {
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, ItemID.skeletonSkull, 1, 0);
    }
    if (Entity.getType(victim) == 38 && Math.random() <= 0.8) {
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, ItemID.endermanSkull, 1, 0);
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, 368, 1 + Math.floor(Math.random() * 3), 0);
    }
    if (Entity.getType(victim) == 48 && Math.random() <= 0.6) {
      region.spawnDroppedItem(c.x + .5, c.y + .5, c.z + .5, 397, 1, 1);
    }
  }
});



//empowered

IDRegistry.genItemID("pickaxeDarkSteelEmpowered1");
Item.createItem("pickaxeDarkSteelEmpowered1", "Dark Pick", { name: "darkSteel_pickaxe" }, { isTech: true, stack: 1 });/*
ToolAPI.setTool(ItemID.pickaxeDarkSteelEmpowered1, "darkSteel", ToolType.darkPick);

ChargeItemRegistry.registerItem(ItemID.pickaxeDarkSteelEmpowered1, "Rf", 100000, 100, 2, true, true);

Item.registerNameOverrideFunction(ItemID.pickaxeDarkSteelEmpowered1, function(item, name) {
   return name + "\n" + "§7Empowered: Breaks obisdian faster.\n§a Explosive: §cNot Empowered \n  " + ItemName.getItemStorageText(item)
});
*/

//THE ENDER