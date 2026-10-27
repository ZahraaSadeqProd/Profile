# Import "woman hijab" (P151292, CC BY 4.0) into the rig scene: one textured scan mesh, standing, facing -Y.
# Scale her to the rig's height, stand her on the floor, centre her chest on the rig's spine. Saves the scaled verts.
import bpy, sys, os, numpy as np
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
names=set(bpy.data.objects.keys())
bpy.ops.import_scene.gltf(filepath=os.environ["CHAR"])
new=[o for o in bpy.data.objects if o.name not in names]
ms=[o for o in new if o.type=='MESH' and len(o.data.vertices)>100]
ch=ms[0]; ch.name="Char"
bpy.ops.object.select_all(action='DESELECT'); ch.select_set(True); bpy.context.view_layer.objects.active=ch
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM'); bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
for o in new:
    if o not in ms: bpy.data.objects.remove(o)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=0.0001); bpy.ops.object.mode_set(mode='OBJECT')
P=np.array([v.co[:] for v in ch.data.vertices])
H=float(os.environ.get("HEIGHT","1.552")); s=H/(P[:,2].max()-P[:,2].min())
P[:,2]-=P[:,2].min(); P*=s
chest=P[(P[:,2]>1.05)&(P[:,2]<1.15)]
cx=(chest[:,0].min()+chest[:,0].max())/2
mid=chest[np.abs(chest[:,0]-cx)<0.06]; cy=(mid[:,1].min()+mid[:,1].max())/2
P[:,0]-=cx; P[:,1]+=-0.012-cy
ch.data.vertices.foreach_set("co",P.ravel())
ch.data.update()
print("CHAR verts",len(P),"scale %.4f"%s,"bbox",P.min(0).round(3),P.max(0).round(3))
np.save(sys.argv[-1].replace('.blend','_P.npy'),P)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
