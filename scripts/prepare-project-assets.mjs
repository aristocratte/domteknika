import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_ROOT = "/Users/mathis/Domteknika/Project";
const OUT_ROOT = path.resolve("public/assets/projects");

const projects = [
  { folder: "Airsmile", slug: "airsmile", cover: "fkfl.png" },
  { folder: "Aventor", slug: "aventor", cover: "Aventor9.jpeg" },
  { folder: "BrossAdent", slug: "brossadent", cover: "Sans titre.png" },
  { folder: "DroneAventor", slug: "aventor-drone", cover: "1.JPG" },
  { folder: "EcranVelumSKY", slug: "velum-sky-screen", cover: "_DSC7008-Modifier.jpg" },
  { folder: "InsulinPen", slug: "insulin-pen", cover: "170831-InsulinPen-3.jpg" },
  { folder: "MontreVacheron", slug: "vacheron-watch-mechanics", cover: "Watch-3.333.jpg" },
  {
    folder: "Paradigm (pince pour mettre en deux vertebre)",
    slug: "paradigm-spine",
    cover: "set-complet-paradigm-spine.2.jpg",
  },
  { folder: "Parapluis", slug: "folding-umbrella", cover: "IMG_2957.JPG" },
  {
    folder: "Pumamachien caffesoluble",
    slug: "instant-coffee-dispenser",
    cover: "DSC00550.JPG",
  },
  {
    folder: "TotalCar",
    slug: "totalcar-concept",
    cover: "total-car.png",
    fallbackInput: "public/assets/our-story/total-car.png",
  },
  { folder: "cliris", slug: "cliris", cover: "Copie de cliris_open_persp_140410.jpg" },
  { folder: "coffeeMachine", slug: "alicoffee-machine", cover: "2.1-Alicoffee-red.jpg" },
  { folder: "flexDrill", slug: "flex-drill", cover: "Flex-drill.10.png" },
  { folder: "iKitty", slug: "ikitty", cover: "Kitty1.png" },
  { folder: "pistolet agrafebiomes", slug: "biome-staple-applicator", cover: "image 18.png" },
  { folder: "seche gant", slug: "glove-helmet-dryer", cover: "DSC06254.JPG" },
  { folder: "skincare", slug: "skincare-applicator", cover: "Applicateur.260.png" },
  { folder: "smartBottle", slug: "smart-bottle", cover: "BTD3 détouré.png" },
  { folder: "stajv", slug: "stajvelo-rv01", cover: "RV01-01 1.png" },
  { folder: "velo:scooter", slug: "folding-bike-scooter", cover: "VELO ELECTRIQUE PLIANT copie.jpg" },
  { folder: "weebot", slug: "weebot", cover: "weebotneige.png" },
];

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function listImages(folder) {
  if (!fs.existsSync(folder)) return [];

  return fs
    .readdirSync(folder)
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function convertImage(input, output) {
  await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: 2200,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 5 })
    .toFile(output);
}

fs.rmSync(OUT_ROOT, { recursive: true, force: true });
fs.mkdirSync(OUT_ROOT, { recursive: true });

const manifest = [];

for (const project of projects) {
  const sourceDir = path.join(SOURCE_ROOT, project.folder);
  const outputDir = path.join(OUT_ROOT, project.slug);
  fs.mkdirSync(outputDir, { recursive: true });

  const files = listImages(sourceDir);
  const fallbackInput = project.fallbackInput
    ? path.resolve(project.fallbackInput)
    : null;
  const ordered = [
    project.cover,
    ...files.filter((file) => file !== project.cover),
  ].filter(
    (file, index, array) =>
      (files.includes(file) || (file === project.cover && fallbackInput)) &&
      array.indexOf(file) === index,
  );

  const projectImages = [];

  for (const [index, file] of ordered.entries()) {
    const label = index === 0 ? "cover" : slugify(path.parse(file).name);
    const outputName = `${project.slug}-${String(index + 1).padStart(2, "0")}-${label}.webp`;
    const input =
      fallbackInput && file === project.cover && !files.includes(file)
        ? fallbackInput
        : path.join(sourceDir, file);
    const output = path.join(outputDir, outputName);

    await convertImage(input, output);

    projectImages.push({
      source: input.startsWith(SOURCE_ROOT)
        ? path.relative(SOURCE_ROOT, input)
        : path.relative(process.cwd(), input),
      output: `/assets/projects/${project.slug}/${outputName}`,
    });
  }

  manifest.push({
    slug: project.slug,
    sourceFolder: project.folder,
    cover: projectImages[0]?.output ?? null,
    images: projectImages,
  });
}

fs.writeFileSync(
  path.join(OUT_ROOT, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Prepared ${manifest.length} project asset folders in ${OUT_ROOT}`);
