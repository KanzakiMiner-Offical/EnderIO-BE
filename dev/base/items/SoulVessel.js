IDRegistry.genItemID("soulVesselEmpty");
Item.createItem("soulVesselEmpty", "Soul Vessel", { name: "itemSoulVessel" }, { stack: 1 });

IDRegistry.genItemID("soulVessel");
Item.createItem("soulVessel", "Soul Vessel ", { name: "itemSoulVesselFull" }, { stack: 1, isTech: false });
Item.setGlint(ItemID["soulVessel"], true);

//var InnerCore_pack = FileTools.ReadJSON(__packdir__ + 'manifest.json');

function createMobData(tag) {
  var isListTag = !tag.getAllKeys;
  var mobData = isListTag ? [] : {};
  var keys = !isListTag ? tag.getAllKeys() : false;
  var length_ = keys ? keys.length : tag.length();
  if (keys != null) {
    for (var _key = 0; _key < length_; _key++) {
      var key = keys ? keys[_key] : _key;
      var keyType = tag.getValueType(key);
      var _data = { type: keyType };
      switch (keyType) {
        case 1:
          _data.value = Number(tag.getByte(key));
          break;
        case 2:
          _data.value = Number(tag.getShort(key));
          break;
        case 3:
          _data.value = Number(tag.getInt(key));
          break;
        case 4:
          _data.value = Number(tag.getInt64(key));
          break;
        case 5:
          _data.value = Number(tag.getFloat(key));
          break;
        case 6:
          _data.value = Number(tag.getDouble(key));
          break;
        case 7:
          _data.value = "";
          break;
        case 8:
          _data.value = tag.getString(key) + "";
          break;
        case 9:
          var listTag = tag.getListTag(key);
          if (listTag != null) {
            _data.value = createMobData(listTag);
          } else {
            _data.value = [];
          }
          break;
        case 10:
          var compoundTag = tag.getCompoundTag(key);
          if (compoundTag != null) {
            _data.value = createMobData(compoundTag);
          } else {
            _data.value = {};
          }
          break;
        case 11:
          _data.value = "";
          break;
      }
      mobData[key] = _data;
    }
  }
  return mobData;
}

function createMobTag(tag_json) {
  var isListTag = Array.isArray(tag_json);
  var tag = isListTag ? new NBT.ListTag() : new NBT.CompoundTag();
  for (var key in tag_json) {
    if (isListTag) key = Number(key);
    var _data = tag_json[key];
    switch (_data.type) {
      case 1:
        tag.putByte(key, _data.value);
        break;
      case 2:
        tag.putShort(key, _data.value);
        break;
      case 3:
        tag.putInt(key, _data.value);
        break;
      case 4:
        tag.putInt64(key, _data.value);
        break;
      case 5:
        tag.putFloat(key, _data.value);
        break;
      case 6:
        tag.putDouble(key, _data.value);
        break;
      case 8:
        tag.putString(key, _data.value);
        break;
      case 9:
        var newTag = createMobTag(_data.value);
        tag.putListTag(key, newTag);
        break;
      case 10:
        var newTag = createMobTag(_data.value);
        tag.putCompoundTag(key, newTag);
        break;
    }
  }
  return tag;
}

var ignoreList = [63, 53, 52, 89, 91, 65, 84, 98, 100, 96, 69, 68, 70, 66, 85, 71, 87, 82, 64, 73, 86, 81, 94, 79, 72, 103, 80, 61, 95, 93, 83];

var playersArray = [];
Callback.addCallback("ServerPlayerLoaded", function (player__) {
  playersArray = Network.getConnectedPlayers();
});

Callback.addCallback("EntityHurt", function (attacker, victim, damage, damageType) {
  if (
    playersArray.indexOf(attacker) != -1 &&
    damageType == 2 &&
    victim &&
    Entity.getCarriedItem(attacker).id == ItemID.soulVesselEmpty &&
    (entityType = Entity.getType(victim) || Entity.getTypeAddon(victim)) &&
    ignoreList.indexOf(entityType) == -1
  ) {
    if (InnerCore_pack.packVersionCode <= 125) return alert("Please Update Your Innecore Pack");
    var mobData = createMobData(Entity.getCompoundTag(victim)); // debug
    Debug.big(mobData);

    Entity.remove(victim);
    var extra = new ItemExtraData();
    if (mobData.identifier) extra.putString("name", mobData.identifier.value);
    extra.putString("entity", JSON.stringify(mobData));
    typeof entityType == "number" ? extra.putInt("type", entityType) : extra.putString("type", entityType);
    runOnMainThread(function () {
      Entity.setCarriedItem(attacker, ItemID.soulVessel, 1, 0, extra);
    });
  }
});

Item.registerUseFunction("soulVessel", function (coords, item, block, player) {
  if (InnerCore_pack.packVersionCode <= 125) return alert("Please Update Your Innecore Pack");
  if (!item.extra) return;
  if (!(entityTag = createMobTag(JSON.parse(item.extra.getString("entity"))))) return;
  var playerActor = new PlayerActor(player);
  var newCoords = {
    x: coords.relative.x + 0.5,
    y: coords.relative.y,
    z: coords.relative.z + 0.5,
  };
  var blockSource = BlockSource.getDefaultForActor(player);
  var entityType = item.extra.getInt("type") || item.extra.getString("type");

  var newEntity = blockSource.spawnEntity(newCoords.x, newCoords.y, newCoords.z, entityType);
  entityTag.putInt64("UniqueID", newEntity);
  var posListTag = new NBT.ListTag();
  posListTag.putFloat(0, newCoords.x);
  posListTag.putFloat(1, newCoords.y);
  posListTag.putFloat(2, newCoords.z);
  entityTag.putListTag("Pos", posListTag);
  Entity.setCompoundTag(newEntity, entityTag);
  playerActor.setInventorySlot(playerActor.getSelectedSlot(), ItemID.soulVesselEmpty, 1, 0, null);
});

Item.registerNameOverrideFunction("soulVessel", function (item, name) {
  if (item.extra) {
    var mobName = item.extra.getString("name");
    name += "\n§7Mob: " + mobName;
    name += "\n§7Type: " + (item.extra.getInt("type") || item.extra.getString("type"));
  }
  return name;
});
