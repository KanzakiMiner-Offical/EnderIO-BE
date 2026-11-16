ModAPI.addAPICallback("RecipeViewer", (api: typeof RV) => {
  RV = api;
  const RecipeType = api.RecipeType;
  const Bitmap = android.graphics.Bitmap;
  class AlloySmelterRecipe extends RecipeType {
    constructor() {
      super("Alloy Smelter", BlockID.alloySmelter, {
        drawing: [
          { type: "bitmap", x: 637, y: 255.5, bitmap: "fire_scale0", scale: 5 },
          { type: "bitmap", x: 417, y: 255.5, bitmap: "fire_scale0", scale: 5 },
        ],
        elements: {
          input0: { type: "slot", x: 412, y: 116.5, size: 80 },
          input1: { type: "slot", x: 522, y: 64.5, size: 80 },
          input2: { type: "slot", x: 632, y: 116.5, size: 80 },
          output0: { type: "slot", x: 522, y: 305.5, size: 80 },
          textTime: { type: "text", x: 637, y: 385.5 },
        },
      });
      this.setDescription("Alloy");
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let i in SmelterRecipe.recipes) {
        const recipe = SmelterRecipe.recipes[i];
        list.push({
          input: recipe.input,
          output: [recipe.result],
          energy: recipe.energy,
        });
      }
      return list;
    }
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
      elements.get("textTime").setBinding("text", Translation.translate("Energy: ") + recipe.energy + " RF");
    }
  }
  api.RecipeTypeRegistry.register("enderio_alloy", new AlloySmelterRecipe());

  class SAGMillRecipe extends RecipeType {
    constructor() {
      super("SAG Mill", BlockID.sagmill, {
        drawing: [{ type: "bitmap", x: 426.4, y: 186, bitmap: "bar_progress_down0", scale: 4 }],
        elements: {
          input0: { type: "slot", x: 602, y: 170, size: 65 },
          output0: { type: "slot", x: 298.4, y: 300, size: 80 },
          output1: { type: "slot", x: 460, y: 300, size: 80 },
          output2: { type: "slot", x: 378.4, y: 300, size: 80 },
          output3: { type: "slot", x: 540, y: 300, size: 80 },
        },
      });
      this.setDescription("Crusher");
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      const recipe = CrusherRecipe.recipes;
      for (const i in recipe) {
        const input = recipe[i].ingredient;
        const result0 = recipe[i].result0;
        const result1 = recipe[i].result1;
        const result2 = recipe[i].result2;
        const result3 = recipe[i].result3;
        list.push({
          input: [{ id: input.id, count: 1, data: input.data }],
          output: [
            {
              id: result0.id || 0,
              count: result0.count || 1,
              data: result0.data || 0,
              tips: { chance: result0.chance * 100 },
            },
            {
              id: result1?.id || 0,
              count: 1,
              data: result1?.data || 0,
              tips: { chance: (result1?.chance || 0) * 100 },
            },
            {
              id: result2?.id || 0,
              count: 1,
              data: result2?.data || 0,
              tips: { chance: (result2?.chance || 0) * 100 },
            },
            {
              id: result3?.id || 0,
              count: 1,
              data: result3?.data || 0,
              tips: { chance: (result3?.chance || 0) * 100 },
            },
          ],
        });
      }
      return list;
    }

    slotTooltip(
      name: string,
      item: ItemInstance,
      tips: {
        [key: string]: any;
      },
    ): string {
      if (tips) return name + "\n Chance: " + tips.chance + " %";
      return name;
    }
  }
  api.RecipeTypeRegistry.register("enderio_sag", new SAGMillRecipe());

  class GrindingBallRecipe extends RecipeType {
    constructor() {
      super("Grinding Ball", ItemID.ball_dark_steel, {
        elements: {
          input0: { type: "slot", x: 280, y: 165, size: 90 },
          textMain: { type: "text", x: 420, y: 135 },
          textBonus: { type: "text", x: 420, y: 180 },
          textUse: { type: "text", x: 420, y: 225 },
          textDura: { type: "text", x: 420, y: 270 },
        },
      });
      this.setDescription("Grinding Ball");
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (const key in GrindingBall.idBall) {
        const id = parseInt(key);
        if (isNaN(id) || id == 0) continue;
        const ball = GrindingBall.idBall[key];
        list.push({
          input: [
            {
              id: id,
              count: 1,
              data: 0,
            },
          ],
          main: ball.main,
          bonus: ball.bonus,
          use: ball.use,
          durability: ball.durability,
        });
      }
      return list;
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
      elements.get("textMain")?.setBinding("text", "Main Output: " + Math.round((recipe.main + 1) * 100) + "%");
      elements.get("textBonus")?.setBinding("text", "Bonus Output: " + Math.round(recipe.bonus * 100) + "%");
      elements.get("textUse")?.setBinding("text", "Power Use: " + Math.round(recipe.use * 100) + "%");
      elements.get("textDura")?.setBinding("text", "Durability: " + recipe.durability * 2400);
    }
  }
  api.RecipeTypeRegistry.register("enderio_sag_ball", new GrindingBallRecipe());

  class TheVatRecipe extends RecipeType {
    constructor() {
      super("The Vat", BlockID.theVat, {
        drawing: [
          { type: "bitmap", x: 245, y: 54, bitmap: "bg_vat", scale: 6 },
          { type: "bitmap", x: 156, y: 78, bitmap: "fluid_bg", scale: 6 },
          { type: "bitmap", x: 753, y: 78, bitmap: "fluid_bg", scale: 6 },
        ],
        elements: {
          input0: { type: "slot", x: 591, y: 78, size: 100 },
          input1: { type: "slot", x: 306, y: 78, size: 100 },
          inputLiq0: { x: 156, y: 78, bitmap: "fluid_bg", scale: 6 },
          outputLiq0: { x: 753, y: 78, bitmap: "fluid_bg", scale: 6 },
          textTime: { type: "text", x: 442, y: 394, width: 100, height: 30 },
        },
      });
      this.setTankLimit(5000);
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let recipe of VatRecipe.recipes) {
        if (!isEmpty(recipe.input2)) {
          for (let prop1 in recipe.input1) {
            let input1 = prop1.split(":");
            for (let prop2 in recipe.input2) {
              let input2 = prop2.split(":");
              let input1Multiplier = recipe.input1[input1[0] + ":" + input1[1]] || recipe.input1[input1[0]];
              let input2Multiplier = recipe.input2[input2[0]] || recipe.input2[input2[0] + ":" + input2[1]];
              let ingredientMultiplier = input1Multiplier * input2Multiplier;
              list.push({
                input: [
                  {
                    id: +input1[0],
                    data: +input1[1] || 0,
                    count: 1,
                    tips: { multi: input1Multiplier },
                  },
                  {
                    id: +input2[0],
                    data: +input2[1] || 0,
                    count: 1,
                    tips: { multi: input2Multiplier },
                  },
                ],
                inputLiq: [
                  {
                    liquid: recipe.inputLiquid,
                    amount: ingredientMultiplier * 1000,
                    tips: { amount: ingredientMultiplier * 1000 },
                  },
                ],
                outputLiq: [
                  {
                    liquid: recipe.outputLiquid,
                    amount: recipe.inputMutilplier * ingredientMultiplier * 1000,
                    tips: {
                      amount: recipe.inputMutilplier * ingredientMultiplier * 1000,
                    },
                  },
                ],
                energy: recipe.energy,
              });
            }
          }
        } else {
          for (let prop1 in recipe.input1) {
            let input1 = prop1.split(":");
            let input1Multiplier = recipe.input1[input1[0] + ":" + input1[1]] || recipe.input1[input1[0]];
            list.push({
              input: [
                {
                  id: +input1[0],
                  data: +input1[1] || 0,
                  count: 1,
                  tips: { multi: input1Multiplier },
                },
                { id: 0, data: 0, count: 0 },
              ],
              inputLiq: [
                {
                  liquid: recipe.inputLiquid,
                  amount: input1Multiplier * 1000,
                  tips: { amount: input1Multiplier * 1000 },
                },
              ],
              outputLiq: [
                {
                  liquid: recipe.outputLiquid,
                  amount: recipe.inputMutilplier * input1Multiplier * 1000,
                  tips: {
                    amount: recipe.inputMutilplier * input1Multiplier * 1000,
                  },
                },
              ],
              energy: recipe.energy,
            });
          }
        }
      }
      return list;
    }

    tankTooltip(
      name: string,
      liquid: LiquidInstance,
      tips: {
        [key: string]: any;
      },
    ): string {
      return name + ": " + tips.amount + " mB";
    }
    slotTooltip(
      name: string,
      item: ItemInstance,
      tips: {
        [key: string]: any;
      },
    ): string {
      if (tips) return name + "\n x:" + tips.multi;
      return name;
    }
  }

  api.RecipeTypeRegistry.register("ender_vat", new TheVatRecipe());

  class SoulBinderRecipe extends RecipeType {
    constructor() {
      super("Soul Binder", BlockID.soulBinder, {
        drawing: [{ type: "bitmap", x: 459, y: 190, bitmap: "bar_progress1", scale: 5 }],
        elements: {
          input0: { type: "slot", x: 267, y: 185, size: 90 },
          input1: { type: "slot", x: 357, y: 185, size: 90 },
          output0: { type: "slot", x: 604, y: 185, size: 90 },
          output1: { type: "slot", x: 694, y: 185, size: 90 },
        },
      });
    }
    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let i in SoulRecipe.recipes) {
        let recipe = SoulRecipe.recipes[i];
        let r_soul = recipe.soul;
        let r_lvl = recipe.lvl;
        let r_ingredient = recipe.ingredient;
        let r_result = recipe.result0;
        let r_energy = recipe.energy;
        list.push({
          input: [
            {
              id: ItemID.soulVessel,
              count: 1,
              data: 0,
              tips: { soul: r_soul, lvl: r_lvl },
            },
            {
              id: r_ingredient.id,
              data: r_ingredient.data || 1,
              count: r_ingredient.count || 1,
              tips: { energy: r_energy },
            },
          ],
          output: [
            {
              id: r_result.id || 0,
              count: r_result.count || 1,
              data: r_result.data || 0,
            },
            { id: ItemID.soulVesselEmpty, count: 1, data: 0 },
          ],
        });
      }
      return list;
    }
    slotTooltip(
      name: string,
      item: ItemInstance,
      tips: {
        [key: string]: any;
      },
    ): string {
      if (tips) {
        if (tips.soul) return name + "\n Soul: " + tips.soul;
        else if (tips.energy) return name + "\n Energy Use: " + tips.energy;
        else if (tips.lvl) return name + "\n Level Require: " + tips.lvl + ".Experience Need: " + ObeliskCore.LVLtoXP(tips.lvl);
      }
      return name;
    }
  }

  api.RecipeTypeRegistry.register("ender_soulbinder", new SoulBinderRecipe());

  class SliceNSpliceRecipe extends RecipeType {
    constructor() {
      super("Slice 'n' splice", BlockID.sliceAndSplice, {
        drawing: [{ type: "bitmap", x: 500, y: 235, bitmap: "bar_progress1", scale: 5 }],
        elements: {
          input0: { type: "slot", x: 240, y: 195, size: 80 },
          input1: { type: "slot", x: 320, y: 195, size: 80 },
          input2: { type: "slot", x: 400, y: 195, size: 80 },
          input3: { type: "slot", x: 240, y: 275, size: 80 },
          input4: { type: "slot", x: 320, y: 275, size: 80 },
          input5: { type: "slot", x: 400, y: 275, size: 80 },
          output: { type: "slot", x: 665, y: 225, size: 90 },
        },
      });
    }
    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let i in SliceAndSpliceRecipe.recipes) {
        let recipe = SliceAndSpliceRecipe.recipes[i];
        let r_input0 = recipe["input0"];
        let r_input1 = recipe["input1"];
        let r_input2 = recipe["input2"];
        let r_input3 = recipe["input3"];
        let r_input4 = recipe["input4"];
        let r_input5 = recipe["input5"];
        let r_result = recipe.result;
        let r_energy = recipe.energy;
        list.push({
          input: [
            { id: r_input0.id, count: r_input0.count, data: r_input0.data },
            { id: r_input1.id, count: r_input1.count, data: r_input1.data },
            { id: r_input2.id, count: r_input2.count, data: r_input2.data },
            { id: r_input3.id, count: r_input3.count, data: r_input3.data },
            { id: r_input4.id, count: r_input4.count, data: r_input4.data },
            { id: r_input5.id, count: r_input5.count, data: r_input5.data },
          ],
          output: [
            {
              id: r_result.id || 0,
              count: r_result.count || 1,
              data: r_result.data || 0,

              tips: { use: r_energy },
            },
          ],
        });
      }
      return list;
    }
    slotTooltip(
      name: string,
      item: ItemInstance,
      tips: {
        [key: string]: any;
      },
    ): string {
      if (tips) return name + "\n Power Use: " + tips.use + " RF";
      return name;
    }
  }
  api.RecipeTypeRegistry.register("ender_sands", new SliceNSpliceRecipe());

  class CombustionProduct extends RecipeType {
    constructor() {
      super("Combustion Fuel", BlockID.combustionGenerator, {
        drawing: [
          { type: "bitmap", x: 458, y: 288, bitmap: "fire_scale1", scale: 6 },
          { type: "bitmap", x: 689, y: 78, bitmap: "fluid_bg", scale: 6 },
          { type: "bitmap", x: 215, y: 78, bitmap: "fluid_bg", scale: 6 },
        ],
        elements: {
          inputLiq0: { type: "scale", x: 689, y: 78, bitmap: "fluid_bg", scale: 6 },
          inputLiq1: { type: "scale", x: 215, y: 78, bitmap: "fluid_bg", scale: 6 },
          textWarn: { type: "text", x: 442, y: 120 },
        },
      });
      this.setTankLimit(300);
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      const coolants = CombustionFuel.getCoolArray();
      const heats = CombustionFuel.getHeatArray();
      for (let coolant_fluid of coolants) {
        for (let heat_fluid of heats) {
          let heat_impl = new CombustionFuel.FuelImpl(heat_fluid);
          let coolant_impl = new CombustionFuel.CoolantImpl(coolant_fluid);
          let math = new CombustionMath(coolant_impl, heat_impl, 1, 1);
          list.push({
            inputLiq: [
              {
                liquid: coolant_fluid,
                amount: 100,
                tips: {
                  amount: 100,
                  burn_time: math.getTicksPerCoolant(100),
                  power: math.getEnergyGeneratorPerCycle(100),
                  powerTick: math.getEnergyPerTick(),
                },
              },
              {
                liquid: heat_fluid,
                amount: 100,
                tips: {
                  amount: 100,
                  burn_time: math.getTicksPerFuel(100),
                  power: math.getEnergyGeneratorPerCycle(100),
                  powerTick: math.getEnergyPerTick(),
                },
              },
            ],
          });
        }
      }
      return list;
    }

    tankTooltip(name: string, liquid: LiquidInstance, tips: { [key: string]: any }): string {
      return name + "100 mB <=> Burn Time: " + tips.burn_time / 20 + "s\n Energy Per Tick: " + tips.powerTick + " RF/tick\n Energy Per Cycle: " + tips.power + " RF";
    }

    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
      elements.get("textWarn")?.setBinding("text", "Data from normal tier with Basic Capacitor");
    }
  }

  api.RecipeTypeRegistry.register("ender_combustion", new CombustionProduct());
});
