# Changes in Player Animated Java

This fork merges features from [Animated Java](https://github.com/Animated-Java/animated-java) and [Stable Player Display](https://github.com/bradleyq/stable_player_display).

## Changes

-   Added a "Add Stable Player Display" button when editing an AJ file and the dialog to choose between "Regular" and "Split"
-   Added support for applying player skins (refer to [README.md](./README.md) for usage infos):
    -   `/function animated_java:<namespace>/set_skin {name: "string"}`
    -   `/function animated_java:<namespace>/set_skin_slim {name: "string"}`
    -   `/function animated_java:<namespace>/apply_skin`
    -   `/function animated_java:<namespace>/apply_skin_slim`
-   Included **Stable Player Display** resource packs (`SPD.zip` and `SPD_split.zip`) in releases

## Other Modifications

-   Updated README to credit original Animated Java and Stable Player Display projects.
-   Changed plugin name in menus to “Player Animated Java” to distinguish from original.
-   Changed the way exporting works to support non-textured cubes (only for the player displays)
