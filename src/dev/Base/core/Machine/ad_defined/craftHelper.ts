const ItemIconSource = WRAP_JAVA("com.zhekasmirnov.innercore.api.mod.ui.icon.ItemIconSource").instance;

namespace CraterHelper {
  export function getIcon(item) {
    return ItemIconSource.getIconName(item.id, item.data);
  }
}
