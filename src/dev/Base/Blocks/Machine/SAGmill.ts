BlockRegistry.createBlock(
  "sagmill",
  [
    {
      name: "tile.block_sag_mill.name",
      texture: [
        ["machineBottom", 0],
        ["machineTop", 0],
        ["machineSide", 0],
        ["crusherFront", 0],
        ["machineSide", 0],
        ["machineSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.sagmill, 0, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["crusherFront", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.sagmill, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["crusherFront", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.sagmill, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["crusherFrontOn", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);

TileRenderer.setRotationFunction(BlockID.sagmill);

/*
ICRender.getGroup("bc-container").add(BlockID.sagmill, -1);
ICRender.getGroup("item-pipe").add(BlockID.sagmill, -1);

*/
let SAGGui = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_sag_mill.name"), {
  drawing: [
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    {
      type: "bitmap",
      x: 595,
      y: 250,
      bitmap: "bar_progress_down0",
      scale: 4.2,
    },
    { type: "bitmap", x: 765, y: 165, bitmap: "bar_silicon0", scale: 6.8 },
  ],
  elements: {
    progressScale: {
      type: "scale",
      x: 595,
      y: 250,
      direction: 3,
      bitmap: "bar_progress_down1",
      scale: 4.2,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_sag");
        },
      },
    },
    energyScale: {
      type: "scale",
      x: 335,
      y: 140,
      direction: 1,
      value: 0.5,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    grindingScale: {
      type: "scale",
      x: 765,
      y: 165,
      direction: 1,
      value: 0.5,
      bitmap: "bar_silicon1",
      scale: 6.8,
    },
    ingredient: {
      type: "slot",
      x: 602,
      y: 170,
    },
    slotGrinding: { type: "slot", x: 700, y: 170 },
    slotCapacitor: { type: "slot", x: 325, y: 310 },
    textInstall: {
      type: "text",
      font: { size: 20, color: Color.YELLOW },
      x: 325,
      y: 50,
      width: 100,
      height: 30,
      text: "",
    },
    result0: { type: "slot", x: 505, y: 340 },
    result1: { type: "slot", x: 570, y: 340 },
    result2: { type: "slot", x: 635, y: 340 },
    result3: { type: "slot", x: 700, y: 340 },
  },
});

Callback.addCallback("PreLoaded", function () {
  // Ifn't have Machine Addon
  /*
Recipes.addShaped({ id: BlockID.sagmill, count: 1, data: 0 }, [
      "fff",
      "imi",
       " p "
  ], ['i', ItemID.darkSteel, 0, 'f', VanillaItemID.flint 0, "m", BlockID.machineChassi, 0, "p", VanillaItemID.piston, 0]);
  */
  Recipes.addShaped(
    { id: BlockID.sagmill, count: 1, data: 0 },
    ["fff", "ipi", "ama"],
    ["i", ItemID.darkSteel, 0, "f", VanillaItemID.flint, 0, "m", BlockID.simplesagmill, 0, "p", BlockID.machineChassi, 0, "a", ItemID.darkSteelGear, 0],
  );
  Recipes.addShaped(
    { id: BlockID.sagmill, count: 1, data: 0 },
    ["fff", "ipi", "ama"],
    ["i", ItemID.darkSteel, 0, "f", VanillaItemID.flint, 0, "m", VanillaBlockID.piston, 0, "p", BlockID.machineChassi, 0, "a", ItemID.darkSteelGear, 0],
  );

  RecipeRegistry.addCrusher({
    isGrinding: false,
    ingredient: { id: 49, data: 0 },
    result0: { id: ItemID.dustObsidian, data: 0, chance: 1, count: 4 },
    energy: 4020,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaBlockID.gold_ore, data: 0 },
    result0: { id: ItemID.dustGold, data: 0, chance: 1, count: 2 },
    result1: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    result2: { id: ItemID.dustCopper, data: 0, chance: 0.2 },
    //id: ItemID.dustSilver, data: 0, chance: 0.4
    energy: 3600,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.iron_ore, data: 0 },
    result0: { id: ItemID.dustIron, data: 0, chance: 1, count: 2 },
    result1: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    result2: { id: ItemID.dustTin, data: 0, chance: 0.05 },
    result3: { id: ItemID.dustNickel, data: 0, chance: 1 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.coal_ore, data: 0 },
    result0: { id: 263, data: 0, chance: 1, count: 3 },
    result1: { id: ItemID.dustCoal, data: 0, chance: 0.6 },
    result2: { id: 264, data: 0, chance: 0.001 },
    result3: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.redstone_ore, data: 0 },
    result0: { id: VanillaItemID.redstone, data: 0, chance: 1, count: 8 },
    result1: { id: VanillaItemID.redstone, data: 0, chance: 0.2 },
    result2: { id: ItemID.silicon, data: 0, chance: 0.8 },
    result3: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.diamond_ore, data: 0 },
    result0: { id: 264, data: 0, chance: 1, count: 2 },
    result1: { id: 264, data: 0, chance: 0.25 },
    result2: { id: 263, data: 0, chance: 0.05 },
    result3: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.emerald_ore, data: 0 },
    result0: { id: VanillaItemID.emerald, data: 0, chance: 1, count: 2 },
    result1: { id: VanillaItemID.emerald, data: 0, chance: 0.25 },
    result2: { id: VanillaBlockID.cobblestone, data: 0, chance: 0.15 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.lapis_ore, data: 0 },
    result0: { id: VanillaItemID.lapis_lazuli, data: 0, chance: 1, count: 8 },
    result1: { id: ItemID.dustLapis, data: 0, chance: 0.2 },
    result2: { id: 4, data: 0, chance: 0.15 },
    result3: { id: VanillaItemID.lapis_lazuli, data: 0, chance: 0.2 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.quartz_ore, data: 0 },
    result0: { id: VanillaItemID.quartz, data: 0, chance: 1, count: 2 },
    result1: { id: ItemID.dustQuarzt, data: 0, chance: 0.1 },
    result2: { id: VanillaBlockID.netherrack, data: 0, chance: 0.15 },
    //result3: { id: VanillaItemID.quartz, data: 0, chance: 0.5 },
    energy: 3600,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaBlockID.sand, data: 0 },
    result0: { id: ItemID.silicon, data: 0, chance: 0.5 },
    energy: 720,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: 4, data: 0 },
    result0: { id: 13, data: 0, chance: 1 },
    result1: { id: 12, data: 0, chance: 0.35 },
    result2: { id: VanillaItemID.flint, data: 0, chance: 0.1 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 3600,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: false,
    ingredient: { id: 13, data: 0 },
    result0: { id: 12, data: 0, chance: 1 },
    result1: { id: VanillaItemID.flint, data: 0, chance: 0.5 },
    result2: { id: 0, data: 0, chance: 0 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 3600,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaItemID.quartz, data: 0 },
    result0: { id: ItemID.dustQuarzt, data: 0, chance: 1 },
    result1: { id: ItemID.dustQuarzt, data: 0, chance: 0.1 },
    result2: { id: 0, data: 0, chance: 0 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 120,
    isGrinding: false,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaItemID.lapis_lazuli, data: 0 },
    result0: { id: ItemID.dustLapis, data: 0, chance: 1 },
    result1: { id: ItemID.dustLapis, data: 0, chance: 0.1 },
    result2: { id: 0, data: 0, chance: 0 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 120,
    isGrinding: false,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaItemID.coal, data: 0 },
    result0: { id: ItemID.dustCoal, data: 0, chance: 1 },
    result1: { id: ItemID.dustSulfur, data: 0, chance: 0.1 },
    result2: { id: ItemID.dustCoal, data: 0, chance: 0.1 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 3600,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: VanillaItemID.ender_pearl, data: 0 },
    result0: { id: ItemID.dustEnder, data: 0, chance: 1, count: 1 },
    energy: 1800,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: 296, data: 0 },
    result0: { id: ItemID.dustWheat, data: 0, chance: 1 },
    result1: { id: VanillaItemID.wheat_seeds, data: 0, chance: 0.45 },
    energy: 1200,
    isGrinding: true,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    ingredient: { id: ItemID.pulsatingCrystal, data: 0 },
    result0: { id: ItemID.dustPulsating, data: 0, chance: 1, count: 1 },
    energy: 1800,
    isGrinding: false,
    by: "EnderIO",
  });
});

namespace Machine {
  export class SagMill_Basic extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      // new feature
      durability: 0,
      maxDurability: 1,
      sag_bonus: 0,
      main: 0,
      pwUse: 0,
    };

    capacitors = ["capacitor"];
    acceptType = ["crushed", "buffer", "intake"];
    initCapacitor(): void {
      const capacitors = CapacitorData.useCapacitor(this);
      this.energyConsume = capacitors.getValue(CapacitorKey.SAG_MILL_POWER_USE);
      this.maxIntake = capacitors.getValue(CapacitorKey.SAG_MILL_POWER_INTAKE);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.SAG_MILL_POWER_BUFFER));
    }

    getScreenByName(): UI.IWindow {
      return SAGGui;
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        if (name == "ingredient") return true; // CrusherRecipe.getInput(new ItemStack(id, amount, data));
        if (name.startsWith("slotGrinding")) return GrindingBall.isBallID(id);
        return false;
      });
    }

    executeBall(): void {
      if (this.data.durability <= 0) {
        this.data.durability = this.data.main = this.data.sag_bonus = this.data.pwUse = 0;
        this.data.maxDurability = 1;
      }
      let slot = this.container.getSlot("slotGrinding");
      if (GrindingBall.isBallID(slot.id) && this.data.durability == 0) {
        let grindingBall = GrindingBall.getBallID(slot.id);
        slot.count--;
        this.data.maxDurability = this.data.durability = grindingBall.durability;
        this.data.main = grindingBall.main;
        this.data.sag_bonus = grindingBall.bonus;
        this.data.pwUse = grindingBall.use;
        this.container.validateAll();
        slot.markDirty();
      }
    }

    run(): void {
      let input = this.container.getSlot("ingredient");
      let res0 = this.container.getSlot("result0");
      let res1 = this.container.getSlot("result1");
      let res2 = this.container.getSlot("result2");
      let res3 = this.container.getSlot("result3");
      let newActive = false;
      let grinding = this.container.getSlot("slotGrinding");
      // cơ chế mài bóng
      this.executeBall();
      // let recipe = CrusherRecipe.getRecipe(input.id, input.data);
      let recipe = CrusherRecipe.getRecipe(input);
      if (recipe) {
        let isGrinding = recipe.isGrinding;
        let ingredient = recipe.ingredient;
        let result0 = recipe.result0;
        let result1 = recipe.result1;
        let result2 = recipe.result2;
        let result3 = recipe.result3;
        let time = recipe.energy;
        if (
          ((res0.id == result0.id && res0.data == result0.data && res0.count + result0.count <= 64) || res0.id == 0) &&
          ((res1.id == result1.id && res1.data == result1.data && res1.count < 64) || res1.id == 0) &&
          ((res2.id == result2.id && res2.data == result2.data && res2.count < 64) || res2.id == 0) &&
          ((res3.id == result3.id && res3.data == result3.data && res3.count < 64) || res3.id == 0)
        ) {
          this.processTime = time;
          let canUseGrinding = isGrinding && this.data.durability > 0;
          let pw_consump = canUseGrinding ? Math.floor(this.energyConsume * this.data.pwUse) : this.energyConsume;
          if (this.data.energy >= pw_consump) {
            newActive = true;
            this.data.progress += this.energyConsume;
            this.data.energy -= pw_consump;
          }
          if (this.data.progress >= this.processTime) {
            input.count--;
            input.markDirty();
            let outputRandom = Math.random();
            let outputBonusRandom = canUseGrinding ? outputRandom * this.data.sag_bonus : outputRandom;
            let countOutput = 1;
            let mainCountIuput = result0.count;
            if (canUseGrinding && Math.random() <= this.data.main) {
              countOutput = 2;
              mainCountIuput = result0.count * 2;
            }
            if (outputRandom <= result0.chance) {
              // Main Output
              res0.id = result0.id;
              res0.data = result0.data;
              res0.count += mainCountIuput;
              res0.markDirty();
            }
            if (result1.chance && outputBonusRandom <= result1.chance) {
              // 3 Bonus
              res1.id = result1.id;
              res1.data = result1.data;
              res1.count += countOutput;
              res1.markDirty();
            }
            if (result2.chance && outputBonusRandom <= result2.chance) {
              res2.id = result2.id;
              res2.data = result2.data;
              res2.count += countOutput;
              res2.markDirty();
            }
            if (result3.chance && outputBonusRandom <= result3.chance) {
              res3.id = result3.id;
              res3.data = result3.data;
              res3.count += countOutput;
              res3.markDirty();
            }
            this.container.validateAll();
            this.data.progress = 0;
            if (canUseGrinding) this.data.durability--;
          }
        }
      } else {
        this.data.progress = 0;
      }
      this.setActive(newActive);
    }

    onTick(): void {
      this.initCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
      let grindingDura = this.data.durability / this.data.maxDurability;
      this.container.setScale("grindingScale", grindingDura || 0);
      this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.sagmill, new SagMill_Basic());

  StorageInterface.createInterface(BlockID.sagmill, {
    slots: {
      ingredient: { input: true },

      result0: { output: true },
      result1: { output: true },
      result2: { output: true },
      result3: { output: true },
    },
    isValidInput: (item: ItemInstance) => {
      return !!CrusherRecipe.getInput(item);
    },
  });
}
