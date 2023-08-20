/*
TileRenderer.setHandAndUiModel(BlockID.bankBasic, 0, [["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBankFront", 0], ["capacitorBank", 0], ["capacitorBank", 0]]);
TileRenderer.setStandardModel(BlockID.bankBasic, 0, [["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBankFront", 0], ["capacitorBank", 0], ["capacitorBank", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.bankBasic, 2, ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBankFront", 0], ["capacitorBank", 0], ["capacitorBank", 0]);
*/
BlockRegistry.createBlock("bankBasic", [
  { name: "Basic Capacitor Bank", texture: [["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBankFront", 0], ["capacitorBank", 0], ["capacitorBank", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.storageBatBox, "stone");


Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.bankBasic, count: 1, data: 0 }, [
    	"ici",
    	"crc",
	   "ici"
  ], ['i', 265, 0, 'c', ItemID.basicCapacitor, 0, "r", BlockID.machineChassi, 0]);
});

const guiBasicCapacitor = CapacitorBlockWindow("Basic Capacitor Bank");

namespace Machine {
  class BasicCapcitor extends CapacitorBlock {
    constructor() {
      super(1, 500, 1000000, guiBasicCapacitor);
    }
  }

  MachineRegistry.registerPrototype(BlockID.bankBasic, new BasicCapcitor());
  MachineRegistry.setStoragePlaceFunction("bankBasic", true);
}