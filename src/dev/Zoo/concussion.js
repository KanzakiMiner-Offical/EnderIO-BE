/*IDRegistry.genBlockID("confusion_charge");
Block.createBlock("confusion_charge", [
  { name: "confusion_charge", texture: [["block_confusion_charge_bot", 0], ["block_confusion_charge_top", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0]], inCreative: true }
]);

TileRenderer.setStandartModel(BlockID.confusion_charge, [["block_confusion_charge_bot", 0], ["block_confusion_charge_top", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0], ["block_confusion_charge_side", 0]]);
TileRenderer.registerRenderModel(BlockID.confusion_charge, 0, [["tnt_active", 0]]);

var AccesMobs = [
  EntityType.BAT,
  EntityType.CHICKEN,
  EntityType.COW,
  EntityType.MUSHROOM_COW,
  EntityType.OCELOT,
  EntityType.PIG,
  EntityType.RABBIT,
  EntityType.SHEEP,
  EntityType.SNOW_GOLEM,
  EntityType.SQUID,
  EntityType.VILLAGER,
  EntityType.WOLF,
  23,
  24,
  25,
  26,
  27,
  EntityType.BLAZE,
  EntityType.CAVE_SPIDER,
  EntityType.CREEPER,
  EntityType.ENDERMAN,
  EntityType.GHAST,
  EntityType.IRON_GOLEM,
  EntityType.LAVA_SLIME,
  EntityType.PIG_ZOMBIE,
  EntityType.PLAYER,
  //Player.get(),
  EntityType.SILVERFISH,
  EntityType.SKELETON,
  EntityType.SLIME,
  EntityType.SPIDER,
  EntityType.ZOMBIE,
  EntityType.ZOMBIE_VILLAGER,
  45,
  46,
  47,
  48,
  49,
  52,
  54,
  55,
  59,
  111,
  105
  ];
MachineRegistry.registerPrototype(BlockID.confusion_charge, {
  defaultValues: {
    activated: false,
    timer: 100
  },

  click: function(id) {
    if (id == VanillaItemID.flint_and_steel) {
      this.data.activated = true;
    }
  },

  explode: function() {
    let entities = AccesMobs
    for (i in entities) {
      let ent = Entity.findNearest({ x: this.x, y: this.y, z: this.z }, entities[i], 64);
      if (ent) {
        let pos = Entity.getPosition(ent)
        Entity.addEffect(ent, PotionEffect.confusion, 1, 15 * 20)
        var rdNav = randomInt(-1, 1)
        Entity.setPosition(ent, (rdNav * 1) + pos.x, 1 + pos.y, (rdNav * 1) + pos.z);
      }
    }
    let player = Player.get();
    if (player) {
      let pos = Entity.getPosition(player)
      Entity.addEffect(player, PotionEffect.confusion, 1, 15 * 20)
      var rdNav = randomInt(-1, 1)
      Entity.setPosition(player, (rdNav * 1) + pos.x, 1 + pos.y, (rdNav * 1) + pos.z);
      return
    }

  },

  onTick: function() {
    if (this.data.activated) {
      if (this.data.timer <= 0) {
        this.explode();
        World.setBlock(this.x, this.y, this.z, 0, 0)
        return;
      }
      if (this.data.timer % 10 < 5) {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, 0);
      } else {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
      }
      this.data.timer--;
    }
  },

  redstone: function(signal) {
    if (signal.power > 0) {
      this.data.activated = true;
    }
  }
});*/
