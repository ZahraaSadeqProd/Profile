# Lifts her hands onto the keys (after 4_mouse.py). The clip types at desk height, so the fingers sink through the
# keyboard. Per frame, each hand's lowest skin vertex over the keyboard sets how far that wrist must rise to clear the
# key tops; the lift is smoothed over time, applied with IK on the arm, and baked into the action. Two passes, since
# moving the forearm tilts the hand a little. The clip's wrists sit up to 3 cm below the desk top, so lifts run to
# several centimetres.
import bpy, sys, os
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc = bpy.context.scene; rig = bpy.data.objects["Human.rig"]; skin = bpy.data.objects["Human.Skin"]
DZ = 0.61
KB_LO, KB_HI = Vector((-0.11, -0.575)), Vector((0.27, -0.425))   # keyboard footprint, with a margin
KEY_TOP = DZ + 0.021 + 0.003                                      # key tops, plus a hair of clearance
f0, f1 = map(int, rig.animation_data.action.frame_range)
bone = lambda s: next(p for p in rig.pose.bones if p.name.startswith("mixamorig:" + s + "_"))

# skin vertices that belong to each hand (by their strongest bone)
side = {"Left": [], "Right": []}
for v in skin.data.vertices:
    if not v.groups: continue
    g = skin.vertex_groups[max(v.groups, key=lambda e: e.weight).group].name
    for s in side:
        if (s + "Hand") in g: side[s].append(v.index)

def needed():
    out = {}
    for f in range(f0, f1 + 1):
        sc.frame_set(f); dg = bpy.context.evaluated_depsgraph_get(); o = skin.evaluated_get(dg); me = o.to_mesh()
        out[f] = {}
        for s, idx in side.items():
            zs = [p.z for p in (o.matrix_world @ me.vertices[i].co for i in idx)
                  if KB_LO.x < p.x < KB_HI.x and KB_LO.y < p.y < KB_HI.y]
            # the right hand resting on the mouse (4_mouse.py) is already placed; its thumb side just reaches the margin
            on_mouse = s == "Right" and (rig.matrix_world @ bone("RightHand").head).x < -0.15
            out[f][s] = max(KEY_TOP - min(zs), 0) if zs and not on_mouse else 0
        o.to_mesh_clear()
    return out

def smooth(seq, r=4):
    hold = [max(seq[max(0, i - r):i + r + 1]) for i in range(len(seq))]        # never dip back into the keys
    return [sum(hold[max(0, i - r):i + r + 1]) / len(hold[max(0, i - r):i + r + 1]) for i in range(len(hold))]

for rnd in range(2):
    need = needed()
    print("PASS", rnd, {s: round(max(need[f][s] for f in need), 4) for s in side})
    bpy.context.view_layer.objects.active = rig
    for s in side:
        lift = smooth([need[f][s] for f in range(f0, f1 + 1)])
        if max(lift) <= 0.001: continue
        hand, fore, arm = bone(s + "Hand"), bone(s + "ForeArm"), bone(s + "Arm")
        tgt = bpy.data.objects.new("keys_ik", None); sc.collection.objects.link(tgt)
        for i, f in enumerate(range(f0, f1 + 1)):
            sc.frame_set(f)
            tgt.location = rig.matrix_world @ hand.head + Vector((0, 0, lift[i])); tgt.keyframe_insert("location", frame=f)
        ik = fore.constraints.new("IK"); ik.target = tgt; ik.chain_count = 2; ik.use_rotation = False
        bpy.ops.object.mode_set(mode="POSE")
        for p in rig.pose.bones: p.select = p in (arm, fore)
        bpy.ops.nla.bake(frame_start=f0, frame_end=f1, only_selected=True, visual_keying=True, clear_constraints=True,
                         use_current_action=True, bake_types={"POSE"})
        bpy.ops.object.mode_set(mode="OBJECT")
        bpy.data.objects.remove(tgt)
need = needed()
print("AFTER", {s: round(max(need[f][s] for f in need), 4) for s in side})
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
