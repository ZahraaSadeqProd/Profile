// Prints /resume to the two files job applications want, into public/:
//   Zahraa-Sadeq-Resume.pdf   tagged, text-based PDF with title/author/keywords set (Chrome print + pypdf)
//   Zahraa-Sadeq-Resume.docx  plain one-column Word file for applicant tracking systems (needs `zip`)
// Run with the dev server up:  PUPPETEER=/path/to/node_modules/puppeteer-core node tools/resume/build.mjs [http://localhost:3456]
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://localhost:3456";
const out = resolve("public");
const pkg = process.env.PUPPETEER ?? "puppeteer-core";
const { default: puppeteer } = await import(pkg.startsWith("/") ? pathToFileURL(join(pkg, "lib/esm/puppeteer/puppeteer-core.js")).href : pkg);

const META = {
  title: "Zahraa Sadeq – Résumé – AI/ML Engineer",
  author: "Zahraa Sadeq",
  subject: "Résumé: AI/ML engineer, LLM APIs, AI agents, RAG, Python, C++, AWS, Kubernetes",
  keywords: "Zahraa Sadeq, AI/ML Engineer, Machine Learning, LLM, AI agents, RAG, Python, C++, AWS, Kubernetes, Embedded systems, Resume",
};

const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
await page.goto(`${base}/resume`, { waitUntil: "networkidle0" });
await page.evaluateHandle("document.fonts.ready");

// PDF: the page's own print stylesheet does the layout
const pdf = join(out, "Zahraa-Sadeq-Resume.pdf");
await page.pdf({ path: pdf, format: "letter", printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
execFileSync("python3", ["-c", `
import sys, pypdf
r = pypdf.PdfReader(sys.argv[1]); w = pypdf.PdfWriter(clone_from=r)
w.add_metadata({"/Title": sys.argv[2], "/Author": sys.argv[3], "/Subject": sys.argv[4], "/Keywords": sys.argv[5], "/Creator": "zahraasadeq.dev"})
w.write(sys.argv[1])
`, pdf, META.title, META.author, META.subject, META.keywords]);

// DOCX: written by hand as minimal WordprocessingML, so it is exactly what ATS parsers like: one column, Arial,
// real Heading styles, real bulleted lists, nothing in headers, footers, tables or text boxes. Links become their text,
// and every URL is already spelled out in the visible copy.
const blocks = await page.$eval("#resume", (el) =>
  [...el.querySelectorAll("h1, h2, h3, p, li")].map((n) => ({
    tag: n.tagName.toLowerCase(),
    cls: n.className.split(" ").find((c) => ["headline", "contact", "when"].includes(c)) ?? "",
    runs: n.tagName === "LI" && n.querySelector("strong")
      ? [{ b: true, t: n.querySelector("strong").textContent }, { t: n.textContent.slice(n.querySelector("strong").textContent.length) }]
      : [{ t: n.textContent }],
  }))
);
await browser.close();

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const run = ({ t, b }) => `<w:r>${b ? "<w:rPr><w:b/></w:rPr>" : ""}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
const STYLE = { h1: "Title", h2: "Heading1", h3: "Heading2", headline: "Subtitle", contact: "Contact", when: "Meta" };
const para = (b) => {
  const style = b.tag === "li" ? "ListBullet" : STYLE[b.cls] ?? STYLE[b.tag] ?? "Normal";
  const num = b.tag === "li" && !b.runs[0].b ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : "";
  return `<w:p><w:pPr><w:pStyle w:val="${num || b.tag !== "li" ? style : "Normal"}"/>${num}</w:pPr>${b.runs.map(run).join("")}</w:p>`;
};
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
const style = (id, name, { size = 21, bold = false, color, before = 0, after = 40, caps = false, based = "Normal", border = false } = {}) =>
  `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="${based}"/><w:qFormat/><w:pPr><w:keepNext w:val="${id.startsWith("Heading") ? 1 : 0}"/><w:spacing w:before="${before}" w:after="${after}"/>${border ? '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="0D6E43"/></w:pBdr>' : ""}</w:pPr><w:rPr>${bold ? "<w:b/>" : ""}${caps ? "<w:caps/>" : ""}${color ? `<w:color w:val="${color}"/>` : ""}<w:sz w:val="${size}"/></w:rPr></w:style>`;
const files = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
  "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`,
  "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(META.title)}</dc:title><dc:subject>${esc(META.subject)}</dc:subject><dc:creator>${META.author}</dc:creator><cp:keywords>${esc(META.keywords)}</cp:keywords><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`,
  "word/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="21"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="252" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>`
    + `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="21"/></w:rPr></w:style>`
    + style("Title", "Title", { size: 40, bold: true, after: 20 })
    + style("Subtitle", "Subtitle", { size: 23, bold: true, color: "0D6E43", after: 20 })
    + style("Contact", "Contact", { size: 19, after: 80 })
    + style("Heading1", "heading 1", { size: 22, bold: true, caps: true, color: "0D6E43", before: 200, after: 80, border: true })
    + style("Heading2", "heading 2", { size: 21, bold: true, before: 120, after: 0 })
    + style("Meta", "Meta", { size: 19, color: "3D5A48", after: 40 })
    + style("ListBullet", "List Bullet", { after: 20 })
    + `</w:styles>`,
  "word/numbering.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="300" w:hanging="220"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`,
  "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W}><w:body>${blocks.map(para).join("")}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="792" w:bottom="720" w:left="792" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`,
};
const dir = mkdtempSync(join(tmpdir(), "resume-"));
for (const [name, xml] of Object.entries(files)) { mkdirSync(dirname(join(dir, name)), { recursive: true }); writeFileSync(join(dir, name), xml); }
const docx = join(out, "Zahraa-Sadeq-Resume.docx");
rmSync(docx, { force: true });
execFileSync("zip", ["-X", "-q", "-r", docx, "[Content_Types].xml", "_rels", "docProps", "word"], { cwd: dir });
console.log("wrote", pdf, "and", join(out, "Zahraa-Sadeq-Resume.docx"));
