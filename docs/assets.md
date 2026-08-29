# Kōdo — Asset Manifest

Every external visual asset used in the application, with source, license, attribution, and where it appears.

All assets are pre-existing, externally licensed works. **No artwork is generated or hand-modelled by the project.**

## 3D Models (glTF / GLB)

| Asset                | Source                                                                                            | License | Creator / Attribution                                                       | File path                          | Used in                                    |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| `LittlestTokyo.glb`  | https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/LittlestTokyo.glb              | MIT     | Glen Fox, redistributed via three.js examples. © three.js authors.            | `public/models/LittlestTokyo.glb` | Ambient environment on every page        |
| `Soldier.glb`        | https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/Soldier.glb                    | MIT     | Matt DesLauriers (original Rigging), redistributed via three.js examples.       | `public/models/Soldier.glb`       | Restrained scroll-triggered figure        |
| `Lantern.glb`        | https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Lantern                    | CC0 1.0 | Public domain KhronosGroup sample asset                                      | `public/models/Lantern.glb`        | Mid-distance composition element         |

### Why these assets

- **LittlestTokyo** is a small stylised Japanese street scene (torii, lanterns, sakura trees) used as a subtle environmental backdrop. It is intentionally not the focus — it sits behind frosted-glass UI panels with reduced opacity and a fog layer.
- **Soldier** is the closest existing asset to a "restrained warrior figure" in the established three.js ecosystem. It has a skeleton and animation clips (Idle, Run, TPose). It is shown scaled down, far away, partially obscured, and only briefly at a specific scroll position.
- **Lantern** is a CC0 stone-style Asian lantern. It is placed as a quiet secondary composition element on selected pages.

## Why no Sakura tree, no Bonsai, no hand-modelled samurai?

- The original `glTF-Sample-Models` repository used to contain a "Bonsai" model. It was removed when the repository was migrated to `glTF-Sample-Assets` and is no longer distributed. No equivalent permissively-licensed Sakura tree asset was found in the established repositories (KhronosGroup, three.js, drei-assets) at the time of integration.
- The LittlestTokyo environment already includes small Sakura trees as part of its scene, satisfying the environmental-Sakura goal without us authoring a model.
- We do not hand-author or hand-model any 3D assets. This is a hard rule.

## HDRI (sky / environment)

No HDRI is loaded. The LittlestTokyo model ships with materials designed for a low-light urban scene; ambient + a single directional key light is sufficient. Adding an HDRI would cost 1.5–2 MB and was not justified for the chosen aesthetic.

## 2D / decorative

| Source | Where | Notes |
| ------ | ----- | ----- |
| `lucide-react` icon library         | Throughout | MIT. Tree-shaken, only used icons are bundled. |
| Spectral, Inter Tight, JetBrains Mono, Noto Serif JP — Google Fonts | Throughout | Open Font License. Loaded via `next/font` for optimal CLS. |
| Existing CSS gradient / dot pattern / sakura petal particles in code | Atmosphere layer | No external image assets. |

## Rejected / unavailable

- **A dedicated Sakura tree GLB** — searched GitHub, KhronosGroup, three.js, drei-assets, Sketchfab. The only permissively-licensed Sakura tree (the original glTF-Sample-Models "Bonsai") was removed from the official sample repository in 2023. Replaced by the Sakura trees inside LittlestTokyo.
- **A dedicated Samurai GLB** — searched GitHub, three.js, KhronosGroup, drei-assets, Sketchfab, Poly Haven. No permissively-licensed animated samurai model found. Replaced by Soldier.glb shown scaled down, far away, with restricted animation.

If higher-quality Japanese assets become available under a clear open license in the future, this file should be updated and the integration swapped.
