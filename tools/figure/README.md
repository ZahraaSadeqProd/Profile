# Study scene pipeline

Builds `public/models/study.glb`: the study room and the seated figure typing at the desk.

## Current figure: `hijabi/`

The figure is "Hijabi Style 3D Character" by zahracarmiela (Sketchfab, CC BY 4.0; credited in the site footer). It ships as a
single fused, unrigged A-pose scan mesh. `hijabi/` fits it to the rig and typing clip from the previous build, which
`hijabi/rig_source.glb` keeps (the room, the MPFB mixamo rig at the origin, and the retargeted "Typing" clip).

Run with Blender 5.2 from `tools/figure/hijabi`, with `CHAR` pointing at the downloaded `scene.gltf`:

1. `RIG=rig_source.glb blender -b -P 0_import.py -- study_in.blend`: import the rig source
2. `CHAR=…/scene.gltf blender -b -P 1_join.py -- study_in.blend prep.npz`: join and weld the character (saves `prep.blend`)
3. `blender -b -P 2_align.py -- prep.blend stageA.blend`: drop scan fragments, scale and place her on the rig, decimate
   (`RATIO`, default 0.08), and sample the texture colour of each face
4. `blender -b -P 3_label.py -- stageA.blend stageB.blend`: label faces as hijab / top / trousers / skin / shoes; fit a
   smooth hijab hemline and cut the mesh along it; delete faces no ray can reach from outside (the scan's inner layers)
5. `blender -b -P 4_skin.py -- stageB.blend stageC.blend`: warp her arms onto the rig's rest pose, transfer the old
   body's skin weights, smooth them over the surface, keep the hijab off the arms and hang the back of the top from the
   hips, then bind and split into one mesh per garment
6. `blender -b -P 5_sleeves.py -- stageC.blend stageC2.blend`: replace the scan's sleeves (fused to the sides, with
   no underside) with proper sweater sleeves: tubes from inside the shoulder cap to a ribbed cuff, sized from the scan,
   skinned along the arm; clear the torn strip on each side and fill it with a relaxed, torso-weighted panel
7. `CSI=25 WEBIT=20 WEBL=0.5 blender -b -P 6_seat.py -- stageC2.blend stageD.blend`: bake the seated pose at frame `F`
   (default 90) with corrective smoothing (and Laplacian smoothing of the `web` group under the arms), apply that pose
   as the rig's rest, and re-key the clip against it, so at runtime the typing only nudges a clean seated mesh
8. `blender -b -P 7_export.py -- stageD.blend study_raw.glb`, then `node ../study-web.mjs study_raw.glb study.glb`

The site colours the garments by material name in `src/components/scene/Study.tsx` and lights her with a spotlight over
the shoulder.

## Previous figure (MPFB body, scripts in this folder)

Needs Blender 5.2 with the MPFB extension and the CC0 MakeHuman packs (system assets, skins01, pants01, shirts01,
shoes01, poses01) loaded into MPFB, plus Mixamo's "Typing" FBX for the motion.

1. `OUT=. blender -b -P build_char.py` — MPFB body, mixamo rig, sweater, wool trousers, flats → `char.blend`
2. `OUTBLEND=char.blend blender -b char.blend -P sweater.py` — ease the knit top off the body (edits `char.blend` in place)
3. `FBX=Typing.fbx OUTBLEND=char_typing.blend blender -b char.blend -P retarget.py` — typing clip onto her rig
4. `OUTBLEND=char_hem.blend blender -b char_typing.blend -P sweater_hem.py` — lengthen the sweater, lay the hem over her lap
5. `OUTBLEND=char_hijab.blend blender -b char_hem.blend -P hijab3.py` — shape the hijab (sculpted head, hull-wrapped drape) and skin it
6. `OUT=. blender -b char_hijab.blend -P room.py` — the study, two-tone preview renders → `study.blend`
7. `GLB=study.glb blender -b study.blend -P export.py` — merge the room by material, export
8. `node study-web.mjs study.glb study-web.glb` — quantize and meshopt (run where @gltf-transform is installed)
