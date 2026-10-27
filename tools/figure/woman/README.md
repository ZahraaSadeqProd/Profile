# Figure: "woman hijab"

"woman hijab" by P151292 (Sketchfab, CC BY 4.0; credited in the site footer). It is one fused, textured scan of a woman
standing in a floor-length abaya and hijab, hands clasped at the waist, with no rig. Instead of warping her onto the
rig, these scripts move the rig's arm bones onto her arms and re-key the typing clip against that rest.

Run with Blender 5.2, `S` as a work folder:

1. `RIG=../hijabi/rig_source.glb blender -b -P ../hijabi/0_import.py -- $S/study_in.blend`: the room, rig and clip
2. `CHAR=…/woman_hijab/scene.gltf blender -b -P 1_import.py -- $S/study_in.blend $S/w1.blend`: scale her to the rig's
   height (1.552 m), stand her on the floor, centre her chest on the spine
3. `blender -b -P 2_rig.py -- $S/w1.blend $S/w2.blend`:
   - record the clip as armature-space matrices
   - unconnect the bones and turn the arm bones onto her elbows and wrists (`JOINTS`, measured on ortho views), keeping
     their lengths
   - re-key the clip against that rest
   - label the hijab (above `HEM`, plus the thin tail panel on her back, trimmed at `TAILZ` so it ends at the seat), the
     abaya and her face
   - cut off her clasped hands at a clean plane across each wrist (just past the hand bone, so the cuff overlaps the
     new hand), and cut the seam where her forearms were fused to the dress (`SEAMLO`/`SEAMHI`)
   - use the MPFB body's typing hands, carried along with the forearm, with a wrist stub (`STUB`) that runs up into the cuff
   - weight the spine and skirt by smooth height bands, and her arms by distance to her own arm segments
4. `CSI=25 WEBIT=20 WEBL=0.5 blender -b -P ../hijabi/6_seat.py -- $S/w2.blend $S/w3.blend`: bake the seated pose
`3_hands.py` (optional, not used) swaps in the Hijabi Style figure's hands instead; they are curled and their open
wrist shows, so the MPFB hands stay.

5. `blender -b -P 4_export.py -- $S/w3.blend $S/study_raw.glb`, then `node ../study-web.mjs $S/study_raw.glb study.glb`

`look3.py` renders the posed figure in the room for checking (`BONE`, `DIST`, `ANG`); `sheet.py` joins renders.
