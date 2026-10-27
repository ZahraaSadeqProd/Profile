# Puts her right hand on the mouse (placed by 3_props.py). The clip rests that hand flat on the desk between bursts
# at the keys, fingers spread as if typing. Wherever it rests near the mouse:
#  - an IK target holds the wrist at HOME, on the mouse's back, and the arm is baked back into the action
#  - the hand turns to point forward over the mouse, palm down, and the fingers close and curl over its front
# and at the keys the right hand mirrors the left's turn (see below).
# Both blend in by k, which falls from 1 at the rest spot to 0 once the hand is on its way to the keys.
import bpy, sys, math, os
from mathutils import Vector, Matrix, Quaternion
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc = bpy.context.scene; rig = bpy.data.objects["Human.rig"]
REST = Vector((-0.207, -0.404))   # where the wrist rests in the clip
HOME = Vector((-0.196, -0.395, float(os.environ.get("HOMEZ", 0.66))))  # where it rests on the mouse; the clip drifts about 2 cm between rests
bone = lambda s: next(p for p in rig.pose.bones if p.name.startswith("mixamorig:" + s + "_"))
hand, fore, arm = bone("RightHand"), bone("RightForeArm"), bone("RightArm")
f0, f1 = map(int, rig.animation_data.action.frame_range)

tgt = bpy.data.objects.new("mouse_ik", None); sc.collection.objects.link(tgt)
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    w = rig.matrix_world @ hand.head
    d = (w.xy - REST).length
    k = 1 - min(max((d - 0.03) / 0.06, 0), 1); k = k * k * (3 - 2 * k)
    tgt.location = w.lerp(HOME, k); tgt.keyframe_insert("location", frame=f)

ik = fore.constraints.new("IK"); ik.target = tgt; ik.chain_count = 2; ik.use_rotation = False
# keep the elbow bending the way it already does: pole off the current elbow direction
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode="POSE")
for p in rig.pose.bones: p.select = p in (arm, fore)
bpy.ops.nla.bake(frame_start=f0, frame_end=f1, only_selected=True, visual_keying=True, clear_constraints=True,
                 use_current_action=True, bake_types={"POSE"})
bpy.ops.object.mode_set(mode="OBJECT")
bpy.data.objects.remove(tgt)

def weight(f):
    sc.frame_set(f)
    d = ((rig.matrix_world @ hand.head).xy - REST).length
    k = 1 - min(max((d - 0.03) / 0.06, 0), 1); return k * k * (3 - 2 * k)
ks = {f: weight(f) for f in range(f0, f1 + 1)}

# the grip, in world axes: the bone's y runs down the fingers, its z out of the back of the hand (as at rest)
fwd = Vector((0.2, -1, float(os.environ.get("PITCH", 0.0)))).normalized(); up = Vector((0.12, 0.0, 1))
up = (up - fwd * up.dot(fwd)).normalized()
G = Matrix((fwd.cross(up), fwd, up)).transposed().to_quaternion()
G = rig.matrix_world.to_quaternion().inverted() @ G
# finger curl about each bone's own x (negative closes towards the palm); the thumb keeps the clip's pose
CURL = dict(zip("1234", map(float, os.environ.get("CURL", "-4,-8,-6,0").split(","))))
fingers = [p for p in rig.pose.bones if p.name.startswith("mixamorig:RightHand") and any(n in p.name for n in ("Index", "Middle", "Ring", "Pinky"))]
# At the keys the clip twists the right hand palm-sideways (a retarget fault); the left hand types cleanly, so the
# right hand takes the left's turn from rest, mirrored across her midline (world x), and blends to the grip by k.
left = bone("LeftHand")
W = rig.matrix_world.to_quaternion().to_matrix()
S = Matrix(((-1, 0, 0), (0, 1, 0), (0, 0, 1)))
L0, R0 = W @ left.bone.matrix_local.to_3x3().normalized(), W @ hand.bone.matrix_local.to_3x3().normalized()
for f in range(f0, f1 + 1):
    k = ks[f]
    sc.frame_set(f)
    Dl = (W @ left.matrix.to_3x3().normalized()) @ L0.inverted()
    typing = (W.inverted() @ (S @ Dl @ S) @ R0).to_quaternion()
    m = hand.matrix.copy()
    q = typing.slerp(G, k)
    target = Matrix.LocRotScale(m.translation, q, m.to_scale())
    hand.matrix = target
    # move the wrist's twist (about the bone's own y) into the forearm, so the skin turns along the forearm instead
    # of wringing at the wrist
    h = hand.rotation_quaternion
    twist = Quaternion((h.w, 0, h.y, 0)).normalized()
    fore.rotation_quaternion = fore.rotation_quaternion @ twist
    fore.keyframe_insert("rotation_quaternion", frame=f)
    bpy.context.view_layer.update()
    hand.matrix = target
    hand.keyframe_insert("rotation_quaternion", frame=f)
    if k <= 0: continue
    for p in fingers:
        joint = p.name.split(":")[1].split("_")[0][-1]
        grip = Quaternion((1, 0, 0), math.radians(CURL[joint]))
        p.rotation_quaternion = p.rotation_quaternion.slerp(grip, k)
        p.keyframe_insert("rotation_quaternion", frame=f)
mid = bone("RightHandMiddle1"); mid2 = bone("RightHandMiddle2")
for f in (0, 40, 120, 300):
    sc.frame_set(f)
    print("WRIST", f, round(ks[f], 2), tuple(round(x, 3) for x in rig.matrix_world @ hand.head),
          "KNUCKLE", tuple(round(x, 3) for x in rig.matrix_world @ mid.head), "MID2", tuple(round(x, 3) for x in rig.matrix_world @ mid2.head))
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
