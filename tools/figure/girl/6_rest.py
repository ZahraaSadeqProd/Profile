# Sets her fingertips down on the keys (after 5_keys.py). Lifting the wrists until nothing touched the keyboard left the
# fingertips 4-7 cm above the key tops, so the hands hovered. Per frame, each hand at the keys pitches down about its
# own x until its lowest vertex over the keyboard reaches the key tops; the pitch is smoothed over time and keyed.
import bpy, sys, math
from mathutils import Vector, Quaternion
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc = bpy.context.scene; rig = bpy.data.objects["Human.rig"]; skin = bpy.data.objects["Human.Skin"]
DZ = 0.61
KB_LO, KB_HI = Vector((-0.11, -0.575)), Vector((0.27, -0.425))
KEY_TOP = DZ + 0.021 + 0.002
MAX = math.radians(50)
f0, f1 = map(int, rig.animation_data.action.frame_range)
bone = lambda s: next(p for p in rig.pose.bones if p.name.startswith("mixamorig:" + s + "_"))

side = {"Left": [], "Right": []}
for v in skin.data.vertices:
    if not v.groups: continue
    g = skin.vertex_groups[max(v.groups, key=lambda e: e.weight).group].name
    for s in side:
        if (s + "Hand") in g: side[s].append(v.index)

def lowest(s):
    dg = bpy.context.evaluated_depsgraph_get(); o = skin.evaluated_get(dg); me = o.to_mesh()
    zs = [p.z for p in (o.matrix_world @ me.vertices[i].co for i in side[s]) if KB_LO.x < p.x < KB_HI.x and KB_LO.y < p.y < KB_HI.y]
    o.to_mesh_clear()
    return min(zs) if zs else None

def pitched(h, q0, a):
    h.rotation_quaternion = q0 @ Quaternion((1, 0, 0), a); bpy.context.view_layer.update()

# which way is "down": the sign that lowers the hand at a frame where it is at the keys
sc.frame_set(120)
SIGN = {}
for s in side:
    h = bone(s + "Hand"); q0 = h.rotation_quaternion.copy(); base = lowest(s)
    pitched(h, q0, math.radians(15)); SIGN[s] = 1 if lowest(s) < base else -1
    pitched(h, q0, 0)
print("SIGN", SIGN)

pitch = {s: [] for s in side}
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    for s in side:
        h = bone(s + "Hand"); q0 = h.rotation_quaternion.copy()
        on_mouse = s == "Right" and (rig.matrix_world @ h.head).x < -0.15
        z = lowest(s)
        if on_mouse or z is None or z <= KEY_TOP: pitch[s].append(0.0); continue
        lo, hi = 0.0, MAX
        pitched(h, q0, SIGN[s] * hi)
        if lowest(s) > KEY_TOP: lo = hi
        else:
            for _ in range(7):
                mid = (lo + hi) / 2; pitched(h, q0, SIGN[s] * mid)
                if lowest(s) > KEY_TOP: lo = mid
                else: hi = mid
        pitched(h, q0, 0); pitch[s].append(lo)

def smooth(seq, r=3):
    low = [min(seq[max(0, i - r):i + r + 1]) for i in range(len(seq))]       # never press further than a frame allows
    return [sum(low[max(0, i - r):i + r + 1]) / len(low[max(0, i - r):i + r + 1]) for i in range(len(low))]

for s in side:
    sm = smooth(pitch[s]); h = bone(s + "Hand")
    print(s, "pitch deg max", round(math.degrees(max(sm)), 1), "mean", round(math.degrees(sum(sm) / len(sm)), 1))
    for i, f in enumerate(range(f0, f1 + 1)):
        sc.frame_set(f)
        if sm[i] <= 0: continue
        h.rotation_quaternion = h.rotation_quaternion @ Quaternion((1, 0, 0), SIGN[s] * sm[i])
        h.keyframe_insert("rotation_quaternion", frame=f)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
