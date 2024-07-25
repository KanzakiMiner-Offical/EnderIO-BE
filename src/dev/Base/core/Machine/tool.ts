interface IWrech {
  isUseable(item: ItemInstance, damage: number): boolean;
  useItem(item: ItemStack, damage: number, player: number): void;
}

namespace EnderTool {
  const wrenchData = {}

  export function registerWrench(id: number, properties: IWrech) {
    wrenchData[id] = properties;
  }

  export function getWrenchData(id: number): IWrech {
    return wrenchData[id];
  }

  export function isWrench(id: number): boolean {
    return !!getWrenchData(id);
  }

  export function isUseableWrench(item: ItemInstance, damage: number = 1): boolean {
    const wrench = getWrenchData(item.id);
    return wrench?.isUseable(item, damage);
  }

  export function useWrench(item: ItemStack, damage: number, player: number): void {
    const wrench = getWrenchData(item.id);
    wrench?.useItem(item, damage, player);
  }

  export function rotateMachine(tileEntity: TileEntity, side: number, item: ItemStack, player: number): void {
    if (tileEntity.setFacing(side)) {
      useWrench(item, 1, player);
      //SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
    }
  }

  export function addRecipe(result: ItemInstance, data: { id: number, data: number }[], tool: number): void {
    data.push({ id: tool, data: -1 });
    Recipes.addShapeless(result, data, function (api, field, result) {
      for (let i = 0; i < field.length; i++) {
        if (field[i].id == tool) {
          field[i].data++;
          if (field[i].data >= Item.getMaxDamage(tool)) {
            field[i].id = field[i].count = field[i].data = 0;
          }
        }
        else {
          api.decreaseFieldSlot(i);
        }
      }
    });
  }

  export function dischargeItem(item: ItemInstance, consume: number, player: number): boolean {
    let energyGot = 0;
    const itemTier = ChargeItemRegistry.getItemData(item.id).tier;
    const armor = Entity.getArmorSlot(player, 1);
    const armorEnergy = ChargeItemRegistry.getEnergyStored(armor);
    const armorData = ChargeItemRegistry.getItemData(armor.id);
    if (armorEnergy > 0 && armorData.energy == RF.name && armorData.tier >= itemTier) {
      energyGot = Math.min(armorEnergy, consume);
    }
    const energyStored = ChargeItemRegistry.getEnergyStored(item) + energyGot;
    if (energyStored >= consume) {
      if (energyGot > 0) {
        ChargeItemRegistry.setEnergyStored(armor, armorEnergy - energyGot);
        Entity.setArmorSlot(player, 1, armor.id, 1, armor.data, armor.extra);
      }
      ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
      return true;
    }
    return false;
  }

  export function useElectricItem(item: ItemInstance, consume: number, player: number): boolean {
    if (dischargeItem(item, consume, player)) {
      Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
      return true;
    }
    return false;
  }


  Callback.addCallback("DestroyBlockStart", function (coords: Callback.ItemUseCoordinates, block: Tile) {
    if (MachineRegistry.isMachine(block.id)) {
      const item = Player.getCarriedItem();
      if (EnderTool.isUseableWrench(item, 10)) {
        Network.sendToServer("EnderCore.demontageMachine", { x: coords.x, y: coords.y, z: coords.z });
      }
    }
  });

  Network.addServerPacket("EnderCore.demontageMachine", function (client: NetworkClient, data: Vector) {
    const player = client.getPlayerUid();
    const region = WorldRegion.getForActor(player);
    const blockID = region.getBlockId(data);
    if (MachineRegistry.isMachine(blockID)) {
      const item = new ItemStack(Entity.getCarriedItem(player));
      if (EnderTool.isUseableWrench(item, 10)) {
        const tileEntity = (region.getTileEntity(data) || region.addTileEntity(data)) as Machine.IWrench;
        if (!tileEntity) return;

        const drop = tileEntity.adjustDrop(new ItemStack(tileEntity.blockID, 1, 0));
        TileEntity.destroyTileEntity(tileEntity);
        region.setBlock(data, 0, 0);
        region.dropAtBlock(data.x, data.y, data.z, drop);
        EnderTool.useWrench(item, 10, player);
      }
    }
  });
}



namespace ModelHelper {
  export function renderModel(model: string, import_params: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams): RenderMesh {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      __dir__ + "resources/res/models/" + model + ".obj",
      "obj",
      import_params || null
    );
    return mesh;
  }

  export function setHandModel(item: ItemStack, model_name: string, texture: string, import_params?: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams) {
    const model = ItemModel.getForWithFallback(item.id, 0);
    model.setHandModel(
      renderModel(model_name, import_params),
      "models/" + texture
    );
  }
  export function setItemModel(item: ItemStack, model_name: string, texture: string, import_params?: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams) {
    const model = ItemModel.getForWithFallback(item.id, 0);
    model.setModel(
      renderModel(model_name, import_params),
      "models/" + texture
    );

  }
  export function setInventoryModel(item: ItemStack,
    model_name: string,
    texture: string,
    import_params?: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams,
    rotation: [number, number, number] = [0, 0, 0]
  ) {
    const mesh = renderModel(model_name, import_params) as RenderMesh;
    mesh.rotate(
      MathHelper.degreeToRadian(rotation[0]),
      MathHelper.degreeToRadian(rotation[1]),
      MathHelper.degreeToRadian(rotation[2])
    );
    const model = ItemModel.getForWithFallback(item.id, 0);
    model.setUiModel(mesh, "models/" + texture);
  }

  export function generateMesh(dir: string, x: number, y: number, z: number, importParams: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams = {
    scale: [0, 0, 0],
    translate: [0, 0, 0],
    noRebuild: false,
    invertV: false,
  }): RenderMesh {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      __dir__ + dir + ".obj",
      "obj",
      {
        noRebuild: false,
        invertV: false,
        scale: importParams.scale,
        translate: importParams.translate
      }
    );
    mesh.rotate(x, y, z);
    return mesh;
  }
  export let rotate = [
    [0, 180, 0],
    [0, 0, 0],
    [0, 90, 0],
    [0, 270, 0]
  ]
  export function registerModelWithRotation(block: number, dir: string, importParams?: com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams) {
    let mesh: RenderMesh, model: BlockRenderer.Model, render: ICRender.Model;
    for (let i = 2; i <= 5; i++) {
      mesh = generateMesh(dir, MathHelper.degreeToRadian(rotate[i - 2][0]), MathHelper.degreeToRadian(rotate[i - 2][1]), MathHelper.degreeToRadian(rotate[i - 2][2]), importParams)
      model = new BlockRenderer.Model(mesh);
      render = new ICRender.Model();
      render.addEntry(model);
      BlockRenderer.setStaticICRender(block, i, render);
    }
    mesh = generateMesh(dir, MathHelper.degreeToRadian(rotate[1][0]), MathHelper.degreeToRadian(rotate[1][1]), MathHelper.degreeToRadian(rotate[1][2]), importParams)
    model = new BlockRenderer.Model(mesh);
    render = new ICRender.Model();
    render.addEntry(model);
    BlockRenderer.setStaticICRender(block, 0, render);
    //ItemModel.getFor(BlockID.electricPump, 0).setModel(render);
  }
}