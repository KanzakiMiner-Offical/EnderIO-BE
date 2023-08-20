BlockRegistry.createBlock("bankVibrant", [
  { name: "Vibrant Capacitor Bank", texture: [["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrantFront", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.bankVibrant, "ston3");

Callback.addCallback("PreLoaded", function() {
   Recipes.addShaped({ id: BlockID.bankVibrant, count: 1, data: 0 }, [
    	"scs",
    	"crc",
	   "scs"
  ], ['s', ItemID.electricalSteel, 0, 'c', ItemID.octadicCapacitor, 0, "r", 152, 0]);
});

const guiVibrantCapacitor = CapacitorBlockWindow("Vibrant Capacitor Bank");

namespace Machine {
  class VibrantCapcitor extends CapacitorBlock {
    constructor() {
      super(4, 1280, 25000000, guiVibrantCapacitor);
    }
  }

  MachineRegistry.registerPrototype(BlockID.bankVibrant, new VibrantCapcitor());
  MachineRegistry.setStoragePlaceFunction("bankVibrant", true);
}