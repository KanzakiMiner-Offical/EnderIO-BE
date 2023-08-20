BlockRegistry.createBlockType("BLOCK_TYPE_ANTI_EXPLO", {
  extends: "opaque",
  destroytime: 100,
  explosionResistance: 3600000*3,
  renderlayer: 3,
  translucency: 0,
  sound: "anvil"
});
/*
IDRegistry.genBlockID("darkSteelBars");
Block.createBlock("darkSteelBars", [
  { name: "Dark Bars", texture: [["darkSteelBars", 0]], inCreative: true }
]);

Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.darkSteelBars, count: 1, data: 0 }, [
	"",
	"aaa",
	"aaa"
], ['a', ItemID.darkSteel, 0]);
});

//
var render = new ICRender.Model();
    var shape = new ICRender.CollisionShape();
    BlockRenderer.setStaticICRender(id, 0, render);

    var boxes = [
      { side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1 - 0.03, 0.5 + width / 2, 0.5 + width / 2] }, //0
      { side: [-1, 0, 0], box: [0 + 0.03, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2] }, //1
      { side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1 - 0.03] }, //4
      { side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0 + 0.03, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2] }, //5
    ]

    var group = ICRender.getGroup(groupConduit);
    group.add(id, -1);


    for (var i in boxes) {
      var box = boxes[i];

      var model = BlockRenderer.createModel();
      model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, 0);
      model.addBox(0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, id, 0);
      render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
    }

    var model = BlockRenderer.createModel();
    model.addBox(0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, id, 0);
    render.addEntry(model);

    width = Math.max(width, 0.5);
    Block.setBlockShape(id, { x: 0.5 - width / 2, y: 0.5 - width / 2, z: 0.5 - width / 2 }, { x: 0.5 + width / 2, y: 0.5 + width / 2, z: 0.5 + width / 2 });
//

function setBarsRender(id, groupName, xsize, zsize) {
  var render = new ICRender.Model();
  BlockRenderer.setStaticICRender(id, 0, render);
  var boxes = [
    { side: [1, 0, 0], box: [xsize, 0, zsize, 1, 1, xsize] },
    { side: [-1, 0, 0], box: [0, 0, zsize, zsize, 1, xsize] },
    { side: [0, 0, 1], box: [zsize, 0, xsize, xsize, 1, 1] },
    { side: [0, 0, -1], box: [zsize, 0, 0, xsize, 1, zsize] },
    ];
  ICRender.getGroup(groupName).add(id, -1);
  for (var i in boxes) {
    var box = boxes[i];
    var model = BlockRenderer.createModel();
    model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], "darkSteelBars", 0);
    render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], ICRender.getGroup(groupName), 0);
  }
  var model = BlockRenderer.createModel();
  render.addEntry(model);
}

setBarsRender(BlockID.darkSteelBars, "ender-bars", 0.54, 0.46);*/
/*
Callback.addCallback("PreLoaded", function() {
  for(let i in BlockID){
		var tile = TileEntity.getPrototype(BlockID[i]);
		if(!tile) {
			ICRender.getGroup("ender-bars").add(BlockID[i], -1);
		}
	}
});*/

IDRegistry.genBlockID("reinforcedObsidian");
Block.createBlock("reinforcedObsidian", [
  { name: "Reinforced Obsidian", texture: [["reinforcedObsidian", 0]], inCreative: true }
], "BLOCK_TYPE_ANTI_EXPLO")
ToolAPI.registerBlockMaterial(BlockID.reinforcedObsidian, "stone")/*
Recipes.addShaped({ id: BlockID.reinforcedObsidian, count: 1, data: 0 }, [
	"bab",
	"aca",
	"bab"
], ['a', ItemID.darkSteel, 0, 'b', BlockID.darkSteelBars, 0, 'c', 49, 0]);*/
Block.registerDropFunction("reinforcedObsidian", function(coords, blockID, blockData, level) {
  if (level > 3) {
    return [[BlockID.reinforcedObsidian, 1, 0]]
  }
  return [];
}, 2);