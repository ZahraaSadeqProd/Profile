# Retarget the Mixamo "Typing" clip (Louise, T-pose rest) onto the MPFB mixamo rig (A-pose rest).
# World-space: target_rot = src_delta_from_rest @ swing(target_rest_dir -> source_rest_dir) @ target_rest_rot
import bpy, os, math
from mathutils import Matrix, Vector, Quaternion
tgt = bpy.data.objects["Human.rig"]
bpy.ops.import_scene.fbx(filepath=os.environ["FBX"], automatic_bone_orientation=False)
src = [o for o in bpy.context.selected_objects if o.type == "ARMATURE"][0]
for o in list(bpy.context.selected_objects):
    if o.type == "MESH": bpy.data.objects.remove(o)
sc = bpy.context.scene
act = src.animation_data.action
f0, f1 = map(int, act.frame_range)
sc.frame_start, sc.frame_end = f0, f1
sc.render.fps = 30
SW, TW = src.matrix_world, tgt.matrix_world
def name(b): return b.name.replace("mixamorig:", "mixamorig8:")
order = []
def walk(b):
    order.append(b); [walk(c) for c in b.children]
walk(tgt.data.bones["mixamorig:Hips"])
order = [b for b in order if name(b) in src.data.bones]
print("MAPPED", len(order), "of", len(tgt.data.bones))
# rest data in world space
rest = {}
for b in order:
    sb = src.data.bones[name(b)]
    Sr = (SW @ sb.matrix_local).to_quaternion()
    Tr = (TW @ b.matrix_local).to_quaternion()
    sd = ((SW @ sb.tail_local) - (SW @ sb.head_local)).normalized()
    td = ((TW @ b.tail_local) - (TW @ b.head_local)).normalized()
    C = td.rotation_difference(sd)
    rest[b.name] = (Sr, Tr, C)
s_hip = (SW @ src.data.bones["mixamorig8:Hips"].head_local).z
t_hip = (TW @ tgt.data.bones["mixamorig:Hips"].head_local).z
k = t_hip / s_hip
print("hip heights", s_hip, t_hip, k)
for pb in tgt.pose.bones: pb.rotation_mode = "QUATERNION"
tgt.animation_data_create()
tact = bpy.data.actions.new("typing"); tgt.animation_data.action = tact
TWi = TW.inverted()
for f in range(f0, f1 + 1):
    sc.frame_set(f)
    posed = {}
    for b in order:
        spb = src.pose.bones[name(b)]
        Sr, Tr, C = rest[b.name]
        Sw = (SW @ spb.matrix)
        delta = Sw.to_quaternion() @ Sr.inverted()
        rot_w = delta @ C @ Tr
        if b.parent is None:
            s_rest_head = SW @ src.data.bones[name(b)].head_local
            t_rest_head = TW @ b.head_local
            head_w = t_rest_head + (Sw.translation - s_rest_head) * k
        else:
            P = posed[b.parent.name]
            rel = b.parent.matrix_local.inverted() @ b.matrix_local
            head_w = (TW @ P @ rel).translation
        M = TWi @ Matrix.LocRotScale(head_w, rot_w, Vector((1, 1, 1)))
        posed[b.name] = M
        pb = tgt.pose.bones[b.name]
        if b.parent is None: basis = b.matrix_local.inverted() @ M
        else:
            rel = b.parent.matrix_local.inverted() @ b.matrix_local
            basis = rel.inverted() @ posed[b.parent.name].inverted() @ M
        pb.matrix_basis = basis
        pb.keyframe_insert("rotation_quaternion", frame=f)
        if b.parent is None: pb.keyframe_insert("location", frame=f)
bpy.data.objects.remove(src)
bpy.ops.wm.save_as_mainfile(filepath=os.environ["OUTBLEND"])
print("DONE", f0, f1)
