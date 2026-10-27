# Checks the mouse grip (after 4_mouse.py): how far her skin sinks below the mouse's sloped top at rest frames, and which
# bones carry the deepest vertices. `blender -b $S/g3.blend -P check_mouse.py`; a few mm at most is fine.
import bpy
from mathutils import Vector
sc=bpy.context.scene
rb=bpy.data.objects["room_bone"]; mw=rb.matrix_world
DZ=0.61
vs=[mw@v.co for v in rb.data.vertices]
vs=[v for v in vs if -0.26<v.x<-0.12 and -0.56<v.y<-0.41 and v.z<DZ+0.05]
lo=Vector((min(v.x for v in vs),min(v.y for v in vs),min(v.z for v in vs))); hi=Vector((max(v.x for v in vs),max(v.y for v in vs),max(v.z for v in vs)))
src=bpy.data.objects["Human.Skin"]
for f in (0,300):
    sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get()
    o=src.evaluated_get(dg); me=o.to_mesh()
    ins=[]; who={}
    for v in me.vertices:
        p=o.matrix_world@v.co
        t=min(max(-(p.y+0.488)/1.15/0.05+0.5,0),1); top=DZ+(hi.z-DZ)*(1-0.45*t*t)
        if lo.x<p.x<hi.x and lo.y<p.y<hi.y and lo.z<p.z<top:
            d=min(top-p.z, p.x-lo.x, hi.x-p.x, p.y-lo.y, hi.y-p.y); ins.append(d)
            sv=src.data.vertices[v.index]
            if sv.groups and d>0.003:
                g=max(sv.groups,key=lambda e:e.weight); n=src.vertex_groups[g.group].name.split(':')[-1].split('_')[0]
                who[n]=max(who.get(n,0),round(d,3))
    print("F",f,"inside",len(ins),"deepest",round(max(ins),4) if ins else 0, sorted(who.items(), key=lambda x:-x[1])[:8])
    o.to_mesh_clear()
