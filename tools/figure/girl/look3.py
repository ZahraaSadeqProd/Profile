# posed preview in the room: flat colours, several angles round the seated figure
import bpy, sys, math, os
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc=bpy.context.scene; sc.frame_set(int(os.environ.get("F","90")))
rig=bpy.data.objects["Human.rig"]
C={"Outfit":(0.80,0.74,0.74),"Abaya":(0.30,0.33,0.31),"Hands":(0.85,0.72,0.62),"Hijab":(0.12,0.30,0.21),"Top":(0.94,0.91,0.86),"Trousers":(0.06,0.18,0.12),"Skin":(0.85,0.72,0.62),"Shoes":(0.85,0.85,0.82)}
for m in bpy.data.materials:
    m.diffuse_color=(*C.get(m.name,(0.7,0.7,0.68)),1)
for o in bpy.data.objects:
    if o.name in ("room_shell","Icosphere","screen") or (os.environ.get("SOLO") and o.name.startswith("room")): o.hide_render=True
sc.render.engine='BLENDER_WORKBENCH'; sc.display.shading.light='STUDIO'; sc.display.shading.color_type='MATERIAL'
sc.display.shading.show_shadows=True; sc.display.shading.show_cavity=False
sc.render.resolution_x=640; sc.render.resolution_y=640
head=rig.matrix_world@rig.pose.bones[os.environ.get("BONE","mixamorig:Spine1")].head
tgt=head+Vector((0,0,0.0))
cam=bpy.data.objects.new('pc',bpy.data.cameras.new('pc')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=40
for i,a in enumerate(map(float,os.environ.get("ANG","150,180,215,30").split(","))):
    r=math.radians(a); cam.location=tgt+Vector((math.sin(r)*float(os.environ.get("DIST","1.9")),-math.cos(r)*float(os.environ.get("DIST","1.9")),0.75*float(os.environ.get("DIST","1.9"))/1.9)); cam.rotation_euler=(tgt-cam.location).to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=sys.argv[-1]+f'_{i}.png'; bpy.ops.render.render(write_still=True)
