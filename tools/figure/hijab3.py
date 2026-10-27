# A regular hijab, shaped rather than simulated: the head part is a sculpted profile, and the neck and shoulder part follows
# a convex hull of her posed upper body, so the fabric bridges chin to chest and lies over the shoulders.
# Then it is skinned to her rig at the bind frame.
import bpy, bmesh, math, os
from mathutils import Vector, Matrix
BIND = int(os.environ.get("BIND", "90"))
sc = bpy.context.scene
rig = bpy.data.objects["Human.rig"]
body = bpy.data.objects["Human.female_generic"]
sweater = bpy.data.objects["Human.toigo_fisherman_sweater"]
sc.frame_set(BIND)
dg = bpy.context.evaluated_depsgraph_get()
act = rig.animation_data.action; rig.animation_data.action = None  # hold the bind pose

def posed(o):
    m = o.evaluated_get(dg).to_mesh(); m.transform(o.matrix_world)
    b = bmesh.new(); b.from_mesh(m); o.evaluated_get(dg).to_mesh_clear(); return b
def obj(name, b):
    me = bpy.data.meshes.new(name); b.to_mesh(me); b.free()
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); return o

# head frame from the Head-weighted vertices
me = body.evaluated_get(dg).to_mesh()
gi = body.vertex_groups["mixamorig:Head"].index
pts = [body.matrix_world @ me.vertices[v.index].co for v in body.data.vertices if any(g.group == gi and g.weight > 0.9 for g in v.groups)]
body.evaluated_get(dg).to_mesh_clear()
lo = Vector((min(p[i] for p in pts) for i in range(3))); hi = Vector((max(p[i] for p in pts) for i in range(3)))
pb = rig.pose.bones["mixamorig:Head"]
up = ((rig.matrix_world @ pb.tail) - (rig.matrix_world @ pb.head)).normalized()
fwd = Vector((0, -1, 0)); fwd = (fwd - up * fwd.dot(up)).normalized()
side = fwd.cross(up)
centre = (lo + hi) / 2 + up * 0.005
def W(x, y, z): return centre + side * x + up * y + fwd * z
def local(p): d = p - centre; return d.dot(side), d.dot(up), d.dot(fwd)

# targets: the head itself, and a hull of head, neck, shoulders and upper chest/back
hb = bmesh.new()
for o in (body, sweater):
    arm = {g.index for g in o.vertex_groups if any(k in g.name for k in ("ForeArm", "Hand"))}
    upper = {g.index for g in o.vertex_groups if g.name.endswith(("LeftArm", "RightArm"))}
    b = posed(o)
    for v, src in zip(b.verts, o.data.vertices):
        if sum(g.weight for g in src.groups if g.group in arm) > 0.3: continue  # not her forearms: they reach forward to type
        x, y, z = local(v.co)
        if sum(g.weight for g in src.groups if g.group in upper) > 0.3 and y < -0.28: continue  # only the tops of her upper arms
        if y > -0.42 and abs(x) < 0.27 and z < 0.16: hb.verts.new(v.co)
    b.free()
bmesh.ops.convex_hull(hb, input=hb.verts[:])
bmesh.ops.delete(hb, geom=[v for v in hb.verts if not v.link_faces], context="VERTS")
bmesh.ops.triangulate(hb, faces=hb.faces[:])
bmesh.ops.subdivide_edges(hb, edges=hb.edges[:], cuts=3, use_grid_fill=True)
hull = obj("HullT", hb)
sm = hull.modifiers.new("Round", "SMOOTH"); sm.factor = 1.0; sm.iterations = 25  # round off the hull's flat facets
bpy.ops.object.select_all(action="DESELECT"); bpy.context.view_layer.objects.active = hull; hull.select_set(True)
bpy.ops.object.modifier_apply(modifier="Round")

prof = [(0.0, 0.11), (0.04, 0.106), (0.07, 0.093), (0.092, 0.07), (0.104, 0.035), (0.107, 0.0), (0.102, -0.05), (0.093, -0.1),
        (0.1, -0.13), (0.15, -0.155), (0.2, -0.18), (0.25, -0.21), (0.29, -0.25), (0.31, -0.29), (0.32, -0.33), (0.325, -0.37)]
P = [Vector(p) for p in prof]; L = [0]
for a, b in zip(P, P[1:]): L.append(L[-1] + (b - a).length)
ROWS, SEG = 60, 104
LN = L[7]
def at(t):
    k = min(max(j for j in range(len(L)) if L[j] <= t), len(P) - 2)
    return P[k].lerp(P[k + 1], (t - L[k]) / (L[k + 1] - L[k]))
bm = bmesh.new(); grid = []
for i in range(ROWS):
    t0 = L[-1] * i / (ROWS - 1)
    ring = []
    for s in range(1 if i == 0 else SEG):
        a = 2 * math.pi * s / SEG; front = min(a, 2 * math.pi - a)
        reach = 0.8 + 0.2 * (1 - math.cos(front)) / 2  # a little shorter over the chest than down the back
        p = at(t0 if t0 <= LN else LN + (t0 - LN) * reach)
        back = max(0.0, -math.cos(a)) * max(0.0, min(1.0, (p.y + 0.09) / 0.06))
        ring.append((bm.verts.new(W(math.sin(a) * p.x, p.y, math.cos(a) * p.x * (1 + 0.12 * back))), at(t0).y))  # volume at the back of the head
    grid.append(ring)
for s in range(SEG): bm.faces.new((grid[0][0][0], grid[1][s][0], grid[1][(s + 1) % SEG][0]))
for i in range(1, ROWS - 1):
    for s in range(SEG):
        am = 2 * math.pi * (s + 0.5) / SEG; front = min(am, 2 * math.pi - am)
        ym = (grid[i][s][1] + grid[i + 1][s][1]) / 2
        e = (ym + 0.012) / 0.074
        if abs(e) < 1 and front < 0.64 * math.sqrt(1 - e * e) ** 0.6: continue  # oval face opening
        bm.faces.new((grid[i][s][0], grid[i + 1][s][0], grid[i + 1][(s + 1) % SEG][0], grid[i][(s + 1) % SEG][0]))
bm.verts.index_update()
wh = [(v.index, max(0.0, min(1.0, (-0.09 - y) / 0.04))) for ring in grid for (v, y) in ring]  # 0 on the head: it keeps the sculpted profile
hij = obj("Hijab", bm)
gl = hij.vertex_groups.new(name="hull")
for i, w in wh:
    if w > 0: gl.add([i], w, "REPLACE")
bpy.ops.object.select_all(action="DESELECT"); bpy.context.view_layer.objects.active = hij; hij.select_set(True)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.delete_loose(); bpy.ops.object.mode_set(mode="OBJECT")
for name, tgt, off in [("hull", hull, 0.016)]:
    m = hij.modifiers.new(name, "SHRINKWRAP"); m.target = tgt; m.wrap_method = "NEAREST_SURFACEPOINT"
    m.wrap_mode = "OUTSIDE_SURFACE"; m.offset = off; m.vertex_group = name
    bpy.ops.object.modifier_apply(modifier=name)
sm = hij.modifiers.new("Smooth", "CORRECTIVE_SMOOTH"); sm.factor = 0.6; sm.iterations = 8; sm.smooth_type = "LENGTH_WEIGHTED"
bpy.ops.object.modifier_apply(modifier="Smooth")
# the hem falls slightly away from her, like fabric that has weight
for v in hij.data.vertices:
    x, y, z = local(v.co)
    if y < -0.17:
        t = min(1, (-0.17 - y) / 0.2); r = (v.co - centre - up * y).normalized(); a = math.atan2(x, z)
        v.co += r * t * (0.012 + 0.009 * math.sin(a * 11 + 0.6 * math.sin(a * 3)))  # soft folds, more toward the hem
# even out the face opening and the hem: smooth each boundary loop along itself
bm = bmesh.new(); bm.from_mesh(hij.data)
edge = [v for v in bm.verts if v.is_boundary]
nb = {v: [e.other_vert(v) for e in v.link_edges if e.is_boundary] for v in edge}
for _ in range(int(os.environ.get("EDGE_IT", "12"))):
    new = {v: v.co * 0.5 + (nb[v][0].co + nb[v][1].co) * 0.25 for v in edge if len(nb[v]) == 2}
    for v, c in new.items(): v.co = c
bm.to_mesh(hij.data); bm.free()
bpy.data.objects.remove(hull)
for g in list(hij.vertex_groups): hij.vertex_groups.remove(g)
rig.animation_data.action = act; sc.frame_set(BIND)

# skin weights from the posed body, then un-pose the vertices so the armature reproduces this shape at BIND
dt = hij.modifiers.new("Weights", "DATA_TRANSFER"); dt.object = body
dt.use_vert_data = True; dt.data_types_verts = {"VGROUP_WEIGHTS"}; dt.vert_mapping = "POLYINTERP_NEAREST"
dt.layers_vgroup_select_src = "ALL"; dt.layers_vgroup_select_dst = "NAME"
bpy.ops.object.datalayout_transfer(modifier="Weights")
bpy.ops.object.modifier_apply(modifier="Weights")
bones = {b.name: (rig.matrix_world @ rig.pose.bones[b.name].matrix @ b.matrix_local.inverted() @ rig.matrix_world.inverted()) for b in rig.data.bones}
names = {g.index: g.name for g in hij.vertex_groups}
for v in hij.data.vertices:
    ws = [(names[g.group], g.weight) for g in v.groups if names[g.group] in bones and g.weight > 0]
    tot = sum(w for _, w in ws)
    if tot <= 0: continue
    M = Matrix(((0,) * 4,) * 4)
    for n, w in ws: M += bones[n] * (w / tot)
    v.co = M.inverted() @ v.co
hij.parent = rig
am = hij.modifiers.new("Armature", "ARMATURE"); am.object = rig
so = hij.modifiers.new("Solid", "SOLIDIFY"); so.thickness = 0.003; so.offset = 1
hij.data.shade_smooth()
bpy.ops.wm.save_as_mainfile(filepath=os.environ["OUTBLEND"])
print("HIJAB_DONE", len(hij.data.vertices))
