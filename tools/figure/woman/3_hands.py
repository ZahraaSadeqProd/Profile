# Swap in the hands of the previous figure ("Hijabi Style 3D Character", zahracarmiela, CC BY 4.0). Both builds end with
# the same seated pose as their rest, on the same bones, so her hands drop straight in: take the skin of that export,
# keep what hangs off the forearm and hand bones (not the face), and bind it by bone name.
import bpy, bmesh, sys, os, numpy as np
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
D=bpy.data.objects; rig=D["Human.rig"]
names=set(D.keys())
bpy.ops.import_scene.gltf(filepath=os.environ["PREV"])
new=[o for o in D if o.name not in names]
arm=[o for o in new if o.type=='ARMATURE'][0]; arm.data.pose_position='REST'
src=[o for o in new if o.type=='MESH' and o.active_material and o.active_material.name.startswith("Skin")][0]
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
# world positions at rest, without the armature modifier's pose
for m in src.modifiers: m.show_viewport=False
bpy.context.view_layer.update()
e=src.evaluated_get(bpy.context.evaluated_depsgraph_get()); me=e.to_mesh()
P=np.array([src.matrix_world@v.co for v in me.vertices]); e.to_mesh_clear()
gn=[g.name for g in src.vertex_groups]
Wt=np.zeros((len(P),len(gn)))
for v in src.data.vertices:
    for ge in v.groups: Wt[v.index,ge.group]=ge.weight
handcol=np.array([("Hand" in n or "ForeArm" in n) for n in gn])
hand=Wt[:,handcol].sum(1)>0.5*Wt.sum(1)
print("PREV skin verts",len(P),"hand verts",int(hand.sum()),"bbox",P[hand].min(0).round(3),P[hand].max(0).round(3))
bm=bmesh.new(); bm.from_mesh(src.data)
oid=bm.verts.layers.int.new("oid")
for v in bm.verts: v[oid]=v.index
dl=bm.verts.layers.deform.active
if dl: bm.verts.layers.deform.remove(dl)
bm.faces.ensure_lookup_table()
bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(hand[v.index] for v in f.verts)],context='FACES_ONLY')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
idx=np.array([v[oid] for v in bm.verts])
for v,i in zip(bm.verts,idx): v.co=P[i]
hme=bpy.data.meshes.new("Hands"); bm.to_mesh(hme); bm.free()
for o in new: D.remove(o)
if "Human.Hands" in D: D.remove(D["Human.Hands"])
ho=bpy.data.objects.new("Human.Hands",hme); bpy.context.scene.collection.objects.link(ho)
hme.materials.clear(); hme.materials.append(bpy.data.materials["Skin"])
for p in hme.polygons: p.use_smooth=True
for j,n in enumerate(gn):
    col=Wt[idx,j]
    if col.max()>1e-4 and n in rig.data.bones:
        vg=ho.vertex_groups.new(name=n)
        for k in np.nonzero(col>1e-4)[0]: vg.add([int(k)],float(col[k]),'REPLACE')
ho.parent=rig; am=ho.modifiers.new("Armature","ARMATURE"); am.object=rig
print("HANDS verts",len(hme.vertices),"groups",len(ho.vertex_groups))
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
