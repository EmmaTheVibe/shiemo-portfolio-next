import { projects, type Project } from "@/lib/data/projects";

export type FlowLayout = {
  width: number;
  height: number;
  fontSize: number;
  lanes?: { label: string; y: number }[];
  divider?: number;
  nodes: { x: number; y: number; w: number; h: number }[];
  edges: string[];
};

export type FlowChart = {
  intro: string;
  steps: string[];
  desktop: FlowLayout;
  mobile: FlowLayout;
};

export type CaseStudy = {
  slug: string;
  projectId: number;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  role: string;
  timeline: string;
  context: string;
  challenge: string[];
  flow?: FlowChart;
  decisions: {
    title: string;
    body: string;
    code?: {
      file: string;
      snippet: string;
      image?: string;
      notes?: { lines: string; text: string }[];
    };
  }[];
  results: { value: string; label: string }[];
  quote?: { text: string; name: string; role: string };
  screens?: { desktop?: string; mobile?: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "themodumaliq",
    projectId: 1,
    seoTitle: "themodumaliq: Photography Portfolio for Moses Momodu",
    seoDescription:
      "How I built a portfolio for Lagos photographer Moses Momodu: 652 MB of photos cut to 17 MB, scroll-driven GSAP galleries and a hanging-print menu.",
    tagline: "A portfolio for Lagos photographer Moses Momodu that loads fast without flattening his work.",
    role: "Design & development",
    timeline: "4 days",
    context: "Client project",
    challenge: [
      "Moses needed a portfolio that felt as considered as his photography, across five categories from corporate events to portraits. Template sites made his work look like everyone else's.",
      "The photos were the other problem. 88 originals came to 652 MB, with single headshots close to 24 MB. Serving them as they were would make the site crawl on mobile data, and compressing them by hand every time he adds a shoot wasn't going to last.",
    ],
    flow: {
      intro: "Every photo takes this path, from Moses's camera to the gallery:",
      steps: [
        "88 original photos, 652 MB in total",
        "sharp rotates each one and fits it within 2400px",
        "Encoded as WebP at quality 82",
        "17 MB of WebP photos",
        "Manifest of sizes and tiny blurs",
        "Gallery shows the blur, then the sharp photo",
        "Scroll intro Flips into the grid, then a full-screen viewer",
      ],
      desktop: {
        width: 1200,
        height: 470,
        fontSize: 15,
        lanes: [
          { label: "Build time", y: 14 },
          { label: "In the browser", y: 334 },
        ],
        divider: 322,
        nodes: [
          { x: 150, y: 80, w: 230, h: 76 },
          { x: 480, y: 80, w: 230, h: 76 },
          { x: 830, y: 80, w: 270, h: 76 },
          { x: 700, y: 235, w: 230, h: 70 },
          { x: 1020, y: 235, w: 230, h: 70 },
          { x: 430, y: 405, w: 330, h: 84 },
          { x: 880, y: 405, w: 300, h: 84 },
        ],
        edges: [
          "M268 80 C 290 55, 305 105, 325 85 C 335 76, 345 80, 354 80",
          "M598 80 C 620 55, 635 105, 655 85 C 665 76, 675 80, 684 80",
          "M790 120 C 790 170, 720 135, 720 194",
          "M880 120 C 880 175, 1020 130, 1020 194",
          "M680 272 C 680 330, 470 290, 470 357",
          "M1010 272 C 1010 330, 940 300, 900 318 C 860 336, 856 298, 880 294 C 904 290, 908 330, 860 342 C 764 366, 580 300, 580 357",
          "M598 405 C 625 380, 645 430, 670 410 C 685 400, 705 405, 718 405",
        ],
      },
      mobile: {
        width: 360,
        height: 730,
        fontSize: 14,
        lanes: [
          { label: "Build time", y: 0 },
          { label: "In the browser", y: 452 },
        ],
        divider: 440,
        nodes: [
          { x: 130, y: 60, w: 220, h: 60 },
          { x: 230, y: 160, w: 220, h: 60 },
          { x: 130, y: 260, w: 220, h: 60 },
          { x: 90, y: 370, w: 160, h: 64 },
          { x: 270, y: 370, w: 160, h: 64 },
          { x: 180, y: 540, w: 300, h: 76 },
          { x: 180, y: 680, w: 300, h: 76 },
        ],
        edges: [
          "M244 60 C 275 40, 300 70, 285 84 C 270 98, 300 100, 300 124",
          "M116 160 C 85 140, 60 170, 75 184 C 90 198, 60 200, 60 224",
          "M90 292 C 90 315, 80 305, 80 332",
          "M200 292 C 200 322, 270 300, 270 332",
          "M90 404 C 90 450, 120 440, 120 496",
          "M270 404 C 270 430, 262 446, 248 454 C 228 466, 218 444, 236 438 C 256 431, 262 462, 244 496",
          "M180 580 C 150 595, 210 605, 185 615 C 175 619, 180 615, 180 636",
        ],
      },
    },
    decisions: [
      {
        title: "A photo pipeline he never has to think about",
        body: "A build script runs every original through sharp: it corrects the rotation, fits the photo within 2400px, keeps the colour profile and saves WebP at quality 82. It skips photos that haven't changed, removes outputs whose original is gone, and writes a manifest with each photo's size and a 16px blur preview.",
        code: {
          file: "scripts/photos.mjs",
          image: "/case-studies/themodumaliq-code.avif",
          notes: [
            { lines: "1–2", text: "Only re-encodes a photo if it's new or the original changed since the last run." },
            {
              lines: "3–8",
              text: "Rotates from the camera's data, fits within 2400px, keeps the colour profile and encodes WebP.",
            },
            {
              lines: "15–22",
              text: "Records each photo's exact size and a 16px blur, so the gallery reserves space and paints something instantly.",
            },
          ],
          snippet: `const [inStat, outStat] = await Promise.all([stat(src), exists(out)]);
if (!outStat || outStat.mtimeMs < inStat.mtimeMs) {
  await sharp(src)
    .rotate()
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .keepIccProfile()
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(out);
  made += 1;
} else {
  kept += 1;
}

const { width, height } = await sharp(out).metadata();
const preview = await sharp(out).resize(16).webp({ quality: 40 }).toBuffer();
manifest[slug].push({
  src: \`/photos/\${slug}/\${name}\`,
  width,
  height,
  blur: \`data:image/webp;base64,\${preview.toString("base64")}\`,
});`,
        },
      },
      {
        title: "Galleries that open like a shoot",
        body: "Each category opens with a scroll intro that zooms and pans through the lead photos on custom smooth scrolling. Past a set point, GSAP Flip morphs them into the full grid while the rest of the photos fade in from a blur.",
      },
      {
        title: "A menu of hanging prints",
        body: "Hovering a category in the full-screen menu drops its cover print in on a peg, where it swings to rest with an elastic ease while the last one lifts away. A custom cursor frames links and photos like a viewfinder, and everything calms down for visitors who prefer reduced motion.",
      },
    ],
    results: [
      { value: "97%", label: "smaller: 652 MB of originals down to 17 MB" },
      { value: "88", label: "photos across five categories" },
      { value: "16px", label: "blur previews, so no photo pops in" },
      { value: "1", label: "command to add a new shoot" },
    ],
    screens: {
      desktop: "/case-studies/themodumaliq-desktop.avif",
      mobile: "/case-studies/themodumaliq-mobile.avif",
    },
  },
  {
    slug: "ricks-closet",
    projectId: 2,
    seoTitle: "Rick's Closet: 3D Clothing Store with Cloth Physics",
    seoDescription:
      "How I built Rick's Closet, a 3D clothing store with real-time cloth physics in a web worker and a lite mode that keeps it smooth on everyday phones.",
    tagline: "A 3D clothing store where you walk into a wardrobe and the shirts move like fabric.",
    role: "Design & development",
    timeline: "10 days",
    context: "Concept project",
    challenge: [
      "Online clothes shopping is a grid of flat photos. I wanted browsing to feel like flicking through a real rail: walk into a wardrobe, slide garments along, and watch them sway when you touch them.",
      "Real cloth physics means hundreds of points per garment, updated many times a second, on top of a full 3D scene with lighting and shadows. Doing that on the main thread would stall every interaction, and most everyday phones don't have memory to spare.",
    ],
    flow: {
      intro: "How a product photo becomes a shirt you can push around:",
      steps: [
        "Garment photo, background removed",
        "Prep script trims the hanger and fits it to 1024×1280",
        "64×80 alpha mask read from the photo",
        "Cloth grid shaped by the mask: 20×25 points, 14×18 on phones",
        "Stretch, shear and bend constraints",
        "Web worker steps the physics at 120 Hz",
        "Main thread bends the shirt mesh every frame",
      ],
      desktop: {
        width: 1200,
        height: 470,
        fontSize: 15,
        lanes: [
          { label: "Build time", y: 14 },
          { label: "In the browser", y: 182 },
        ],
        divider: 170,
        nodes: [
          { x: 150, y: 80, w: 240, h: 76 },
          { x: 520, y: 80, w: 320, h: 76 },
          { x: 150, y: 260, w: 240, h: 76 },
          { x: 520, y: 260, w: 320, h: 76 },
          { x: 920, y: 260, w: 260, h: 76 },
          { x: 920, y: 405, w: 280, h: 76 },
          { x: 460, y: 405, w: 320, h: 76 },
        ],
        edges: [
          "M274 80 C 296 57, 309 103, 326 85 C 335 76, 342 80, 348 80",
          "M440 120 C 440 180, 170 150, 170 214",
          "M274 260 C 296 237, 309 283, 326 265 C 335 256, 342 260, 348 260",
          "M684 260 C 708 235, 722 285, 742 265 C 754 254, 766 260, 778 260",
          "M920 300 C 900 320, 940 340, 920 360",
          "M778 392 C 740 368, 670 368, 632 388",
          "M622 420 C 660 444, 740 444, 768 422",
        ],
      },
      mobile: {
        width: 360,
        height: 790,
        fontSize: 14,
        lanes: [
          { label: "Build time", y: 0 },
          { label: "In the browser", y: 242 },
        ],
        divider: 230,
        nodes: [
          { x: 130, y: 60, w: 220, h: 60 },
          { x: 230, y: 160, w: 220, h: 76 },
          { x: 130, y: 310, w: 220, h: 64 },
          { x: 230, y: 410, w: 220, h: 76 },
          { x: 130, y: 510, w: 220, h: 64 },
          { x: 180, y: 620, w: 300, h: 64 },
          { x: 180, y: 740, w: 300, h: 64 },
        ],
        edges: [
          "M244 60 C 275 40, 300 70, 285 84 C 270 98, 300 100, 300 116",
          "M116 160 C 85 140, 60 170, 75 192 C 90 214, 60 238, 60 272",
          "M244 310 C 275 290, 300 320, 285 334 C 270 348, 300 350, 300 366",
          "M116 410 C 85 390, 60 420, 75 434 C 90 448, 60 452, 60 472",
          "M130 544 C 130 566, 170 560, 170 582",
          "M130 654 C 112 670, 132 690, 130 702",
          "M230 706 C 248 690, 228 670, 230 658",
        ],
      },
    },
    decisions: [
      {
        title: "Turn product photos into cloth",
        body: "Each garment starts as a photo. A prep script strips the hanger and fits it to a fixed canvas, then in the browser a 64×80 alpha mask shapes a grid of points held together by stretch, shear and bend constraints. Only the garments near the centre of the rail are simulated, at most three at a time.",
      },
      {
        title: "Run the physics off the main thread",
        body: "The simulation lives in a web worker, stepping at 120 Hz with six constraint passes. Each frame the main thread sends the pointer and hanger positions and gets the cloth back, so dragging the rail never waits on the physics.",
      },
      {
        title: "A lite mode for low-memory phones",
        body: "Phones that report 4 GB of memory or less get a lighter scene: the render resolution caps at 1.5×, and bump maps, sheen and clearcoat are stripped from every fabric. Each room is its own route, and the next room's assets preload at low priority.",
        code: {
          file: "components/rack/device.ts",
          image: "/case-studies/ricks-closet-code.avif",
          notes: [
            { lines: "3–4", text: "Reads the device's memory, where the browser exposes it." },
            { lines: "5–6", text: "4 GB or less turns lite mode on and caps the render resolution at 1.5× instead of 2×." },
            {
              lines: "10–19",
              text: "Every fabric material goes through these, so lite devices never build bump maps, clearcoat or sheen.",
            },
          ],
          snippet: `import { MeshPhysicalMaterial, type MeshPhysicalMaterialParameters } from "three";

const memory =
  typeof navigator === "undefined" ? undefined : (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
export const LOW_MEMORY = memory !== undefined && memory <= 4;
export const DPR: [number, number] = LOW_MEMORY ? [1, 1.5] : [1, 2];

const BUMP = new Set(["bumpMap", "bumpScale"]);

export function flat<T extends object>(params: T): T {
  return LOW_MEMORY ? (Object.fromEntries(Object.entries(params).filter(([key]) => !BUMP.has(key))) as T) : params;
}

const EXTRAS = /^(clearcoat|sheen)/;

export function physicalMaterial(params: MeshPhysicalMaterialParameters) {
  return new MeshPhysicalMaterial(
    LOW_MEMORY ? Object.fromEntries(Object.entries(flat(params)).filter(([key]) => !EXTRAS.test(key))) : params,
  );
}`,
        },
      },
    ],
    results: [
      { value: "5s", label: "average first load" },
      { value: "500", label: "cloth points per garment, 252 on phones" },
      { value: "120 Hz", label: "physics steps, off the main thread" },
      { value: "3", label: "rooms: clothes rail, shoe wall and watch box" },
    ],
    screens: {
      desktop: "/case-studies/ricks-closet-desktop.avif",
      mobile: "/case-studies/ricks-closet-mobile.avif",
    },
  },
  {
    slug: "swoop",
    projectId: 3,
    seoTitle: "Swoop: Scroll-Driven Drone Landing Page",
    seoDescription:
      "How I built Swoop, a landing page where scrolling flies you through five drone videos, with frame-by-frame canvas playback that stays smooth on phones.",
    tagline: "A camera drone store where scrolling flies you through five aerial videos.",
    role: "Design & development",
    timeline: "2 days",
    context: "Concept project",
    challenge: [
      "Scroll-scrubbed video sounds simple until you build it. Browsers can't seek a video frame-accurately on every scroll tick, so playback stutters, and reversing direction makes it worse.",
      "Swapping video for images fixes the seeking, but five 1080p clips are hundreds of frames. Loading and decoding all of them would blow past a phone's memory and take ages on mobile data. The page had to feel like flying, in both scroll directions, without that cost.",
    ],
    flow: {
      intro: "Every frame you see takes this path, from source footage to the screen:",
      steps: [
        "Drone footage",
        "ffmpeg extracts every frame",
        "sharp encodes each frame as AVIF",
        "1920×1080 desktop set",
        "9:16 cropped phone set",
        "Scheduler fetches and decodes only frames near the scroll",
        "Canvas draws each frame, with whip blur between clips",
      ],
      desktop: {
        width: 1200,
        height: 470,
        fontSize: 15,
        lanes: [
          { label: "Build time", y: 14 },
          { label: "In the browser", y: 334 },
        ],
        divider: 322,
        nodes: [
          { x: 150, y: 80, w: 230, h: 76 },
          { x: 480, y: 80, w: 230, h: 76 },
          { x: 830, y: 80, w: 270, h: 76 },
          { x: 700, y: 235, w: 230, h: 70 },
          { x: 1020, y: 235, w: 230, h: 70 },
          { x: 430, y: 405, w: 330, h: 84 },
          { x: 880, y: 405, w: 300, h: 84 },
        ],
        edges: [
          "M268 80 C 290 55, 305 105, 325 85 C 335 76, 345 80, 354 80",
          "M598 80 C 620 55, 635 105, 655 85 C 665 76, 675 80, 684 80",
          "M790 120 C 790 170, 720 135, 720 194",
          "M880 120 C 880 175, 1020 130, 1020 194",
          "M680 272 C 680 330, 470 290, 470 357",
          "M1010 272 C 1010 330, 940 300, 900 318 C 860 336, 856 298, 880 294 C 904 290, 908 330, 860 342 C 764 366, 580 300, 580 357",
          "M598 405 C 625 380, 645 430, 670 410 C 685 400, 705 405, 718 405",
        ],
      },
      mobile: {
        width: 360,
        height: 730,
        fontSize: 14,
        lanes: [
          { label: "Build time", y: 0 },
          { label: "In the browser", y: 452 },
        ],
        divider: 440,
        nodes: [
          { x: 130, y: 60, w: 220, h: 60 },
          { x: 230, y: 160, w: 220, h: 60 },
          { x: 130, y: 260, w: 220, h: 60 },
          { x: 90, y: 370, w: 160, h: 64 },
          { x: 270, y: 370, w: 160, h: 64 },
          { x: 180, y: 540, w: 300, h: 76 },
          { x: 180, y: 680, w: 300, h: 76 },
        ],
        edges: [
          "M244 60 C 275 40, 300 70, 285 84 C 270 98, 300 100, 300 124",
          "M116 160 C 85 140, 60 170, 75 184 C 90 198, 60 200, 60 224",
          "M90 292 C 90 315, 80 305, 80 332",
          "M200 292 C 200 322, 270 300, 270 332",
          "M90 404 C 90 450, 120 440, 120 496",
          "M270 404 C 270 430, 262 446, 248 454 C 228 466, 218 444, 236 438 C 256 431, 262 462, 244 496",
          "M180 580 C 150 595, 210 605, 185 615 C 175 619, 180 615, 180 636",
        ],
      },
    },
    decisions: [
      {
        title: "Turn the videos into image sequences",
        body: "A build script pipes each clip through ffmpeg into sharp and encodes every frame as AVIF, at around 90 KB per 1080p frame. It also writes a second, 9:16 centre-cropped set for phones, so mobile never downloads pixels it can't show.",
      },
      {
        title: "Only decode what's near the scroll position",
        body: "A custom scheduler streams frames in the background, six requests at a time, but only decodes full-resolution frames inside a window around where you are: 40 ahead and 16 behind, flipping with scroll direction. Frames that leave the window are released. Every fourth frame also gets a small preview, so a fast fling always has something to draw while full frames catch up.",
        code: {
          file: "lib/frameScheduler.ts",
          image: "/case-studies/swoop-code.avif",
          notes: [
            { lines: "1–2", text: "How far the window reaches: 40 frames ahead of you, 16 behind." },
            {
              lines: "4–8",
              text: "inWindow flips the window when you scroll back up, so the frames you're heading towards are always the ones ready.",
            },
            {
              lines: "9–12",
              text: "distance ranks frames for loading. Frames behind you count double, so whatever comes next always loads first.",
            },
          ],
          snippet: `const AHEAD = 40;
const BEHIND = 16;

const inWindow = (g: number, margin = 0) => {
  const back = (direction > 0 ? BEHIND : AHEAD) + margin;
  const forward = (direction > 0 ? AHEAD : BEHIND) + margin;
  return g >= focus - back && g <= focus + forward;
};

const distance = (g: number) => {
  const d = (g - focus) * direction;
  return d >= 0 ? d : -d * 2;
};`,
        },
      },
      {
        title: "Whip-blur transitions on one canvas",
        body: "Clips join with a whip pan instead of a cut. The outgoing frame is drawn eight times with growing offsets and fading opacity to fake motion blur while the next clip slides in, all on a single canvas with no video elements.",
      },
    ],
    results: [
      { value: "459", label: "frames scrubbed by scroll across 5 clips" },
      { value: "90 KB", label: "average per 1080p AVIF frame" },
      { value: "56", label: "frame decode window, so memory stays capped" },
      { value: "9:16", label: "lighter frame set served to phones" },
    ],
    screens: {
      desktop: "/case-studies/swoop-desktop.avif",
      mobile: "/case-studies/swoop-mobile.avif",
    },
  },
  {
    slug: "yapp",
    projectId: 5,
    seoTitle: "Yapp: End-to-End Encrypted Chat App",
    seoDescription:
      "How I built Yapp, a real-time chat app where messages are encrypted in the browser with RSA-OAEP and AES-GCM, so the server never sees plaintext.",
    tagline: "A real-time chat app where the server only ever sees scrambled text.",
    role: "Design & full-stack development",
    timeline: "2 days",
    context: "Personal project",
    challenge: [
      "Most chat apps encrypt messages on the way to their server, and then the server can read them. I wanted the opposite: encrypt in the sender's browser, decrypt only in the recipient's, and have the server store and pass along nothing it can read.",
      "That raises awkward questions. RSA can't encrypt a long message, the sender still needs to read their own sent messages, and if the private key only lives in one browser, signing in on a new device would lose every conversation.",
    ],
    flow: {
      intro: "What happens to your keys when you sign up, and to every message you send:",
      steps: [
        "Browser generates an RSA key pair",
        "Your password locks the private key",
        "Server keeps the public key and the locked copy",
        "A fresh AES-GCM key encrypts each message",
        "That key is encrypted for them and for you",
        "Server stores and relays only ciphertext",
        "Their private key unlocks the AES key, then the message",
      ],
      desktop: {
        width: 1200,
        height: 470,
        fontSize: 15,
        lanes: [
          { label: "Signing up", y: 14 },
          { label: "Sending a message", y: 182 },
        ],
        divider: 170,
        nodes: [
          { x: 150, y: 80, w: 240, h: 76 },
          { x: 500, y: 80, w: 280, h: 76 },
          { x: 870, y: 80, w: 290, h: 76 },
          { x: 150, y: 260, w: 240, h: 76 },
          { x: 500, y: 260, w: 300, h: 76 },
          { x: 870, y: 260, w: 290, h: 76 },
          { x: 620, y: 405, w: 320, h: 76 },
        ],
        edges: [
          "M274 80 C 292 57, 305 103, 322 85 C 331 76, 340 80, 348 80",
          "M644 80 C 662 57, 675 103, 692 85 C 701 76, 706 80, 713 80",
          "M830 120 C 830 180, 580 150, 580 214",
          "M274 260 C 290 237, 303 283, 318 265 C 326 256, 332 260, 338 260",
          "M654 260 C 668 237, 680 283, 694 265 C 701 256, 707 260, 713 260",
          "M960 300 C 960 345, 1000 362, 975 374 C 950 386, 932 354, 956 350 C 985 345, 940 405, 790 405",
        ],
      },
      mobile: {
        width: 360,
        height: 830,
        fontSize: 14,
        lanes: [
          { label: "Signing up", y: 0 },
          { label: "Sending a message", y: 352 },
        ],
        divider: 340,
        nodes: [
          { x: 130, y: 60, w: 220, h: 60 },
          { x: 230, y: 160, w: 220, h: 76 },
          { x: 130, y: 270, w: 220, h: 76 },
          { x: 230, y: 420, w: 220, h: 76 },
          { x: 130, y: 530, w: 220, h: 76 },
          { x: 230, y: 640, w: 220, h: 76 },
          { x: 180, y: 780, w: 300, h: 76 },
        ],
        edges: [
          "M244 60 C 275 40, 300 70, 285 84 C 270 98, 300 100, 300 116",
          "M116 160 C 85 140, 60 170, 75 186 C 90 202, 60 206, 60 226",
          "M60 310 C 60 370, 35 420, 60 486",
          "M200 460 C 200 476, 180 470, 180 486",
          "M244 530 C 275 510, 300 540, 285 556 C 270 572, 300 578, 300 596",
          "M230 680 C 230 705, 255 710, 243 722 C 231 734, 214 720, 222 712 C 230 704, 200 718, 200 736",
        ],
      },
    },
    decisions: [
      {
        title: "Encrypt each message with its own key",
        body: "Every message gets a fresh AES-GCM key, which handles text of any length. That key is then encrypted twice with RSA-OAEP, once with the recipient's public key and once with yours, so both of you can read the thread and nobody else can.",
      },
      {
        title: "Let your password carry your private key",
        body: "The private key is locked in the browser with a key derived from your password, and only the locked copy goes to the server. Sign in on any device and it unlocks locally. After a reload, an unlock screen asks for your password before the key goes back into memory.",
        code: {
          file: "lib/crypto.ts",
          image: "/case-studies/yapp-code.avif",
          notes: [
            { lines: "1–4", text: "Takes your password and a random salt stored with your account." },
            {
              lines: "5–12",
              text: "Imports the password as raw key material that can only be used to derive other keys.",
            },
            {
              lines: "14–25",
              text: "Stretches it through 100,000 SHA-256 rounds into an AES-KW key that can only lock and unlock other keys.",
            },
          ],
          snippet: `async function deriveWrappingKey(
  password: string,
  saltB64: string,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: BASE64.decode(saltB64),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-KW", length: 256 },
    false,
    ["wrapKey", "unwrapKey"],
  );
}`,
        },
      },
      {
        title: "Real time, without trusting the socket",
        body: "A FastAPI WebSocket server relays ciphertext, delivery receipts and online status. Messages sent to someone offline are stored and marked delivered when they connect, and the client reconnects on its own with a refreshed token.",
      },
    ],
    results: [
      { value: "0", label: "messages the server can read" },
      { value: "2048", label: "bit RSA keys, generated in your browser" },
      { value: "100k", label: "PBKDF2 rounds guarding your private key" },
      { value: "2", label: "encrypted copies of each message key: theirs and yours" },
    ],
    screens: {
      desktop: "/case-studies/yapp-desktop.avif",
      mobile: "/case-studies/yapp-mobile.avif",
    },
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudyFor(projectId: number) {
  return caseStudies.find((c) => c.projectId === projectId);
}

export function projectFor(study: CaseStudy): Project {
  const project = projects.find((p) => p.id === study.projectId);
  if (!project) throw new Error(`No project with id ${study.projectId} for case study ${study.slug}`);
  return project;
}
