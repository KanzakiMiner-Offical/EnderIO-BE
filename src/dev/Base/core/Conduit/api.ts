BlockRegistry.createBlockType("conduit", {
  destroyTime: 0.125,
  explosionResistance: 1,
  renderLayer: 1,
});

let blocksCheck = [
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: 0, z: 1 },
];

namespace ConduitRegistry {
  export let ConduitWidth: number = 0.2; //0.1875//0.375

  export function registerCable(nameID: string, maxVoltage: number) {
    let blockID: number = BlockID[nameID];
    RF.registerWire(blockID, maxVoltage);
    RF_type2.registerWire(blockID, maxVoltage);
    Item.registerNameOverrideFunction(blockID, function (item, name) {
      return name + "\n§7" + Translation.translate("enderio.power.max_output") + " " + maxVoltage + " RF/t";
    });
  }

  export function setupModel(id, width, groupConduit) {
    let render = new ICRender.Model();
    let shape = new ICRender.CollisionShape();
    BlockRenderer.setStaticICRender(id, 0, render);

    let boxes = [
      {
        side: [1, 0, 0],
        box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1 - 0.03, 0.5 + width / 2, 0.5 + width / 2],
      }, //0
      {
        side: [-1, 0, 0],
        box: [0 + 0.03, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2],
      }, //1
      {
        side: [0, 1, 0],
        box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1 - 0.03, 0.5 + width / 2],
      }, //2
      {
        side: [0, -1, 0],
        box: [0.5 - width / 2, 0 + 0.03, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2],
      }, //3
      {
        side: [0, 0, 1],
        box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1 - 0.03],
      }, //4
      {
        side: [0, 0, -1],
        box: [0.5 - width / 2, 0.5 - width / 2, 0 + 0.03, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2],
      }, //5
    ];

    let group = ICRender.getGroup(groupConduit);
    group.add(id, -1);

    for (let box of boxes) {
      let model = BlockRenderer.createModel();
      model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, 0);
      model.addBox(0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, id, 0);
      render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
    }
    // BlockRenderer.setCustomCollisionShape(id, 0, shape);

    let model = BlockRenderer.createModel();
    model.addBox(0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 - 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, 0.5 + 0.3125 / 2, id, 0);
    render.addEntry(model);

    width = Math.max(width, 0.5);
    Block.setBlockShape(
      id,
      { x: 0.5 - width / 2, y: 0.5 - width / 2, z: 0.5 - width / 2 },
      { x: 0.5 + width / 2, y: 0.5 + width / 2, z: 0.5 + width / 2 },
    );
  }
}
