# label faces hijab / top / trousers / skin / shoes from texture colour + body region, smooth, assign material slots
import bpy, sys, numpy as np, colorsys
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
ch=bpy.data.objects["Char"]; me=ch.data
d=np.load(sys.argv[-2].replace('.blend','.npz')); col=d['col']; cen=d['cen']
HJ,TOP,TR,SK,SH=0,1,2,3,4
n=len(col); lab=np.full(n,-1)
x,y,z=cen[:,0],cen[:,1],cen[:,2]
hsv=np.array([colorsys.rgb_to_hsv(*c) for c in col]); h,s,v=hsv.T
green=(h>0.12)&(h<0.4)&(s>0.15)&(v<0.5)
skin=(h<0.11)&(s>0.2)&(v>0.45)
pale=(s<0.15)&(v>0.6)
grey=(s<0.12)&(v>0.3)&(v<=0.6)
hand=(abs(x)>0.22)&(z<0.87)&(z>0.6)
face=(abs(x)<0.075)&(y<-0.08)&(z>1.28)&(z<1.48)
lab[green]=TR; lab[pale]=TOP; lab[grey&(z>1.12)]=HJ; lab[grey&(z<=1.12)&(z>0.75)]=TOP
lab[skin&(hand|face)]=SK
# hijab hem: a smooth height per angle round the neck, fitted to grey vs pale faces
th=np.arctan2(x,y+0.05); NB=24; bins=((th+np.pi)/(2*np.pi)*NB).astype(int)%NB
zb=np.zeros(NB)
for b in range(NB):
    m=(bins==b)&(z>0.95)&(z<1.4)&(abs(x)<0.22)&(grey|pale)
    zs=z[m]; g=grey[m]
    best=(1e9,1.17)
    for t in np.arange(1.0,1.32,0.005):
        err=np.sum(g&(zs<t))+np.sum(~g&(zs>=t))
        if err<best[0]: best=(err,t)
    zb[b]=best[1]
for _ in range(3): zb=(np.roll(zb,1)+2*zb+np.roll(zb,-1))/4
print("HEM",zb.round(3).tolist())
zt=np.interp((th+np.pi)/(2*np.pi)*NB-0.5,np.arange(-1,NB+1),np.r_[zb[-1],zb,zb[0]])
hj=(z>=zt)&~face
lab[hj]=HJ; lab[(z<zt)&(z>0.9)&(lab==HJ)]=TOP
face_skin=face&(skin|(v<0.35))
lab[(z<0.42)&(z>0.1)]=TR
lab[(z<=0.1)&(v>0.55)]=SH; lab[(z<=0.1)&green]=TR
lab[face_skin]=SK; lab[hand&skin]=SK
lab[~hand&~face&(lab==SK)]=-1
# adjacency via shared edges
ek={}
for p in me.polygons:
    for k in p.edge_keys: ek.setdefault(k,[]).append(p.index)
nb=[[] for _ in range(n)]
for fs in ek.values():
    for a in fs:
        for b in fs:
            if a!=b: nb[a].append(b)
fixed=hj|face_skin|(z<0.42)
for it in range(8):
    new=lab.copy()
    for i in range(n):
        if not nb[i]: continue
        c=np.bincount([lab[j] for j in nb[i] if lab[j]>=0]+([lab[i]] if lab[i]>=0 else []),minlength=5)
        if c.sum()==0: continue
        if lab[i]<0 or c[lab[i]]*2 < c.sum()- c[lab[i]]+0: new[i]=c.argmax()
    new[fixed]=lab[fixed]; lab=new
lab[lab<0]=TOP
names=["Hijab","Top","Trousers","Skin","Shoes"]
me.materials.clear()
for nm in names: me.materials.append(bpy.data.materials.get(nm) or bpy.data.materials.new(nm))
me.polygons.foreach_set("material_index",lab.astype(np.int32))
lab[(lab==SH)&(z>0.15)]=TR
# hidden-surface removal: faces no ray can reach from outside are inner layers of the scan
import bmesh, time
from mathutils import Vector
from mathutils.bvhtree import BVHTree
t0=time.time()
bm=bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
bvh=BVHTree.FromBMesh(bm)
rng=np.random.default_rng(0); dirs=rng.normal(size=(int(__import__('os').environ.get('NDIR','40')),3)); dirs/=np.linalg.norm(dirs,axis=1,keepdims=True)
dirs=[Vector(d) for d in dirs]
hidden=[]
for f in bm.faces:
    c=f.calc_center_median(); vis=False
    for d in dirs:
        hit=bvh.ray_cast(c+d*0.002,d)
        if hit[0] is None: vis=True; break
    if not vis: hidden.append(f.index)
bm.free()
print("HIDDEN",len(hidden),"of",n,"in %.0fs"%(time.time()-t0))
print("LABELS",dict(zip(names,np.bincount(lab,minlength=5).tolist())))
bm=bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
bmesh.ops.delete(bm,geom=[bm.faces[i] for i in hidden],context='FACES_ONLY')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
# cut the mesh exactly along the hijab hem, so the colour edge is a clean curve instead of a sawtooth of triangles
def hemf(co):
    t=np.arctan2(co.x,co.y+0.05)
    return co.z-np.interp((t+np.pi)/(2*np.pi)*NB-0.5,np.arange(-1,NB+1),np.r_[zb[-1],zb,zb[0]])
def inreg(co): return 0.95<co.z<1.4 and (abs(co.x)<0.24 or (abs(co.x)<0.32 and co.z>1.08)) and not (abs(co.x)<0.075 and co.y<-0.08 and co.z>1.28)
fv={v:hemf(v.co) for v in bm.verts}
cuts=[]
for e in list(bm.edges):
    a,b=e.verts
    if inreg(a.co) and inreg(b.co) and fv[a]*fv[b]<0: cuts.append((e,a,fv[a]/(fv[a]-fv[b])))
newv=set()
for e,a,t in cuts:
    ne,nv=bmesh.utils.edge_split(e,a,t); newv.add(nv)
for f in list(bm.faces):
    vs=[v for v in f.verts if v in newv]
    if len(vs)==2 and not any(set(vs)<=set(ed.verts) for ed in f.edges):
        bmesh.ops.connect_verts(bm,verts=vs)
relab=0
for f in bm.faces:
    c=f.calc_center_median()
    if inreg(c) and f.material_index in (HJ,TOP):
        m=HJ if hemf(c)>0 else TOP
        if m!=f.material_index: f.material_index=m; relab+=1
print("HEMCUT edges",len(cuts),"relabelled",relab)
bm.to_mesh(me); bm.free()
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
