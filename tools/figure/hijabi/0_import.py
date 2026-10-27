# Imports the rig source (the previous study.glb: room, MPFB rig and the typing clip) and saves it as a .blend.
import bpy, sys
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=""+__import__("os").environ.get("RIG","rig_source.glb")+"")
for o in bpy.data.objects:
    print("OBJ", o.name, o.type, o.parent.name if o.parent else None, [round(x,3) for x in o.location], [round(x,3) for x in o.rotation_euler], [round(x,3) for x in o.scale], len(o.data.vertices) if o.type=='MESH' else '', [m.name for m in o.modifiers] if o.type=='MESH' else '')
print("ACTIONS",[ (a.name, a.frame_range[:]) for a in bpy.data.actions])
rig=[o for o in bpy.data.objects if o.type=='ARMATURE'][0]
for b in rig.data.bones: print("BONE", b.name, [round(x,3) for x in (rig.matrix_world@b.head_local)])
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
