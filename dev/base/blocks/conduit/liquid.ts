IDRegistry.genBlockID("fluidConduit");
Block.createBlock("fluidConduit", [
  {
    name: "Fluid Conduit",
    texture: [["liquidConduitCore", 0]],
    inCreative: true,
  },
]);

IDRegistry.genBlockID("fluidConduitEx");
Block.createBlock("fluidConduitEx", [
  {
    name: "Fluid Conduit Extractor",
    texture: [["liquidConduitExtract", 0]],
    inCreative: false,
  },
]);

IDRegistry.genBlockID("fluidConduitIn");
Block.createBlock("fluidConduitIn", [
  {
    name: "Fluid Conduit Input",
    texture: [["liquidConduitInput", 0]],
    inCreative: false,
  },
]);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.fluidConduit, count: 8, data: 0 },
    ["bbb", "ccc", "bbb"],
    ["b", ItemID.conduitBinder, 0, "c", BlockID.fusedGlass, 0],
  );
});

Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.fluidConduit && Entity.getSneaking(player)) {
    let region = BlockSource.getDefaultForActor(player);
    region.setBlock(coords.x, coords.y, coords.z, BlockID.fluidConduitEx, 0);
  }
});
Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.fluidConduitEx && Entity.getSneaking(player)) {
    let region = BlockSource.getDefaultForActor(player);
    region.setBlock(coords.x, coords.y, coords.z, BlockID.fluidConduitIn, 0);
  }
});
Callback.addCallback("ItemUse", function (coords, item, block, isExternal, player) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.fluidConduitIn && Entity.getSneaking(player)) {
    let region = BlockSource.getDefaultForActor(player);
    region.setBlock(coords.x, coords.y, coords.z, BlockID.fluidConduit, 0);
  }
});

Block.registerDropFunction("fluidConduitEx", function (blockCoords, blockID, blockData, diggingLevel, enchant, item, region) {
  return [[BlockID.fluidConduit, 1, 0]];
});

Block.registerDropFunction("fluidConduitEx", function (blockCoords, blockID, blockData, diggingLevel, enchant, item, region) {
  return [[BlockID.fluidConduit, 1, 0]];
});

// global group
/*for (let i in BlockID) {
   var tile = TileEntity.getPrototype(BlockID[i]);
   if (tile && BlockID[i] != BlockId.fluidConduit && tile.liquidStorage ) {
      
   }

}
ICRender.getGroup("liquid_pipe").add(BlockID.fluidConduitEx, -1);
ICRender.getGroup("liquid_pipe").add(BlockID.fluidConduitIn, -1);
*/
// only conduit

/*
ICRender.getGroup("eio_liquid_conduit").add(BlockID.fluidConduit, -1);
ICRender.getGroup("eio_liquid_conduit").add(BlockID.fluidConduitEx, -1);
ICRender.getGroup("eio_liquid_conduit").add(BlockID.fluidConduitIn, -1);
*/
ConduitRegistry.setupModel(BlockID.fluidConduit, ConduitRegistry.ConduitWidth, "liquid_pipe");
ConduitRegistry.setupModel(BlockID.fluidConduitEx, ConduitRegistry.ConduitWidth, "liquid_pipe");
ConduitRegistry.setupModel(BlockID.fluidConduitIn, ConduitRegistry.ConduitWidth, "liquid_pipe");

TileEntity.registerPrototype(BlockID.fluidConduit, {
  defaultValues: {
    check: false,
  },
  useNetworkItemContainer: true,
  tick() {
    if (World.getThreadTime() % 6 == 0) this.data.check = false;
  },
  click(id, count, data, coords, player) {
    if (!Entity.getSneaking(player) && id == ItemID.itemYetaWrench) {
      this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID.fluidConduit, 1, 0);
      this.blockSource.destroyBlock(this.x, this.y, this.z, false);
    }
  },
});

MachineRegistry.registerPrototype(BlockID.fluidConduitIn, {
  defaultValues: {
    isActive: true,
  },
  useNetworkItemContainer: true,

  onClick(item, coords, player) {
    if (!Entity.getSneaking(player) && item.id == ItemID.itemYetaWrench) {
      this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID.fluidConduit, 1, 0);
      this.blockSource.destroyBlock(this.x, this.y, this.z, false);
    }
  },
});

MachineRegistry.registerPrototype(BlockID.fluidConduitEx, {
  defaultValues: {
    isActive: true,
  },
  useNetworkItemContainer: true,
  getBlocks(x, y, z, arr) {
    for (let i in blocksCheck) {
      let pos = blocksCheck[i];
      let block = this.blockSource.getBlock(x + pos.x, y + pos.y, z + pos.z);
      if (block.id == BlockID.fluidConduit) {
        let tile = TileEntity.getTileEntity(x + pos.x, y + pos.y, z + pos.z, this.blockSource);
        if (tile && !tile.data.check) {
          tile.data.check = true;
          this.getBlocks(x + pos.x, y + pos.y, z + pos.z, arr);
        }
      } else if (block.id == BlockID.fluidConduitIn) {
        arr.push({ x: x + pos.x, y: y + pos.y, z: z + pos.z });
      }
    }
    return arr;
  },
  input(tile, output, pos) {
    let block = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
    for (let w in blocksCheck) {
      let ip = blocksCheck[w];
      if (block.data.active || block.data.isActive) {
        let input = TileEntity.getTileEntity(pos.x + ip.x, pos.y + ip.y, pos.z + ip.z, this.blockSource);
        if (input) {
          try {
            let liquids = Object.keys(tile.liquidStorage.liquidAmounts);
            for (let i in liquids)
              if (output.canTransportLiquid(liquids[i], 0))
                StorageInterface.transportLiquid(
                  liquids[i],
                  50,
                  output,
                  StorageInterface.getLiquidStorage(this.blockSource, pos.x + ip.x, pos.y + ip.y, pos.z + ip.z),
                  0,
                );
          } catch (e) {
            StorageInterface.extractLiquid(
              null,
              50,
              StorageInterface.getLiquidStorage(this.blockSource, pos.x + ip.x, pos.y + ip.y, pos.z + ip.z),
              output,
              0,
            );
          }
        }
      }
    }
  },
  pump() {
    let blocks = this.getBlocks(this.x, this.y, this.z, []);
    for (let q in blocksCheck) {
      let op = blocksCheck[q];
      let tile = TileEntity.getTileEntity(this.x + op.x, this.y + op.y, this.z + op.z, this.blockSource);
      if (tile) {
        let output = StorageInterface.getLiquidStorage(this.blockSource, this.x + op.x, this.y + op.y, this.z + op.z);
        for (let a in blocks) this.input(tile, output, blocks[a]);
      }
    }
  },
  onClick(item, coords, player) {
    if (!Entity.getSneaking(player) && item.id == ItemID.itemYetaWrench) {
      this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID.fluidConduit, 1, 0);
      this.blockSource.destroyBlock(this.x, this.y, this.z, false);
    }
  },
  onTick() {
    try {
      if (World.getThreadTime() % 20 == 0) {
        this.pump();
      }
    } catch (e) {
      Game.message(e);
    }
  },
});
