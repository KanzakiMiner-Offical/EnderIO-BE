interface ICapacitorData {
    type: string;
    canBeDMG: boolean
    getLevel?(item: ItemInstance, machine: TileEntity): number
    getBaseLevel?(item: ItemInstance): number
    getMachineLevel?(item: ItemInstance): IMachineLevel 
}
interface IMachineLevel {
    [key: string]: number
}
class DefaultCapacitor extends ItemCommon
    implements ItemBehavior, ICapacitorData {
    type = "capacitor"
    level: number;
    canBeDMG: boolean = false
    constructor(stringID: string, name: string, texture: string, level: number = 1) {
        super(stringID, name, texture, false);
        this.level = level
        Item.addToCreative(this.id, 1, 0, new ItemExtraData().putFloat("level", level))
        CapacitorData.registerCapacitor(this.id, this)
    }

    onNameOverride(item: ItemInstance, name: string): string {
        return name + "\nBase level: " + this.level
    }

    getLevel(item: ItemInstance, machine: TileEntity): number {
        return item.extra.getFloat("level") || 1
    }
}

class CapacitorLoot extends ItemCommon
    implements ItemBehavior, ICapacitorData {
    type: "loot_capacitor";
    canBeDMG: boolean = false
    constructor(stringID: string, name: string, texture: string) {
        super(stringID, name, texture, false);
        CapacitorData.registerCapacitor(this.id, this)
    }

    onNameOverride(item: ItemInstance, name: string): string {
        if (item.extra) {
            let base_name = this.getNameByBaseLevel(item);
            let machine_name = this.getNameByMachineType(item);
            let machine_level = this.getNameByMachineLevel(item);

            let final_name = ""

            for (let i = 0; i++; i >= machine_name.length || i >= machine_level.length) {
                final_name = `${machine_name[i]} ${machine_level[i]}`
            }
            return (`${final_name} ${base_name}`).replace("%s", '')
        } else
            return name
    }
    getBaseLevel(item: ItemInstance): number {  // For All Machine, except Machine Level
        return item.extra ? item.extra.getFloat("base_level") : 0.5 // min: 0.5, max: 4.5
    }
    getNameByBaseLevel(item: ItemInstance): string {
        let level = this.getBaseLevel(item)
        if (level < 1) {
            return "enderio.loot.capacitor.baselevel.10"
        } else if (level >= 1 && level < 1.5) {
            return "enderio.loot.capacitor.baselevel.15"
        } else if (level >= 1.5 && level < 2.5) {
            return "enderio.loot.capacitor.baselevel.25"
        } else if (level >= 2.5 && level < 3.5) {
            return "enderio.loot.capacitor.baselevel.35"
        } else if (level >= 3.5 && level <= 4.5) {
            return "enderio.loot.capacitor.baselevel.45"
        }
        return
    }
    getMachineLevel(item: ItemInstance): IMachineLevel {  // For 1 or more Machine(s)
        return item.extra ? item.extra.getSerializable("machine_level") : null //min: 0
    }

    getNameByMachineLevel(item: ItemInstance): string[] {
        let temp_: string[] = []
        if (item.extra) {
            let data = this.getMachineLevel(item)
            for (const type in data) {
                let level = data[type];
                if (level < 1) {
                    temp_.push("enderio.loot.capacitor.level.10")
                } else if (level >= 1 && level < 1.5) {
                    temp_.push("enderio.loot.capacitor.level.15")
                } else if (level >= 1.5 && level < 2.5) {
                    temp_.push("enderio.loot.capacitor.level.25")
                } else if (level >= 2.5 && level < 3) {
                    temp_.push("enderio.loot.capacitor.level.30")
                } else if (level >= 3 && level <= 3.5) {
                    temp_.push("enderio.loot.capacitor.level.35")
                } else if (level >= 3.5 && level < 4) {
                    temp_.push("enderio.loot.capacitor.level.40")
                } else if (level >= 4 && level < 4.25) {
                    temp_.push("enderio.loot.capacitor.level.42")
                } else if (level >= 4.25 && level <= 4.5) {
                    temp_.push("enderio.loot.capacitor.level.45")
                }
            }
        }
        return temp_
    }
    getNameByMachineType(item: ItemInstance): string[] {
        let temp_: string[] = []
        if (item.extra) {
            let data = this.getMachineLevel(item)
            for (const type in data) {
                temp_.push(`enderio.loot.capacitor.${type} `)
            }
        }
        return temp_
    }
}