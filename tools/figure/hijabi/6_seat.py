# bake the seated pose into the mesh, clean it, and make that pose the rig's rest so the typing clip only nudges it
import bpy, bmesh, sys, os, numpy as np
from mathutils import Matrix
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc=bpy.context.scene; D=bpy.data.objects; rig=D["Human.rig"]
F=int(os.environ.get("F","90")); act=rig.animation_data.action
f0,f1=map(int,act.frame_range)
# 1. record every bone's pose matrix (armature space) per frame
order=[]
def walk(b): order.append(b.name); [walk(c) for c in b.children]
for b in rig.data.bones:
    if b.parent is None: walk(b)
M={}
for f in range(f0,f1+1):
    sc.frame_set(f); M[f]={n:rig.pose.bones[n].matrix.copy() for n in order}
sc.frame_set(F)
parts=[o for o in D if o.parent==rig and o.type=='MESH']
for o in parts:
    rest=np.array([v.co[:] for v in o.data.vertices])
    cs=o.modifiers.new("cs","CORRECTIVE_SMOOTH"); cs.rest_source='ORCO'; cs.iterations=int(os.environ.get("CSI","10")); cs.smooth_type='LENGTH_WEIGHTED'; cs.factor=float(os.environ.get('CSF','1.0'))
    if "web" in o.vertex_groups:
        sm=o.modifiers.new("web","LAPLACIANSMOOTH"); sm.vertex_group="web"; sm.iterations=int(os.environ.get("WEBIT","20"))
        sm.lambda_factor=float(os.environ.get("WEBL","0.6")); sm.use_volume_preserve=True
    bpy.context.view_layer.objects.active=o
    for m in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
    if "web" in o.vertex_groups: o.vertex_groups.remove(o.vertex_groups["web"])
    bm=bmesh.new(); bm.from_mesh(o.data); bm.verts.ensure_lookup_table()
    bad=set()
    for e in bm.edges:
        a,b=e.verts[0].index,e.verts[1].index
        l0=np.linalg.norm(rest[a]-rest[b]); l1=e.calc_length()
        if l1>float(os.environ.get('SPK','6'))*l0+0.03: bad.update(e.link_faces)
    bmesh.ops.delete(bm,geom=list(bad),context='FACES_ONLY')
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    # tiny floating fragments
    bm.faces.ensure_lookup_table(); seen=set(); small=[]
    for f in bm.faces:
        if f.index in seen: continue
        st=[f]; comp=[]; seen.add(f.index)
        while st:
            x=st.pop(); comp.append(x)
            for e in x.edges:
                for g in e.link_faces:
                    if g.index not in seen: seen.add(g.index); st.append(g)
        if len(comp)<int(os.environ.get("MINI","60")): small+=comp
    bmesh.ops.delete(bm,geom=small,context='FACES_ONLY')
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    bm.to_mesh(o.data); bm.free()
    print("BAKE",len(small),"fragment faces;",o.name,"spike faces",len(bad),"verts",len(o.data.vertices))
# 2. current pose becomes the rest pose
bpy.ops.object.select_all(action='DESELECT'); rig.select_set(True); bpy.context.view_layer.objects.active=rig
bpy.ops.object.mode_set(mode='POSE'); bpy.ops.pose.armature_apply(selected=False); bpy.ops.object.mode_set(mode='OBJECT')
# 3. re-key the clip against the new rest
new=bpy.data.actions.new("typing"); rig.animation_data.action=new
for pb in rig.pose.bones: pb.rotation_mode='QUATERNION'
bones=rig.data.bones
for f in range(f0,f1+1):
    for n in order:
        b=bones[n]; Mf=M[f][n]
        if b.parent is None: basis=b.matrix_local.inverted()@Mf
        else:
            rel=b.parent.matrix_local.inverted()@b.matrix_local
            basis=rel.inverted()@M[f][b.parent.name].inverted()@Mf
        pb=rig.pose.bones[n]; l,r,_=basis.decompose()
        pb.location=l; pb.rotation_quaternion=r
        pb.keyframe_insert("rotation_quaternion",frame=f); pb.keyframe_insert("location",frame=f)
bpy.data.actions.remove(act)
for o in parts:
    am=o.modifiers.new("Armature","ARMATURE"); am.object=rig
sc.frame_set(F)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
print("DONE",f0,f1)
