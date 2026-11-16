namespace LangLoader {
  export let dir = `${__dir__}/lang`;
  export let all_translation_keys: {
    [translation_key: string]: {
      [language: string]: string;
    };
  } = {};
  export function addLang() {
    if (!FileTools.isExists(dir)) {
      Logger.Log(`Cannot load .lang file: directory ${dir} does not exist.`, "ERROR");
      return;
    }
    let files = FileTools.GetListOfFiles(dir, ".lang");
    files.forEach((file) => {
      let name = file.getName();
      if (name.lastIndexOf(".") > 0) name = name.substring(0, name.lastIndexOf(".")); // convert to lang code
      const keyValue = FileTools.ReadKeyValueFile(file.getAbsolutePath(), "=");
      let count = 0;
      for (const key in keyValue) {
        if (!all_translation_keys[key]) all_translation_keys[key] = {};
        all_translation_keys[key][name] = keyValue[key];
        count++;
      }
      Logger.Log(`Loaded ${count} entries from ${file} successfully!`, "EnderIO");
    });

    for (let key in all_translation_keys) {
      all_translation_keys[key][Translation.getLanguage()] ??= all_translation_keys[key].en; // make sure nothing will show item.abc.xyz
      Translation.addTranslation(key, all_translation_keys[key]);
    }
  }
}
