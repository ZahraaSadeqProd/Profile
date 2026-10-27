# clean, scale and align the character to the rig's rest pose space, decimate, sample face colours
import bpy, bmesh, sys, numpy as np, os
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
ch=bpy.data.objects["Char"]
bm=bmesh.new(); bm.from_mesh(ch.data); bm.verts.ensure_lookup_table()
seen=set(); kill=[]
for v in bm.verts:
    if v.index in seen: continue
    st=[v]; comp=[]; seen.add(v.index)
    while st:
        x=st.pop(); comp.append(x)
        for e in x.link_edges:
            y=e.other_vert(x)
            if y.index not in seen: seen.add(y.index); st.append(y)
    if len(comp)<1000: kill+=comp
bmesh.ops.delete(bm,geom=kill,context='VERTS')
S=1.552/1.904
zmin=min(v.co.z for v in bm.verts)
for v in bm.verts: v.co.x*=S; v.co.y=v.co.y*S-0.08; v.co.z=(v.co.z-zmin)*S
bm.to_mesh(ch.data); bm.free()
r=float(os.environ.get("RATIO","0.08"))
m=ch.modifiers.new("dec","DECIMATE"); m.ratio=r
bpy.context.view_layer.objects.active=ch; bpy.ops.object.modifier_apply(modifier="dec")
me=ch.data
img=[n for n in ch.active_material.node_tree.nodes if n.type=='TEX_IMAGE' and 'baseColor' in n.image.name][0].image
W,H=img.size; px=np.array(img.pixels[:],dtype=np.float32).reshape(H,W,4)
uv=me.uv_layers.active.data
nf=len(me.polygons); col=np.zeros((nf,3)); cen=np.zeros((nf,3))
for p in me.polygons:
    u=np.mean([uv[i].uv[:] for i in p.loop_indices],0)
    x=int((u[0]%1)*(W-1)); y=int((u[1]%1)*(H-1)); col[p.index]=px[y,x,:3]; cen[p.index]=p.center[:]
print("DEC verts",len(me.vertices),"faces",nf)
np.savez(sys.argv[-1].replace('.blend','.npz'),col=col,cen=cen)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
