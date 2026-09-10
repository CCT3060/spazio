import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Default admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@farnichare.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@farnichare.com",
      passwordHash,
      role: "admin",
    },
  });
  console.log("✓ Admin user created: admin@farnichare.com / admin123");

  // Site settings defaults
  const settings = [
    { key: "showroom_hours", value: "Mon–Fri 9am–5pm, Sat 10am–4pm" },
    { key: "address", value: "123 Luxury Ave, Los Angeles, CA 90001" },
    { key: "phone", value: "+1 (310) 555-0100" },
    { key: "email", value: "info@farnichare.com" },
    { key: "facebook_url", value: "" },
    { key: "instagram_url", value: "" },
    { key: "pinterest_url", value: "" },
    { key: "brand_blurb", value: "Curating exceptional furniture & lighting for discerning interiors." },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✓ Site settings seeded");

  // Sample categories
  const lighting = await prisma.category.upsert({
    where: { slug: "lighting" },
    update: {},
    create: { name: "Lighting", slug: "lighting", sortOrder: 1 },
  });
  const chandeliers = await prisma.category.upsert({
    where: { slug: "chandeliers" },
    update: {},
    create: { name: "Chandeliers", slug: "chandeliers", parentId: lighting.id, sortOrder: 1 },
  });
  await prisma.category.upsert({
    where: { slug: "table-lamps" },
    update: {},
    create: { name: "Table Lamps", slug: "table-lamps", parentId: lighting.id, sortOrder: 2 },
  });
  const furniture = await prisma.category.upsert({
    where: { slug: "furniture" },
    update: {},
    create: { name: "Furniture", slug: "furniture", sortOrder: 2 },
  });
  await prisma.category.upsert({
    where: { slug: "sofas" },
    update: {},
    create: { name: "Sofas", slug: "sofas", parentId: furniture.id, sortOrder: 1 },
  });
  await prisma.category.upsert({
    where: { slug: "dining-tables" },
    update: {},
    create: { name: "Dining Tables", slug: "dining-tables", parentId: furniture.id, sortOrder: 2 },
  });
  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: { name: "Accessories", slug: "accessories", sortOrder: 3 },
  });
  console.log("✓ Categories seeded");

  // Sample products
  await prisma.product.upsert({
    where: { sku: "LGT-001" },
    update: {},
    create: {
      sku: "LGT-001",
      name: "Baccarat Crystal Chandelier",
      slug: "baccarat-crystal-chandelier",
      categoryId: chandeliers.id,
      shortDescription: "A breathtaking 24-arm chandelier in hand-cut crystal.",
      description: "<p>Crafted by master artisans, this <strong>24-arm crystal chandelier</strong> is the centrepiece of any grand interior. Each crystal is hand-cut for maximum light refraction.</p>",
      price: 12800,
      itemNumber: "EH-LGT-001",
      material: "Crystal, Brass",
      finish: "Polished Brass",
      dimensions: "W: 120cm | H: 90cm",
      stockStatus: "in_stock",
      isFeatured: true,
    },
  });
  await prisma.product.upsert({
    where: { sku: "FRN-001" },
    update: {},
    create: {
      sku: "FRN-001",
      name: "Versailles Dining Table",
      slug: "versailles-dining-table",
      categoryId: furniture.id,
      shortDescription: "An eight-seat dining table in solid marble and brushed gold.",
      description: "<p>The <strong>Versailles Dining Table</strong> marries Calacatta marble with a hand-brushed 24-carat gold base, seating eight in palatial style.</p>",
      price: 22500,
      salePrice: 19800,
      itemNumber: "EH-FRN-001",
      material: "Calacatta Marble, Steel",
      finish: "Brushed Gold",
      dimensions: "L: 240cm | W: 110cm | H: 76cm",
      stockStatus: "made_to_order",
      isFeatured: true,
    },
  });
  await prisma.product.upsert({
    where: { sku: "ACC-001" },
    update: {},
    create: {
      sku: "ACC-001",
      name: "Onyx Decorative Vase",
      slug: "onyx-decorative-vase",
      categoryId: accessories.id,
      shortDescription: "Hand-carved Mexican onyx vase with natural veining.",
      description: "<p>Each <strong>Onyx Decorative Vase</strong> is unique — hand-carved from a single block of Mexican onyx, featuring natural green and honey veining.</p>",
      price: 1450,
      itemNumber: "EH-ACC-001",
      material: "Mexican Onyx",
      dimensions: "H: 45cm | Dia: 22cm",
      stockStatus: "out_of_stock",
      isFeatured: false,
    },
  });
  console.log("✓ Sample products seeded");

  // Homepage slides
  await prisma.homepageSlide.upsert({
    where: { id: 1 },
    update: { imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80" },
    create: {
      title: "Illuminate Your World",
      subtitle: "Exceptional lighting for exceptional spaces",
      imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80",
      linkUrl: "/collections/lighting",
      buttonText: "Explore Lighting",
      sortOrder: 1,
    },
  });
  await prisma.homepageSlide.upsert({
    where: { id: 2 },
    update: { imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80" },
    create: {
      title: "The Art of Living",
      subtitle: "Luxury furniture crafted for generations",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80",
      linkUrl: "/collections/furniture",
      buttonText: "Explore Furniture",
      sortOrder: 2,
    },
  });
  console.log("✓ Homepage slides seeded");

  // Homepage sections
  await prisma.homepageSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sectionType: "heritage",
      title: "Our Heritage",
      subtitle: "Est. 1987",
      bodyText: "<p>For over three decades, Spazio has sourced the world's finest furniture and lighting — bringing European craftsmanship to discerning homes across the globe.</p>",
      imageUrl: "/uploads/placeholder-heritage.jpg",
      sortOrder: 1,
    },
  });
  await prisma.homepageSection.upsert({
    where: { id: 2 },
    update: {},
    create: {
      sectionType: "trade_cta",
      title: "Trade Program",
      subtitle: "Exclusive benefits for design professionals",
      bodyText: "<p>Join our Trade Program and access exclusive pricing, priority service, and a dedicated account manager.</p>",
      linkUrl: "/pages/trade-program",
      sortOrder: 2,
    },
  });
  console.log("✓ Homepage sections seeded");

  // Static pages
  const staticPages = [
    {
      slug: "about-us",
      title: "About Us",
      content: "<h1>About Spazio</h1><p>We curate exceptional furniture and lighting for discerning interiors worldwide.</p>",
    },
    {
      slug: "trade-program",
      title: "Trade Program",
      content: "<h1>Trade Program</h1><p>Design professionals enjoy exclusive access to our full catalog with trade pricing and dedicated support.</p>",
    },
    {
      slug: "shipping-returns",
      title: "Shipping & Returns",
      content: "<h1>Shipping & Returns</h1><p>We offer white-glove delivery on all orders. Please contact us to arrange returns within 14 days of receipt.</p>",
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "<h1>Privacy Policy</h1><p>We are committed to protecting your personal data in accordance with applicable data protection laws.</p>",
    },
    {
      slug: "terms-conditions",
      title: "Terms & Conditions",
      content: "<h1>Terms & Conditions</h1><p>By accessing our website you agree to our terms of service. All prices are subject to change without notice.</p>",
    },
  ];
  for (const p of staticPages) {
    await prisma.page.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  console.log("✓ Static pages seeded");

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
