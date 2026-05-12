import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SeedProduct = {
  slug: string;
  name: string;
  brand: "nike" | "adidas" | "supreme" | "hats";
  description: string;
  imageUrl: string;
  sourceUrl: string;
  basePrice?: string;
  sizes: string[];
};

const SNEAKER_SIZES = ["40", "41", "42", "43", "44", "45", "46"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];
const OS = ["OS"];

const BRANDS = [
  { slug: "nike", name: "Nike" },
  { slug: "adidas", name: "Adidas" },
  { slug: "supreme", name: "Supreme" },
  { slug: "hats", name: "Hats" },
];

const PRODUCTS: SeedProduct[] = [
  { slug: "jordan-3-retro-laser-orange-w-1", name: "Jordan 3 Retro Laser Orange (W)", brand: "nike",
    description: "STYLE CK9246-108 COLORWAY WHITE/LASER ORANGE-CEMENT GREY-BLACK RELEASE DATE 08/21/2020",
    imageUrl: "/images/products/jordan-3-retro-laser-orange-w-1.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/jordan-3-retro-laser-orange-w-1",
    basePrice: "320.00", sizes: SNEAKER_SIZES },
  { slug: "jordan-1-low-dark-beetroot-black-w", name: "Jordan 1 Low Dark Beetroot Black (W)", brand: "nike",
    description: "STYLE DB6491-600 COLORWAY DARK BEETROOT/BLACK-WHITE RELEASE DATE 11/29/2020",
    imageUrl: "/images/products/jordan-1-low-dark-beetroot-black-w.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/jordan-1-low-dark-beetroot-black-w",
    basePrice: "240.00", sizes: SNEAKER_SIZES },
  { slug: "jordan-1-mid-hyper-royal", name: "Jordan 1 Mid Hyper Royal", brand: "nike",
    description: "STYLE 554725-077 COLORWAY BLACK/HYPER ROYAL/WHITE",
    imageUrl: "/images/products/jordan-1-mid-hyper-royal.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/jordan-1-mid-hyper-royal",
    basePrice: "210.00", sizes: SNEAKER_SIZES },
  { slug: "air-force-1-low-triple-white", name: "Air Force 1 Low Triple White", brand: "nike",
    description: "STYLE 315122-111 COLORWAY WHITE/WHITE",
    imageUrl: "/images/products/air-force-1-low-triple-white.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/air-force-1-low-triple-white",
    basePrice: "150.00", sizes: SNEAKER_SIZES },
  { slug: "dunk-low-panda", name: "Dunk Low Panda", brand: "nike",
    description: "STYLE DD1391-100 COLORWAY WHITE/BLACK",
    imageUrl: "/images/products/dunk-low-panda.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/dunk-low-panda",
    basePrice: "180.00", sizes: SNEAKER_SIZES },
  { slug: "jordan-4-retro-bred", name: "Jordan 4 Retro Bred", brand: "nike",
    description: "STYLE 308497-060 COLORWAY BLACK/CEMENT GREY-FIRE RED",
    imageUrl: "/images/products/jordan-4-retro-bred.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/jordan-4-retro-bred",
    basePrice: "350.00", sizes: SNEAKER_SIZES },
  { slug: "jordan-11-cool-grey", name: "Jordan 11 Cool Grey", brand: "nike",
    description: "STYLE CT8012-005 COLORWAY MEDIUM GREY/WHITE-COOL GREY",
    imageUrl: "/images/products/jordan-11-cool-grey.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/jordan-11-cool-grey",
    basePrice: "380.00", sizes: SNEAKER_SIZES },
  { slug: "air-max-90-infrared", name: "Air Max 90 Infrared", brand: "nike",
    description: "STYLE CT1685-100 COLORWAY WHITE/COOL GREY-INFRARED",
    imageUrl: "/images/products/air-max-90-infrared.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/air-max-90-infrared",
    basePrice: "175.00", sizes: SNEAKER_SIZES },
  { slug: "yeezy-boost-350-v2-zebra", name: "Yeezy Boost 350 V2 Zebra", brand: "adidas",
    description: "STYLE CP9654 COLORWAY WHITE/CORE BLACK/RED",
    imageUrl: "/images/products/yeezy-boost-350-v2-zebra.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/yeezy-boost-350-v2-zebra",
    basePrice: "330.00", sizes: SNEAKER_SIZES },
  { slug: "yeezy-boost-700-wave-runner", name: "Yeezy Boost 700 Wave Runner", brand: "adidas",
    description: "STYLE B75571 COLORWAY SOLID GREY/CHALK WHITE",
    imageUrl: "/images/products/yeezy-boost-700-wave-runner.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/yeezy-boost-700-wave-runner",
    basePrice: "360.00", sizes: SNEAKER_SIZES },
  { slug: "yeezy-slide-bone", name: "Yeezy Slide Bone", brand: "adidas",
    description: "STYLE FZ5897 COLORWAY BONE/BONE",
    imageUrl: "/images/products/yeezy-slide-bone.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/yeezy-slide-bone",
    basePrice: "140.00", sizes: SNEAKER_SIZES },
  { slug: "samba-og-cloud-white", name: "Samba OG Cloud White", brand: "adidas",
    description: "STYLE B75806 COLORWAY CLOUD WHITE/CORE BLACK",
    imageUrl: "/images/products/samba-og-cloud-white.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/samba-og-cloud-white",
    basePrice: "130.00", sizes: SNEAKER_SIZES },
  { slug: "gazelle-bold-pink", name: "Gazelle Bold Pink", brand: "adidas",
    description: "STYLE HQ6889 COLORWAY PINK/CORE BLACK",
    imageUrl: "/images/products/gazelle-bold-pink.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/gazelle-bold-pink",
    basePrice: "135.00", sizes: SNEAKER_SIZES },
  { slug: "campus-00s-grey", name: "Campus 00s Grey", brand: "adidas",
    description: "STYLE HQ8707 COLORWAY GREY/CORE WHITE",
    imageUrl: "/images/products/campus-00s-grey.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/campus-00s-grey",
    basePrice: "125.00", sizes: SNEAKER_SIZES },
  { slug: "supreme-box-logo-tee-white", name: "Supreme Box Logo Tee White", brand: "supreme",
    description: "Cotton tee with red box logo print.",
    imageUrl: "/images/products/supreme-box-logo-tee-white.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-box-logo-tee-white",
    basePrice: "90.00", sizes: APPAREL_SIZES },
  { slug: "supreme-box-logo-tee-black", name: "Supreme Box Logo Tee Black", brand: "supreme",
    description: "Black cotton tee with red box logo print.",
    imageUrl: "/images/products/supreme-box-logo-tee-black.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-box-logo-tee-black",
    basePrice: "90.00", sizes: APPAREL_SIZES },
  { slug: "supreme-bogo-hoodie-grey", name: "Supreme Box Logo Hoodie Grey", brand: "supreme",
    description: "Heavyweight cotton hoodie with box logo embroidery.",
    imageUrl: "/images/products/supreme-bogo-hoodie-grey.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-bogo-hoodie-grey",
    basePrice: "220.00", sizes: APPAREL_SIZES },
  { slug: "supreme-bogo-hoodie-navy", name: "Supreme Box Logo Hoodie Navy", brand: "supreme",
    description: "Navy box logo hoodie, heavyweight cotton.",
    imageUrl: "/images/products/supreme-bogo-hoodie-navy.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-bogo-hoodie-navy",
    basePrice: "220.00", sizes: APPAREL_SIZES },
  { slug: "supreme-mountain-jacket", name: "Supreme Mountain Jacket", brand: "supreme",
    description: "Technical mountain shell with Supreme logo.",
    imageUrl: "/images/products/supreme-mountain-jacket.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-mountain-jacket",
    basePrice: "450.00", sizes: APPAREL_SIZES },
  { slug: "supreme-arc-logo-crewneck", name: "Supreme Arc Logo Crewneck", brand: "supreme",
    description: "Heavyweight crewneck with embroidered arc logo.",
    imageUrl: "/images/products/supreme-arc-logo-crewneck.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/supreme-arc-logo-crewneck",
    basePrice: "180.00", sizes: APPAREL_SIZES },
  { slug: "new-era-yankees-black-cap", name: "New Era Yankees Black Cap", brand: "hats",
    description: "59FIFTY fitted, black on black NY embroidery.",
    imageUrl: "/images/products/new-era-yankees-black-cap.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/new-era-yankees-black-cap",
    basePrice: "55.00", sizes: OS },
  { slug: "stussy-stock-low-pro-cap", name: "Stussy Stock Low Pro Cap", brand: "hats",
    description: "Low profile cap with Stussy stock script.",
    imageUrl: "/images/products/stussy-stock-low-pro-cap.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/stussy-stock-low-pro-cap",
    basePrice: "45.00", sizes: OS },
  { slug: "carhartt-watch-beanie-black", name: "Carhartt Watch Beanie Black", brand: "hats",
    description: "Rib knit watch hat, classic Carhartt patch.",
    imageUrl: "/images/products/carhartt-watch-beanie-black.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/carhartt-watch-beanie-black",
    basePrice: "30.00", sizes: OS },
  { slug: "patta-script-trucker", name: "Patta Script Trucker", brand: "hats",
    description: "Mesh-back trucker with embroidered Patta script.",
    imageUrl: "/images/products/patta-script-trucker.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/patta-script-trucker",
    basePrice: "50.00", sizes: OS },
  { slug: "kith-classic-logo-cap", name: "Kith Classic Logo Cap", brand: "hats",
    description: "Six-panel cap with embroidered Kith script.",
    imageUrl: "/images/products/kith-classic-logo-cap.jpg",
    sourceUrl: "https://www.eightyfiveeleven.com/product-page/kith-classic-logo-cap",
    basePrice: "55.00", sizes: OS },
];

function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const rnd = prng(8511);

async function seedBrands() {
  for (const b of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      create: b,
      update: { name: b.name },
    });
  }
}

async function seedProducts() {
  for (const p of PRODUCTS) {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: p.brand } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        brandId: brand.id,
        description: p.description,
        imageUrl: p.imageUrl,
        sourceUrl: p.sourceUrl,
        basePrice: p.basePrice ? new Prisma.Decimal(p.basePrice) : null,
      },
      update: {
        name: p.name,
        brandId: brand.id,
        description: p.description,
        imageUrl: p.imageUrl,
        sourceUrl: p.sourceUrl,
        basePrice: p.basePrice ? new Prisma.Decimal(p.basePrice) : null,
      },
    });

    for (const size of p.sizes) {
      const stock = Math.floor(rnd() * 9);
      await prisma.productVariant.upsert({
        where: { productId_sizeEu: { productId: product.id, sizeEu: size } },
        create: {
          productId: product.id,
          sizeEu: size,
          sku: `${p.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}-${size}`,
          stock,
        },
        update: { stock },
      });
    }
  }
}

async function main() {
  console.log("Seeding brands...");
  await seedBrands();
  console.log("Seeding products + variants...");
  await seedProducts();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
