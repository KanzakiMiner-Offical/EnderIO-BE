namespace EnderCore {
  
  export let ender_io_block = []
  export let ender_io_ingot = []
  export let ender_io_nugget = []

  export function registerDust(types: string[]) {
    for (let i in types) {
      let name_types = types[i]
      let name = "item.item_material.powder_" + name_types.charAt(0).toLowerCase() + name_types.slice(1) + ".name";
      ItemRegistry.createItem("dust" + types[i], { name: name, icon: "dust" + types[i], stack: 64 });
    }
  }

  export function createResourceItem(id, name) {
    name = name.toLowerCase();
    while (name.indexOf(" ") > 0) {
      name = name.replace(" ", "_");
    }
    let ingot_name = "item.item_alloy_ingot_" + name + ".name"
    let nugget_name = "item.item_alloy_nugget_" + name + ".name"

    let nug_id = id + "Nugget";
    ItemRegistry.createItem(id, { name: ingot_name, icon: id, stack: 64 });
    ItemRegistry.createItem(nug_id, { name: nugget_name, icon: nug_id, stack: 64 });

    Callback.addCallback("PreLoaded", function() {
      Recipes.addShaped({ id: ItemID[id], count: 1, data: 0 }, [
  	  "bbb",
  	  "bbb",
  	  "bbb"
    ], ['b', ItemID[nug_id], 0]);
      Recipes.addShapeless({ id: ItemID[nug_id], count: 9, data: 0 }, [{ id: ItemID[id], data: 0 }]);
    });
  }

  export function createResourceBlock(id, name) {
    let block_id = "block" + id.charAt(0).toUpperCase() + id.substr(1);

    name = name.toLowerCase();
    while (name.indexOf(" ") > 0) {
      name = name.replace(" ", "_");
    }
    let block_name = "tile.block_alloy." + name + ".name"

    BlockRegistry.createBlock(block_id, [
      {
        name: block_name,
        texture: [[id + "Block", 0]],
        inCreative: true
      }], "machine");

    Callback.addCallback("PreLoaded", function() {
      Recipes.addShaped({ id: BlockID[block_id], count: 1, data: 0 }, [
	  "bbb",
	  "bbb",
	  "bbb"
  ], ['b', ItemID[id], 0]);
      Recipes.addShapeless({ id: ItemID[id], count: 9, data: 0 }, [{ id: BlockID[block_id], data: 0 }]);
    });
  }

  export function addIngotRecipe (src, out) {
    if (ItemID[out] && typeof out == "string") {
      Recipes.addFurnace(src, ItemID[out], 0);
    } else if (typeof out == "number") {
      Recipes.addFurnace(src, out, 0);
    }
  }

}