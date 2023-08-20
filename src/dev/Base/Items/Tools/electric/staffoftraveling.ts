class ItemTravelStaff extends ItemElectric
implements ItemBehavior {
  energyPerUse = 3000;

  constructor() {
    super("itemTravelStaff", "Staff of Traveling", 250000, 100, 1);
  }

  onNoTargetUse(item: ItemStack, player: number): void {
    const client = Network.getClientForPlayer(player);
    if (client && EnderTool.useElectricItem(item, this.energyPerUse, player)) {
      //
      let region = BlockSource.getDefaultForActor(player);
      let item = Entity.getCarriedItem(player);
      let pos = Entity.getPosition(player);
      let vec = Entity.getLookVector(player);
      let crd = {
        x: 0,
        y: 0,
        z: 0
      };
      let t = Math.round(Math.random() * 16)
      crd.x = pos.x + vec.x * t;
      crd.y = pos.y + vec.y * t;
      crd.z = pos.z + vec.z * t;

      Entity.setPosition(player, Math.round(crd.x), Math.round(crd.y), Math.round(crd.z));
      client.sendMessage("Teleport at: X: " + Math.round(crd.x) + " Y: " + Math.round(crd.y) + " Z: " + Math.round(crd.z));
    }
  }
}

ItemRegistry.registerItem(new ItemTravelStaff());