Item.createUpgradeItem = function(id, name, res) {

  IDRegistry.genItemID(id);
  Item.createItem(id, name, { name: res }, { stack: 16 });

 // mod_tip(ItemID[id]);
};
//

Item.createUpgradeItem("itemFilter", "Basic Item Filter", "basic_item_filter");