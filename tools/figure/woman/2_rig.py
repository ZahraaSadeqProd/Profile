# Fit the rig to her standing pose instead of warping her to the rig: record the typing clip as absolute bone poses,
# move the arm bones onto her arms (keeping bone lengths), re-key the clip against that rest, then skin her.
# Her clasped hands are fused together and to the dress; they are cut off at the wrist and replaced with the hands of the
# previous build's body, which are already shaped for typing.
import bpy, bmesh, sys, os, colorsys, numpy as np
from mathutils import Matrix, Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc=bpy.context.scene; D=bpy.data.objects; rig=D["Human.rig"]; ch=D["Char"]; body=D["Human.female_generic"]
act=rig.animation_data.action; f0,f1=map(int,act.frame_range)
def ss(e0,e1,x): t=np.clip((x-e0)/(e1-e0),0,1); return t*t*(3-2*t)
def nrm(v): v=np.asarray(v,float); return v/np.linalg.norm(v)
def rot(a,b):
    a,b=nrm(a),nrm(b); v=np.cross(a,b); c=a@b
    K=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]); return np.eye(3)+K+K@K/(1+c)
# 1. the clip as armature-space matrices
order=[]
def walk(b): order.append(b.name); [walk(c) for c in b.children]
for b in rig.data.bones:
    if b.parent is None: walk(b)
M={}
for f in range(f0,f1+1):
    sc.frame_set(f); M[f]={n:rig.pose.bones[n].matrix.copy() for n in order}
rig.data.pose_position='REST'; sc.frame_set(f0); bpy.context.view_layer.update()
# 2. her joints (measured on the ortho views) and the new rest for each arm
# elbow and wrist centres, measured from the forearms' front surface (a forearm is ~4 cm deep)
J={"Left":[(0.227,0.000,0.965),(0.130,-0.165,0.880)],"Right":[(-0.220,-0.060,0.990),(-0.010,-0.175,0.935)]}
env=os.environ.get("JOINTS")
if env: J=eval(env)
bpy.context.view_layer.objects.active=rig; bpy.ops.object.mode_set(mode='EDIT')
eb=rig.data.edit_bones
for b in eb: b.use_connect=False
T={}; SEG={}
for side,(E,Wr) in J.items():
    a=eb[f"mixamorig:{side}Arm"]; fa=eb[f"mixamorig:{side}ForeArm"]
    sh=np.array(a.head[:]); E=np.array(E); Wr=np.array(Wr)
    Ra=rot(np.array(a.tail[:])-sh,E-sh); A0=np.array(a.matrix); F0=np.array(fa.matrix)
    A1=np.eye(4); A1[:3,:3]=Ra@A0[:3,:3]; A1[:3,3]=sh
    newE=sh+Ra@(np.array(a.tail[:])-sh)
    Rf=rot(Ra@(np.array(fa.tail[:])-np.array(fa.head[:])),Wr-E)
    F1=np.eye(4); F1[:3,:3]=Rf@Ra@F0[:3,:3]; F1[:3,3]=newE
    Tf=F1@np.linalg.inv(F0)   # rigid move of everything below the elbow
    a.matrix=Matrix(A1.tolist()); fa.matrix=Matrix(F1.tolist())
    for b in eb:
        if b.name.startswith(f"mixamorig:{side}Hand"):
            b.matrix=Matrix((Tf@np.array(b.matrix)).tolist())
    T[side]=Tf
    SEG[side]=(sh,newE,np.array(fa.tail[:]))
    print("ARM",side,"shoulder",sh.round(3),"elbow",newE.round(3),"wrist",np.array(fa.tail[:]).round(3),"(her wrist",Wr,")")
bpy.ops.object.mode_set(mode='OBJECT')
# 3. re-key the clip against the new rest
bones=rig.data.bones; new=bpy.data.actions.new("Animation2"); rig.animation_data.action=new
for pb in rig.pose.bones: pb.rotation_mode='QUATERNION'
for f in range(f0,f1+1):
    for n in order:
        b=bones[n]; Mf=M[f][n]
        if b.parent is None: basis=b.matrix_local.inverted()@Mf
        else: basis=(b.parent.matrix_local.inverted()@b.matrix_local).inverted()@M[f][b.parent.name].inverted()@Mf
        pb=rig.pose.bones[n]; l,r,_=basis.decompose(); pb.location=l; pb.rotation_quaternion=r
        pb.keyframe_insert("rotation_quaternion",frame=f); pb.keyframe_insert("location",frame=f)
bpy.data.actions.remove(act); new.name="Animation"
# 4. her mesh: labels, hands off
me=ch.data; P=np.array([v.co[:] for v in me.vertices]); n=len(P)
img=[nd for nd in ch.active_material.node_tree.nodes if nd.type=='TEX_IMAGE'][0].image
W_,H_=img.size; px=np.array(img.pixels[:],dtype=np.float32).reshape(H_,W_,4)
uv=me.uv_layers.active.data; vc=np.zeros((n,3)); cnt=np.zeros(n)
for l in me.loops:
    u=uv[l.index].uv; vc[l.vertex_index]+=px[int((u[1]%1)*(H_-1)),int((u[0]%1)*(W_-1)),:3]; cnt[l.vertex_index]+=1
vc/=np.maximum(cnt,1)[:,None]
hsv=np.array([colorsys.rgb_to_hsv(*c) for c in vc])
skin=(hsv[:,0]<0.12)&(hsv[:,1]>0.18)&(hsv[:,2]>0.30)
x,y,z=P.T
face=skin&(z>1.30)&(y<-0.04)&(np.abs(x)<0.09)
# thin sheets on the back are the hijab's tail panel
from mathutils.bvhtree import BVHTree
bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table(); bm.normal_update()
bvh=BVHTree.FromBMesh(bm)
thin=np.zeros(n,bool)
for v in bm.verts:
    if v.co.y>0.04 and 0.45<v.co.z<1.25 and abs(v.co.x)<0.2:
        h=bvh.ray_cast(v.co-v.normal*0.001,-v.normal,0.03)
        thin[v.index]=h[0] is not None
hijab=((z>float(os.environ.get("HEM","1.22")))&~face)|thin
lab=np.where(hijab,0,np.where(face,2,1))
me.materials.clear()
for nm in ("Hijab","Abaya","Skin"): me.materials.append(bpy.data.materials.get(nm) or bpy.data.materials.new(nm))
bm.faces.ensure_lookup_table()
for f in bm.faces:
    ls=[lab[v.index] for v in f.verts]; f.material_index=max(set(ls),key=ls.count); f.smooth=True
bid=bm.verts.layers.int.new("oid")
for v in bm.verts: v[bid]=v.index+1   # indices go stale after a delete; 0 marks verts the wrist cut adds
# her clasped hands come off at a clean plane across each wrist, so the sleeve keeps a whole, round cuff
CUFF=float(os.environ.get("CUFF","0.0")); TAILZ=float(os.environ.get("TAILZ","0.86"))
ARMS=[]
for side in J:
    # the cuff ends just past the hand bone's wrist (her right forearm is longer than the bone it rides on)
    herE=np.array(J[side][0]); dh=nrm(np.array(J[side][1])-herE); sh_,E_,Wr_=SEG[side]
    herW=herE+dh*min(np.linalg.norm(np.array(J[side][1])-herE),np.linalg.norm(Wr_-E_)+0.02); ARMS.append((herE,herW,dh))
    near=[f for f in bm.faces if (Vector(herW)-f.calc_center_median()).length<0.09]
    geom=list(set(near)|{e for f in near for e in f.edges}|{v for f in near for v in f.verts})
    bmesh.ops.bisect_plane(bm,geom=geom,plane_co=Vector(herW-dh*CUFF),plane_no=Vector(dh))
def sleeve(p):  # inside a forearm, short of the wrist plane
    for herE,herW,dh in ARMS:
        q=p-herE; al=q@dh
        if -0.02<al<=(herW-herE)@dh-CUFF+1e-5 and np.linalg.norm(q-al*dh)<0.065: return True
    return False
def gone(v):
    p=np.array(v.co[:]); i=v[bid]-1
    if i>=0 and thin[i] and p[2]<TAILZ: return True   # seated, the tail would hang through the chair seat
    for herE,herW,dh in ARMS:
        q=p-herE; al=q@dh
        if al>(herW-herE)@dh-CUFF+1e-5 and np.linalg.norm(q-al*dh)<0.09: return True
    return p[1]<-0.135 and 0.80<p[2]<0.97 and abs(p[0])<0.17 and not sleeve(p)   # the fingers fused to the dress
cutv={v for v in bm.verts if gone(v)}
dead=[f for f in bm.faces if any(v in cutv for v in f.verts)]
bmesh.ops.delete(bm,geom=dead,context='FACES_ONLY')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
oidx=np.array([v[bid]-1 for v in bm.verts]); bm.to_mesh(me); bm.free()
print("LABEL face",int(face.sum()),"hijab",int(hijab.sum()),"tail",int(thin.sum()),"cut verts",len(cutv),"cuff verts",int((oidx<0).sum()))
P=np.array([v.co[:] for v in me.vertices]); n=len(P); x,y,z=P.T
new_=oidx<0; oidx[new_]=0
thin=thin[oidx]&~new_; lab=np.where(new_,1,lab[oidx]); keep=np.arange(n)
# 5. weights: smooth bands along the spine and down the skirt (the old body's weights alternate between bones across
#    the wide dress and shred it); her own arm segments for the arms
names=[g.name for g in body.vertex_groups if g.name.startswith("mixamorig:")]; G=len(names); ix={nm:i for i,nm in enumerate(names)}
for nm in names: ch.vertex_groups.new(name=nm)
Wt=np.zeros((n,G))
def bone_z(nm): return (rig.matrix_world@rig.data.bones[nm].head_local).z
spine=["mixamorig:Hips","mixamorig:Spine","mixamorig:Spine1","mixamorig:Spine2","mixamorig:Neck","mixamorig:Head"]
zs=[bone_z(b) for b in spine]
# piecewise-linear "hat" weights between bone heads along z
for k,b in enumerate(spine):
    lo=zs[k-1] if k>0 else -9; hi=zs[k+1] if k+1<len(spine) else 9
    up=np.clip((z-lo)/(zs[k]-lo),0,1) if k>0 else np.ones(n)
    dn=np.clip((hi-z)/(hi-zs[k]),0,1) if k+1<len(spine) else np.ones(n)
    Wt[:,ix[b]]=np.where(z<zs[k],up,dn)
# shoulders lift with the clavicles
for side,s_ in (("Left",1),("Right",-1)):
    sw=ss(0.06,0.14,s_*x)*ss(1.12,1.2,z)*(1-ss(1.3,1.36,z))
    Wt[:,ix[f"mixamorig:{side}Shoulder"]]=sw  # blended in below
hipz=bone_z("mixamorig:Hips"); kneez=bone_z("mixamorig:LeftLeg")
leg=1-ss(hipz-0.13,hipz+0.02,z)          # 1 below the hip line
shin=ss(kneez+0.06,kneez-0.06,z)          # 1 below the knee
side=ss(-0.07,0.07,x)                      # 1 = left leg
for nm,w in (("LeftUpLeg",side*(1-shin)),("RightUpLeg",(1-side)*(1-shin)),("LeftLeg",side*shin),("RightLeg",(1-side)*shin)):
    Wt[:,ix["mixamorig:"+nm]]=leg*w
Wt[:,[ix[b] for b in spine]]*=(1-leg)[:,None]
for side_,s_ in (("Left",1),("Right",-1)):
    c=ix[f"mixamorig:{side_}Shoulder"]; sw=Wt[:,c].copy()
    others=[j for j in range(G) if j!=c]; Wt[:,others]*=(1-sw)[:,None]
isarm=np.array(["Arm" in nm or "Hand" in nm for nm in names])
Wt[:,isarm]=0
def segdist(p,a,b):
    d=b-a; t=np.clip(((p-a)@d)/(d@d),0,1); return np.linalg.norm(a+t[:,None]*d-p,axis=1),t
AW=np.zeros(n); AWsplit={}
for side,(sh,E,Wr) in SEG.items():
    s=1 if side=="Left" else -1
    herE=np.array(J[side][0]); herW=np.array(J[side][1])
    du,tu=segdist(P,sh,herE); dfo,tf=segdist(P,herE,herW)
    dd=np.minimum(du,dfo)
    # the forearms rest against the dress: a tighter reach there keeps the belly off them
    w=np.where(dfo<du,ss(float(os.environ.get("FOREOUT","0.06")),float(os.environ.get("FOREIN","0.047")),dfo),ss(0.075,0.05,du))
    w=w*ss(-0.02,0.03,s*x)*(1-ss(1.18,1.26,z))*~thin
    # upper arm near the shoulder blends into the shoulder
    w*=np.where(du<dfo,ss(0.0,0.25,tu),1.0)
    fore=ss(-0.03,0.03,(P-herE)@nrm(nrm(herE-sh)+nrm(herW-herE)))
    AW=np.maximum(AW,w); AWsplit[side]=(w,fore)
Wb=Wt.copy(); sm=Wb.sum(1,keepdims=True); Wb/=np.where(sm>1e-6,sm,1)
Wn=Wb*(1-AW[:,None])
for side,(w,fore) in AWsplit.items():
    m=w>=AW-1e-9
    Wn[m,ix[f"mixamorig:{side}Arm"]]+=(AW*(1-fore))[m]; Wn[m,ix[f"mixamorig:{side}ForeArm"]]+=(AW*fore)[m]
# the hijab's tail hangs from the upper back
tail=thin|((y>0.08)&(z<1.25)&(z>0.45)&(np.abs(x)<0.17)&(lab==0))
Wn[tail]=0; Wn[tail,ix["mixamorig:Spine2"]]=1
empty=Wn.sum(1)<1e-6; Wn[empty,ix["mixamorig:Spine1"]]=1
E_=np.array([e.vertices[:] for e in me.edges]); deg=np.bincount(E_.ravel(),minlength=n).astype(float)
for _ in range(int(os.environ.get("WSMOOTH","6"))):
    acc=np.zeros_like(Wn); np.add.at(acc,E_[:,0],Wn[E_[:,1]]); np.add.at(acc,E_[:,1],Wn[E_[:,0]])
    Wn=0.5*Wn+0.5*acc/np.maximum(deg,1)[:,None]
Wn/=Wn.sum(1,keepdims=True)
for g in list(ch.vertex_groups): ch.vertex_groups.remove(g)
for j,nm in enumerate(names):
    idx=np.nonzero(Wn[:,j]>1e-4)[0]
    if len(idx)==0: continue
    vg=ch.vertex_groups.new(name=nm)
    for i in idx: vg.add([int(i)],float(Wn[i,j]),'REPLACE')
# web group: where arm and body were fused, relaxed during the bake
web=1-np.abs(2*AW-1)
vg=ch.vertex_groups.new(name="web")
for i in np.nonzero(web>0.05)[0]: vg.add([int(i)],float(web[i]),'REPLACE')
print("WEIGHTS arm verts",int((AW>0.5).sum()),"web",int((web>0.05).sum()))
# the forearms were fused to the front of the dress: cut that seam so they lift off it cleanly instead of pulling strips
bm=bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
lo_,hi_=float(os.environ.get("SEAMLO","0.25")),float(os.environ.get("SEAMHI","0.75"))
seam=[f for f in bm.faces if min(AW[v.index] for v in f.verts)<lo_ and max(AW[v.index] for v in f.verts)>hi_
      and f.calc_center_median().y<-0.06 and f.calc_center_median().z<1.02]
bmesh.ops.delete(bm,geom=seam,context='FACES_ONLY')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
bm.to_mesh(me); bm.free()
print("SEAM faces cut",len(seam))
# 6. hands from the old body, carried with the forearm
dg=bpy.context.evaluated_depsgraph_get()
bn=[g.name for g in body.vertex_groups]
BW=np.zeros((len(body.data.vertices),len(bn)))
for v in body.data.vertices:
    for ge in v.groups: BW[v.index,ge.group]=ge.weight
BP=np.array([v.co[:] for v in body.data.vertices])
hm=bmesh.new(); hm.from_mesh(body.data); hm.verts.ensure_lookup_table()
keepv=np.zeros(len(BP),bool); sidev=np.zeros(len(BP),int)
for side in ("Left","Right"):
    hcol=[i for i,nm in enumerate(bn) if nm.startswith(f"mixamorig:{side}Hand")]
    fcol=bn.index(f"mixamorig:{side}ForeArm")
    rw=np.array(rig.data.bones[f"mixamorig:{side}Hand"].head_local[:])  # new rest; T^-1 takes it back to the old body
    wr0=np.linalg.inv(T[side])@np.r_[rw,1]
    m=(BW[:,hcol].sum(1)>0.3)|((BW[:,fcol]>0.3)&(np.linalg.norm(BP-wr0[:3],axis=1)<float(os.environ.get("STUB","0.07"))))
    keepv|=m; sidev[m]=1 if side=="Left" else -1
oid=hm.verts.layers.int.new("oid")
for v in hm.verts: v[oid]=v.index
hm.faces.ensure_lookup_table()
bmesh.ops.delete(hm,geom=[f for f in hm.faces if not all(keepv[v.index] for v in f.verts)],context='FACES_ONLY')
bmesh.ops.delete(hm,geom=[v for v in hm.verts if not v.link_faces],context='VERTS')
hidx=np.array([v[oid] for v in hm.verts])
for v in hm.verts:
    side="Left" if sidev[v[oid]]>0 else "Right"
    v.co=Vector((T[side]@np.r_[np.array(v.co[:]),1])[:3])
dl=hm.verts.layers.deform.active
if dl: hm.verts.layers.deform.remove(dl)  # the body's group indices mean nothing on the new object
hme=bpy.data.meshes.new("Hands"); hm.to_mesh(hme); hm.free()
ho=bpy.data.objects.new("Hands",hme); sc.collection.objects.link(ho)
hme.materials.append(bpy.data.materials["Skin"])
for p in hme.polygons: p.use_smooth=True
for j,nm in enumerate(bn):
    col=BW[hidx,j]
    if nm.startswith("mixamorig:") and ("Hand" in nm or "ForeArm" in nm) and col.max()>1e-4:
        vg=ho.vertex_groups.new(name=nm)
        for k in np.nonzero(col>1e-4)[0]: vg.add([int(k)],float(col[k]),'REPLACE')
print("HANDS verts",len(hme.vertices))
# 7. bind, split by garment, clear the old figure
for o in [o for o in D if o.parent==rig and o.type=='MESH']: D.remove(o)
for o in (ch,ho):
    o.parent=rig; am=o.modifiers.new("Armature","ARMATURE"); am.object=rig
bpy.ops.object.select_all(action='DESELECT'); ch.select_set(True); bpy.context.view_layer.objects.active=ch
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='MATERIAL'); bpy.ops.object.mode_set(mode='OBJECT')
for o in [o for o in D if o.parent==rig and o.type=='MESH' and o!=ho]:
    o.name="Human."+o.active_material.name; print("PART",o.name,len(o.data.vertices))
ho.name="Human.Hands"
rig.data.pose_position='POSE'
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
