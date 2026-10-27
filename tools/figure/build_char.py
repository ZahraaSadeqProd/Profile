import bpy, os, math, sys
from mathutils import Vector
from bl_ext.blender_org.mpfb.services import HumanService, TargetService, LocationService
D = LocationService.get_user_data()
OUT = os.environ.get("OUT", "/tmp")
for o in list(bpy.data.objects): bpy.data.objects.remove(o)

macro = TargetService.get_default_macro_info_dict()
macro.update(gender=0.0, age=0.47, muscle=0.42, weight=0.45, proportions=0.7, height=0.45, cupsize=0.4, firmness=0.5)
macro["race"] = {"asian": 0.2, "caucasian": 0.6, "african": 0.2}
base = HumanService.create_human(macro_detail_dict=macro, scale=0.1)
HumanService.add_builtin_rig(base, "mixamo")
P = lambda *p: os.path.join(D, *p)
HumanService.add_mhclo_asset(P("proxymeshes/female_generic/female_generic.proxy"), base, asset_type="Proxymeshes", subdiv_levels=0, material_type="NONE")
HumanService.add_mhclo_asset(P("eyes/low-poly/low-poly.mhclo"), base, asset_type="Eyes", subdiv_levels=0, material_type="NONE")
for c in ["toigo_fisherman_sweater", "toigo_wool_pants", "toigo_flats"]:
    HumanService.add_mhclo_asset(P("clothes", c, c + ".mhclo"), base, asset_type="Clothes", subdiv_levels=0, material_type="NONE")
base.hide_render = True; base.hide_set(True)
for o in bpy.data.objects: print("OBJ", o.name, o.type, len(o.data.vertices) if o.type == "MESH" else "")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "char.blend"))

# preview renders
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"; sc.display.shading.light = "STUDIO"; sc.display.shading.color_type = "SINGLE"
sc.display.shading.single_color = (0.8, 0.8, 0.8); sc.display.shading.show_cavity = True; sc.display.shading.show_shadows = True
sc.render.resolution_x, sc.render.resolution_y = 700, 1000; sc.render.film_transparent = False
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = "ORTHO"; cam.data.ortho_scale = 2.0
for name, ang in [("front", 0), ("side", 90), ("back", 180)]:
    a = math.radians(ang); cam.location = (4 * math.sin(a), -4 * math.cos(a), 0.85)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = os.path.join(OUT, f"char-{name}.png"); bpy.ops.render.render(write_still=True)
