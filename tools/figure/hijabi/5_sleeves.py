# Replace the scan's sleeves with proper sweater sleeves. The scan's upper sleeve is fused to the side of the top
# and has no underside, so it webs when the arm comes forward. Each sleeve becomes a closed tube from inside the
# shoulder cap to a ribbed cuff at the wrist, sized from the scan's own sleeve, skinned smoothly along the arm.
# The patch on the side where the sleeve was fused is filled. Runs on the rest pose, between 4_skin and 5_seat.
import bpy, bmesh, sys, os, math, numpy as np
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2])
D = bpy.data.objects; rig = D["Human.rig"]; rig.data.pose_position = 'REST'
top = D["Human.Top"]; me = top.data
names = [g.name for g in top.vertex_groups]
P = np.array([v.co[:] for v in me.vertices])
W = np.zeros((len(P), len(names)))
for v in me.vertices:
    for ge in v.groups: W[v.index, ge.group] = ge.weight
def bj(n, tail=False):
    b = rig.data.bones[n]; return np.array((rig.matrix_world @ (b.tail_local if tail else b.head_local))[:])
def ss(e0, e1, x): t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)
def nrm(v): return v / np.linalg.norm(v)
CAP = float(os.environ.get("CAP", "0.015"))  # keep this much of the scan's sleeve below the shoulder joint

def path(side):
    return [bj(f"mixamorig:{side}Arm"), bj(f"mixamorig:{side}ForeArm"), bj(f"mixamorig:{side}Hand")]

def project(X, pts):
    """arc length along the polyline and distance to it, for each point"""
    best_d = np.full(len(X), 1e9); best_s = np.zeros(len(X)); acc = 0.0
    for a, b in zip(pts[:-1], pts[1:]):
        d = b - a; L = np.linalg.norm(d)
        t = np.clip(((X - a) @ d) / (L * L), 0, 1)
        dist = np.linalg.norm(a + t[:, None] * d - X, axis=1)
        m = dist < best_d; best_d[m] = dist[m]; best_s[m] = acc + t[m] * L
        acc += L
    return best_s, best_d, acc

kill = np.zeros(len(P), bool); prof = {}
for sgn, side in ((1, "Left"), (-1, "Right")):
    pts = path(side)
    armw = W[:, [i for i, n in enumerate(names) if n.startswith(f"mixamorig:{side}") and ("Arm" in n or "Hand" in n)]].sum(1)
    s, d, L = project(P, pts)
    sleeve = (armw > 0.5) & (sgn * P[:, 0] > 0.05)
    # radius profile of the scan's sleeve: the outer half is intact, so take a high percentile per 1 cm
    bins = np.arange(0, L + 0.01, 0.01); r = []
    for b0 in bins:
        m = sleeve & (abs(s - b0) < 0.015) & (d < 0.1)
        r.append(np.percentile(d[m], 80) if m.sum() > 8 else np.nan)
    r = np.array(r); ok = ~np.isnan(r); r = np.interp(bins, bins[ok], r[ok])
    for _ in range(4): r = np.convolve(np.r_[r[0], r, r[-1]], [0.25, 0.5, 0.25], 'valid')
    prof[side] = (bins, r, L)
    print("SLEEVE", side, "len %.3f" % L, "radius cm", np.round(r[::4] * 100, 1).tolist())
    # everything of the old sleeve, plus fused scraps near the arm that the new tube will replace
    kill |= (sleeve & (s > CAP)) | ((armw > 0.25) & (s > CAP) & (d < 0.08) & (sgn * P[:, 0] > 0.05))

# drop the scan sleeve, and the scraps of the side it was fused to (anything the arm still pulls on below the cap)
armany = W[:, [i for i, n in enumerate(names) if ("Arm" in n or "Hand" in n)]].sum(1)
side = (armany > float(os.environ.get("SIDEW", "0.04"))) & (P[:, 2] < float(os.environ.get("SIDEZ", "1.08"))) & (P[:, 2] > 0.7)
bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
dl = bm.verts.layers.deform.active
gone = [f for f in bm.faces if all(kill[v.index] for v in f.verts) or any(side[v.index] for v in f.verts)]
bmesh.ops.delete(bm, geom=gone, context='FACES_ONLY')
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
# drop crumbs: tiny islands left behind
bm.faces.ensure_lookup_table(); seenf = set(); crumbs = []
for f in bm.faces:
    if f in seenf: continue
    st = [f]; comp = []; seenf.add(f)
    while st:
        x = st.pop(); comp.append(x)
        for e in x.edges:
            for g in e.link_faces:
                if g not in seenf: seenf.add(g); st.append(g)
    if len(comp) < 80: crumbs += comp
bmesh.ops.delete(bm, geom=crumbs, context='FACES_ONLY')
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')

def loops_of(bm):
    out = []; seen = set()
    for e in [e for e in bm.edges if e.is_boundary]:
        if e in seen: continue
        lp = []; st = [e]; seen.add(e)
        while st:
            x = st.pop(); lp.append(x)
            for v in x.verts:
                for y in v.link_edges:
                    if y.is_boundary and y not in seen: seen.add(y); st.append(y)
        out.append(lp)
    return out

armgrp = {i for i, n in enumerate(names) if ("Arm" in n or "Hand" in n)}
filled = 0
for lp in loops_of(bm):
    ring = {v for e in lp for v in e.verts}
    c = np.mean([np.array(v.co[:]) for v in ring], 0)
    if not (0.07 < abs(c[0]) < 0.34 and 0.72 < c[2] < 1.22 and len(lp) > 5): continue
    res = bmesh.ops.holes_fill(bm, edges=lp, sides=0)
    nf = res["faces"]
    if not nf: continue
    nf = bmesh.ops.triangulate(bm, faces=nf)["faces"]
    # refine the patch so it can bend: split its inner edges twice
    for _ in range(2):
        inner = list({e for f in nf for e in f.edges if not (e.verts[0] in ring and e.verts[1] in ring)})
        if not inner: break
        r = bmesh.ops.subdivide_edges(bm, edges=inner, cuts=1, use_grid_fill=True)
        nf = list({f for v in r["geom_inner"] if isinstance(v, bmesh.types.BMVert) for f in v.link_faces})
        nf = bmesh.ops.triangulate(bm, faces=nf)["faces"]
    patch = list({v for f in nf for v in f.verts} - ring)
    # relax the new points into a smooth panel spanning the hole; weights follow, minus the arm
    for _ in range(60):
        newco = {}
        for v in patch:
            nb = [e.other_vert(v) for e in v.link_edges]
            newco[v] = sum((u.co for u in nb), Vector()) / len(nb)
        for v, co in newco.items(): v.co = co
    for _ in range(40):
        neww = {}
        for v in patch:
            acc = {}
            nb = [e.other_vert(v) for e in v.link_edges]
            for u in nb:
                for gi, w in u[dl].items():
                    if gi not in armgrp: acc[gi] = acc.get(gi, 0) + w / len(nb)
            neww[v] = acc
        for v, acc in neww.items():
            v[dl].clear()
            t = sum(acc.values()) or 1
            for gi, w in acc.items(): v[dl][gi] = w / t
    filled += 1
print("SLEEVE removed faces", len(gone), "crumbs", len(crumbs), "side patches", filled)
bm.to_mesh(me); bm.free()
if "web" in top.vertex_groups: top.vertex_groups.remove(top.vertex_groups["web"])

# the new sleeves
SEG = 28
def build(sgn, side):
    S, E, Wr = path(side); bins, r, L = prof[side]
    du, df = nrm(E - S), nrm(Wr - E)
    # centreline: from inside the cap to just past the wrist, sampled every 6 mm, the elbow rounded
    start = S - du * 0.03 + np.array([0, 0, -0.004]); end = Wr + df * 0.004
    raw = [start, S, E, Wr, end]
    cl = []
    for a, b in zip(raw[:-1], raw[1:]):
        n = max(2, int(np.linalg.norm(b - a) / 0.006))
        cl += [a + (b - a) * k / n for k in range(n)]
    cl.append(end); cl = np.array(cl)
    for _ in range(12):  # round the elbow bend
        cl[1:-1] = 0.5 * cl[1:-1] + 0.25 * (cl[:-2] + cl[2:])
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(cl, axis=0), axis=1))]
    s_arm = seg - 0.03  # arc length measured from the shoulder joint
    L1 = np.linalg.norm(E - S); Ltot = s_arm[-1]
    rad = np.interp(np.clip(s_arm, 0, L), bins, r)
    rad = np.clip(rad * float(os.environ.get('RSCALE', '0.68')), 0.03, float(os.environ.get('RMAX', '0.05')))
    # a slightly fuller upper arm, gentle bunching above a snug ribbed cuff
    cuff0 = Ltot - 0.035
    bunch = 1 + 0.07 * np.sin((s_arm - cuff0) / 0.022 * math.pi) * ss(cuff0 - 0.1, cuff0 - 0.03, s_arm) * (s_arm < cuff0)
    rad = rad * bunch
    rad = rad * (1 - ss(cuff0 - 0.01, cuff0 + 0.005, s_arm)) + 0.027 * ss(cuff0 - 0.01, cuff0 + 0.005, s_arm)
    # parallel-transport frames; the first normal points down the outside of the arm
    T = np.gradient(cl, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True)
    N0 = np.cross(T[0], [0, 1, 0]); N0 = nrm(N0) * (1 if N0[2] < 0 else -1)
    Ns = [N0]
    for i in range(1, len(cl)):
        n_ = Ns[-1] - T[i] * (Ns[-1] @ T[i]); Ns.append(nrm(n_))
    Ns = np.array(Ns); Bs = np.cross(T, Ns)
    verts = []; idx = []
    for i in range(len(cl)):
        ring = []
        for k in range(SEG):
            a = 2 * math.pi * k / SEG
            rib = 1 + (0.035 * math.cos(a * 14) if s_arm[i] > cuff0 + 0.004 else 0)  # knit rib on the cuff
            # cross-section a touch flattened front to back, like a sleeve hanging on an arm
            off = (Ns[i] * math.cos(a) * 1.0 + Bs[i] * math.sin(a) * 0.92) * rad[i] * rib
            ring.append(len(verts)); verts.append(cl[i] + off)
        idx.append(ring)
    faces = []
    for i in range(len(cl) - 1):
        for k in range(SEG):
            a, b = idx[i][k], idx[i][(k + 1) % SEG]; c, d = idx[i + 1][(k + 1) % SEG], idx[i + 1][k]
            faces.append((a, b, c, d) if sgn > 0 else (a, d, c, b))
    mesh = bpy.data.meshes.new(f"sleeve_{side}"); mesh.from_pydata([tuple(v) for v in verts], [], faces)
    ob = bpy.data.objects.new(f"sleeve_{side}", mesh); bpy.context.collection.objects.link(ob)
    # weights: shoulder into upper arm into forearm (wide blend at the elbow) into hand at the cuff
    sa = np.repeat(s_arm, SEG)
    w_sh = (1 - ss(-0.02, 0.05, sa)) * 0.5
    w_fa = ss(L1 - 0.05, L1 + 0.05, sa)
    w_hd = ss(Ltot - 0.02, Ltot + 0.005, sa) * 0.6
    w_ar = (1 - w_fa) * (1 - w_sh); w_fa = w_fa * (1 - w_hd)
    for nm, w in ((f"mixamorig:{side}Shoulder", w_sh), (f"mixamorig:{side}Arm", w_ar), (f"mixamorig:{side}ForeArm", w_fa), (f"mixamorig:{side}Hand", w_hd)):
        g = ob.vertex_groups.new(name=nm)
        for i in np.nonzero(w > 1e-3)[0]: g.add([int(i)], float(w[i]), 'REPLACE')
    for p in mesh.polygons: p.use_smooth = True
    return ob

# the sides of the top get smoothed in the seated bake (5_seat relaxes the "web" group), so they hang clean
nbase = len(me.vertices)
Q = np.array([v.co[:] for v in me.vertices])
sw = ss(0.09, 0.15, np.abs(Q[:, 0])) * ss(0.82, 0.9, Q[:, 2]) * (1 - ss(1.08, 1.16, Q[:, 2]))
g = top.vertex_groups.new(name="web")
for i in np.nonzero(sw > 0.02)[0]: g.add([int(i)], float(sw[i]), 'REPLACE')
print("SLEEVE side smoothing verts", int((sw > 0.02).sum()))
new = [build(1, "Left"), build(-1, "Right")]
for ob in new:
    ob.parent = rig; ob.data.materials.append(top.data.materials[0])
bpy.ops.object.select_all(action='DESELECT')
for ob in new: ob.select_set(True)
top.select_set(True); bpy.context.view_layer.objects.active = top
bpy.ops.object.join()
# normalise every vertex's weights after the join (the smoothing mask is not a bone)
webi = top.vertex_groups["web"].index
for v in me.vertices:
    t = sum(g.weight for g in v.groups if g.group != webi)
    if t > 0:
        for g in v.groups:
            if g.group != webi: g.weight /= t
print("SLEEVE top verts", len(me.vertices))
rig.data.pose_position = 'POSE'
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-1])
