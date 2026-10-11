BlockRegistry.createBlock(
  "experience_obelisk",
  [
    {
      name: "tile.block_experience_obelisk.name",
      texture: [["experience_obelisk", 0]],
      inCreative: true,
    },
  ],
  "other-machine",
);

Block.setShape(BlockID.experience_obelisk, 1 / 16, 0, 1 / 16, 15 / 16, 0.5, 15 / 16);
Block.setDestroyTime(BlockID.experience_obelisk, 5);
ToolAPI.registerBlockMaterial(BlockID.experience_obelisk, "stone");

ObeliskCore.registerModel("experience_obelisk", "experience_obelisk");

Block.registerPlaceFunction(
  "experience_obelisk",
  function (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, _player: number, blockSource: BlockSource) {
    const region = new WorldRegion(blockSource);
    const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    const rotation = TileRenderer.getBlockRotation(_player, false);
    region.setBlock(place, item.id, rotation);
    const tile = region.addTileEntity(place);
    if (item.extra) {
      let name_fluid = item.extra.getString("fluid");
      let amount_fluid = item.extra.getInt("amount");
      if (amount_fluid > 0) {
        tile.liquidStorage.addLiquid(name_fluid, amount_fluid);
      }
    }
  },
);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.experience_obelisk, count: 1, data: 0 },
    [" e ", " a ", "aba"],
    ["a", ItemID.soularium, 0, "e", ItemID.itemXpTransfer, 0, "b", BlockID.machineChassiSoul, 0], // function (api: Recipes.WorkbenchFieldAPI, field: com.zhekasmirnov.innercore.api.mod.ui.container.Slot[], result: ItemInstance) {
    //   let xp = new ItemExtraData();
    //   for (let i = 0; i < field.length; i++) {
    //     if (field[i].id == ItemID.itemXpTransfer && field[i].extra) {
    //       if (field[i].extra.getInt("xp_stored") > 0) {
    //         xp.putString("fluid", "xpjuice")
    //         xp.putInt("amount", this.liquidTank.getAmount(field[i].extra.getInt("xp_stored")))
    //       }
    //       api.decreaseFieldSlot(i);
    //     }
    //   }
    //   result.extra = xp;
    //}
  );
});

let ExperienceObelisk_elements = {};

function ExpObeliskUICreate() {
  let ExperienceObeliskButtonSettings = {
    x1: 375, //525
    x2: 625, //775
    y: (110 / 575.5) * UI.getScreenHeight(),
    scale: 3,
    padding: 5,
  };
  ExperienceObeliskButtonSettings.x1 -= ExperienceObeliskButtonSettings.scale * 20;
  ExperienceObelisk_elements["text"] = {
    type: "text",
    x: 1000 / 2,
    y: ExperienceObeliskButtonSettings.y + 20 * ExperienceObeliskButtonSettings.scale + (20 * ExperienceObeliskButtonSettings.scale) / 2,
    z: 10,
    text: "0",
    font: {
      color: android.graphics.Color.rgb(127, 255, 0),
      shadow: 0.5,
      size: 30,
    },
  };
  ExperienceObelisk_elements["text"].y -= ExperienceObelisk_elements["text"].font.size / 2;
  ExperienceObelisk_elements["playerxp"] = {
    type: "text",
    x: 1000 / 2,
    y: 0,
    z: 10,
    text: "0",
    font: {
      color: android.graphics.Color.rgb(127, 255, 0),
      shadow: 0.5,
      size: 20,
    },
  };
  ExperienceObelisk_elements["playerxp"].y = UI.getScreenHeight() - ExperienceObelisk_elements["playerxp"].font.size - 20 - 80;
  ExperienceObelisk_elements["xpall"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x1,
    y: ExperienceObeliskButtonSettings.y,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xpall", {});
      },
    },
  };
  ExperienceObelisk_elements["xp-all"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x2,
    y: ExperienceObeliskButtonSettings.y,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xp-all", {});
      },
    },
  };
  ExperienceObelisk_elements["xp10"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x1,
    y: ExperienceObelisk_elements["xpall"].y + ExperienceObelisk_elements["xpall"].scale * 20 + ExperienceObeliskButtonSettings.padding,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xp10", {});
      },
    },
  };
  ExperienceObelisk_elements["xp-10"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x2,
    y: ExperienceObelisk_elements["xp-all"].y + ExperienceObelisk_elements["xp-all"].scale * 20 + ExperienceObeliskButtonSettings.padding,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xp-10", {});
      },
    },
  };
  ExperienceObelisk_elements["xp1"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x1,
    y: ExperienceObelisk_elements["xp10"].y + ExperienceObelisk_elements["xp10"].scale * 20 + ExperienceObeliskButtonSettings.padding,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xp1", {});
      },
    },
  };
  ExperienceObelisk_elements["xp-1"] = {
    type: "button",
    x: ExperienceObeliskButtonSettings.x2,
    y: ExperienceObelisk_elements["xp-10"].y + ExperienceObelisk_elements["xp-10"].scale * 20 + ExperienceObeliskButtonSettings.padding,
    bitmap: "RS_empty_button",
    bitmap2: "RS_empty_button_pressed",
    scale: ExperienceObeliskButtonSettings.scale,
    clicker: {
      onClick: function (itemContainerUiHandler, container, element) {
        container.sendEvent("xp-1", {});
      },
    },
  };
  ExperienceObelisk_elements["xp_bar"] = {
    type: "scale",
    x: (1000 - 185 * 3.5) / 2,
    y: ExperienceObelisk_elements["xp1"].y + ExperienceObelisk_elements["xp1"].scale * 20 + 30,
    direction: 0,
    bitmap: "xp_scale_full",
    background: "xp_scale",
    value: 0,
    scale: 3.5,
  };
  let xp_storage_map = ["all", "10", "1", "-all", "-10", "-1"];
  for (let i = 0; i < 6; i++) {
    ExperienceObelisk_elements["xp" + xp_storage_map[i] + "_image"] = {
      type: "image",
      x: ExperienceObelisk_elements["xp" + xp_storage_map[i]].x,
      y: ExperienceObelisk_elements["xp" + xp_storage_map[i]].y,
      z: 10,
      bitmap: "ExperienceObelisk" + xp_storage_map[i],
      scale: ExperienceObelisk_elements["xp" + xp_storage_map[i]].scale,
    };
  }
}
ExpObeliskUICreate();

let guiEObelisk = new UI.StandardWindow({
  standard: {
    header: {
      text: {
        text: Translation.translate("tile.block_experience_obelisk.name"),
      },
    },
    background: {
      standard: true,
    },
  },

  drawing: [],

  elements: ExperienceObelisk_elements,
});

namespace Machine {
  export class XP_Obelisk extends MachineBase {
    defaultValues = {};

    x: number;
    y: number;
    z: number;
    anim: Animation.Item;
    liquidTank: BlockEngine.LiquidTank;

    getScreenByName(): UI.IWindow {
      return guiEObelisk;
    }

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 2000000000, ["xpjuice"]);
    }

    clientLoad() {
      this.anim = new Animation.Item(this.x + 0.5, this.y + 1, this.z + 0.5);
      this.anim.setSkylightMode();
      this.anim.describeItem({
        id: Network.serverToLocalId(ItemID.itemXpTransfer),
        count: 1,
        data: 0,
      });
      this.anim.loadCustom(function () {
        let transform = this.transform();
        transform && transform.rotate(0, Math.PI / 60, 0);
      });
    }

    clientUnload() {
      this.anim && this.anim.destroy();
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      if (item.id == ItemID.itemXpTransfer) {
        this.preventClick();
        let playerActor = new PlayerActor(player);
        playerActor.addExperience(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")));
        this.liquidTank.getLiquid("xpjuice", this.liquidTank.getAmount("xpjuice"));
        return true;
      } else if (item.id == ItemID.itemXpTransfer && Entity.getSneaking(player)) {
        this.preventClick();
        let playerActor = new PlayerActor(player);
        this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(playerActor.getExperience()));
        playerActor.setLevel(0);
        playerActor.setExperience(0);
        return true;
      }
      return super.onItemUse(coords, item, player);
    }

    onTick(): void {
      let xp_data = ObeliskCore.XPtoLVL(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")));
      this.container.setText("text", "" + xp_data.lvl);
      let next_xp = ObeliskCore.LVLtoXP(xp_data.lvl + 1);
      let this_xp = ObeliskCore.LVLtoXP(xp_data.lvl);
      let other_xp_data = {
        xp: Math.max(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")) - this_xp, 0),
        next_xp: Math.max(next_xp - this_xp, 0),
      };
      this.container.setScale("xp_bar", other_xp_data.xp / other_xp_data.next_xp || 0);
      this.container.sendChanges();

      let startCoords = { x: this.x + 0.5, y: this.y + 0.5, z: this.z + 0.5 };
      let ents = Entity.getAllInRange(startCoords, 10, 69);
      for (let i in ents) {
        let ent = ents[i];
        if (!ent) continue;
        let tag = Entity.getCompoundTag(ent);
        let exp_value = tag.getInt("experience value");
        if (exp_value > 0) {
          this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(exp_value));
        }
        Entity.remove(ent);
      }
    }

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      let extra: ItemExtraData = null;
      let region = BlockSource.getDefaultForActor(player);
      let liquid = this.liquidTank.getLiquidStored();
      if (liquid == "xpjuice") {
        extra = new ItemExtraData();
        extra.putString("fluid", liquid);
        extra.putInt("amount", this.liquidTank.getAmount(liquid));
      }
      region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, BlockID.experience_obelisk, 1, 0, extra);
    }

    containerEvents = {
      "xp-1": function (eventData, connectedClient) {
        if (!this.liquidTank.getAmount("xpjuice")) return;
        let player = new PlayerActor(connectedClient.getPlayerUid());
        let player_lvl = player.getLevel();
        let player_xp = player.getExperience();
        let xp = Math.min(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")), ObeliskCore.LVLtoXP(player_lvl + 1) - player_xp);
        ObeliskCore.setPlayerXp(player, player_xp + xp);
        this.liquidTank.getLiquid("xpjuice", ObeliskCore.XPtoLiquid(xp));
      },

      xp1: function (eventData, connectedClient) {
        let player = new PlayerActor(connectedClient.getPlayerUid());
        let player_lvl = player.getLevel();
        if (player_lvl == 0) return;
        let player_xp = player.getExperience();
        let xp = player_xp - ObeliskCore.LVLtoXP(player_lvl - 1);
        ObeliskCore.setPlayerXp(player, player_xp - xp);
        this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(xp));
      },
      "xp-10": function (eventData, connectedClient) {
        if (!this.liquidTank.getAmount("xpjuice")) return;
        let player = new PlayerActor(connectedClient.getPlayerUid());
        let player_lvl = player.getLevel();
        let player_xp = player.getExperience();
        let xp = Math.min(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")), ObeliskCore.LVLtoXP(player_lvl + 10) - player_xp);
        ObeliskCore.setPlayerXp(player, player_xp + xp);
        this.liquidTank.getLiquid("xpjuice", ObeliskCore.XPtoLiquid(xp));
      },
      xp10: function (eventData, connectedClient) {
        let player = new PlayerActor(connectedClient.getPlayerUid());
        let player_lvl = player.getLevel();
        if (player_lvl == 0) return;
        let player_xp = player.getExperience();
        let xp = player_xp - ObeliskCore.LVLtoXP(player_lvl - 10);
        ObeliskCore.setPlayerXp(player, player_xp - xp);
        this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(xp));
      },
      xpall: function (eventData, connectedClient) {
        let player = new PlayerActor(connectedClient.getPlayerUid());
        this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(player.getExperience()));
        player.setLevel(0);
        player.setExperience(0);
      },
      "xp-all": function (eventData, connectedClient) {
        let player = new PlayerActor(connectedClient.getPlayerUid());
        player.addExperience(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")));
        this.liquidTank.getLiquid("xpjuice", this.liquidTank.getAmount("xpjuice"));
      },
    };
  }
  MachineRegistry.registerPrototype(BlockID.experience_obelisk, new XP_Obelisk());

  MachineRegistry.setTankPlaceFunction("experience_obelisk");
  StorageInterface.createInterface(BlockID.experience_obelisk, {
    canReceiveLiquid: () => true,
    canTransportLiquid: () => true,
  });
}
