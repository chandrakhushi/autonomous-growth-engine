const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fa = require("react-icons/fa");

// ---------- palette (matches the product UI) ----------
const C = {
  bg: "0F0F12",
  bg2: "15151A",
  panel: "1C1C22",
  panel2: "26262E",
  border: "33333C",
  ink: "F2F2F6",
  sub: "9A9AA8",
  faint: "6E6E7A",
  accent: "D97757", // terracotta
  scalekit: "7C8CFF", // indigo
  actian: "34D399", // emerald
  render: "B69CFF", // violet
  posthog: "F5B14C", // amber
};

// ---------- icon rasterization ----------
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: "#" + color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

// brand mark: a rising trend line breaking up through a ring (autonomous + growth)
const logoSvg = (hex) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="${hex}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><circle cx="48" cy="54" r="27"/><path d="M33 65 L47 51 L57 59 L71 39"/><path d="M61 35 L76 32 L73 47 Z" fill="${hex}" stroke="none"/></svg>`;

// friendly robot in a terracotta loop (mascot mark)
const robotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 124" fill="none">
<circle cx="60" cy="60" r="46" stroke="#D97757" stroke-width="7"/>
<path d="M95 33 L106 32 L100 43 Z" fill="#D97757"/>
<path d="M25 87 L14 88 L20 77 Z" fill="#D97757"/>
<path d="M60 30 L60 18" stroke="#D97757" stroke-width="5" stroke-linecap="round"/>
<circle cx="60" cy="14" r="5" fill="#34D399"/>
<rect x="29" y="54" width="8" height="18" rx="4" fill="#2C313C" stroke="#5A6172" stroke-width="2"/>
<rect x="83" y="54" width="8" height="18" rx="4" fill="#2C313C" stroke="#5A6172" stroke-width="2"/>
<rect x="34" y="32" width="52" height="48" rx="15" fill="#2C313C" stroke="#5A6172" stroke-width="2.5"/>
<rect x="42" y="41" width="36" height="29" rx="9" fill="#0F1118"/>
<path d="M49 55 q4.5 -6.5 9 0" stroke="#34D399" stroke-width="3.6" stroke-linecap="round"/>
<path d="M62 55 q4.5 -6.5 9 0" stroke="#34D399" stroke-width="3.6" stroke-linecap="round"/>
</svg>`;

// brand mark: ascending growth bars rising into an arrow
const barsSvg = (hex) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 92" fill="${hex}"><rect x="16" y="54" width="15" height="26" rx="5"/><rect x="38" y="42" width="15" height="38" rx="5"/><rect x="60" y="32" width="15" height="48" rx="5"/><path d="M67.5 10 L83 32 L52 32 Z"/></svg>`;

async function rasterSvg(svg, size = 256) {
  const png = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return "image/png;base64," + png.toString("base64");
}

const makeShadow = (opacity = 0.35, blur = 10, offset = 4, angle = 90) => ({
  type: "outer",
  color: "000000",
  blur,
  offset,
  angle,
  opacity,
});

async function main() {
  const I = {
    search: await icon(Fa.FaSearch, C.posthog),
    bulb: await icon(Fa.FaLightbulb, C.accent),
    code: await icon(Fa.FaCode, C.scalekit),
    rocket: await icon(Fa.FaRocket, C.actian),
    shield: await icon(Fa.FaUserShield, C.scalekit),
    db: await icon(Fa.FaDatabase, C.actian),
    cloud: await icon(Fa.FaCloud, C.render),
    chart: await icon(Fa.FaChartLine, C.posthog),
    check: await icon(Fa.FaCheckCircle, C.actian),
    github: await icon(Fa.FaGithub, C.ink),
    users: await icon(Fa.FaUsers, C.accent),
    bolt: await icon(Fa.FaBolt, C.accent),
    layers: await icon(Fa.FaLayerGroup, C.scalekit),
    trophy: await icon(Fa.FaTrophy, C.accent),
    brain: await icon(Fa.FaBrain, C.actian),
    lock: await icon(Fa.FaLock, C.scalekit),
    ban: await icon(Fa.FaBan, C.accent),
    link: await icon(Fa.FaLink, C.scalekit),
    eye: await icon(Fa.FaRegEye, C.posthog),
    sparkles: await icon(Fa.FaMagic, C.accent),
    logo: await rasterSvg(logoSvg("#0F0F12")), // dark mark for the terracotta tile
    robot: await rasterSvg(robotSvg, 320), // mascot mark (own colors, no tile)
    bars: await rasterSvg(barsSvg("#D97757"), 320), // brand mark
  };

  const pres = new pptxgen();
  pres.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  pres.layout = "W";
  pres.author = "Khushi Chandra";
  pres.title = "Autonomous Growth Engine";

  const W = 13.333,
    H = 7.5;

  // ---------- helpers ----------
  function footer(slide, idx) {
    slide.addText(
      [
        { text: "Autonomous Growth Engine", options: { color: C.faint } },
      ],
      { x: 0.6, y: H - 0.5, w: 6, h: 0.3, fontSize: 9, fontFace: "Arial", align: "left", margin: 0 }
    );
    slide.addText(
      [
        { text: "Scalekit", options: { color: C.scalekit, bold: true } },
        { text: "  ·  ", options: { color: C.faint } },
        { text: "Actian", options: { color: C.actian, bold: true } },
        { text: "  ·  ", options: { color: C.faint } },
        { text: "Render", options: { color: C.render, bold: true } },
      ],
      { x: W - 5.1, y: H - 0.5, w: 4.5, h: 0.3, fontSize: 9, fontFace: "Arial", align: "right", margin: 0 }
    );
  }

  function eyebrow(slide, text, color = C.accent) {
    slide.addText(text.toUpperCase(), {
      x: 0.62,
      y: 0.55,
      w: 10,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color,
      charSpacing: 3,
      margin: 0,
    });
  }

  function heading(slide, text, opts = {}) {
    slide.addText(text, {
      x: 0.6,
      y: 0.9,
      w: 12.1,
      h: 1.0,
      fontSize: opts.size || 34,
      fontFace: "Calibri",
      bold: true,
      color: C.ink,
      margin: 0,
      ...opts,
    });
  }

  // card with icon header + body lines
  function iconCard(slide, x, y, w, h, accent, iconData, title, bodyRuns, opts = {}) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w,
      h,
      rectRadius: 0.1,
      fill: { color: C.panel },
      line: { color: C.border, width: 1 },
      shadow: makeShadow(0.3, 9, 3, 90),
    });
    // icon chip
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.28,
      y: y + 0.28,
      w: 0.62,
      h: 0.62,
      rectRadius: 0.1,
      fill: { color: C.panel2 },
      line: { color: accent, width: 1 },
    });
    slide.addImage({ data: iconData, x: x + 0.42, y: y + 0.42, w: 0.34, h: 0.34 });
    if (title) {
      slide.addText(title, {
        x: x + 1.06,
        y: y + 0.28,
        w: w - 1.3,
        h: 0.62,
        fontSize: opts.titleSize || 17,
        fontFace: "Calibri",
        bold: true,
        color: C.ink,
        valign: "middle",
        margin: 0,
      });
    }
    if (bodyRuns) {
      slide.addText(bodyRuns, {
        x: x + 0.3,
        y: y + 1.02,
        w: w - 0.6,
        h: h - 1.2,
        fontSize: opts.bodySize || 12.5,
        fontFace: "Arial",
        color: C.sub,
        valign: "top",
        lineSpacingMultiple: 1.05,
        margin: 0,
      });
    }
  }

  // a "loop chip" pill with icon
  function chip(slide, x, y, w, iconData, label, accent) {
    const h = 0.62;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w,
      h,
      rectRadius: 0.31,
      fill: { color: C.panel },
      line: { color: accent, width: 1.25 },
    });
    slide.addImage({ data: iconData, x: x + 0.22, y: y + 0.17, w: 0.28, h: 0.28 });
    slide.addText(label, {
      x: x + 0.58,
      y,
      w: w - 0.7,
      h,
      fontSize: 13,
      fontFace: "Calibri",
      bold: true,
      color: C.ink,
      valign: "middle",
      margin: 0,
    });
  }

  function arrow(slide, x, y) {
    slide.addText("→", {
      x,
      y,
      w: 0.5,
      h: 0.62,
      fontSize: 22,
      color: C.accent,
      align: "center",
      valign: "middle",
      bold: true,
      margin: 0,
    });
  }

  // =====================================================
  // SLIDE 1 — TITLE
  // =====================================================
  let s = pres.addSlide();
  s.background = { color: C.bg };
  // logo mark (growth bars)
  s.addImage({ data: I.bars, x: 0.62, y: 0.62, w: 0.64, h: 0.59 });
  s.addText("GROWTH ENGINE", {
    x: 1.45,
    y: 0.6,
    w: 8,
    h: 0.7,
    fontSize: 14,
    fontFace: "Calibri",
    bold: true,
    color: C.ink,
    charSpacing: 2,
    valign: "middle",
    margin: 0,
  });

  s.addText("Autonomous Growth Engine", {
    x: 0.6,
    y: 2.35,
    w: 12.1,
    h: 1.1,
    fontSize: 52,
    fontFace: "Calibri",
    bold: true,
    color: C.ink,
    margin: 0,
  });
  s.addText("A self-improving SaaS layer", {
    x: 0.62,
    y: 3.5,
    w: 12,
    h: 0.6,
    fontSize: 24,
    fontFace: "Calibri",
    color: C.accent,
    italic: true,
    margin: 0,
  });
  s.addText(
    "Learns from real user behavior and automatically generates and deploys onboarding, SEO, and pricing improvements — publishing each change as the right user, with the right permissions.",
    {
      x: 0.62,
      y: 4.25,
      w: 10.6,
      h: 1.2,
      fontSize: 16,
      fontFace: "Arial",
      color: C.sub,
      lineSpacingMultiple: 1.15,
      margin: 0,
    }
  );
  // sponsor strip
  s.addText(
    [
      { text: "Scalekit", options: { color: C.scalekit, bold: true } },
      { text: "   ×   ", options: { color: C.faint } },
      { text: "Actian", options: { color: C.actian, bold: true } },
      { text: "   ×   ", options: { color: C.faint } },
      { text: "Render", options: { color: C.render, bold: true } },
      { text: "   Hackathon · Agents in Production", options: { color: C.faint } },
    ],
    { x: 0.62, y: 6.35, w: 12, h: 0.4, fontSize: 14, fontFace: "Calibri", margin: 0 }
  );

  // =====================================================
  // SLIDE 2 — THE PROBLEM
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "The problem", C.accent);
  heading(s, "Most agents are demos. The last mile breaks them.");

  iconCard(
    s,
    0.6,
    2.35,
    5.95,
    3.15,
    C.posthog,
    I.chart,
    "Growth work is manual & reactive",
    [
      { text: "Teams drown in analytics but act on a fraction of it.", options: { breakLine: true, bullet: true, color: C.sub } },
      { text: "Onboarding gaps, dead SEO pages, and pricing leaks sit for weeks.", options: { breakLine: true, bullet: true, color: C.sub } },
      { text: "Insight → shipped fix is a slow, human, error-prone loop.", options: { bullet: true, color: C.sub } },
    ],
    { bodySize: 13.5 }
  );

  iconCard(
    s,
    6.78,
    2.35,
    5.95,
    3.15,
    C.scalekit,
    I.ban,
    "Agents act as root, not as you",
    [
      { text: "Calling an API is easy. Acting as a specific user is not.", options: { breakLine: true, bullet: true, color: C.sub } },
      { text: "Most agents use a service account — ignoring tenant, identity, and scoped permissions.", options: { breakLine: true, bullet: true, color: C.sub } },
      { text: "That's unsafe to put in production, so the demo never ships.", options: { bullet: true, color: C.sub } },
    ],
    { bodySize: 13.5 }
  );
  s.addText(
    "We solve both — an autonomous growth loop that ships changes as the real user.",
    { x: 0.6, y: 6.0, w: 12.1, h: 0.5, fontSize: 16, fontFace: "Calibri", italic: true, color: C.accent, margin: 0 }
  );
  footer(s, 2);

  // =====================================================
  // SLIDE 3 — OUR ANSWER + THE LOOP
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "Our answer", C.accent);
  heading(s, "One signal → one insight → one change, shipped safely.", { size: 31 });

  s.addText(
    "A chat-native agent that closes the growth loop end to end — and publishes the result under the user's own identity.",
    { x: 0.62, y: 1.95, w: 11.6, h: 0.7, fontSize: 15, fontFace: "Arial", color: C.sub, margin: 0 }
  );

  const loopY = 3.05;
  const cw = 2.55;
  const gap = 0.42;
  let lx = 0.95;
  chip(s, lx, loopY, cw, I.search, "Signal · PostHog", C.posthog);
  arrow(s, lx + cw + 0.0, loopY);
  lx += cw + gap;
  chip(s, lx, loopY, cw, I.bulb, "Insight", C.accent);
  arrow(s, lx + cw + 0.0, loopY);
  lx += cw + gap;
  chip(s, lx, loopY, cw, I.code, "Generated asset", C.scalekit);
  arrow(s, lx + cw + 0.0, loopY);
  lx += cw + gap;
  chip(s, lx, loopY, cw, I.rocket, "Ship · Linear + GitHub", C.actian);

  // explanation cards under the loop
  const ey = 4.3;
  const ew = 2.92;
  const exs = [0.6, 3.73, 6.86, 9.99];
  const expl = [
    ["Detect", "Reads search_query, page_dropoff, and feature_confusion events.", C.posthog],
    ["Reason", "Clusters friction into one high-confidence, high-impact insight.", C.accent],
    ["Generate", "Produces the actual code or content diff to fix it.", C.scalekit],
    ["Ship as you", "Files the Linear ticket and opens the GitHub PR as the real user.", C.actian],
  ];
  expl.forEach(([t, b, col], i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: exs[i],
      y: ey,
      w: ew,
      h: 1.75,
      rectRadius: 0.09,
      fill: { color: C.panel },
      line: { color: C.border, width: 1 },
    });
    s.addText(t, { x: exs[i] + 0.25, y: ey + 0.2, w: ew - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: "Calibri", color: col, margin: 0 });
    s.addText(b, { x: exs[i] + 0.25, y: ey + 0.66, w: ew - 0.5, h: 1.0, fontSize: 12, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.05, margin: 0 });
  });
  footer(s, 3);

  // =====================================================
  // SLIDE 4 — HOW IT WORKS (architecture)
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "How it works", C.accent);
  heading(s, "The architecture", { size: 32 });

  s.addText("User prompt in, shipped change out — with identity and memory built in.", {
    x: 0.62, y: 1.85, w: 11.8, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.sub, margin: 0,
  });

  // ----- arrow + node helpers (local to this slide) -----
  const aR = (x1, x2, y, color) => s.addShape(pres.shapes.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color, width: 1.5, endArrowType: "triangle" } });
  const aL = (x1, x2, y, color) => s.addShape(pres.shapes.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color, width: 1.5, beginArrowType: "triangle" } });
  const aBiH = (x1, x2, y, color) => s.addShape(pres.shapes.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color, width: 1.5, beginArrowType: "triangle", endArrowType: "triangle" } });
  const aBiV = (x, y1, y2, color) => s.addShape(pres.shapes.LINE, { x, y: y1, w: 0, h: y2 - y1, line: { color, width: 1.5, beginArrowType: "triangle", endArrowType: "triangle" } });
  const node = (x, y, w, h, ic, title, sub, accent, opts = {}) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.09, fill: { color: C.panel }, line: { color: opts.border || C.border, width: opts.bw || 1 }, shadow: makeShadow(0.28, 7, 2, 90) });
    s.addImage({ data: ic, x: x + 0.22, y: y + 0.2, w: 0.4, h: 0.4 });
    s.addText(title, { x: x + 0.74, y: y + 0.16, w: w - 0.9, h: 0.42, fontSize: opts.ts || 14, bold: true, fontFace: "Calibri", color: C.ink, valign: "middle", margin: 0 });
    if (sub) s.addText(sub, { x: x + 0.26, y: y + 0.64, w: w - 0.5, h: h - 0.74, fontSize: 10.5, fontFace: "Arial", color: C.sub, valign: "top", margin: 0 });
  };

  // ----- Render container (our deployed services) -----
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 2.35, w: 6.15, h: 4.0, rectRadius: 0.12, fill: { color: C.bg2 }, line: { color: C.render, width: 1.25 } });
  s.addText("RENDER", { x: 0.82, y: 2.44, w: 3, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, fontFace: "Calibri", color: C.render, margin: 0 });

  // internal nodes
  node(0.85, 3.3, 2.0, 1.05, I.sparkles, "App UI", "chat (yours)", C.accent);
  node(3.3, 3.0, 3.0, 1.45, I.brain, "AI Agent", "reason · generate · decide", C.accent, { border: C.accent, bw: 1.5, ts: 16 });
  node(3.3, 4.95, 3.0, 1.05, I.db, "Actian · memory", "past decisions & encounters", C.actian, { border: C.actian });

  // internal arrows
  aR(2.85, 3.3, 3.78, C.faint);
  s.addText("prompt", { x: 2.55, y: 3.3, w: 1.0, h: 0.25, fontSize: 8.5, align: "center", color: C.faint, fontFace: "Arial", margin: 0 });
  aBiV(4.8, 4.45, 4.95, C.actian);
  s.addText("recall / store", { x: 4.98, y: 4.46, w: 1.5, h: 0.3, fontSize: 8.5, color: C.actian, fontFace: "Arial", margin: 0 });

  // ----- Scalekit gateway -----
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.15, y: 2.55, w: 1.5, h: 3.55, rectRadius: 0.12, fill: { color: C.panel }, line: { color: C.scalekit, width: 1.5 }, shadow: makeShadow(0.35, 10, 3, 90) });
  s.addImage({ data: I.shield, x: 7.7, y: 2.78, w: 0.4, h: 0.4 });
  s.addText("SCALEKIT", { x: 7.15, y: 3.28, w: 1.5, h: 0.3, fontSize: 12, bold: true, align: "center", fontFace: "Calibri", color: C.scalekit, margin: 0 });
  s.addText("connectivity layer", { x: 7.15, y: 3.6, w: 1.5, h: 0.5, fontSize: 9, align: "center", fontFace: "Arial", color: C.sub, margin: 0 });

  // agent <-> scalekit
  aBiH(6.3, 7.15, 3.78, C.scalekit);

  // ----- external SaaS -----
  node(9.0, 2.65, 3.55, 1.0, I.chart, "PostHog", "behavioral signals", C.posthog, { border: C.posthog });
  node(9.0, 4.0, 3.55, 1.0, I.link, "Linear", "files the ticket", C.scalekit, { border: C.scalekit });
  node(9.0, 5.35, 3.55, 1.0, I.github, "GitHub", "opens the PR", C.ink);

  aL(8.65, 9.0, 3.15, C.posthog);
  aR(8.65, 9.0, 4.5, C.scalekit);
  aR(8.65, 9.0, 5.85, C.ink);

  // caption
  s.addText(
    [
      { text: "One agent. ", options: { color: C.ink, bold: true } },
      { text: "Scalekit is the single connectivity layer to PostHog, Linear & GitHub — Actian remembers every past decision — all on Render.", options: { color: C.sub } },
    ],
    { x: 0.6, y: 6.6, w: 12.1, h: 0.45, fontSize: 12.5, italic: true, fontFace: "Calibri", margin: 0 }
  );
  footer(s, 4);

  // =====================================================
  // SLIDE 5 — SCALEKIT thesis (act on behalf of users)
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "The hard part · Scalekit", C.scalekit);
  heading(s, "It ships as the right person — not a service account.", { size: 30 });

  // before / after comparison
  const compY = 2.35;
  const compH = 3.45;
  // WRONG card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: compY, w: 5.9, h: compH, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.border, width: 1 } });
  s.addImage({ data: I.ban, x: 0.98, y: compY + 0.34, w: 0.42, h: 0.42 });
  s.addText("Typical agent", { x: 1.54, y: compY + 0.32, w: 4.8, h: 0.45, fontSize: 18, bold: true, fontFace: "Calibri", color: C.ink, valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "Acts as a shared service account", options: { breakLine: true, bullet: true } },
      { text: "Ignores tenant + per-user permissions", options: { breakLine: true, bullet: true } },
      { text: "Audit trail says \"the bot did it\"", options: { breakLine: true, bullet: true } },
      { text: "Too risky to enable in production", options: { bullet: true } },
    ],
    { x: 1.0, y: compY + 1.1, w: 5.4, h: 2.1, fontSize: 14.5, fontFace: "Arial", color: C.sub, paraSpaceAfter: 10, margin: 0 }
  );

  // RIGHT card (highlighted)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.84, y: compY, w: 5.8, h: compH, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.scalekit, width: 1.5 }, shadow: makeShadow(0.4, 12, 4, 90) });
  s.addImage({ data: I.shield, x: 7.12, y: compY + 0.34, w: 0.42, h: 0.42 });
  s.addText("Our agent + Scalekit", { x: 7.68, y: compY + 0.32, w: 4.8, h: 0.45, fontSize: 18, bold: true, fontFace: "Calibri", color: C.ink, valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "Acts on behalf of the specific user", options: { breakLine: true, bullet: true } },
      { text: "Per-user token lifecycle + scoped access", options: { breakLine: true, bullet: true } },
      { text: "Respects tenant, identity, and context", options: { breakLine: true, bullet: true } },
      { text: "Safe to run for real — that's the unlock", options: { bullet: true } },
    ],
    { x: 7.14, y: compY + 1.1, w: 5.3, h: 2.1, fontSize: 14.5, fontFace: "Arial", color: C.ink, paraSpaceAfter: 10, margin: 0 }
  );

  s.addText(
    "Connecting an agent to GitHub or Linear is easy. Doing it as the right user, with the right permissions, is the last mile — and the whole point.",
    { x: 0.7, y: 6.15, w: 11.9, h: 0.7, fontSize: 14, fontFace: "Calibri", italic: true, color: C.scalekit, margin: 0 }
  );
  footer(s, 5);

  // =====================================================
  // SLIDE 6 — ACTIAN memory
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "Memory · Actian", C.actian);
  heading(s, "An agent that remembers gets smarter.", { size: 32 });

  s.addText(
    "Actian's VectorAI DB gives the agent fast, local vector search over every past encounter — no round-trip to the cloud to think.",
    { x: 0.62, y: 1.95, w: 11.8, h: 0.7, fontSize: 15, fontFace: "Arial", color: C.sub, margin: 0 }
  );

  const m = [
    [I.brain, "Recall", "Pulls similar past insights before acting, so it builds on prior fixes."],
    [I.check, "Dedupe", "Won't re-file a ticket or re-open a PR for a problem it already solved."],
    [I.bolt, "Compound", "Each loop enriches the memory, sharpening future insights over time."],
  ];
  const mw = 3.92;
  const mxs = [0.62, 4.73, 8.84];
  m.forEach(([ic, t, b], i) => {
    iconCard(s, mxs[i], 3.2, mw, 2.4, C.actian, ic, t, [{ text: b, options: { color: C.sub } }], { bodySize: 14.5, titleSize: 18 });
  });
  s.addText(
    "From one-shot demo to a system that learns — that's what \"in production\" really means.",
    { x: 0.62, y: 6.1, w: 12, h: 0.5, fontSize: 14, italic: true, fontFace: "Calibri", color: C.actian, margin: 0 }
  );
  footer(s, 6);

  // =====================================================
  // SLIDE 7 — PRODUCT / DEMO
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "The product", C.accent);
  heading(s, "What the judges will see", { size: 32 });

  // left: faux app window
  const ax = 0.62,
    ay = 2.2,
    aw = 6.1,
    ah = 4.0;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ax, y: ay, w: aw, h: ah, rectRadius: 0.12, fill: { color: C.bg2 }, line: { color: C.border, width: 1 }, shadow: makeShadow(0.4, 14, 5, 90) });
  // title bar dots
  ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) =>
    s.addShape(pres.shapes.OVAL, { x: ax + 0.28 + i * 0.26, y: ay + 0.26, w: 0.15, h: 0.15, fill: { color: c } })
  );
  s.addText("Autonomous Growth Engine", { x: ax + 1.3, y: ay + 0.16, w: aw - 1.5, h: 0.35, fontSize: 11, fontFace: "Calibri", color: C.sub, valign: "middle", margin: 0 });
  // mini run steps inside window
  const steps = [
    [I.search, "Pulled behavioral signals from PostHog", C.posthog],
    [I.bulb, "Users can't find data export — 86% confidence", C.accent],
    [I.code, "Generated tooltip + relocated CTA (diff)", C.scalekit],
    [I.rocket, "Filed GRW-204 · opened PR #482 as the user", C.actian],
  ];
  let sy = ay + 0.75;
  steps.forEach(([ic, t, col]) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ax + 0.3, y: sy, w: aw - 0.6, h: 0.66, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.border, width: 1 } });
    s.addImage({ data: ic, x: ax + 0.46, y: sy + 0.19, w: 0.28, h: 0.28 });
    s.addText(t, { x: ax + 0.86, y: sy, w: aw - 1.1, h: 0.66, fontSize: 11.5, fontFace: "Calibri", color: C.ink, valign: "middle", margin: 0 });
    sy += 0.78;
  });

  // right: highlights
  const hx = 7.0;
  s.addText("Chat-native, like Claude or ChatGPT", { x: hx, y: 2.35, w: 5.7, h: 0.5, fontSize: 17, bold: true, fontFace: "Calibri", color: C.ink, margin: 0 });
  s.addText(
    [
      { text: "Watch the agent stream the full loop live", options: { breakLine: true, bullet: true } },
      { text: "Connectors panel (PostHog · Linear · GitHub) — wired through Scalekit", options: { breakLine: true, bullet: true } },
      { text: "Real Linear ticket + GitHub PR, opened as the user", options: { breakLine: true, bullet: true } },
      { text: "Light & dark mode, deployed live on Render", options: { bullet: true } },
    ],
    { x: hx, y: 2.95, w: 5.7, h: 2.4, fontSize: 14, fontFace: "Arial", color: C.sub, lineSpacingMultiple: 1.25, margin: 0 }
  );
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: hx, y: 5.55, w: 5.7, h: 0.7, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.render, width: 1.25 } });
  s.addImage({ data: I.cloud, x: hx + 0.22, y: 5.72, w: 0.34, h: 0.34 });
  s.addText("autonomous-growth-engine.onrender.com", { x: hx + 0.66, y: 5.55, w: 5.0, h: 0.7, fontSize: 12.5, fontFace: "Calibri", bold: true, color: C.render, valign: "middle", margin: 0 });
  footer(s, 7);

  // =====================================================
  // SLIDE 8 — WHY IT WINS (judging criteria)
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  eyebrow(s, "Why it wins", C.accent);
  heading(s, "Scored on all four — by design", { size: 32 });

  const j = [
    [I.sparkles, "Innovation", "A self-improving growth loop that ships as the real user — not another API-calling demo.", C.accent],
    [I.layers, "Technical complexity", "Genuinely uses all three: Scalekit identity, Actian vector memory, Render deploy.", C.scalekit],
    [I.chart, "Impact", "Every SaaS team needs this. Safe, per-user actions make it real beyond the demo.", C.actian],
    [I.eye, "Presentation & usability", "A polished chat UI anyone can drive — live, deployed, and clear in 60 seconds.", C.posthog],
  ];
  const jw = 5.9,
    jh = 1.95;
  const jpos = [
    [0.7, 2.35],
    [6.84, 2.35],
    [0.7, 4.45],
    [6.84, 4.45],
  ];
  j.forEach((c, i) => {
    iconCard(s, jpos[i][0], jpos[i][1], i % 2 === 0 ? jw : 5.78, jh, c[3], c[0], c[1] + "  ·  25%", [{ text: c[2], options: { color: C.sub } }], { bodySize: 13, titleSize: 16 });
  });
  footer(s, 8);

  // =====================================================
  // SLIDE 9 — CLOSING
  // =====================================================
  s = pres.addSlide();
  s.background = { color: C.bg };
  s.addImage({ data: I.bars, x: 0.62, y: 0.74, w: 0.64, h: 0.59 });
  s.addText("GROWTH ENGINE", { x: 1.45, y: 0.7, w: 8, h: 0.7, fontSize: 14, fontFace: "Calibri", bold: true, color: C.ink, charSpacing: 2, valign: "middle", margin: 0 });

  s.addText("Agents that don't just act —", { x: 0.6, y: 2.5, w: 12, h: 0.9, fontSize: 40, bold: true, fontFace: "Calibri", color: C.ink, margin: 0 });
  s.addText("they act as you.", { x: 0.6, y: 3.4, w: 12, h: 0.9, fontSize: 40, bold: true, fontFace: "Calibri", color: C.accent, margin: 0 });

  s.addText(
    "Autonomous Growth Engine — a self-improving SaaS layer built on Scalekit, Actian, and Render.",
    { x: 0.62, y: 4.5, w: 11, h: 0.6, fontSize: 16, fontFace: "Arial", color: C.sub, margin: 0 }
  );

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 5.35, w: 6.2, h: 0.72, rectRadius: 0.12, fill: { color: C.panel }, line: { color: C.render, width: 1.25 } });
  s.addImage({ data: I.cloud, x: 0.85, y: 5.53, w: 0.36, h: 0.36 });
  s.addText("autonomous-growth-engine.onrender.com", { x: 1.32, y: 5.35, w: 5.4, h: 0.72, fontSize: 14, bold: true, fontFace: "Calibri", color: C.render, valign: "middle", margin: 0 });

  s.addText(
    [
      { text: "Scalekit", options: { color: C.scalekit, bold: true } },
      { text: "   ×   ", options: { color: C.faint } },
      { text: "Actian", options: { color: C.actian, bold: true } },
      { text: "   ×   ", options: { color: C.faint } },
      { text: "Render", options: { color: C.render, bold: true } },
    ],
    { x: 0.62, y: 6.55, w: 8, h: 0.4, fontSize: 14, fontFace: "Calibri", margin: 0 }
  );

  await pres.writeFile({ fileName: "Autonomous-Growth-Engine.pptx" });
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
