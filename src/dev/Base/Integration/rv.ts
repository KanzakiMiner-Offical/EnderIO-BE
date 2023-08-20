ModAPI.addAPICallback("RecipeViewer", (api: typeof RV) => {
  RV = api;
  const RecipeType = api.RecipeType
  const Bitmap = android.graphics.Bitmap;

  class AlloySmelterRecipe extends RecipeType {

    constructor() {
      super("Alloy Smelter", BlockID.alloySmelter, {
        drawing: [
          { type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2 },
          { type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2 },
            ],
        elements: {
          input0: { type: "slot", x: 520, y: 170 },
          input1: { type: "slot", x: 600, y: 140 },
          input2: { type: "slot", x: 680, y: 170 },
          output0: { type: "slot", x: 600, y: 320 },
          textTime: { type: "text", x: 750, y: 200 }
        }
      });
      this.setGridView(2, 2, true);
      this.setDescription("Alloy")
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let i in SmelterRecipe.recipes) {
        const recipe = SmelterRecipe.recipes[i];
        list.push({
          input: recipe.input,
          output: [recipe.result],
          energy: recipe.energy
        });
      }
      return list;
    }
    onOpen(elements: java.util.HashMap < string, UI.Element > , recipe: RecipePattern): void {
      elements.get("textTime").setBinding("text", Translation.translate("Energy: ") + recipe.energy + " RF");
    }
  }

  api.RecipeTypeRegistry.register("enderio_alloy", new AlloySmelterRecipe());

  class SAGMillRecipe extends RecipeType {

    constructor() {
      super("SAG Mill", BlockID.sagmill, {
        drawing: [
          { type: "bitmap", x: 595, y: 250, bitmap: "bar_progress_down0", scale: 4.2 }
	     		],
        elements: {
          input0: { type: "slot", x: 602, y: 170, size: 65 },
          output0: { type: "slot", x: 505, y: 340, size: 65 },
          output1: { type: "slot", x: 570, y: 340, size: 65 },
          output2: { type: "slot", x: 635, y: 340, size: 65 },
          output3: { type: "slot", x: 700, y: 340, size: 65 }
        }
      });
      this.setGridView(2, 2, true);
      this.setDescription("Crusher")
    }

    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      const recipe = CrusherRecipe.recipes
      for (const i in recipe) {
        const input = recipe[i].ingredient;
        const result0 = recipe[i].result0;
        const result1 = recipe[i].result1;
        const result2 = recipe[i].result2;
        const result3 = recipe[i].result3;
        list.push({
          input: [{ id: input.id, count: 1, data: input.data }],
          output: [
            { id: result0.id || 0, count: result0.count || 1, data: result0.data || 0, tips: { chance: result0.chance * 100 } },
            { id: result1.id || 0, count: 1, data: result1.data || 0, tips: { chance: result1.chance * 100 } },
            { id: result2.id || 0, count: 1, data: result2.data || 0, tips: { chance: result2.chance * 100 } },
            { id: result3.id || 0, count: 1, data: result3.data || 0, tips: { chance: result3.chance * 100 } },
					]
        })
      }
      return list;
    }

    slotTooltip(name: string, item: ItemInstance, tips: {
      [key: string]: any
    }): string {
      if (tips)
        return name + "\n Chance: " + tips.chance + " %";
    }
  }
  api.RecipeTypeRegistry.register("enderio_sag", new SAGMillRecipe());


  class TheVatRecipe extends RecipeType {
    constructor() {
      super("The Vat", BlockID.theVat, {
        drawing: [
          { type: "bitmap", x: 281, y: -190, bitmap: "backgroundVatRV", scale: 3.3 },
          { type: "bitmap", x: 679, y: 304, bitmap: "fire_scale1", scale: 3.3 },
   			],
        elements: {
          input0: { type: "slot", x: 590, y: 130, size: 65 },
          input1: { type: "slot", x: 753, y: 130, size: 65 },
          inputLiq0: { x: 502, y: 130, width: 50, height: 200 },
          outputLiq0: { x: 842, y: 130, width: 50, height: 200 },
          textTime: { type: "text", x: 750, y: 200 }
        },
      })
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
              let input1Multiplier = recipe.input1[input1[0] + ":" + input1[1]] || recipe.input1[input1[0]]
              let input2Multiplier = recipe.input2[input2[0]] || recipe.input2[input2[0] + ":" + input2[1]]
              let ingredientMultiplier = input1Multiplier * input2Multiplier;
              list.push({
                input: [
                  { id: +input1[0], data: +input1[1] || 0, count: 1, tips: { multi: input1Multiplier } },
                  { id: +input2[0], data: +input2[1] || 0, count: 1, tips: { multi: input2Multiplier } }
                      ],
                inputLiq: [{
                  liquid: recipe.inputLiquid,
                  amount: ingredientMultiplier * 1000,
                  tips: { amount: ingredientMultiplier * 1000 }
                      }],
                outputLiq: [{
                  liquid: recipe.outputLiquid,
                  amount: recipe.inputMutilplier * ingredientMultiplier * 1000,
                  tips: { amount: recipe.inputMutilplier * ingredientMultiplier * 1000 }
                      }],
                energy: recipe.energy
              })
            }
          }
        } else {
          for (let prop1 in recipe.input1) {
            let input1 = prop1.split(":");
            let input1Multiplier = recipe.input1[input1[0] + ":" + input1[1]] || recipe.input1[input1[0]];
            list.push({
              input: [
                { id: +input1[0], data: +input1[1] || 0, count: 1, tips: { multi: input1Multiplier } },
                { id: 0, data: 0, count: 0 }
                      ],
              inputLiq: [{
                liquid: recipe.inputLiquid,
                amount: input1Multiplier * 1000,
                tips: { amount: input1Multiplier * 1000 }
                    }],
              outputLiq: [{
                liquid: recipe.outputLiquid,
                amount: recipe.inputMutilplier * input1Multiplier * 1000,
                tips: { amount: recipe.inputMutilplier * input1Multiplier * 1000 }
                    }],
              energy: recipe.energy
            })
          }
        }
      }
      return list
    }

    tankTooltip(name: string, liquid: LiquidInstance, tips: {
      [key: string]: any
    }): string {
      return name + ": " + tips.amount + " mB";
    }
    slotTooltip(name: string, item: ItemInstance, tips: {
      [key: string]: any
    }): string {
      if (tips)
        return name + "\n x:" + tips.multi;
    }
  }

  api.RecipeTypeRegistry.register("ender_vat", new TheVatRecipe());


  class SoulBinderRecipe extends RecipeType {
    constructor() {
      super("Soul Binder", BlockID.soulBinder, {
        drawing: [
          { type: "bitmap", x: 600, y: 205, bitmap: "bar_progress1", scale: 3.2 }
        ],
        elements: {
          input0: { type: "slot", x: 450, y: 200 },
          input1: { type: "slot", x: 510, y: 200 },
          output0: { type: "slot", x: 700, y: 200 },
          output1: { type: "slot", x: 760, y: 200 },
        },
      })
    }
    getAllList(): RecipePattern[] {
      const list: RecipePattern[] = [];
      for (let i in SoulRecipe.recipes) {
        let recipe = SoulRecipe.recipes[i]
        let r_soul = recipe.soul
        let r_lvl = recipe.lvl;
        let r_ingredient = recipe.ingredient
        let r_result = recipe.result0
        let r_energy = recipe.energy
        list.push({
          input: [{ id: ItemID.soulVessel, count: 1, data: 0, tips: { soul: r_soul } },
            { id: r_ingredient.id, data: r_ingredient.data || 1, count: r_ingredient.count || 1, tips: { energy: r_energy } }],
          output: [
            { id: r_result.id || 0, count: r_result.count || 1, data: r_result.data || 0 },
            { id: ItemID.soulVesselEmpty, count: 1, data: 0 }
					]
        })
      }
      return list
    }
    slotTooltip(name: string, item: ItemInstance, tips: {
          [key: string]: any
    }): string {
      if (tips)
        if (tips.soul)
          return name + "\n Soul: " + tips.soul;
          else if (tips.energy)
          return name + "\n Energy Use: " + tips.energy
    }
  }

  api.RecipeTypeRegistry.register("ender_soulbinder", new SoulBinderRecipe());
});