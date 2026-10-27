# Desk props, after 1_build:
#  - removes the stack of blank books; the site draws titled ones in their place (src/components/scene/Books.tsx)
#  - removes the mug and the arm lamp; the site draws finer ones (src/components/scene/Desk.tsx)
#  - moves the mouse and its pad under her right hand. The room put them on her left, but the typing clip rests her
#    right hand at about (-0.2, -0.44) between bursts at the keys, so that is where the mouse belongs. Her palm sits
#    at desk height, so 4_mouse.py lifts the hand onto it.
import bpy, bmesh, sys
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
DZ = 0.61
CUTS = [((0.56, -1.08, DZ + 0.002), (0.94, -0.78, DZ + 0.2)),     # books
        ((-0.19, -0.76, DZ - 0.001), (-0.035, -0.64, DZ + 0.1)),    # mug, handle included
        ((-0.58, -1.02, DZ - 0.001), (-0.34, -0.40, DZ + 0.52))]    # lamp
inside = lambda p: any(all(lo[i] <= p[i] <= hi[i] for i in range(3)) for lo, hi in CUTS)
TIP = 0.55
# (name, mesh, old centre, new centre, xyz scale)
MOVE = [("mouse", "room_bone", (0.36, -0.52), (-0.19, -0.488), (1.08, 1.15, 1.0)),
        ("pad", "room_dark", (0.37, -0.53), (-0.2, -0.44), (0.82, 0.85, 1.0))]

# the joined room mesh is a soup of loose faces, so a prop is every face inside its box; the keyboard's right end
# reaches into the pad's box, so faces that sit wholly in that sliver are skipped
BOX = {"mouse": ((0.32, -0.58, DZ - 0.002), (0.40, -0.46, DZ + 0.035)), "pad": ((0.245, -0.64, DZ - 0.002), (0.495, -0.42, DZ + 0.0045))}
inbox = lambda p, lo, hi: all(lo[i] <= p[i] <= hi[i] for i in range(3))
for name in ("room_bone", "room_dark", "room_ink"):
    o = bpy.data.objects[name]; mw = o.matrix_world; mi = mw.inverted()
    bm = bmesh.new(); bm.from_mesh(o.data)
    gone = [f for f in bm.faces if all(inside(mw @ v.co) for v in f.verts)]
    bmesh.ops.delete(bm, geom=gone, context="FACES")
    print("CUT", name, len(gone))
    for label, mesh, old, new, s in MOVE:
        if mesh != name: continue
        lo, hi = BOX[label]
        faces = [f for f in bm.faces if all(inbox(mw @ v.co, lo, hi) for v in f.verts)
                 and not all(0.253 <= (mw @ v.co).x <= 0.265 for v in f.verts)]
        verts = {v for f in faces for v in f.verts}
        for v in verts:
            w = mw @ v.co
            sz = s[2]
            if label == "mouse":
                # a mouse slopes down to its buttons: full height under the palm, TIP of it at the front
                t = min(max((old[1] - w.y) / 0.05 + 0.5, 0), 1)   # 0 at the back, 1 at the front
                sz *= 1 - (1 - TIP) * t * t
            v.co = mi @ Vector((new[0] + (w.x - old[0]) * s[0], new[1] + (w.y - old[1]) * s[1], DZ + (w.z - DZ) * sz))
        print("MOVED", label, len(faces))
    bm.to_mesh(o.data); bm.free()
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
