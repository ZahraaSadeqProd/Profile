# Prepares study.blend for the web and exports study.glb (room + skinned character + typing clip).
import bpy, math, os
from mathutils import Vector
sc = bpy.context.scene
D = bpy.data.objects
# room for the circuit board (story prop added on the site) and the Z mark: move the mug inboard
for n in ("mug", "coffee"):
    for o in D:
        if o.name.split(".")[0] == n: o.location.x, o.location.y = -0.13, -0.7
for o in D:
    if o.name.startswith("Torus"): o.location.x, o.location.y = -0.13 + 0.045, -0.7
# screen as a UV'd plane so the site can map the loss-curve texture onto it
scr = D["mon_screen"]
bpy.ops.mesh.primitive_plane_add(size=1, location=scr.location, rotation=(math.radians(90 - 6), 0, math.radians(180)))
p = bpy.context.active_object; p.scale = (0.63, 0.36, 1); p.name = "screen"
p.location.y += 0.003
for c in list(p.users_collection): c.objects.unlink(p)
scr.users_collection[0].objects.link(p); p.data.materials.append(bpy.data.materials["screen"])
D.remove(scr)
for n in ("Human", "cam", "Sun", "skyplane"):
    if n in D: D.remove(D[n])
for o in list(D):
    if o.name.startswith("bldg") or o.name.startswith("Human.low-poly"): D.remove(o)  # skyline is drawn on the site; eyes are hidden by the hood
# one mesh per material for the static room (fewer draw calls); the character stays separate
room = [o for o in D if o.type == "MESH" and not o.name.startswith("Human.") and o.name not in ("Hijab", "screen")]
bpy.ops.object.select_all(action="DESELECT")
for o in room: o.select_set(True)
bpy.context.view_layer.objects.active = room[0]
names = [o.name for o in room]
bpy.ops.object.convert(target="MESH")
room = [D[n] for n in names]
def key(o):  # floor and walls apart from the furniture, so the site's point-cloud dissolve can weight them separately
    return "shell" if o.name.startswith(("floor", "wall", "sky")) else o.data.materials[0].name
for mat in {key(o) for o in room}:
    group = [o for o in room if key(o) == mat]
    bpy.ops.object.select_all(action="DESELECT")
    for o in group: o.select_set(True)
    bpy.context.view_layer.objects.active = group[0]
    keep = group[0].name
    if len(group) > 1: bpy.ops.object.join()
    D[keep].name = "room_" + mat
    room = [D[n] for n in [o.name for o in room if o.name in D]] if False else [o for o in D if o.type == "MESH" and not o.name.startswith(("Human.", "room_")) and o.name not in ("Hijab", "screen")]
rig = D["Human.rig"]
for a in list(bpy.data.actions):
    if a.name != "typing": bpy.data.actions.remove(a)
rig.animation_data.action = bpy.data.actions["typing"]
sc.frame_set(1)
bpy.ops.export_scene.gltf(filepath=os.environ["GLB"], export_format="GLB", export_apply=True, export_animations=True,
                          export_animation_mode="ACTIVE_ACTIONS", export_skins=True, export_morph=False, export_materials="EXPORT",
                          export_image_format="NONE", export_yup=True, export_cameras=False, export_lights=False, export_extras=False)
print("EXPORTED", len([o for o in D if o.type == "MESH"]))
