# Builds the study around the seated character, with a two-tone print look for art direction.
# Blender coords: z up, she faces -y. Seat ~0.32, hands ~0.65.
import bpy, bmesh, math, os, random
from mathutils import Vector, Euler
random.seed(4)
sc = bpy.context.scene
OUT = os.environ["OUT"]
for o in list(bpy.data.objects):
    if o.name in ("cam",): bpy.data.objects.remove(o)
room = bpy.data.collections.new("Room"); sc.collection.children.link(room)

INK, GREEN, BONE = (0.012, 0.03, 0.017, 1), (0.03, 0.09, 0.05, 1), (0.86, 0.81, 0.71, 1)
def toon(name, lit, shade, threshold=0.5):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; n = nt.nodes; l = nt.links; n.clear()
    out = n.new("ShaderNodeOutputMaterial"); dif = n.new("ShaderNodeBsdfDiffuse"); s2r = n.new("ShaderNodeShaderToRGB")
    ramp = n.new("ShaderNodeValToRGB"); ramp.color_ramp.interpolation = "CONSTANT"
    ramp.color_ramp.elements[0].color = shade; ramp.color_ramp.elements[1].position = threshold; ramp.color_ramp.elements[1].color = lit
    emi = n.new("ShaderNodeEmission")
    l.new(dif.outputs[0], s2r.inputs[0]); l.new(s2r.outputs[0], ramp.inputs[0]); l.new(ramp.outputs[0], emi.inputs[0]); l.new(emi.outputs[0], out.inputs[0])
    return m
M = {
    "bone": toon("bone", BONE, GREEN, 0.08),      # pale surfaces: bone in light, green in shadow
    "dark": toon("dark", GREEN, INK, 0.08),       # dark objects: green in light, ink in shadow
    "ink": toon("ink", INK, INK),
    "screen": toon("screen", INK, INK),
}
def link(o, mat, col=room):
    col.objects.link(o); o.data.materials.clear(); o.data.materials.append(M[mat]); return o
def box(name, size, loc, mat="bone", bevel=0.004, rot=(0, 0, 0)):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1); 
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); o.location = loc; o.rotation_euler = rot
    if bevel: b = o.modifiers.new("b", "BEVEL"); b.width = bevel; b.segments = 2; b.limit_method = "ANGLE"
    return link(o, mat)
def cyl(name, r, h, loc, mat="bone", rot=(0, 0, 0), verts=32, bevel=0.002, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=h)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); o.location = loc; o.rotation_euler = rot
    if bevel: b = o.modifiers.new("b", "BEVEL"); b.width = bevel; b.segments = 2; b.limit_method = "ANGLE"
    for p in me.polygons: p.use_smooth = True
    return link(o, mat)

# shell: floor, back wall, left wall with a window
box("floor", (6, 6, 0.02), (0, -0.5, -0.01), bevel=0)
WALL_Y, WALL_X = -1.32, -1.25
box("wall_back", (5, 0.06, 3), (0.6, WALL_Y - 0.03, 1.5), bevel=0)
# left wall, window opening x=WALL_X, y in [-1.25,-0.05], z in [0.85,2.15]
wy0, wy1, wz0, wz1 = -0.75, 0.85, 0.8, 2.1
box("wall_l_low", (0.06, 5, wz0), (WALL_X, 0.5, wz0 / 2), bevel=0)
box("wall_l_high", (0.06, 5, 3 - wz1), (WALL_X, 0.5, (3 + wz1) / 2), bevel=0)
box("wall_l_a", (0.06, wy0 - (WALL_Y - 0.06), wz1 - wz0), (WALL_X, (wy0 + WALL_Y - 0.06) / 2, (wz0 + wz1) / 2), bevel=0)
box("wall_l_b", (0.06, 3 - wy1, wz1 - wz0), (WALL_X, (wy1 + 3) / 2, (wz0 + wz1) / 2), bevel=0)
# window frame and mullions
for z in (wz0, wz1, (wz0 + wz1) / 2 + 0.15):
    box("frame_h", (0.09, wy1 - wy0, 0.04), (WALL_X, (wy0 + wy1) / 2, z), "dark")
for y in (wy0, wy1, (wy0 + wy1) / 2):
    box("frame_v", (0.09, 0.04, wz1 - wz0), (WALL_X, y, (wz0 + wz1) / 2), "dark")
box("sill", (0.22, wy1 - wy0 + 0.1, 0.03), (WALL_X + 0.06, (wy0 + wy1) / 2, wz0 - 0.015))
box("wall_r", (0.06, 5, 3), (1.7, 0.5, 1.5), bevel=0)
box("wall_front", (5, 0.06, 3), (0.2, 2.6, 1.5), bevel=0)
# skyline outside
for i in range(26):
    w = random.uniform(0.25, 0.7); h = random.uniform(0.6, 2.6); d = random.uniform(4, 7)
    box("bldg", (0.3, w, h), (WALL_X - d, random.uniform(-3.5, 2.5), h / 2 + 0.3), "bone" if d > 5.5 else "dark", bevel=0)

sky = bpy.data.materials.new("sky"); sky.use_nodes = True
e = sky.node_tree.nodes.new("ShaderNodeEmission"); e.inputs[0].default_value = BONE
sky.node_tree.links.new(e.outputs[0], sky.node_tree.nodes["Material Output"].inputs[0])
sp = box("skyplane", (0.05, 14, 8), (WALL_X - 8, -0.5, 3), bevel=0); sp.data.materials[0] = sky
sp.visible_shadow = False
# desk: top on a black steel frame
DZ = 0.61; DX0, DX1, DY0, DY1 = -0.62, 0.95, -0.36, -1.06
box("desk_top", (DX1 - DX0, DY0 - DY1, 0.03), ((DX0 + DX1) / 2, (DY0 + DY1) / 2, DZ - 0.015), bevel=0.006)
for x in (DX0 + 0.06, DX1 - 0.06):
    box("desk_leg", (0.04, 0.6, 0.04), (x, (DY0 + DY1) / 2, 0.02), "ink")
    box("desk_post", (0.04, 0.04, DZ - 0.07), (x, (DY0 + DY1) / 2, (DZ - 0.03) / 2 + 0.02), "ink")
    box("desk_rail", (0.04, 0.6, 0.03), (x, (DY0 + DY1) / 2, DZ - 0.045), "ink")
box("desk_beam", (DX1 - DX0 - 0.12, 0.04, 0.05), ((DX0 + DX1) / 2, DY1 + 0.1, DZ - 0.06), "ink")

# monitor
MX, MY = 0.1, -0.9
box("mon_base", (0.24, 0.17, 0.012), (MX, MY - 0.02, DZ + 0.006), "dark")
box("mon_neck", (0.05, 0.025, 0.2), (MX, MY - 0.06, DZ + 0.11), "dark", rot=(math.radians(-8), 0, 0))
box("mon_body", (0.66, 0.03, 0.39), (MX, MY + 0.0, DZ + 0.36), "dark", bevel=0.008, rot=(math.radians(-6), 0, 0))
box("mon_screen", (0.63, 0.004, 0.36), (MX, MY + 0.017, DZ + 0.362), "screen", bevel=0, rot=(math.radians(-6), 0, 0))
# keyboard with keys
KX, KY = 0.08, -0.5
box("kb", (0.36, 0.13, 0.014), (KX, KY, DZ + 0.007), "dark", bevel=0.003, rot=(math.radians(3), 0, 0))
for r in range(5):
    for c in range(14):
        w = 0.019 if not (r == 4 and 4 <= c <= 9) else 0
        if r == 4 and c == 4: box("space", (0.12, 0.018, 0.008), (KX - 0.36 / 2 + 0.024 * 7.5, KY - 0.05 + r * 0.024, DZ + 0.017), "bone", bevel=0.002)
        if w: box("key", (w, 0.019, 0.008), (KX - 0.36 / 2 + 0.024 * (c + 0.75), KY + 0.05 - r * 0.024, DZ + 0.017), "bone", bevel=0.002)
box("mouse", (0.06, 0.1, 0.03), (0.36, -0.52, DZ + 0.015), "bone", bevel=0.014)
box("pad", (0.24, 0.2, 0.003), (0.37, -0.53, DZ + 0.0015), "dark", bevel=0.001)
# mug
cyl("mug", 0.04, 0.095, (-0.3, -0.56, DZ + 0.048), "bone", bevel=0.003)
cyl("coffee", 0.036, 0.002, (-0.3, -0.56, DZ + 0.088), "ink", bevel=0)
bpy.ops.mesh.primitive_torus_add(major_radius=0.026, minor_radius=0.007, location=(-0.3 + 0.045, -0.56, DZ + 0.05), rotation=(math.radians(90), 0, 0))
h = bpy.context.active_object; [c.objects.unlink(h) for c in list(h.users_collection)]; link(h, "bone")
# notebook, pen, papers
box("notebook", (0.2, 0.27, 0.012), (0.62, -0.62, DZ + 0.006), "bone", rot=(0, 0, math.radians(-12)))
box("nb_cover", (0.2, 0.27, 0.002), (0.62, -0.62, DZ + 0.013), "dark", rot=(0, 0, math.radians(-12)))
cyl("pen", 0.004, 0.14, (0.55, -0.48, DZ + 0.005), "ink", rot=(0, math.radians(90), math.radians(30)), verts=12, bevel=0)
for i in range(4):
    box("paper", (0.21, 0.297, 0.001), (-0.28 + i * 0.012, -0.82 + i * 0.01, DZ + 0.001 + i * 0.001), "bone", bevel=0, rot=(0, 0, math.radians(8 - i * 6)))
# books
for i, (w, t) in enumerate([(0.24, 0.035), (0.22, 0.03), (0.26, 0.045), (0.2, 0.025)]):
    box("book", (w, 0.17, t), (0.75, -0.93, DZ + sum(x[1] for x in [(0.24, 0.035), (0.22, 0.03), (0.26, 0.045), (0.2, 0.025)][:i]) + t / 2),
        "dark" if i % 2 else "bone", rot=(0, 0, math.radians(random.uniform(-10, 10))))
# arm lamp
LX, LY = -0.48, -0.92
cyl("lamp_base", 0.075, 0.025, (LX, LY, DZ + 0.0125), "ink")
a1 = Vector((LX, LY, DZ + 0.02)); a2 = a1 + Vector((0.05, 0.1, 0.42)); a3 = a2 + Vector((-0.04, 0.26, -0.06))  # head over the board, clear of the monitor
for p, q in ((a1, a2), (a2, a3)):
    d = q - p; o = cyl("lamp_arm", 0.009, d.length, (p + q) / 2, "ink", verts=12, bevel=0)
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
cyl("lamp_joint", 0.018, 0.03, a2, "ink", rot=(0, math.radians(90), 0), verts=16)
head = cyl("lamp_head", 0.04, 0.13, a3 + Vector((0, 0.03, -0.05)), "ink", r2=0.085, verts=32)
head.rotation_euler = Vector((0.05, 0.3, -1)).to_track_quat("Z", "Y").to_euler()
# shelf with upright books and a pin board on the back wall
box("shelf", (0.9, 0.22, 0.025), (0.55, WALL_Y + 0.11, 1.45))
x = 0.15
for i in range(14):
    w = random.uniform(0.02, 0.04); hgt = random.uniform(0.18, 0.26)
    box("spine", (w, 0.17, hgt), (x, WALL_Y + 0.11, 1.4625 + hgt / 2), "dark" if i % 3 else "bone", rot=(0, math.radians(random.choice([0, 0, 0, 8])), 0)); x += w + 0.004
box("pinboard", (0.7, 0.02, 0.48), (-0.25, WALL_Y + 0.01, 1.18), "dark")
for i in range(6):
    box("note", (0.15, 0.003, 0.2), (-0.5 + (i % 3) * 0.24 + random.uniform(-0.02, 0.02), WALL_Y + 0.023, 1.07 + (i // 3) * 0.23), "bone", bevel=0,
        rot=(0, math.radians(random.uniform(-6, 6)), 0))
# bin and stool-like side cabinet
cyl("bin", 0.12, 0.3, (-0.85, -0.85, 0.15), "dark", r2=0.14, verts=40)

# office chair under her: seat top ~0.33
CX, CY = 0.02, 0.0
box("seat", (0.48, 0.46, 0.07), (CX, CY + 0.02, 0.3), "dark", bevel=0.025)
box("back", (0.44, 0.06, 0.46), (CX, CY + 0.27, 0.62), "dark", bevel=0.025, rot=(math.radians(-8), 0, 0))
box("back_strut", (0.05, 0.03, 0.3), (CX, CY + 0.27, 0.36), "ink")
cyl("gas", 0.022, 0.2, (CX, CY + 0.02, 0.16), "ink", verts=16)
for k in range(5):
    a = k * 2 * math.pi / 5; d = Vector((math.sin(a), math.cos(a), 0))
    o = box("leg", (0.04, 0.3, 0.03), Vector((CX, CY + 0.02, 0.06)) + d * 0.15, "ink", rot=(0, 0, -a))
    cyl("caster", 0.022, 0.025, Vector((CX, CY + 0.02, 0.022)) + d * 0.29, "ink", rot=(0, math.radians(90), -a), verts=16)

# character materials
for o in bpy.data.objects:
    if o.name.startswith("Human.") and o.type == "MESH":
        o.data.materials.clear(); o.data.materials.append(M["dark" if any(k in o.name for k in ("pants", "flats")) else "bone"])
hij = bpy.data.objects.get("Hijab")
if hij: hij.data.materials.clear(); hij.data.materials.append(M["bone"])

# sun through the window: crisp shadows
sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN")); sc.collection.objects.link(sun)
sun.data.energy = 4; sun.data.angle = math.radians(0.4)
sun.rotation_euler = Vector((1.0, -0.38, -0.68)).to_track_quat("-Z", "Y").to_euler()
sc.world = sc.world or bpy.data.worlds.new("W"); sc.world.use_nodes = True
bg = sc.world.node_tree.nodes.get("Background"); bg.inputs[1].default_value = 0.0

sc.render.engine = "BLENDER_EEVEE"
ee = sc.eevee
for attr, val in (("shadow_ray_count", 2), ("shadow_step_count", 12), ("use_shadows", True), ("taa_render_samples", 32)):
    if hasattr(ee, attr): setattr(ee, attr, val)
sc.view_settings.view_transform = "Standard"
sc.render.use_freestyle = True
fs = sc.view_layers[0].freestyle_settings
ls = fs.linesets[0] if fs.linesets else fs.linesets.new("L")
ls.select_by_visibility = True; ls.select_crease = True; ls.select_silhouette = True; ls.select_border = True; ls.select_external_contour = True
fs.crease_angle = math.radians(118)
ls.linestyle.color = INK[:3]; ls.linestyle.thickness = 1.1
sc.render.resolution_x, sc.render.resolution_y = 1600, 1000
sc.frame_set(90)

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
def shot(name, loc, target, lens):
    cam.location = loc; cam.data.lens = lens
    cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = os.path.join(OUT, f"room-{name}.png"); bpy.ops.render.render(write_still=True)
shot("wide", (1.6, 1.7, 1.75), (0.0, -0.6, 0.75), 32)
shot("shoulder", (0.55, 0.55, 1.35), (0.05, -0.7, 0.75), 35)
shot("side", (-0.9, -0.2, 1.15), (0.15, -0.5, 0.8), 32)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "study.blend"))
print("ROOM_DONE")
