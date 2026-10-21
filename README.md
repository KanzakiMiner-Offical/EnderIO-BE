# EnderIO BE

Port of Ender IO for MC Java Edition to Inner Core modloader for Minecraft on Android

## How to play?

1. Install Horizon apk via: [apk](https://drive.usercontent.google.com/download?id=14SBKQSYbMGRT-Z5_cowYVfYiWTKD605c&export=download)
2. Open app and install Inner Core
3. Install mod in Mod manager or download it from github and extract mod folder to games/Horizon/packs/Inner_Core/innercore/mods/

## Development

### Requirements

1. [Visual Studio Code IDE](https://code.visualstudio.com/)
2. [Python 3.8](https://www.python.org/downloads/) or higher
3. [Node.js 14.17](https://nodejs.org/en/download/current) or higher
4. Typescript Compiler (run `npm install -g typescript`, high recommend using `npm install -g typescript@6`, tsc v7 is not supported now)

### Building

1. [Clone](https://github.com/zheka2304/innercore-mod-toolchain) or [download](https://github.com/zheka2304/innercore-mod-toolchain/archive/refs/heads/master.zip) Toolchain repository
2. Then clone this repository
3. Execute the `Import Project` task in VS Code (Ctrl + Shift + B) to import EnderIO
   > [!WARNING]
   > High recommend execute the `Fetch Declarations` task to up-to-date Core-Engine
4. Build project with `Build (No Push)` task or `Build` task to test your changes.

### More

If you want to update Libraries or Declarations of EnderIO, follow this steps:

#### For Declarations

#### For Libraries

1. Sr, WIP

## Note

I'm not associated with EnderIO developer team which develops original mod for MC Java Edition, this is unofficial port of the mod to Inner Core modloader.
All rights for textures from original EnderIO are reserved by EnderIO developer team.

## Credits

Thanks to:

- Team EnderIO for EnderIO For JAVA Edition
- Zheka Smirnov for Inner Core modloader
- toncho\_ for first version of EnderIO PE
- Special thanks to MineExplorer for help me develop this mod
