function isEmpty(obj): boolean {
  return Object.keys(obj).length === 0;
}

namespace SmelterRecipe {
  export type RecipeFormat = { result: ItemInstance, input: ItemInstance[], energy: number /*, exp ? : number*/ };
  export type RecipeType = {
    ingredient1: ItemInstance,
    ingredient2 ? : ItemInstance,
    ingredient3 ? : ItemInstance,
    result: ItemInstance,
    energy: number,
    by ? : string
    //exp ? : number
  }
  /*export type FurnaceRecipeFormat = {
    result: ItemInstance,
    ingredient: string
  }
*/
  export const recipes: RecipeFormat[] = [];

  export function addRecipe(obj: RecipeType) {
    let inputArray = [obj.ingredient1]
    if (!!obj.ingredient2) {
      inputArray.push(obj.ingredient2)
    }
    if (!!obj.ingredient3) {
      inputArray.push(obj.ingredient3)
    }
    recipes.push({
      result: obj.result,
      input: inputArray,
      energy: obj.energy
    })
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
        inputItems["ingredient" + i] = new ItemStack(slot)
      }
    }
    return inputItems;
  }
  export function getRecipeFurnace(input: any) {
    for (let slots in input) {
      let slot = input[slots]
      if (!Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron")) {
        continue;
      } else if (Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron")) {
        return {
          result: Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron"),
          ingredient: slots
        }
      }
    }
    return {
      result: null,
      ingredient: null
    }
  }
}

namespace CrusherRecipe {
  export type SagMillRecipeFormat = {
    isGrinding: boolean,
    ingredient: { id: number, data: number },
    result0: { id: number, data: number, chance: number, count ? : number },
    result1 ? : { id: number, data: number, chance: number },
    result2 ? : { id: number, data: number, chance: number },
    result3 ? : { id: number, data: number, chance: number },
    energy: number,
    by: string
  }


  export let recipes: SagMillRecipeFormat[] = []
  export function add(obj: SagMillRecipeFormat): void {
    if (!obj.result0.count) {
      obj.result0.count = 1
    }
    if (!obj.result1) {
      obj.result1 = { id: 0, data: 0, chance: 0 }
    }
    if (!obj.result2) {
      obj.result2 = { id: 0, data: 0, chance: 0 }
    }
    if (!obj.result3) {
      obj.result3 = { id: 0, data: 0, chance: 0 }
    }
    if (obj.isGrinding == undefined || obj.isGrinding == null) {
      obj.isGrinding = false;
    }
    recipes.push(obj);
  }

  export function getRecipe(input: any): SagMillRecipeFormat {
    // ItemContainerSlot
    let id = input.id;
    let data = input.data;
    let count = input.count;
    if (!id)
      return null;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if (id == ingredient.id && (data == -1 || data == ingredient.data) && count >= 1)
        return recipe
    }
    return null;
  }

  export function getInput(item: ItemInstance | ItemStack): boolean {
    let id = item.id;
    let data = item.data;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if (id == ingredient.id && (data == -1 || data == ingredient.data)) {
        return true
      }
      return false
    }
  }
}

namespace VatRecipe {
  export let recipes = []

  export type VatResultFormat = {
    type: number,
    liquidOut: string,
    amount: number,
    energy: number,
    amount_input: number,
    liquidIn: string,
  }

  export function add(obj) {
    let newData = {};
    let newData2 = {};
    for (let key1 in obj.input1) {
      let newKey: any;
      if (key1.includes(":")) {
        let keyArray = key1.split(":");
        if (keyArray[0] == "minecraft") {
          let stringID = keyArray[1];
          let numericID = VanillaBlockID[stringID] || VanillaItemID[stringID];
          if (!numericID) {
            let source = IDConverter.getIDData(stringID);
            newKey = source.id + ":" + source.data;
          } else {
            newKey = numericID;
            if (keyArray[2]) newKey += ":" + keyArray[2];
          }
        } else {
          newKey = eval(keyArray[0]) + ":" + keyArray[1];
        }
      } else {
        newKey = eval(key1);
      }
      if (newKey) newData[newKey] = obj.input1[key1];
    }

    for (let key2 in obj.input2) {
      let newKey2: any;
      if (key2.includes(":")) {
        let keyArray = key2.split(":");
        if (keyArray[0] == "minecraft") {
          let stringID = keyArray[1];
          let numericID = VanillaBlockID[stringID] || VanillaItemID[stringID];
          if (!numericID) {
            let source = IDConverter.getIDData(stringID);
            newKey2 = source.id + ":" + source.data;
          } else {
            newKey2 = numericID;
            if (keyArray[2]) newKey2 += ":" + keyArray[2];
          }
        } else {
          newKey2 = eval(keyArray[0]) + ":" + keyArray[1];
        }
      } else {
        newKey2 = eval(key2);
      }
      if (newKey2) newData2[newKey2] = obj.input2[key2];
    }
    obj.input1 = newData
    obj.input2 = newData2
    recipes.push(obj);
  }
  export function getResult(i1, i2, inputTank): VatResultFormat {
    let result: VatResultFormat;
    let liquidStorage = inputTank.getLiquidStored();
    let liquidAmount = inputTank.getAmount(liquidStorage)
    for (let recipe of recipes) {
      let input1 = recipe.input1
      let input2 = recipe.input2
      let input2Check = !isEmpty(input2); // empty = false; non-empty = true
      let input1Multiplier = input1[i1.id + ":" + i1.data] || input1[i1.id];
      if (input1Multiplier && input2Check) {
        let input2Multiplier = input2[i2.id] || input2[i2.id + ":" + i2.data]
        let ingredientMultiplier = input1Multiplier * input2Multiplier;
        let inputVolume = ingredientMultiplier * 1000;
        if (liquidStorage == recipe.inputLiquid && liquidAmount >= inputVolume) {
          let outputVolume = ingredientMultiplier * recipe.inputMutilplier * 1000;
          result = {
            type: 2,
            liquidOut: recipe.outputLiquid,
            amount: outputVolume,
            energy: recipe.energy,
            amount_input: inputVolume,
            liquidIn: recipe.inputLiquid
          }
        }
      } else if (input1Multiplier && !input2Check) {
        let ingredientMultiplier = input1Multiplier;
        let inputVolume = ingredientMultiplier * 1000;
        if (liquidStorage == recipe.inputLiquid && liquidAmount >= inputVolume) {
          let outputVolume = ingredientMultiplier * recipe.inputMutilplier * 1000;
          result = {
            type: 1,
            liquidOut: recipe.outputLiquid,
            amount: outputVolume,
            energy: recipe.energy,
            amount_input: inputVolume,
            liquidIn: recipe.inputLiquid
          }
        }
      }
    }
    return result
  }

  export function getLiquidOutput(): string[] {
    let outputLiquid = []
    for (let i in recipes) {
      outputLiquid.push(recipes[i].outputLiquid)
    }
    return outputLiquid
  }

  export function getLiquidInput(): string[] {
    let inputLiquid = []
    for (let i in recipes) {
      inputLiquid.push(recipes[i].inputLiquid)
    }
    return inputLiquid
  }

  export function performRecipe(result: VatResultFormat, tile: TileEntity.TileEntityPrototype): void {
    let ingredient1 = tile.container.getSlot("slotInput0");
    let ingredient2 = tile.container.getSlot("slotInput1");
    if (result.type == 2) {
      ingredient1.count--;
      ingredient1.markDirty();
      ingredient2.count--;
      ingredient2.markDirty();
    } else if (result.type == 1) {
      ingredient1.count--;
      ingredient1.markDirty();
    }
    tile.outputTank.addLiquid(result.liquidOut, result.amount);
    tile.inputTank.getLiquid(result.liquidIn, result.amount_input);
    tile.container.validateAll();
    tile.data.progress = 0;
  }
}

namespace SoulRecipe {
  export type SoulBinderRecipeFormat = {
    soul: string,
    lvl: number,
    ingredient: { id: number, data: number, count: number },
    result0: { id: number, data: number, count: number, extra?: ItemExtraData},
    //result1 : { id: number, data: number, count: number },
    energy: number,
    by ? : string
  }

  export let recipes: SoulBinderRecipeFormat[] = []
  export function add(obj: SoulBinderRecipeFormat): void {
    if (!(!obj.soul || !obj.lvl || !obj.ingredient)) {
      recipes.push(obj);
    }
  }

  export function getRecipe(input: any, soul: string, lvl: number): SoulBinderRecipeFormat {
    let id = input.id;
    let data = input.data;
    let count = input.count;
    if (!id)
      return null;
    for (let recipe of recipes) {
      let ingredient = recipe.ingredient;
      if ((id == ingredient.id &&
          (data == -1 || data == ingredient.data) && count >= 1) &&
        (soul == recipe.soul || recipe.soul == "all") &&
        lvl >= recipe.lvl)
        return recipe
    }
    return null;
  }

  export function getTypeSoul(item: any) {
    if (item.id == ItemID.soulVessel) {
      if (item.extra) {
        if (item.extra.getString('name')) {
          return item.extra.getString('name')
        }
      }
    }
    return null
  }
}

namespace RecipeRegistry {
  export function addSmelter(obj: SmelterRecipe.RecipeType): void {
    SmelterRecipe.addRecipe(obj)
  }
  export function addCrusher(obj: CrusherRecipe.SagMillRecipeFormat): void {
    CrusherRecipe.add(obj);
  }

  export function addVat(obj: any) {
    VatRecipe.add(obj);
  }

  export function addSBinder(obj: SoulRecipe.SoulBinderRecipeFormat): void {
    SoulRecipe.add(obj);
  }
}