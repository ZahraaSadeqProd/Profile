# Eases the fitted knit top off the body so it reads as a loose sweater. Runs in the rest pose, before retargeting;
# the longer hem is added and draped over her lap later, in sweater_hem.py.
import bpy, bmesh, os
from mathutils.bvhtree import BVHTree
sw = bpy.data.objects["Human.toigo_fisherman_sweater"]
body = bpy.data.objects["Human.female_generic"]
dg = bpy.context.evaluated_depsgraph_get()
bme = bmesh.new(); m = body.evaluated_get(dg).to_mesh(); m.transform(body.matrix_world); bme.from_mesh(m)
body.evaluated_get(dg).to_mesh_clear()
tree = BVHTree.FromBMesh(bme)
W = sw.matrix_world; Wi = W.inverted()
ztop = max((W @ v.co).z for v in sw.data.vertices)
for v in sw.data.vertices:
    p = W @ v.co
    hit, n, _, _ = tree.find_nearest(p)
    if hit is None: continue
    gap = max((p - hit).dot(n), 0.006)  # never inside her
    ease = 0.016 * max(0.0, min(1.0, (ztop - 0.17 - p.z) / 0.12))  # loose through the body, snug at neck and shoulders
    v.co = Wi @ (hit + n * (gap + ease))
bme.free()
bpy.ops.wm.save_as_mainfile(filepath=os.environ["OUTBLEND"])
print("SWEATER_DONE")
