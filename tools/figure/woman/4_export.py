import bpy, sys
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
sc=bpy.context.scene; rig=bpy.data.objects["Human.rig"]
for o in [o for o in bpy.data.objects if o.type in ('CAMERA','LIGHT')]: bpy.data.objects.remove(o)
for a in list(bpy.data.actions):
    if a.name!="typing": bpy.data.actions.remove(a)
for o in bpy.data.objects:
    if o.type=='MESH':
        for m in o.data.materials:
            if m: m.use_nodes=False
sc.frame_set(0)
bpy.ops.export_scene.gltf(filepath=sys.argv[-1], export_format="GLB", export_apply=True, export_animations=True,
    export_animation_mode="ACTIVE_ACTIONS", export_skins=True, export_morph=False, export_materials="EXPORT",
    export_image_format="NONE", export_yup=True, export_cameras=False, export_lights=False, export_extras=False, export_texcoords=False)
print("EXPORTED",[o.name for o in bpy.data.objects if o.type=='MESH'])
