# warp the arms onto the rig's rest pose, transfer skin weights from the old body, bind, split by garment
import bpy, bmesh, sys, os, numpy as np
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
D=bpy.data.objects; rig=D["Human.rig"]; rig.data.pose_position='REST'
ch=D["Char"]; me=ch.data
P=np.array([v.co[:] for v in me.vertices]); n=len(P)
def bj(name): return np.array((rig.matrix_world@rig.data.bones[name].head_local)[:])
def ss(e0,e1,x): t=np.clip((x-e0)/(e1-e0),0,1); return t*t*(3-2*t)
def nrm(v): return v/np.linalg.norm(v)
def rot(a,b):  # minimal rotation matrix taking unit a to unit b
    a,b=nrm(a),nrm(b); v=np.cross(a,b); c=a@b
    K=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]); return np.eye(3)+K+K@K/(1+c)
CJ=[np.array(p) for p in [(0.125,-0.07,1.22),(0.205,-0.08,1.005),(0.272,-0.09,0.81),(0.34,-0.10,0.70)]]
zk=[0.60,0.70,0.74,0.78,0.82,0.86,0.90,0.94,1.10,1.22,1.40]; bk=[0.26,0.26,0.25,0.24,0.215,0.196,0.177,0.17,0.16,0.105,0.105]
AW=np.zeros(n); NP=P.copy()
hjv=np.zeros(n,bool)
for f in me.polygons:
    if f.material_index==0: hjv[list(f.vertices)]=True
for sgn,side in ((1,"Left"),(-1,"Right")):
    m=np.array([sgn,1,1])
    C=[c*m for c in CJ]
    B=[bj(f"mixamorig:{side}Arm"),bj(f"mixamorig:{side}ForeArm"),bj(f"mixamorig:{side}Hand"),bj(f"mixamorig:{side}HandMiddle3")]
    segs=[]
    for i in range(3):
        R=rot(C[i+1]-C[i],B[i+1]-B[i]); s=np.linalg.norm(B[i+1]-B[i])/np.linalg.norm(C[i+1]-C[i])
        segs.append((C[i],B[i],R,s))
    X=P*1.0
    aw=ss(-0.015,0.015,sgn*X[:,0]-np.interp(X[:,2],zk,bk))*(1-ss(1.24,1.30,X[:,2]))*(sgn*X[:,0]>0)
    T=[b+s*((X-c)@R.T) for c,b,R,s in segs]
    du,df,dh=[nrm(C[i+1]-C[i]) for i in range(3)]
    we=ss(-0.03,0.03,(X-C[1])@nrm(du+df)); ww=ss(-0.02,0.02,(X-C[2])@nrm(df+dh))
    arm=(1-we)[:,None]*T[0]+we[:,None]*((1-ww)[:,None]*T[1]+ww[:,None]*T[2])
    aw=aw*~hjv; NP=NP+aw[:,None]*(arm-P); AW=np.maximum(AW,aw)
# faces stretched by the warp are where sleeve and tunic were fused: drop them
bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
bad=[]
for f in bm.faces:
    for e in f.edges:
        a,b=e.verts[0].index,e.verts[1].index
        l0=np.linalg.norm(P[a]-P[b]); l1=np.linalg.norm(NP[a]-NP[b])
        if l1>6*l0+0.02: bad.append(f); break
    else:
        # the scan fuses sleeve and side below the armpit; cut that seam so they move apart
        a=[AW[v.index] for v in f.verts]
        if max(a)>0.5 and min(a)<0.5 and f.calc_center_median().z<float(os.environ.get("CUTZ","-1")): bad.append(f)
for v in bm.verts: v.co=Vector(NP[v.index])
bmesh.ops.delete(bm,geom=bad,context='FACES_ONLY')
loose=[v for v in bm.verts if not v.link_faces]
bmesh.ops.delete(bm,geom=loose,context='VERTS')
keep=np.array([v.index for v in bm.verts])
bm.to_mesh(me); bm.free()
AW=AW[keep]
print("WARP stretched faces removed",len(bad),"verts",len(me.vertices))
# skin weights from the old body
body=D["Human.female_generic"]
for g in body.vertex_groups: ch.vertex_groups.new(name=g.name)
dt=ch.modifiers.new("dt","DATA_TRANSFER"); dt.object=body; dt.use_vert_data=True; dt.data_types_verts={'VGROUP_WEIGHTS'}
dt.vert_mapping='POLYINTERP_NEAREST'; dt.layers_vgroup_select_src='ALL'; dt.layers_vgroup_select_dst='NAME'
bpy.context.view_layer.objects.active=ch; bpy.ops.object.modifier_apply(modifier="dt")
names=[g.name for g in ch.vertex_groups]; G=len(names)
Wt=np.zeros((len(me.vertices),G))
for v in me.vertices:
    for ge in v.groups: Wt[v.index,ge.group]=ge.weight
Q=np.array([v.co[:] for v in me.vertices])
isarm=np.array(["Arm" in nm or "Hand" in nm for nm in names])
isL=np.array([nm.startswith("mixamorig:Left") for nm in names]); isR=np.array([nm.startswith("mixamorig:Right") for nm in names])
isleg=np.array([any(k in nm for k in ("UpLeg","Leg","Foot","Toe")) for nm in names])&~isarm
tors=AW<0.5; armv=~tors
Wt[np.ix_(Q[:,0]>0,isR&isarm)]=0; Wt[np.ix_(Q[:,0]<0,isL&isarm)]=0
Wa=Wt*(isarm|np.array(["Shoulder" in nm for nm in names])); Wb=Wt*~isarm
for X in (Wa,Wb):
    sm=X.sum(1,keepdims=True); X/=np.where(sm>1e-6,sm,1)
ea=Wa.sum(1)<1e-6; eb=Wb.sum(1)<1e-6
a=AW[:,None]*1.0; a[ea]=0; a[eb]=1
Wt=a*Wa+(1-a)*Wb
low=tors&(Q[:,2]<0.85)
Wt[np.ix_(low&(Q[:,0]>0.02),isR&isleg)]=0; Wt[np.ix_(armv,isleg)]=0; Wt[np.ix_(low&(Q[:,0]<-0.02),isL&isleg)]=0
sm=Wt.sum(1); z=sm<1e-6
print("WEIGHTS empty",int(z.sum()))
# empty after filtering: nearest allowed bone segment
segH=np.array([(rig.matrix_world@rig.data.bones[nm].head_local)[:] if nm in rig.data.bones else (0,0,0) for nm in names])
segT=np.array([(rig.matrix_world@rig.data.bones[nm].tail_local)[:] if nm in rig.data.bones else (0,0,0) for nm in names])
def segd(p):
    d=segT-segH; t=np.clip(((p-segH)*d).sum(1)/np.maximum((d*d).sum(1),1e-9),0,1)
    return np.linalg.norm(segH+t[:,None]*d-p,axis=1)
fing=np.array([any(k in nm for k in ("Index","Middle","Ring","Pinky","Thumb")) for nm in names])
for i in np.nonzero(z)[0]:
    p=Q[i]; dd=segd(p)
    if armv[i]: ok=isarm&~fing&(isL if p[0]>0 else isR)
    else:
        ok=~isarm&~fing
        if p[2]<0.85: ok&=~(isR&isleg) if p[0]>0.02 else (~(isL&isleg) if p[0]<-0.02 else ok)
    dd[~ok]=1e9; Wt[i,int(dd.argmin())]=1
Wt/=Wt.sum(1,keepdims=True)
# smooth the weights over the surface: sharp weight steps are what fold the cloth into shards
hjm=np.zeros(len(Q),bool)
for f in me.polygons:
    if f.material_index==0: hjm[list(f.vertices)]=True
E=np.array([e.vertices[:] for e in me.edges])
deg=np.bincount(E.ravel(),minlength=len(Q)).astype(float)
for _ in range(int(os.environ.get("WSMOOTH","8"))):
    acc=np.zeros_like(Wt); np.add.at(acc,E[:,0],Wt[E[:,1]]); np.add.at(acc,E[:,1],Wt[E[:,0]])
    Wt=0.5*Wt+0.5*acc/np.maximum(deg,1)[:,None]
Wt[np.ix_(hjm,isarm)]=0
Wt[np.ix_(Q[:,0]>0,isR&isarm)]=0; Wt[np.ix_(Q[:,0]<0,isL&isarm)]=0
Wt[np.ix_(low&(Q[:,0]>0.02),isR&isleg)]=0; Wt[np.ix_(low&(Q[:,0]<-0.02),isL&isleg)]=0
Wt/=Wt.sum(1,keepdims=True)
# the top below the waist: the back hangs from the hips, only the front lies on the lap
topv=np.zeros(len(Q),bool)
for f in me.polygons:
    if f.material_index==1: topv[list(f.vertices)]=True
hips=names.index("mixamorig:Hips")
bw=ss(-0.09,0.0,Q[:,1])*(Q[:,2]<0.92)*topv*tors*ss(0.92,0.80,Q[:,2])
oh=np.zeros(G); oh[hips]=1
Wt=bw[:,None]*oh+(1-bw[:,None])*Wt
for g in list(ch.vertex_groups): ch.vertex_groups.remove(g)
for j,nm in enumerate(names):
    vg=ch.vertex_groups.new(name=nm); idx=np.nonzero(Wt[:,j]>1e-4)[0]
    for i in idx: vg.add([int(i)],float(Wt[i,j]),'REPLACE')
# the band where sleeve and side were fused: the bake relaxes it into one drape
web=1-np.abs(2*np.clip(AW,0,1)-1)
for _ in range(int(os.environ.get('WEBD','3'))):
    acc=np.zeros(len(web)); np.add.at(acc,E[:,0],web[E[:,1]]); np.add.at(acc,E[:,1],web[E[:,0]])
    web=np.maximum(web,0.85*acc/np.maximum(deg,1))
web=np.clip(web*1.3,0,1)*(1-0.7*(AW>0.85))*(Q[:,2]<1.16)*(~hjm)
vg=ch.vertex_groups.new(name="web")
for i in np.nonzero(web>0.02)[0]: vg.add([int(i)],float(web[i]),'REPLACE')
print("WEB verts",int((web>0.02).sum()))
for nm in [o.name for o in D if o.parent==rig and o.type=='MESH' and o!=ch]: D.remove(D[nm])
ch.parent=rig; am=ch.modifiers.new("Armature","ARMATURE"); am.object=rig
bpy.ops.object.select_all(action='DESELECT'); ch.select_set(True); bpy.context.view_layer.objects.active=ch
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='MATERIAL'); bpy.ops.object.mode_set(mode='OBJECT')
for o in [o for o in D if o.parent==rig and o.type=='MESH']:
    o.name="Human."+o.active_material.name
    o.data.materials.clear(); o.data.materials.append(bpy.data.materials[o.name[6:]])
    print("PART",o.name,len(o.data.vertices))
rig.data.pose_position='POSE'
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
