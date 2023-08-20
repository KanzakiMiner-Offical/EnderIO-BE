// from Avaritia

(() => {
  const all_translation_keys: {
    [translation_key: string]: {
      [language: string]: string } } = {};
  const readFile = (name: string) =>
    FileTools.ReadText(`${__dir__}/res/lang/${name}.lang`)
    .split("\n")
    .filter(element => element.length > 0 && !element.startsWith("#"))
    .forEach(line => {
      const kv = line.split("=");
      all_translation_keys[kv[0]] ??= {};
      all_translation_keys[kv[0]][name] = kv[1];
    });
  FileTools.GetListOfFiles(`${__dir__}/res/lang`, "lang")
    .forEach(file => readFile(new java.lang.String(file.getName()).replaceFirst("[.][^.]+$", "")));
  for (let key in all_translation_keys) {
    all_translation_keys[key][Translation.getLanguage()] ??= all_translation_keys[key].en;
    Translation.addTranslation(key, all_translation_keys[key]);
  }
})();