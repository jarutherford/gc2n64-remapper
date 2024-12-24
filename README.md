# GC2N64 Button Remapper

This web application provides a user-friendly interface for remapping GameCube controller buttons to N64 controller inputs when using the [JPS GC2N64 Adapter](https://github.com/joer456/Gamecube-N64-Controller). It generates the necessary code for the gamecube.ino file used in the adapter project.

## Overview

The JPS GC2N64 Adapter allows you to use GameCube controllers on the N64. This web tool helps you customize your button mappings without having to manually write the code.

## How to Use

1. Visit the [GC2N64 Button Remapper](https://yourusername.github.io/gc2n64-remapper)
2. Configure your desired button mappings using the dropdown menus
3. Click "Generate Code" to create the mapping function
4. Copy the entire generated function
5. Open your `gamecube.ino` file from the JPS GC2N64 Adapter project
6. Replace the existing `void mapGamecubeToN64()` function with your newly generated code
7. Upload the modified `gamecube.ino` to your Arduino

## Saving and Loading Mappings

- Use the "Save Mappings" button to download your current configuration
- Use the "Load Mappings" button to restore a previously saved configuration

## Available Mappings

### GameCube Buttons
- A, B, X, Y
- Start
- L, R, Z
- D-Pad (Up, Down, Left, Right)
- C-Stick (Up, Down, Left, Right)

### N64 Buttons
- A, B, Z
- Start
- L, R
- D-Pad (Up, Down, Left, Right)
- C Buttons (Up, Down, Left, Right)

## Project Links

- [JPS GC2N64 Adapter Project](https://github.com/joer456/Gamecube-N64-Controller)
- [Button Remapper Web App](https://jarutherford.com/gc2n64-remapper)

## Contributing

Feel free to open issues or submit pull requests if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the same terms as the original JPS GC2N64 Adapter project.