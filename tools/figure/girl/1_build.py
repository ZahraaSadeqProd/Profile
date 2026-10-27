# "hijabi girl" by fatinnajwa (Sketchfab, CC BY 4.0): a Mixamo-rigged, skinned figure. Replaces the old figure in the
# study: scale her to the typing rig's hip height, retarget the typing clip onto her own skeleton by bone direction
# (her rest is a T-pose, the clip's rig rests in an A-pose), decimate for the web, and split materials by texture colour.
import bpy, bmesh, sys, os, re, colorsys, numpy as np
from mathutils import Matrix, Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc=bpy.context.scene; D=bpy.data.objects
src=D["Human.rig"]; act=src.animation_data.action; f0,f1=map(int,act.frame_range)
# 1. the clip as world matrices per bone, and the source rest
SW={}
for f in range(f0,f1+1):
    sc.frame_set(f); SW[f]={pb.name:(src.matrix_world@pb.matrix).copy() for pb in src.pose.bones}
src.data.pose_position='REST'; bpy.context.view_layer.update()
SR={b.name:(src.matrix_world@b.matrix_local).copy() for b in src.data.bones}
hips_rest=SR["mixamorig:Hips"].translation.copy()
for o in [o for o in D if o.parent==src]: D.remove(o)
D.remove(src); bpy.data.actions.remove(act)
# 2. import her, drop the wrapper empties, stand her on the floor at the rig's hip height
names=set(D.keys())
bpy.ops.import_scene.gltf(filepath=os.environ["CHAR"])
new=[o for o in D if o.name not in names]
A=[o for o in new if o.type=='ARMATURE'][0]
ms=[o for o in new if o.type=='MESH' and o.parent==A]
for a in list(bpy.data.actions):
    if a.name!="Animation" and a.users and A.animation_data and A.animation_data.action==a: pass
if A.animation_data: A.animation_data.action=None; [A.animation_data.nla_tracks.remove(t) for t in list(A.animation_data.nla_tracks)]
mw=A.matrix_world.copy(); A.parent=None; A.matrix_world=mw
for o in new:
    if o is not A and o not in ms: D.remove(o)
A.data.pose_position='REST'; bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
zmin=min(min((o.evaluated_get(dg).matrix_world@v.co).z for v in o.evaluated_get(dg).to_mesh().vertices) for o in ms)
hb=[b for b in A.data.bones if re.sub(r"_\d+$","",b.name)=="mixamorig:Hips"][0]
hz=(A.matrix_world@hb.head_local)
s=(hips_rest.z)/(hz.z-zmin)
A.matrix_world=Matrix.Translation((0,0,0))@Matrix.Diagonal((s,s,s,1))@A.matrix_world
bpy.context.view_layer.update()
hw=A.matrix_world@hb.head_local
A.matrix_world=Matrix.Translation((hips_rest.x-hw.x,hips_rest.y-hw.y,hips_rest.z-hw.z))@A.matrix_world
bpy.context.view_layer.update()
print("SCALE %.4f"%s,"hips",np.array(A.matrix_world@hb.head_local).round(3))
A.name="Human.rig"; A.data.name="Human.rig"
# 3. retarget by bone direction
AW=A.matrix_world; Ar=AW.to_3x3().normalized(); Ari=Ar.inverted()
def rot(m): return m.to_3x3().normalized()
tb=A.data.bones; key={b.name:re.sub(r"_\d+$","",b.name) for b in tb}
order=[]
def walk(b): order.append(b); [walk(c) for c in b.children]
for b in tb:
    if b.parent is None: walk(b)
OFF={}
for b in tb:
    sn=key[b.name]
    if sn not in SR: continue
    Rt=Ar@b.matrix_local.to_3x3()             # target rest, world
    dt=(Rt@Vector((0,1,0))).normalized(); ds=(rot(SR[sn])@Vector((0,1,0))).normalized()
    Al=dt.rotation_difference(ds).to_matrix()
    OFF[b.name]=rot(SR[sn]).inverted()@Al@Rt  # world rest-to-clip offset
newact=bpy.data.actions.new("typing")
A.animation_data_create(); A.animation_data.action=newact
for pb in A.pose.bones: pb.rotation_mode='QUATERNION'
for f in range(f0,f1+1):
    Mf={}
    for b in order:
        rest_rel=(b.parent.matrix_local.inverted()@b.matrix_local) if b.parent else b.matrix_local
        if b.name in OFF:
            R=Ari@rot(SW[f][key[b.name]])@OFF[b.name]
        else:
            R=(Mf[b.parent.name]@rest_rel).to_3x3().normalized() if b.parent else b.matrix_local.to_3x3()
        if key[b.name]=="mixamorig:Hips": t=AW.inverted()@SW[f]["mixamorig:Hips"].translation   # under a _rootJoint
        elif b.parent is None: t=b.matrix_local.translation
        else: t=(Mf[b.parent.name]@rest_rel).translation
        M=R.to_4x4(); M.translation=t; Mf[b.name]=M
        basis=(rest_rel.inverted()@Mf[b.parent.name].inverted()@M) if b.parent else b.matrix_local.inverted()@M
        pb=A.pose.bones[b.name]; l,r,_=basis.decompose()
        pb.rotation_quaternion=r; pb.keyframe_insert("rotation_quaternion",frame=f)
        if b.parent is None or key[b.name]=="mixamorig:Hips": pb.location=l; pb.keyframe_insert("location",frame=f)
A.data.pose_position='POSE'
print("RETARGET bones",len(OFF),"of",len(tb),"frames",f0,f1)
# 4. one mesh, decimated, materials by texture colour
bpy.ops.object.select_all(action='DESELECT')
for o in ms: o.select_set(True)
bpy.context.view_layer.objects.active=ms[0]; bpy.ops.object.join(); ch=bpy.context.active_object; ch.name="Human.Girl"
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=0.00001); bpy.ops.object.mode_set(mode='OBJECT')
dm=ch.modifiers.new("dec","DECIMATE"); dm.ratio=float(os.environ.get("RATIO","0.09")); dm.use_collapse_triangulate=True
with bpy.context.temp_override(object=ch): bpy.ops.object.modifier_move_to_index(modifier="dec",index=0)
bpy.ops.object.modifier_apply(modifier="dec")
me=ch.data
img=[n for n in ch.active_material.node_tree.nodes if n.type=='TEX_IMAGE'][0].image
W_,H_=img.size; px=np.array(img.pixels[:],dtype=np.float32).reshape(H_,W_,4)
uv=me.uv_layers.active.data
gi={g.index:key.get(g.name,g.name) for g in ch.vertex_groups}
def wsum(v,pred): return sum(g.weight for g in v.groups if pred(gi[g.group]))
handv=np.array([wsum(v,lambda n:"Hand" in n)>0.5 for v in me.vertices])
headv=np.array([wsum(v,lambda n:n in("mixamorig:Head","mixamorig:Neck"))>0.5 for v in me.vertices])
footv=np.array([wsum(v,lambda n:"Foot" in n or "Toe" in n)>0.5 for v in me.vertices])
upperv=np.array([wsum(v,lambda n:n in("mixamorig:Head","mixamorig:Neck","mixamorig:Spine2","mixamorig:LeftShoulder","mixamorig:RightShoulder"))>0.5 for v in me.vertices])
lab=np.zeros(len(me.polygons),int)  # 0 hijab 1 outfit 2 skin 3 shoes
for p in me.polygons:
    u=np.mean([uv[i].uv[:] for i in p.loop_indices],0)
    c=px[int((u[1]%1)*(H_-1)),int((u[0]%1)*(W_-1)),:3]; h,s_,v=colorsys.rgb_to_hsv(*c)
    vs=list(p.vertices)
    teal=0.35<h<0.65 and s_>0.12
    printd=v<0.28 and upperv[vs].mean()>0.5          # the hijab's dark print; the blouse is light
    if (teal or printd) and not handv[vs].any(): lab[p.index]=0
    elif handv[vs].mean()>0.5: lab[p.index]=2
    elif headv[vs].mean()>0.5 and 0.02<h<0.13 and s_>0.25 and v>0.35: lab[p.index]=2
    elif footv[vs].mean()>0.5: lab[p.index]=3
    else: lab[p.index]=1
# majority filter over neighbours, a few passes
ek={}
for p in me.polygons:
    for k in p.edge_keys: ek.setdefault(k,[]).append(p.index)
nb=[[] for _ in me.polygons]
for fs in ek.values():
    for a in fs:
        nb[a]+= [b for b in fs if b!=a]
def islands(lab):
    seen=np.zeros(len(lab),bool); out=[]
    for i in range(len(lab)):
        if seen[i]: continue
        st=[i]; comp=[]; seen[i]=True
        while st:
            x=st.pop(); comp.append(x)
            for y in nb[x]:
                if not seen[y] and lab[y]==lab[i]: seen[y]=True; st.append(y)
        out.append(comp)
    return out
MINI=int(os.environ.get("MINISL","400"))
for it in range(4):
    # small islands of one label take the label around them (specks of blouse in the hijab, and the reverse)
    for comp in islands(lab):
        if len(comp)<MINI:
            cs=set(comp); ring=[y for x in comp for y in nb[x] if y not in cs]
            if ring: lab[comp]=np.bincount(lab[ring],minlength=4).argmax()
    # then smooth the boundaries
    for _ in range(3):
        new_=lab.copy()
        for i,ns in enumerate(nb):
            if ns:
                c=np.bincount(lab[ns],minlength=4)
                if c.max()>len(ns)*0.5: new_[i]=c.argmax()
        lab=new_
me.materials.clear()
for nm in ("Hijab","Outfit","Skin","Shoes"): me.materials.append(bpy.data.materials.get(nm) or bpy.data.materials.new(nm))
me.polygons.foreach_set("material_index",lab.astype(np.int32))
for p in me.polygons: p.use_smooth=True
print("MESH verts",len(me.vertices),"faces",len(me.polygons),"labels",np.bincount(lab,minlength=4).tolist())
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='MATERIAL'); bpy.ops.object.mode_set(mode='OBJECT')
for o in [o for o in D if o.parent==A and o.type=='MESH']:
    o.name="Human."+o.active_material.name; print("PART",o.name,len(o.data.vertices))
sc.frame_set(90)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
