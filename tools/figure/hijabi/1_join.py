# decimate the downloaded character, report sizes; save body rest verts + char verts for analysis
import bpy, bmesh, sys, numpy as np
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
rig=bpy.data.objects["Human.rig"]; rig.data.pose_position='REST'
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
def wverts(o):
    e=o.evaluated_get(dg); m=e.to_mesh(); a=np.array([o.matrix_world@v.co for v in m.vertices]); e.to_mesh_clear(); return a
body=wverts(bpy.data.objects["Human.female_generic"]); hij=wverts(bpy.data.objects["Hijab"])
print("BODY", body.min(0).round(3), body.max(0).round(3), "HIJAB top", hij[:,2].max().round(3))
names=set(bpy.data.objects.keys())
bpy.ops.import_scene.gltf(filepath=__import__("os").environ["CHAR"])
newn=[o.name for o in bpy.data.objects if o.name not in names]
ms=[bpy.data.objects[n] for n in newn if bpy.data.objects[n].type=='MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in ms: o.select_set(True)
bpy.context.view_layer.objects.active=ms[0]
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM'); bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.object.join(); ch=bpy.context.active_object; ch.name="Char"
for n in newn:
    if n in bpy.data.objects and n!='Char': bpy.data.objects.remove(bpy.data.objects[n])
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=0.0002); bpy.ops.object.mode_set(mode='OBJECT')
bm=bmesh.new(); bm.from_mesh(ch.data)
isl=[]; seen=set()
for v in bm.verts:
    if v.index in seen: continue
    st=[v]; comp=[]; seen.add(v.index)
    while st:
        x=st.pop(); comp.append(x.index)
        for e in x.link_edges:
            y=e.other_vert(x)
            if y.index not in seen: seen.add(y.index); st.append(y)
    isl.append(comp)
co=np.array([v.co[:] for v in bm.verts])
isl.sort(key=len,reverse=True)
print("CHAR verts",len(co),"islands",len(isl),[ (len(c), co[c].min(0).round(2).tolist(), co[c].max(0).round(2).tolist()) for c in isl[:12]])
bm.free()
np.savez(sys.argv[-1], body=body, hij=hij, char=co)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-2].replace('study_in','prep'))
