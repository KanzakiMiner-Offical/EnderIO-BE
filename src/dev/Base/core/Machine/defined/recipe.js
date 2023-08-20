
/*
let SmelterRecipe = {
  //smelter_filter: [],
  smelter: [],
  add: function(obj) {
    if (obj.ingredient2.count == undefined || obj.ingredient2.count == null) {
      obj.ingredient2.count = 1
    }
    let inputArray = [obj.ingredient1]
    if (obj.ingredient2.id) {
      inputArray.push(obj.ingredient2)
    }
    if (obj.ingredient3.id) {
      inputArray.push(obj.ingredient3)
    }
    this.smelter.push({
      input: inputArray,
      result: obj.result,
      time: obj.time
    })
    //this.smelter_filt,er.push(obj);
  },
  getInput: function(container) {
    let inputItems = [];
    for (let i = 1; i <= 3; i++) {
      let slot = container.getSlot("ingredient" + i);
      if (slot.id > 0) {
        inputItems.push(new ItemStack(slot));
      }
    }
    return inputItems;
  },
  getRecipe: function(inputItems) {
    if (inputItems.length == 0) return null;
    for (let recipes in this.smelter) {
      let recipe = this.smelter[recipes]
      let valid = true;
      for (let items in recipe.input) {
        let item = recipe.input[items]
        let count = 0;
        for (let slots in inputItems) {
          let slot = inputItems[slots]
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
  },
  performRecipe: function(recipe, container) {
    const resultSlot = container.getSlot("slotResult");
    for (let items in recipe.input) {
      let item = recipe.input[items]
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
  },

  getInputFurnace: function(container) {
    // input check
    let inputItems = {};
    for (let i = 1; i <= 3; i++) {
      let slot = container.getSlot("ingredient" + i);
      if (slot.id > 0 && slot.count > 0) {
        inputItems["ingredient" + i] = new ItemStack(slot)
      }
    }

    return inputItems;
    // ...
  }
}

let CrusherRecipe = {
  recipes: [],
  add: function(obj) {
    this.recipes.push(obj);
  },
  getRecipe: function(id, data) {
    if (!id)
      return null;
    for (let i in this.recipes) {
      let input = this.recipes[i].ingredient;
      if (input.id === id && (input.data === -1 || input.data === data))
        return this.recipes[i];
    }
    return null;
  },
}

let VatRecipe = {
  recipes: [],
  add: function(obj) {
    let newData = {};
    let newData2 = {};
    for (let key1 in obj.input1) {
      let newKey;
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
      let newKey2;
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
    this.recipes.push(obj);
  },
  getResult: function(i1, i2, inputTank) {
    let result;
    let liquidStorage = inputTank.getLiquidStored();
    let liquidAmount = inputTank.getAmount(liquidAmount)
    for (let i in this.recipes) {
      let recipe = this.recipes[i]
      let input1 = recipe.input1
      let input2 = recipe.input2
      let input2Check = input2[i2.id] || input2[i2.id + ":" + i2.data] || !!input2;
      let input1Multiplier = input1[i1.id + ":" + i1.data] || input1[i1.id];
      if (input1Multiplier && input2Check) {
        let input2Multiplier = input2[i2.id] || input2[i2.id + ":" + i2.data]
        let ingredientMultiplier = input2Multiplier ? input1Multiplier * input2Multiplier : input1Multiplier;
        let inputVolume = ingredientMultiplier * 1000;
        if (liquidStorage == recipe.inputLiquid && liquidAmount >= inputVolume) {
          let outputVolume = ingredientMultiplier * recipe.inputMutilplier * 1000;
          result = {
            id: recipe.outputLiquid,
            amount: outputVolume,
            time: recipe.time,
            amount_input: inputVolume
          }
        }
      }
    }
    return result
  },
  getLiquidOutput: function() {
    let outputLiquid = []
    for (let i in this.recipes) {
      outputLiquid.push(this.recipes[i].outputLiquid)
    }
    return outputLiquid
  },
  getLiquidInput: function() {
    let inputLiquid = []
    for (let i in this.recipes) {
      inputLiquid.push(this.recipes[i].inputLiquid)
    }
    return inputLiquid
  }
}

var SliceAndSpliceRecipes = {
  recipes: [],

  add: function(obj) {
    this.recipes.push(obj)
  },

  getRecipe: function(container) {
    for (let e in this.recipes) {
      let recipes = this.recipes[i]
      let slot0 = container.getSlot("slotInput0");
      let slot1 = container.getSlot("slotInput1");
      let slot2 = container.getSlot("slotInput2");
      let slot3 = container.getSlot("slotInput3");
      let slot4 = container.getSlot("slotInput4");
      let slot5 = container.getSlot("slotInput5");

      let r_input0 = recipes["input0"];
      let r_input1 = recipes["input1"];
      let r_input2 = recipes["input2"];
      let r_input3 = recipes["input3"];
      let r_input4 = recipes["input4"];
      let r_input5 = recipes["input5"];

      if ((slot0.id == r_input0.id && slot0.data == r_input0.data && slot0.count >= 1) &&
        (slot1.id == r_input1.id && slot1.data == r_input1.data && slot1.count >= 1) &&
        (slot2.id == r_input2.id && slot2.data == r_input2.data && slot2.count >= 1) &&
        (slot3.id == r_input3.id && slot3.data == r_input3.data && slot3.count >= 1) &&
        (slot4.id == r_input4.id && slot4.data == r_input4.data && slot4.count >= 1) &&
        (slot5.id == r_input5.id && slot5.data == r_input5.data && slot5.count >= 1)) {
        return recipes;
      }
    }
    return null
  }
  
  
}

var RecipeRegistry = {
  soulBinder: [],

  addSmelter: function(obj) {
    SmelterRecipe.add(obj)
  },
  addCrusher: function(obj) {
    CrusherRecipe.add(obj);
  },
  addVat: function(obj) {
    VatRecipe.add(obj);
  },
  addSliceAndSplice: function(obj) {
    SliceAndSpliceRecipes.add(obj);
  }


};
*/

/*addSliceAndSplice: function(obj) {
      this.sliceAndSplice.push(obj);
   },
   addSmelter: function(obj) {
      if (obj.ingredient2.count == undefined || obj.ingredient2.count == null) {
         obj.ingredient2.count = 1
      }
      let inputArray = [obj.ingredient1]
      if (obj.ingredient2.id) {
         inputArray.push(obj.ingredient2)
      }
      if (obj.ingredient3.id) {
         inputArray.push(obj.ingredient3)
      }
      this.smelter.push({
         input: inputArray,
         result: obj.result,
         time: obj.time
      })
      this.smelter_filter.push(obj);
   },
   addCrusher: function(obj) {
      this.crusher.push(obj);
   },
   addVat: function(obj) {
      this.theVat.push(obj)
   },
   getInCrusher: function(id, data) {
      for (let i in RecipeRegistry.crusher) {
         var Recipe = RecipeRegistry.crusher[i];
         var ingre = Recipe.ingredient;
         if (id == ingre.id && data == ingre.data) {
            return true
         }
      }
   },
   getInVat1: function(id, data) {
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var ingre1 = Recipe.input1;
         if (id == ingre1.id && data == ingre1.data) {
            return true
         }
      }
   },
   getInVat2: function(id, data) {
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var ingre2 = Recipe.input2;
         if (id == ingre2.id && data == ingre2.data) {
            return true
         }
      }
   },
   getLiquidVat1: function(liquid) {
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var liquidIn = Recipe.inputLiquid;
         if (liquid == liquidIn) {
            return true
         }
      }
   },
   getLiquidVat2: function(liquid) {
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var liquidOut = Recipe.outputLiquid;
         if (liquid == liquidOut) {
            return true
         }
      }
   },
   getLiquidVatInput: function() {
      let inputLiquid = []
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var liquidIn = Recipe.inputLiquid;
         inputLiquid.push(liquidIn)
      }
   },
   getLiquidVatOutput: function() {
      let outputLiquid = []
      for (let i in RecipeRegistry.theVat) {
         var Recipe = RecipeRegistry.theVat[i];
         var liquidOut = Recipe.outputLiquid;
         outputLiquid.push(liquidOut)
      }
   }*/