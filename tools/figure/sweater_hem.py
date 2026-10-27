# Lengthens the sweater in her seated pose. The hem is extruded forward along her thighs at the front and down at the
# back, then laid onto a smooth hull of her lap and hips, so it reads as a long knit falling over her legs.
# Then it is skinned back to the rig at the bind frame.
import bpy, bmesh, math, os
from mathutils import Vector, Matrix
BIND = int(os.environ.get("BIND", "90"))
sc = bpy.context.scene
rig = bpy.data.objects["Human.rig"]
body = bpy.data.objects["Human.female_generic"]
pants = bpy.data.objects["Human.toigo_wool_pants"]
sw = bpy.data.objects["Human.toigo_fisherman_sweater"]
sc.frame_set(BIND)
dg = bpy.context.evaluated_depsgraph_get()
act = rig.animation_data.action; rig.animation_data.action = None

rest_z = [v.co.z for v in sw.data.vertices]; zmin = min(rest_z)
ev = sw.evaluated_get(dg).to_mesh(); posed = [sw.matrix_world @ v.co for v in ev.vertices]; sw.evaluated_get(dg).to_mesh_clear()
for m in list(sw.modifiers): sw.modifiers.remove(m)
Wi = sw.matrix_world.inverted()
for v, p in zip(sw.data.vertices, posed): v.co = Wi @ p
n0 = len(sw.data.vertices)
bm = bmesh.new(); bm.from_mesh(sw.data); bm.verts.ensure_lookup_table()
hem = [e for e in bm.edges if e.is_boundary and all(rest_z[v.index] < zmin + 0.06 for v in e.verts)]
hv = {v for e in hem for v in e.verts}
c = sum((posed[v.index] for v in hv), Vector()) / len(hv)
hz = max(posed[v.index].z for v in hv)
print("HEM", len(hem), "centre", tuple(round(x, 3) for x in c))

# lap hull: hips, seat of the trousers and the thighs out to mid-thigh
hb = bmesh.new()
for o in (body, pants):
    m = o.evaluated_get(dg).to_mesh(); m.transform(o.matrix_world)
    for v in m.vertices:
        p = v.co
        if 0.3 < p.z < hz + 0.02 and c.y - 0.26 < p.y and abs(p.x - c.x) < 0.25: hb.verts.new(p)
    o.evaluated_get(dg).to_mesh_clear()
bmesh.ops.convex_hull(hb, input=hb.verts[:])
bmesh.ops.delete(hb, geom=[v for v in hb.verts if not v.link_faces], context="VERTS")
bmesh.ops.triangulate(hb, faces=hb.faces[:]); bmesh.ops.subdivide_edges(hb, edges=hb.edges[:], cuts=3, use_grid_fill=True)
hm = bpy.data.meshes.new("Lap"); hb.to_mesh(hm); hb.free()
lap = bpy.data.objects.new("Lap", hm); sc.collection.objects.link(lap)
bpy.ops.object.select_all(action="DESELECT"); bpy.context.view_layer.objects.active = lap; lap.select_set(True)
r = lap.modifiers.new("Round", "SMOOTH"); r.factor = 1.0; r.iterations = 15; bpy.ops.object.modifier_apply(modifier="Round")

STEPS = 6
cur = hem; ring_of = {}
for i in range(STEPS):
    ret = bmesh.ops.extrude_edge_only(bm, edges=cur)
    for v in [g for g in ret["geom"] if isinstance(g, bmesh.types.BMVert)]:
        d = Vector((v.co.x - c.x, v.co.y - c.y, 0)).normalized()
        f = max(0.0, -d.y)  # 1 at the front, where the thighs run forward
        step = Vector((d.x * 0.25, -f, -0.25)).normalized() * f + Vector((d.x * 0.3, d.y * 0.15, -1)).normalized() * (1 - f)
        v.co += step * ((0.2 * f + 0.11 * (1 - f)) / STEPS)
    cur = [g for g in ret["geom"] if isinstance(g, bmesh.types.BMEdge) and g.is_boundary]
bm.to_mesh(sw.data); bm.free()
new = list(range(n0, len(sw.data.vertices)))
for g in sw.vertex_groups: g.remove(new)
wg = sw.vertex_groups.new(name="lapw")
for i in new: wg.add([i], 1.0, "REPLACE")
bpy.ops.object.select_all(action="DESELECT"); bpy.context.view_layer.objects.active = sw; sw.select_set(True)
m = sw.modifiers.new("Lap", "SHRINKWRAP"); m.target = lap; m.wrap_method = "NEAREST_SURFACEPOINT"; m.wrap_mode = "OUTSIDE"
m.offset = 0.014; m.vertex_group = "lapw"; bpy.ops.object.modifier_apply(modifier="Lap")
m = sw.modifiers.new("Smooth", "CORRECTIVE_SMOOTH"); m.factor = 0.5; m.iterations = 6; m.vertex_group = "lapw"
bpy.ops.object.modifier_apply(modifier="Smooth")
bpy.data.objects.remove(lap)
rig.animation_data.action = act; sc.frame_set(BIND)

dt = sw.modifiers.new("Weights", "DATA_TRANSFER"); dt.object = body
dt.use_vert_data = True; dt.data_types_verts = {"VGROUP_WEIGHTS"}; dt.vert_mapping = "POLYINTERP_NEAREST"
dt.layers_vgroup_select_src = "ALL"; dt.layers_vgroup_select_dst = "NAME"; dt.vertex_group = "lapw"
bpy.ops.object.datalayout_transfer(modifier="Weights")
bpy.ops.object.modifier_apply(modifier="Weights")
sw.vertex_groups.remove(sw.vertex_groups["lapw"])

bones = {b.name: (rig.matrix_world @ rig.pose.bones[b.name].matrix @ b.matrix_local.inverted() @ rig.matrix_world.inverted()) for b in rig.data.bones}
names = {g.index: g.name for g in sw.vertex_groups}
W = sw.matrix_world
for v in sw.data.vertices:
    ws = [(names[g.group], g.weight) for g in v.groups if names[g.group] in bones and g.weight > 0]
    tot = sum(w for _, w in ws)
    if tot <= 0: continue
    M = Matrix(((0,) * 4,) * 4)
    for n, w in ws: M += bones[n] * (w / tot)
    v.co = Wi @ (M.inverted() @ (W @ v.co))
am = sw.modifiers.new("Armature", "ARMATURE"); am.object = rig
sw.data.shade_smooth()
bpy.ops.wm.save_as_mainfile(filepath=os.environ["OUTBLEND"])
print("HEM_DONE", len(new))
