type NBTMobData = {
  type: number;
  value?: number | string | [] | {};
};

type NBTMobDataComponent = {
  [key: string]: NBTMobData;
};

namespace SoulVesselManager {
  export const ignoreList: number[] = [
    EEntityType.PLAYER,
    EEntityType.ENDER_DRAGON,
    EEntityType.WITHER,
    EEntityType.ARMOR_STAND,
    EEntityType.ITEM,
    EEntityType.EXPERIENCE_ORB,
    EEntityType.FALLING_BLOCK,
    EEntityType.MOVING_BLOCK,
    EEntityType.ENDER_CRYSTAL,
    EEntityType.FIREWORKS_ROCKET,
    EEntityType.DRAGON_FIREBALL,
    EEntityType.ARROW,
    EEntityType.SNOWBALL,
    EEntityType.EGG,
    EEntityType.PAINTING,
    EEntityType.MINECART,
    EEntityType.FIREBALL,
    EEntityType.THROWN_POTION,
    EEntityType.ENDER_PEARL,
    EEntityType.LEASH_KNOT,
    EEntityType.WITHER_SKULL,
    EEntityType.WITHER_SKULL_DANGEROUS,
    EEntityType.LIGHTNING_BOLT,
    EEntityType.SMALL_FIREBALL,
    EEntityType.AREA_EFFECT_CLOUD,
    EEntityType.HOPPER_MINECART,
    EEntityType.TNT_COMMAND,
    EEntityType.CHEST_MINECART,
    EEntityType.COMMAND_BLOCK_MINECART,
    EEntityType.LINGERING_POTION,
    EEntityType.LLAMA_SPLIT,
  ];
  export function createMobData(tag: NBT.CompoundTag | NBT.ListTag): NBTMobDataComponent | NBTMobData[] {
    const isListTag = !("getAllKeys" in tag);
    let mobData: NBTMobDataComponent | NBTMobData[] = isListTag ? [] : {};
    if (!isListTag) {
      // Handle if tag is CompoundTag
      let keys = (tag as NBT.CompoundTag).getAllKeys();
      let length = keys.length;
      if (keys != null) {
        for (let key_index = 0; key_index < length; key_index++) {
          let key = keys[key_index];
          let keyType = tag.getValueType(key);
          let data: NBTMobData = { type: keyType };
          switch (keyType) {
            case ENbtDataType.TYPE_BYTE:
              data.value = Number(tag.getByte(key));
              break;
            case ENbtDataType.TYPE_SHORT:
              data.value = Number(tag.getShort(key));
              break;
            case ENbtDataType.TYPE_INT:
              data.value = Number(tag.getInt(key));
              break;
            case ENbtDataType.TYPE_INT64:
              data.value = Number(tag.getInt64(key));
              break;
            case ENbtDataType.TYPE_FLOAT:
              data.value = Number(tag.getFloat(key));
              break;
            case ENbtDataType.TYPE_DOUBLE:
              data.value = Number(tag.getDouble(key));
              break;
            case ENbtDataType.TYPE_BYTE_ARRAY:
              data.value = "";
              break;
            case ENbtDataType.TYPE_STRING:
              data.value = `${tag.getString(key)}`;
              break;
            case ENbtDataType.TYPE_LIST:
              let listTag = tag.getListTag(key);
              if (listTag != null) data.value = createMobData(listTag);
              else data.value = [];
              break;
            case ENbtDataType.TYPE_COMPOUND:
              let compoundTag = tag.getCompoundTag(key);
              if (compoundTag != null) data.value = createMobData(compoundTag);
              else data.value = {};
              break;
            case ENbtDataType.TYPE_INT_ARRAY:
              data.value = "";
              break;
          }
          (mobData as NBTMobDataComponent)[key] = data;
        }
      }
    } else {
      // Handle if tag is ListTag
      let listTag = tag as NBT.ListTag;
      let length = listTag.length();
      for (let key_index = 0; key_index < length; key_index++) {
        let keyType = listTag.getValueType(key_index);
        let data: NBTMobData = { type: keyType };
        switch (keyType) {
          case ENbtDataType.TYPE_BYTE:
            data.value = Number(tag.getByte(key_index));
            break;
          case ENbtDataType.TYPE_SHORT:
            data.value = Number(tag.getShort(key_index));
            break;
          case ENbtDataType.TYPE_INT:
            data.value = Number(tag.getInt(key_index));
            break;
          case ENbtDataType.TYPE_INT64:
            data.value = Number(tag.getInt64(key_index));
            break;
          case ENbtDataType.TYPE_FLOAT:
            data.value = Number(tag.getFloat(key_index));
            break;
          case ENbtDataType.TYPE_DOUBLE:
            data.value = Number(tag.getDouble(key_index));
            break;
          case ENbtDataType.TYPE_BYTE_ARRAY:
            data.value = "";
            break;
          case ENbtDataType.TYPE_STRING:
            data.value = `${tag.getString(key_index)}`;
            break;
          case ENbtDataType.TYPE_LIST:
            let listTag = tag.getListTag(key_index);
            if (listTag != null) data.value = createMobData(listTag);
            else data.value = [];
            break;
          case ENbtDataType.TYPE_COMPOUND:
            let compoundTag = tag.getCompoundTag(key_index);
            if (compoundTag != null) data.value = createMobData(compoundTag);
            else data.value = {};
            break;
          case ENbtDataType.TYPE_INT_ARRAY:
            data.value = "";
            break;
        }
        (mobData as NBTMobData[]).push(data);
      }
    }
    return mobData;
  }

  export function createMobTag(tag_json: any): NBT.CompoundTag | NBT.ListTag {
    let isListTag = Array.isArray(tag_json);
    let tag = isListTag ? new NBT.ListTag() : new NBT.CompoundTag();

    for (let key in tag_json) {
      let idx = isListTag ? Number(key) : key;
      let data = tag_json[key];
      if (isListTag) {
        // Handle if tag input is ListTag
        switch (data.type) {
          case ENbtDataType.TYPE_BYTE:
            (tag as NBT.ListTag).putByte(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_SHORT:
            (tag as NBT.ListTag).putShort(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_INT:
            (tag as NBT.ListTag).putInt(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_INT64:
            (tag as NBT.ListTag).putInt64(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_FLOAT:
            (tag as NBT.ListTag).putFloat(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_DOUBLE:
            (tag as NBT.ListTag).putDouble(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_STRING:
            (tag as NBT.ListTag).putString(idx as number, data.value);
            break;
          case ENbtDataType.TYPE_LIST:
            (tag as NBT.ListTag).putListTag(idx as number, createMobTag(data.value) as NBT.ListTag);
            break;
          case ENbtDataType.TYPE_COMPOUND:
            (tag as NBT.ListTag).putCompoundTag(idx as number, createMobTag(data.value) as NBT.CompoundTag);
            break;
        }
      } else {
        // Handle if tag input is CompoundTag
        switch (data.type) {
          case ENbtDataType.TYPE_BYTE:
            (tag as NBT.CompoundTag).putByte(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_SHORT:
            (tag as NBT.CompoundTag).putShort(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_INT:
            (tag as NBT.CompoundTag).putInt(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_INT64:
            (tag as NBT.CompoundTag).putInt64(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_FLOAT:
            (tag as NBT.CompoundTag).putFloat(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_DOUBLE:
            (tag as NBT.CompoundTag).putDouble(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_STRING:
            (tag as NBT.CompoundTag).putString(idx as string, data.value);
            break;
          case ENbtDataType.TYPE_LIST:
            (tag as NBT.CompoundTag).putListTag(idx as string, createMobTag(data.value) as NBT.ListTag);
            break;
          case ENbtDataType.TYPE_COMPOUND:
            (tag as NBT.CompoundTag).putCompoundTag(idx as string, createMobTag(data.value) as NBT.CompoundTag);
            break;
        }
      }
    }
    return tag;
  }
}
ItemRegistry.createItem("soulVesselEmpty", {
  name: "item.item_soul_vial.name",
  icon: "itemSoulVessel",
  stack: 1,
});

class SoulVessel extends ItemCommon implements ItemBehavior {
  constructor() {
    super("soulVessel", "item.item_soul_vial.name", "itemSoulVesselFull", false);
    this.setMaxStack(1);
    this.setGlint(true);
  }
  onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
    if (!item.extra) return;

    let entityTag = SoulVesselManager.createMobTag(JSON.parse(item.extra.getString("entity"))) as NBT.CompoundTag; // get NBT Tag from extra data
    if (!entityTag) return;

    let playerActor = new PlayerActor(player);
    let newCoords = {
      x: coords.relative.x + 0.5,
      y: coords.relative.y,
      z: coords.relative.z + 0.5,
    };
    let blockSource = BlockSource.getDefaultForActor(player);
    let entityType = item.extra.getInt("type") ?? item.extra.getString("type");
    let newEntity = blockSource.spawnEntity(newCoords.x, newCoords.y, newCoords.z, entityType);
    entityTag.putInt64("UniqueID", newEntity);
    let posListTag = new NBT.ListTag();
    posListTag.putFloat(0, newCoords.x);
    posListTag.putFloat(1, newCoords.y);
    posListTag.putFloat(2, newCoords.z);
    entityTag.putListTag("Pos", posListTag);
    Entity.setCompoundTag(newEntity, entityTag);
    playerActor.setInventorySlot(playerActor.getSelectedSlot(), ItemID.soulVesselEmpty, 1, 0, null);
  }
  onNameOverride(item: ItemInstance, translation: string, name: string): string {
    let tooltip = "\n" + Translation.translate("item.item_soul_vial.tooltip.detailed.line1") + "\n" + Translation.translate("item.item_soul_vial.tooltip.detailed.line2");
    if (item.extra) {
      let mobName = item.extra.getString("name");
      tooltip += "\n§7Mob:" + mobName + "\n§7Type: " + (item.extra.getInt("type") ?? item.extra.getString("type"));
    }
    return name + tooltip;
  }
}

ItemRegistry.registerItem(new SoulVessel());

Callback.addCallback("EntityHurt", (attackerUid: number, entityUid: number, damageValue: number, damageType: Entity.DamageSource, armorReducesDamage: boolean): void => {
  if (!entityUid || !attackerUid || Entity.getType(attackerUid) !== EEntityType.PLAYER) return;

  // if (damageType !== EDamageCause.MOB) return;

  if (Entity.getCarriedItem(attackerUid).id !== ItemID.soulVesselEmpty) return;

  let entityType = Entity.getType(entityUid) || Entity.getTypeAddon(entityUid);
  if (!entityType) return;

  if (typeof entityType == "number" && SoulVesselManager.ignoreList.indexOf(entityType as number) !== -1) return;

  let mobData = SoulVesselManager.createMobData(Entity.getCompoundTag(entityUid));
  if (!mobData) return; // can't create mod data from NBT Tag
  Debug.big(mobData);

  Entity.remove(entityUid);
  let extra = new ItemExtraData();
  if (mobData["identifier"]) extra.putString("name", mobData["identifier"].value); // type of mobs, like minecraft:cow
  extra.putString("entity", JSON.stringify(mobData)); // put nbt data
  if (typeof entityType == "number") extra.putInt("type", entityType);
  else extra.putString("type", entityType); // put type of mob (EEntityType or string if it from Addon)

  runOnMainThread(function () {
    let player = new PlayerActor(attackerUid);
    player.setInventorySlot(player.getSelectedSlot(), ItemID.soulVessel, 1, 0, extra);
  });
});
