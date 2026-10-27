# Figure: "hijabi girl"

"hijabi girl" by fatinnajwa (Sketchfab, CC BY 4.0; credited in the site footer). Unlike the earlier scans she comes
rigged and skinned on a Mixamo skeleton, with separate arms, so no cutting or patching: the typing clip drives her own
skeleton.

Run with Blender 5.2, `S` as a work folder:

1. `RIG=../hijabi/rig_source.glb blender -b -P ../hijabi/0_import.py -- $S/study_in.blend`: the room, the old rig and
   its typing clip
2. `RATIO=0.6 CHAR=…/hijabi_girl/scene.gltf blender -b -P 1_build.py -- $S/study_in.blend $S/g1.blend`:
   - record the clip as world matrices, then remove the old figure and rig
   - import her, scale her to the old rig's hip height, put her hips on its hips
   - retarget by bone direction (her rest is a T-pose, the clip's rig rests in an A-pose); her hips sit under a
     `_rootJoint`, so their position is keyed directly
   - join, weld and decimate (`RATIO`), and split materials by texture colour and bone weights: Hijab (teal), Skin
     (hands, face), Shoes, Outfit
3. `blender -b -P 3_props.py -- $S/g1.blend $S/g2.blend`: cut the blank book stack off the desk (the site draws titled
   books there, `src/components/scene/Books.tsx`) and move the mouse under her right hand
4. `blender -b -P 4_mouse.py -- $S/g2.blend $S/g3.blend`: put that hand on the mouse wherever the clip rests it (grip pose,
   wrist held in one spot); `check_mouse.py` reports any fingers sinking into it
5. `blender -b -P 5_keys.py -- $S/g3.blend $S/g4.blend`: lift both hands so the fingers clear the key tops (the clip types
   at desk height)
6. `blender -b -P 6_rest.py -- $S/g4.blend $S/g5.blend`: tilt each hand down at the wrist until the fingertips rest on
   the key tops (the lift alone left them hovering)
7. `blender -b -P 2_export.py -- $S/g5.blend $S/study_raw.glb`, then `node ../study-web.mjs $S/study_raw.glb study.glb`

`look3.py` renders her in the room for checking (`BONE=mixamorig:Spine1_03`); `sheet.py` joins renders.
