function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

namespace SmelterRecipe {
  export type RecipeFormat = {
    result: ItemInstance;
    input: ItemInstance[];
    energy: number /*, exp ? : number*/;
  };
  export type RecipeType = {
    ingredient1: ItemInstance;
    ingredient2?: ItemInstance;
    ingredient3?: ItemInstance;
    result: ItemInstance;
    energy: number;
    by?: string;
    //exp ? : number
  };
  /*export type FurnaceRecipeFormat = {
    result: ItemInstance,
    ingredient: string
  }
*/
  export const recipes: RecipeFormat[] = [];

  export function addRecipe(obj: RecipeType) {
    let inputArray = [obj.ingredient1];
    if (!!obj.ingredient2) {
      inputArray.push(obj.ingredient2);
    }
    if (!!obj.ingredient3) {
      inputArray.push(obj.ingredient3);
    }
    recipes.push({
      result: obj.result,
      input: inputArray,
      energy: obj.energy,
    });
  }

  export function getInput(container: ItemContainer): ItemInstance[] {
    const inputItems: ItemInstance[] = [];
    for (let i = 1; i <= 3; i++) {
      const slot = container.getSlot("ingredient" + i);
      if (slot.id > 0) {
        inputItems.push(new ItemStack(slot));
      }
    }
    return inputItems;
  }

  export function getRecipe(inputItems: ItemInstance[]): RecipeFormat {
    if (inputItems.length == 0) return null;
    for (let recipe of recipes) {
      let valid = true;
      for (let item of recipe.input) {
        let count = 0;
        for (let slot of inputItems) {
          if (item.id == slot.id && (item.data == -1 || item.data == slot.data)) {
            count += slot.count;
          }
        }
        if (count < item.count) {
          valid = false;
          break;
        }
      }
      if (valid) {
        return recipe;
      }
    }
    return null;
  }

  export function performRecipe(recipe: RecipeFormat, container: ItemContainer) {
    const resultSlot = container.getSlot("slotResult");
    for (let item of recipe.input) {
      let count = item.count;
      for (let i = 1; i <= 3; i++) {
        const slot = container.getSlot("ingredient" + i);
        if (item.id == slot.id && (item.data == -1 || item.data == slot.data)) {
          const dc = Math.min(count, slot.count);
          count -= dc;
          slot.setSlot(slot.id, slot.count - dc, slot.data);
          slot.validate();
        }
      }
    }
    resultSlot.setSlot(recipe.result.id, resultSlot.count + recipe.result.count, recipe.result.data);
    container.validateAll();
  }

  export function getInputFurnace(container: ItemContainer): any {
    // input check
    let inputItems = {};
    for (let i = 1; i <= 3; i++) {
      let slot = container.getSlot("ingredient" + i);
      if (slot.id > 0 && slot.count > 0) {
        inputItems["ingredient" + i] = new ItemStack(slot);
      }
    }
    return inputItems;
  }
  export function getRecipeFurnace(input: any) {
    if (input) {
      for (let slots in input) {
        let slot = input[slots];
        if (!Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron")) {
          continue;
        } else if (Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron")) {
          return {
            result: Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron"),
            ingredient: slots,
          };
        }
      }
    }
    return {
      result: null,
      ingredient: null,
    };
  }
}

namespace CrusherRecipe {
  export type SagMillRecipeFormat = {
    isGrinding: boolean;
    ingredient: { id: number; data: number };
    result0: { id: number; data: number; chance: number; count?: number };
    result1?: { id: number; data: number; chance: number };
    result2?: { id: number; data: number; chance: number };
    result3?: { id: number; data: number; chance: number };
    energy: number;
    by: string;
  };

  export let recipes: SagMillRecipeFormat[] = [];
  export function add(obj: SagMillRecipeFormat): void {
    if (!obj.result0.count) {
      obj.result0.count = 1;
    }
    if (!obj.result1) {
      obj.result1 = { id: 0, data: 0, chance: 0 };
    }
    if (!obj.result2) {
      obj.result2 = { id: 0, data: 0, chance: 0 };
    }
    if (!obj.result3) {
      obj.result3 = { id: 0, data: 0, chance: 0 };
    }
    if (obj.isGrinding == undefined || obj.isGrinding == null) {
      obj.isGrinding = false;
    }
    recipes.push(obj);
  }

  // Logic for Tile Entity
  export function getRecipe(input: ItemContainerSlot): SagMillRecipeFormat {
    let id = input.id;
    let data = input.data;
    let count = input.count;
    if (!id) return null;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if (id == ingredient.id && (data == -1 || data == ingredient.data) && count >= 1) return recipe;
    }
    return null;
  }

  export function getInput(item: ItemInstance | ItemStack): boolean {
    let id = item.id;
    let data = item.data;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if (id == ingredient.id && (data == -1 || data == ingredient.data)) {
        return true;
      }
    }
    return false;
  }
}

namespace VatRecipe {
  export let recipes: RecipeMap<string>[] = [];

  export type InputType = `minecraft:${string}` | `ItemID.${string}` | `BlockID.${string}`;
  export type InputMap<T extends string> = {
    [key in T]?: number;
  };

  export type RecipeMap<T extends string> = {
    // string for save recipes, InputType for input recipes
    input1: InputMap<T>;
    input2?: InputMap<T>;
    inputLiquid: string;
    inputMutilplier: number;
    outputLiquid: string;
    energy: number;
  };
  export type VatResultFormat = {
    liquidOut: string;
    amount: number;
    energy: number;
    amountInput: number;
    liquidIn: string;
    slotIndex: number[];
  };

  export function solveInput(obj: InputMap<InputType>): InputMap<string> {
    let newData: InputMap<string> = {};
    if (!obj) return newData;
    for (let key in obj) {
      let newKey: string;
      if (key.startsWith("minecraft:")) {
        // Vanilla id
        let keyArray = key.split(":");
        let stringID = keyArray[1];
        let numericID = VanillaBlockID[stringID] || VanillaItemID[stringID];
        if (!numericID) {
          let source = IDConverter.getIDData(stringID);
          newKey = source.id + ":" + source.data;
        } else {
          newKey = `${numericID}`;
          if (keyArray[2]) newKey += ":" + keyArray[2];
        }
      } else if (key.includes(".")) {
        // Innercore id
        let keyArray = key.split(":");
        if (keyArray[0].startsWith("ItemID") || keyArray[0].startsWith("BlockID")) {
          let dotIndex = keyArray[0].indexOf(".");
          let stringID = keyArray[0].substring(dotIndex + 1);
          let numericID = keyArray[0].startsWith("ItemID") ? ItemID[stringID] : BlockID[stringID];
          if (numericID) {
            newKey = `${numericID}`;
            if (keyArray[1]) newKey += ":" + keyArray[1];
          }
        } else {
          Logger.Log(`Can't parse ${key} into InnerCore ID`, "ERROR");
        }
      } else Logger.Log(`Found a recipe with undefined input item ID: ${key}`, "ERROR");
      if (newKey && !newData[newKey]) newData[newKey] = obj[key];
    }
    return newData;
  }
  /**

  * Add vat recipe, with [input_] will accept item with no metadata like

  * `minecraft:${string_id}` | `ItemID.${string_id}` | `BlockID.${string_id}` or with metadata like

  * `minecraft:${string_id}:${metadata}` | `ItemID.${string}:${metadata}` | `BlockID.${string}:${metadata}`.

  * @param obj object that contain recipe

  */
  export function add(obj: RecipeMap<InputType>) {
    let newData = solveInput(obj.input1);
    let newData2 = obj.input2 ? solveInput(obj.input2) : {};
    let recipe: RecipeMap<string> = {
      ...obj,
      input1: newData,
      input2: newData2,
    };
    recipes.push(recipe);
  }

  export function getLiquidOutput(): string[] {
    let outputLiquid = [];
    for (let i in recipes) {
      outputLiquid.push(recipes[i].outputLiquid);
    }
    return outputLiquid;
  }

  export function getLiquidInput(): string[] {
    let inputLiquid = [];
    for (let i in recipes) {
      inputLiquid.push(recipes[i].inputLiquid);
    }
    return inputLiquid;
  }

  // Logic for Tile Entity
  export function getInput(container: ItemContainer): ItemInstance[] {
    const inputItems: ItemInstance[] = [];
    for (let i = 0; i <= 1; i++) {
      const slot = container.getSlot("slotInput" + i);
      inputItems.push(new ItemStack(slot));
    }
    return inputItems;
  }

  export function getResult(inputItems: ItemInstance[], inputTank: BlockEngine.LiquidTank): VatResultFormat | null {
    if (inputItems.length == 0) return null;
    let result: VatResultFormat | null = null;
    let liquidStorage = inputTank.getLiquidStored();
    let liquidAmount = inputTank.getAmount(liquidStorage);

    for (let recipe of recipes) {
      let input1 = recipe.input1;
      let input2 = recipe.input2;
      let hasInput2 = !isEmpty(input2); // empty = false; have input item 2 = true
      let input1Multiplier = 0;
      let input2Multiplier = 0;
      let input1Index = -1;
      let input2Index = -1;

      for (let i = 0; i < inputItems.length; i++) {
        let slot = inputItems[i];
        if (!slot || slot.count == 0) continue;

        let multiFromInput = input1[slot.id + ":" + slot.data] ?? input1[slot.id];
        if (!multiFromInput || multiFromInput <= 0) continue;
        input1Multiplier = multiFromInput;
        input1Index = i;
        break;
      }
      if (input1Index == -1) continue;
      if (hasInput2) {
        for (let i = 0; i < inputItems.length; i++) {
          if (i == input1Index) continue;
          let slot = inputItems[i];
          if (!slot || slot.count == 0) continue;

          let multiFromInput = input2[slot.id + ":" + slot.data] ?? input2[slot.id];
          if (!multiFromInput || multiFromInput <= 0) continue;
          input2Multiplier = multiFromInput;
          input2Index = i;
          break;
        }
        if (input2Index == -1) continue;
      }

      let ingredientMultiplier = input1Multiplier * (hasInput2 ? input2Multiplier : 1);
      if (ingredientMultiplier <= 0) continue;
      let inputVolume = ingredientMultiplier * 1000;
      if (liquidStorage == recipe.inputLiquid && liquidAmount >= inputVolume) {
        let outputVolume = ingredientMultiplier * recipe.inputMutilplier * 1000;
        result = {
          liquidOut: recipe.outputLiquid,
          amount: outputVolume,
          energy: recipe.energy,
          amountInput: inputVolume,
          liquidIn: recipe.inputLiquid,
          slotIndex: hasInput2 ? [input1Index, input2Index] : [input1Index],
        };
      }
    }
    return result;
  }

  export function performRecipe(result: VatResultFormat, tile: TileEntity.TileEntityPrototype): void {
    for (const idx of result.slotIndex) {
      let slot = tile.container.getSlot(`slotInput${idx}`);
      slot.setSlot(slot.id, slot.count - 1, slot.data);
      slot.validate();
    }

    tile.outputTank.addLiquid(result.liquidOut, result.amount);
    tile.inputTank.getLiquid(result.liquidIn, result.amountInput);
    tile.container.validateAll();
    tile.data.progress = 0;
  }
}

namespace SoulRecipe {
  export type SoulBinderRecipeFormat = {
    soul: string | -1;
    lvl: number;
    ingredient: { id: number; data: number; count: number };
    result0: { id: number; data: number; count: number; extra?: ItemExtraData };
    //result1 : { id: number, data: number, count: number },
    energy: number;
    by?: string;
  };

  export let recipes: SoulBinderRecipeFormat[] = [];
  export function add(obj: SoulBinderRecipeFormat): void {
    if (!(!obj.soul || !obj.lvl || !obj.ingredient)) {
      recipes.push(obj);
    }
  }

  export function getRecipe(input: any, soul: string, lvl: number): SoulBinderRecipeFormat {
    let id = input.id;
    let data = input.data;
    let count = input.count;
    if (!id) return null;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if (id == ingredient.id && (data == -1 || data == ingredient.data) && count >= 1 && (soul == recipe.soul || recipe.soul == "all") && lvl >= recipe.lvl) return recipe;
    }
    return null;
  }

  export function getTypeSoul(item: any) {
    if (item.id == ItemID.soulVessel) {
      if (item.extra) {
        if (item.extra.getString("name")) {
          return item.extra.getString("name");
        }
      }
    }
    return null;
  }
}

namespace SliceAndSpliceRecipe {
  export type SASRecipe = {
    input0: ItemInstance;
    input1: ItemInstance;
    input2: ItemInstance;
    input3: ItemInstance;
    input4: ItemInstance;
    input5: ItemInstance;
    result: ItemInstance;
    energy: number;
  };

  export let recipes: SASRecipe[] = [];

  export function addRecipe(obj: SASRecipe) {
    recipes.push(obj);
  }

  export function getRecipe(container: ItemContainer) {
    for (let i in recipes) {
      let recipe = recipes[i];
      let slot0 = container.getSlot("slotInput0");
      let slot1 = container.getSlot("slotInput1");
      let slot2 = container.getSlot("slotInput2");
      let slot3 = container.getSlot("slotInput3");
      let slot4 = container.getSlot("slotInput4");
      let slot5 = container.getSlot("slotInput5");

      let r_input0 = recipe["input0"];
      let r_input1 = recipe["input1"];
      let r_input2 = recipe["input2"];
      let r_input3 = recipe["input3"];
      let r_input4 = recipe["input4"];
      let r_input5 = recipe["input5"];

      if (
        slot0.id == r_input0.id &&
        slot0.data == r_input0.data &&
        slot0.count >= 1 &&
        slot1.id == r_input1.id &&
        slot1.data == r_input1.data &&
        slot1.count >= 1 &&
        slot2.id == r_input2.id &&
        slot2.data == r_input2.data &&
        slot2.count >= 1 &&
        slot3.id == r_input3.id &&
        slot3.data == r_input3.data &&
        slot3.count >= 1 &&
        slot4.id == r_input4.id &&
        slot4.data == r_input4.data &&
        slot4.count >= 1 &&
        slot5.id == r_input5.id &&
        slot5.data == r_input5.data &&
        slot5.count >= 1
      ) {
        return recipe;
      }
    }
    return null;
  }

  export function getRecipeWithItem(item: ItemInstance) {
    for (let i in recipes) {
      let recipe = recipes[i];
      let r_input0 = recipe["input0"];
      let r_input1 = recipe["input1"];
      let r_input2 = recipe["input2"];
      let r_input3 = recipe["input3"];
      let r_input4 = recipe["input4"];
      let r_input5 = recipe["input5"];

      if (
        (item.id == r_input0.id && item.data == r_input0.data && item.count >= 1) ||
        (item.id == r_input1.id && item.data == r_input1.data && item.count >= 1) ||
        (item.id == r_input2.id && item.data == r_input2.data && item.count >= 1) ||
        (item.id == r_input3.id && item.data == r_input3.data && item.count >= 1) ||
        (item.id == r_input4.id && item.data == r_input4.data && item.count >= 1) ||
        (item.id == r_input5.id && item.data == r_input5.data && item.count >= 1)
      ) {
        return recipe;
      }
    }
    return null;
  }

  export function isInput(item: ItemInstance) {
    for (let i in recipes) {
      let recipe = recipes[i];
      let r_input0 = recipe["input0"];
      let r_input1 = recipe["input1"];
      let r_input2 = recipe["input2"];
      let r_input3 = recipe["input3"];
      let r_input4 = recipe["input4"];
      let r_input5 = recipe["input5"];
      switch (item) {
        case r_input0:
        case r_input1:
        case r_input2:
        case r_input3:
        case r_input4:
        case r_input5:
          return true;
        default:
          return false;
      }
    }
  }
}
namespace RecipeRegistry {
  export function addSmelter(obj: SmelterRecipe.RecipeType): void {
    SmelterRecipe.addRecipe(obj);
  }
  export function addCrusher(obj: CrusherRecipe.SagMillRecipeFormat): void {
    CrusherRecipe.add(obj);
  }

  export function addVat(obj: any) {
    VatRecipe.add(obj);
  }

  export function addSBinder(obj: SoulRecipe.SoulBinderRecipeFormat): void {
    if (obj.soul === -1) obj.soul = "all";
    SoulRecipe.add(obj);
  }

  export function addSliceAndSplice(obj: SliceAndSpliceRecipe.SASRecipe): void {
    SliceAndSpliceRecipe.addRecipe(obj);
  }
}
