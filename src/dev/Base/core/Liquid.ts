LiquidRegistry.registerLiquid("nutrientDistillation", "Nutrient Distillation", ["nutrientDistillation_fluid"]);
LiquidRegistry.registerLiquid("hootch", "Hootch", ["hootch_fluid"]);
LiquidRegistry.registerLiquid("rocketFuel", "Rocket fuel", ["rocketFuel_fluid"]);
LiquidRegistry.registerLiquid("fireWater", "Fire Water", ["fireWater_fluid"]);
// next update
// non-bucket
LiquidRegistry.registerLiquid("xpjuice", "XP Juice", ["xpjuice_fluid"]);
//
LiquidRegistry.registerLiquid("cloudSeed", "Cloud Seed", ["cloudSeed_fluid"]);
LiquidRegistry.registerLiquid("cloudSeedConcentrated", "Cloud Seed Concentrated", ["cloudSeedConcentrated_fluid"]);
LiquidRegistry.registerLiquid("enderDistillation", "Dew of the Void", ["enderDistillation_fluid"]);
LiquidRegistry.registerLiquid("sunshine", "Liquid Sunshine", ["sunshine_fluid"]);
LiquidRegistry.registerLiquid("vaporOfLevity", "Vapor Of Levity", ["vaporOfLevity_fluid"]);

class ItemLiquidBucket extends ItemCommon implements ItemBehavior {
  constructor(stringID: string, liquid: string) {
    let liquid_name = LiquidRegistry.getLiquidName(liquid);
    super(stringID, `${liquid_name} Bucket`, `bucket_${liquid}`);
    LiquidItemRegistry.registerItem(liquid, 325, this.id, 1000);
  }

  onNameOverride(item: ItemInstance, name: string): string {
    return name + "\n§7" + (1000 - item.data) + " mB";
  }
}

ItemRegistry.registerItem(new ItemLiquidBucket("bucketHootch", "hootch"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketNutrientDistillation", "nutrientDistillation"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketFireWater", "fireWater"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketRocketFuel", "rocketFuel"));

ItemRegistry.registerItem(new ItemLiquidBucket("bucketVaporOfLevity", "vaporOfLevity"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketCloudSeed", "cloudSeed"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketSunshine", "sunshine"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketCloudSeedConcentrated", "cloudSeedConcentrated"));
ItemRegistry.registerItem(new ItemLiquidBucket("bucketEnderDistillation", "enderDistillation"));
