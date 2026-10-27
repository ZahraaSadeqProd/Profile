import * as THREE from "three";

// The monitor: an editor on the left, the model it trains on the right. Drawn in the site palette and kept out of
// the print pass (see DuotonePass), so it reads as a lit display in the shaded room.
const C = {
  bg: "#0b2118", panel: "#0f2a1f", rule: "#1d4231", gutter: "#3f6a52",
  text: "#e9e3d4", dim: "#7fa08a", key: "#b8e07a", str: "#d9c58f", num: "#9fd3b4", fn: "#f2efe6", com: "#557a63",
};

const CODE: [string, string][][] = [
  [["key", "import"], ["text", " torch"]],
  [["key", "from"], ["text", " torch "], ["key", "import"], ["text", " nn"]],
  [],
  [["key", "class"], ["fn", " Scorer"], ["text", "(nn.Module):"]],
  [["str", '    """Scores a product label against cited evidence."""']],
  [["key", "    def"], ["fn", " __init__"], ["text", "(self, vocab, dim="], ["num", "256"], ["text", ", heads="], ["num", "8"], ["text", "):"]],
  [["text", "        super().__init__()"]],
  [["text", "        self.embed = nn.Embedding(vocab, dim)"]],
  [["text", "        layer = nn.TransformerEncoderLayer(dim, heads, batch_first="], ["key", "True"], ["text", ")"]],
  [["text", "        self.encoder = nn.TransformerEncoder(layer, num_layers="], ["num", "4"], ["text", ")"]],
  [["text", "        self.head = nn.Linear(dim, "], ["num", "1"], ["text", ")"]],
  [],
  [["key", "    def"], ["fn", " forward"], ["text", "(self, tokens, mask):"]],
  [["text", "        x = self.encoder(self.embed(tokens), src_key_padding_mask=mask)"]],
  [["key", "        return"], ["text", " self.head(x[:, "], ["num", "0"], ["text", "]).squeeze("], ["num", "-1"], ["text", ")"]],
  [],
  [["com", "# train"]],
  [["key", "for"], ["text", " epoch "], ["key", "in"], ["text", " range(epochs):"]],
  [["key", "    for"], ["text", " batch "], ["key", "in"], ["text", " loader:"]],
  [["text", "        pred = model(batch.tokens, batch.mask)"]],
  [["text", "        loss = criterion(pred, batch.score)"]],
  [["text", "        loss.backward()"]],
  [["text", "        opt.step(); opt.zero_grad()"]],
  [["text", "    val = evaluate(model, val_loader)"]],
  [["text", "    log(epoch, loss.item(), val)"]],
];

// next/font hashes the family name; read it from the variable the page sets
const MONO = () => (getComputedStyle(document.querySelector(".app") ?? document.body).getPropertyValue("--font-mono").trim() || "ui-monospace") + ", Menlo, monospace";

function draw(g: CanvasRenderingContext2D, W: number, H: number) {
  const mono = `500 22px ${MONO()}`;
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  // title bar
  g.fillStyle = C.panel; g.fillRect(0, 0, W, 54);
  [C.gutter, C.gutter, C.gutter].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(30 + i * 26, 27, 8, 0, Math.PI * 2); g.fill(); });
  g.font = mono; g.fillStyle = C.dim; g.fillText("scorer — train.py", 120, 35);

  // ---------- left: editor ----------
  const L = W * 0.54;
  g.fillStyle = C.panel; g.fillRect(0, 54, L, 46);
  g.fillStyle = C.bg; g.fillRect(16, 60, 168, 40);
  g.fillStyle = C.key; g.fillRect(16, 60, 168, 3);
  g.fillStyle = C.text; g.fillText("train.py", 40, 88);
  g.fillStyle = C.dim; g.fillText("data.py", 220, 88); g.fillText("eval.py", 360, 88);
  const lh = 37, x0 = 86, y0 = 146;
  g.font = mono;
  CODE.forEach((line, i) => {
    const y = y0 + i * lh;
    if (i === 13) { g.fillStyle = "rgba(184,224,122,0.08)"; g.fillRect(0, y - 26, L, lh); }
    g.fillStyle = C.gutter; g.textAlign = "right"; g.fillText(String(i + 1), 58, y); g.textAlign = "left";
    let x = x0;
    for (const [k, t] of line) {
      g.fillStyle = C[k as keyof typeof C]; g.fillText(t, x, y); x += g.measureText(t).width;
    }
    if (i === 13) { g.fillStyle = C.key; g.fillRect(x + 4, y - 22, 3, 28); } // cursor
  });
  g.fillStyle = C.rule; g.fillRect(L, 54, 2, H - 54);

  // ---------- right: the model ----------
  const R0 = L + 40, RW = W - R0 - 36;
  g.fillStyle = C.dim; g.font = `600 20px ${MONO()}`;
  g.fillText("MODEL", R0, 104); g.fillText("ATTENTION · HEAD 3", R0, 560); g.fillText("LOSS", R0 + RW * 0.52, 560);

  // network: embedding → 4 encoder layers → head
  const cols = [6, 8, 8, 8, 8, 1], top = 140, bot = 500;
  const nodes = cols.map((n, ci) => Array.from({ length: n }, (_, k) => [
    R0 + 24 + (ci * (RW - 48)) / (cols.length - 1),
    n === 1 ? (top + bot) / 2 : top + ((k + 0.5) * (bot - top)) / n,
  ]));
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let ci = 0; ci < nodes.length - 1; ci++)
    for (const a of nodes[ci]) for (const b of nodes[ci + 1]) {
      const w = rnd();
      g.strokeStyle = w > 0.82 ? "rgba(184,224,122,0.75)" : `rgba(127,160,138,${0.08 + w * 0.18})`;
      g.lineWidth = w > 0.82 ? 2 : 1;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
  nodes.forEach((col, ci) => col.forEach(([x, y]) => {
    const hot = rnd() > 0.6 || ci === nodes.length - 1;
    g.fillStyle = hot ? C.key : C.panel; g.strokeStyle = hot ? C.key : C.gutter; g.lineWidth = 2;
    g.beginPath(); g.arc(x, y, ci === nodes.length - 1 ? 14 : 9, 0, Math.PI * 2); g.fill(); g.stroke();
  }));
  g.fillStyle = C.dim; g.font = `500 17px ${MONO()}`;
  ["embed", "enc 1", "enc 2", "enc 3", "enc 4", "score"].forEach((t, ci) => {
    g.textAlign = "center"; g.fillText(t, nodes[ci][0][0], bot + 34);
  });
  g.textAlign = "left";

  // attention map: a token-by-token grid with a bright diagonal band
  const n = 12, cell = Math.min((RW * 0.46) / n, (H - 610) / n), ax = R0, ay = 580;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = Math.max(0, 1 - Math.abs(i - j) / 3) * 0.75 + rnd() * 0.25 + (j === 0 ? 0.35 : 0);
    const a = Math.min(1, v);
    g.fillStyle = a > 0.7 ? C.key : a > 0.45 ? "#6f9a63" : a > 0.25 ? "#2f5a42" : "#163a2a";
    g.fillRect(ax + j * cell, ay + i * cell, cell - 2, cell - 2);
  }

  // loss curves: train and validation
  const lx = R0 + RW * 0.52, ly = ay, lw = RW * 0.48, lhh = n * cell;
  g.strokeStyle = C.rule; g.lineWidth = 1;
  for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(lx, ly + (k * lhh) / 4); g.lineTo(lx + lw, ly + (k * lhh) / 4); g.stroke(); }
  const curve = (k: number, wob: number, col: string, wdt: number) => {
    g.strokeStyle = col; g.lineWidth = wdt; g.beginPath();
    for (let s = 0; s <= 80; s++) {
      // falls from the top left towards the bottom right
      const t = s / 80, y = ly + 8 + (lhh - 16) * (1 - Math.exp(-k * t)) * 0.92 + Math.sin(s * 1.7) * wob * (1 - t);
      if (s === 0) g.moveTo(lx + t * lw, y); else g.lineTo(lx + t * lw, y);
    }
    g.stroke();
  };
  curve(4.2, 5, C.key, 4);
  curve(3.3, 3, C.str, 3);
  g.font = `500 16px ${MONO()}`;
  g.fillStyle = C.key; g.fillRect(lx, ly + lhh + 22, 22, 4); g.fillStyle = C.dim; g.fillText("train", lx + 30, ly + lhh + 30);
  g.fillStyle = C.str; g.fillRect(lx + 110, ly + lhh + 22, 22, 4); g.fillStyle = C.dim; g.fillText("val", lx + 140, ly + lhh + 30);
}

export function makeScreen() {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1170;
  const g = c.getContext("2d")!;
  draw(g, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  // redraw once the mono face has loaded, so the code is not in the fallback font
  document.fonts?.ready.then(() => { draw(g, c.width, c.height); tex.needsUpdate = true; });
  // a lit display: written straight to the frame with alpha 0.5, which tells the print pass to leave it alone
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: tex } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D map; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(map, vUv).rgb, 0.5); }",
    side: THREE.DoubleSide,
  });
}
