/**
 * Comprehensive seed script , Adorzia Marketplace
 * Run:  node src/seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Designer = require("./models/Designer");
const Collection = require("./models/Collection");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Payout = require("./models/Payout");
const Review = require("./models/Review");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected\n");

  // ── Clear existing data ──────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Designer.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Payout.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log("Cleared all collections\n");

  // ── Create Users ─────────────────────────────────────────────────────────
  const customerUser = await User.create({
    name: "Ayesha Khan",
    email: "customer@demo.com",
    password: "password123",
    role: "buyer",
  });

  const designers = [
    { name: "Zara Ahmad", email: "zara@designer.com", password: "password123", role: "seller" },
    { name: "Bilal Hussain", email: "bilal@designer.com", password: "password123", role: "seller" },
    { name: "Fatima Noor", email: "fatima@designer.com", password: "password123", role: "seller" },
  ];

  const userDesigners = [];
  for (const d of designers) {
    userDesigners.push(await User.create(d));
  }

  const adminUser = await User.create({
    name: "Adorzia Admin",
    email: "admin@adorzia.com",
    password: "admin12345",
    role: "admin",
  });

  console.log(`✓ Users: ${userDesigners.length} designers + 1 customer + 1 admin`);

  // ── Create Designer Profiles ──────────────────────────────────────────────
  const designerProfiles = await Promise.all(
    userDesigners.map(async (u, i) => {
      const data = [
        {
          name: "Zara Ahmad", brandName: "ZA Studio",
          bio: "Contemporary Pakistani womenswear blending traditional craft with modern silhouettes.",
          category: "Womenswear", craftTraditions: ["Chikankari", "Handloom", "Block Printing"],
          studioCity: "Lahore", verified: true,
          socialLinks: {
            instagram: "https://instagram.com/zarastudio",
            website: "https://zarastudio.com",
            facebook: "https://facebook.com/zarastudio"
          }
        },
        {
          name: "Bilal Hussain", brandName: "BH Atelier",
          bio: "Luxury menswear reinterpreting heritage textiles through a contemporary lens.",
          category: "Menswear", craftTraditions: ["Zardozi", "Ajrak", "Handloom"],
          studioCity: "Karachi", verified: true,
          socialLinks: {
            instagram: "https://instagram.com/bhatelier",
            website: "https://bhatelier.com",
            facebook: "https://facebook.com/bhatelier"
          }
        },
        {
          name: "Fatima Noor", brandName: "Noor Couture",
          bio: "Bridal and formal wear celebrating Pakistani craftsmanship with modern elegance.",
          category: "Bridal", craftTraditions: ["Zardozi", "Mirror Work", "Handloom"],
          studioCity: "Islamabad", verified: false,
          socialLinks: {
            instagram: "https://instagram.com/noorcouture",
            website: "https://noorcouture.com"
          }
        },
      ][i];

      return Designer.create({
        ...data,
        userId: u._id, email: u.email, password: u.password, role: "seller",
        profileViews: Math.floor(Math.random() * 2000) + 500,
      });
    })
  );

  console.log(`✓ Designer profiles: ${designerProfiles.length}`);

  // ── Create Collections ────────────────────────────────────────────────────
  const collectionData = [
    { 
      designer: 0, name: "Geometry of Home", season: "Fall/Winter", category: "Womenswear", 
      craftTraditions: ["Chikankari", "Handloom"], status: "published", featured: true,
      description: "The 2024 FW collection by Zara Ahmad explores the intimate geometry of domestic spaces, where traditional Pakistani craftsmanship meets contemporary architectural forms. Each piece is a meditation on the concept of home—its structures, its memories, and the hands that shape it. Through meticulous Chikankari embroidery and handloom weaving, this collection transforms everyday garments into heirlooms that carry the weight of generations.",
      coverImage: "/assets/images/ajrak-architect-coat-adorzia1.webp",
      lookbookImages: [
        "/assets/images/ajrak-architect-coat-adorzia2.webp",
        "/assets/images/phulkari-reborn-blazer-adorzia.webp",
        "/assets/images/khaddar-modern-suit-adorzia.webp",
        "/assets/images/pashmina-wrap-dress-adorzia.webp",
        "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
        "/assets/images/mirror-rebel-tee-adorzia.webp",
        "/assets/images/rilli-sculpt-tote-adorzia.webp",
        "/assets/images/ajrak-architect-coat-adorzia1.webp",
        "/assets/images/phulkari-reborn-blazer-adorzia.webp",
        "/assets/images/khaddar-modern-suit-adorzia.webp",
        "/assets/images/pashmina-wrap-dress-adorzia.webp",
        "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
        "/assets/images/mirror-rebel-tee-adorzia.webp",
        "/assets/images/rilli-sculpt-tote-adorzia.webp",
        "/assets/images/ajrak-architect-coat-adorzia2.webp"
      ]
    },
    { 
      designer: 0, name: "Urban Heritage", season: "Spring/Summer", category: "Womenswear", 
      craftTraditions: ["Block Printing"], status: "published",
      description: "Urban Heritage is a celebration of Pakistan's living craft traditions, reimagined for the modern woman. Hand-block printed patterns tell stories of ancestral techniques passed down through generations, while contemporary silhouettes speak to the dynamism of today's fashion landscape. This collection bridges past and present, proving that heritage is not static—it evolves, adapts, and thrives.",
      coverImage: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
      lookbookImages: [
        "/assets/images/mirror-rebel-tee-adorzia.webp",
        "/assets/images/rilli-sculpt-tote-adorzia.webp"
      ]
    },
    { 
      designer: 1, name: "Desert Bloom", season: "Fall/Winter", category: "Menswear", 
      craftTraditions: ["Ajrak", "Zardozi"], status: "published", featured: true,
      description: "Desert Bloom draws from the stark beauty of Pakistan's Thar landscape, where life persists against all odds. The collection reinterprets Ajrak's ancient geometric patterns through a contemporary menswear lens, while Zardozi embroidery adds layers of luxury to structured silhouettes. Each piece is a testament to resilience—how beauty can flourish in the harshest conditions, rooted in tradition yet reaching toward the future.",
      coverImage: "/assets/images/ajrak-architect-coat-adorzia2.webp",
      lookbookImages: [
        "/assets/images/ajrak-architect-coat-adorzia1.webp",
        "/assets/images/phulkari-reborn-blazer-adorzia.webp",
        "/assets/images/khaddar-modern-suit-adorzia.webp",
        "/assets/images/pashmina-wrap-dress-adorzia.webp",
        "/assets/images/mirrorwork-bomber-jacket-adorzia.webp"
      ]
    },
    { 
      designer: 1, name: "Night Weave", season: "Couture", category: "Menswear", 
      craftTraditions: ["Handloom"], status: "published",
      description: "Night Weave is an exploration of texture, time, and the meditative quality of handloom weaving. Created during the quiet hours of dawn and dusk, this couture collection captures the essence of patience—each thread deliberately placed, each pattern emerging slowly from the weaver's loom. The result is a collection that honors the slow craft movement, offering garments that are as much about the journey of making as they are about the final form.",
      coverImage: "/assets/images/pashmina-wrap-dress-adorzia.webp",
      lookbookImages: [
        "/assets/images/mirrorwork-bomber-jacket-adorzia.webp"
      ]
    },
    { 
      designer: 2, name: "Eternal Vows", season: "Bridal", category: "Bridal", 
      craftTraditions: ["Zardozi", "Mirror Work"], status: "published", featured: true,
      description: "Eternal Vows is a love letter to Pakistani bridal traditions, reimagined for the modern bride. This collection celebrates the sacred rituals of marriage—the haldi, the mehndi, the baraat—through garments that honor centuries-old craftsmanship. Zardozi embroidery catches the light like promises made, while mirror work reflects the infinite reflections of love. Each piece is designed not just for a wedding day, but for the generations of memories that follow.",
      coverImage: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
      lookbookImages: [
        "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
        "/assets/images/mirror-rebel-tee-adorzia.webp",
        "/assets/images/rilli-sculpt-tote-adorzia.webp",
        "/assets/images/pashmina-wrap-dress-adorzia.webp",
        "/assets/images/ajrak-architect-coat-adorzia1.webp",
        "/assets/images/ajrak-architect-coat-adorzia2.webp",
        "/assets/images/khaddar-modern-suit-adorzia.webp"
      ]
    },
    { 
      designer: 2, name: "Summer Luxe", season: "Spring/Summer", category: "Womenswear", 
      craftTraditions: ["Handloom"], status: "draft",
      description: "Summer Luxe is an ode to effortless elegance, where handloom breathes new life into warm-weather dressing. Lightweight fabrics and relaxed silhouettes celebrate the art of doing less—both in design and in life. This collection invites you to slow down, to appreciate the subtle textures that emerge when craft meets comfort, and to find luxury in simplicity.",
      coverImage: "/assets/images/khaddar-modern-suit-adorzia.webp"
    },
  ];

  const collections = [];
  for (const c of collectionData) {
    const col = await Collection.create({
      ...c,
      designer: designerProfiles[c.designer]._id,
      description: `A curated collection exploring ${c.craftTraditions.join(" and ")} techniques.`,
      coverImage: `https://placehold.co/800x600/2d2d2d/f5f0eb?text=${encodeURIComponent(c.name)}`,
      lookbookImages: Array(3).fill(null).map((_, i) => `https://placehold.co/800x1000/2d2d2d/f5f0eb?text=${encodeURIComponent(c.name)}+${i+1}`),
    });
    collections.push(col);
  }

  console.log(`✓ Collections: ${collections.length}`);

  // ── Create Products ───────────────────────────────────────────────────────
  const productTemplates = [
    { designer: 0, collection: 0, name: "Embroidered Chikankari Tunic", category: "Kurta", price: 18500, craft: "Chikankari", sizes: ["XS","S","M","L","XL"], colors: ["Ivory","Dusty Rose","Sage"], stock: 12 },
    { designer: 0, collection: 0, name: "Handloom Silk Saree", category: "Dresses", price: 45000, craft: "Handloom", sizes: ["Free Size"], colors: ["Gold","Emerald","Burgundy"], stock: 5 },
    { designer: 0, collection: 0, name: "Block Print Palazzo Set", category: "Shalwar Kameez", price: 22000, craft: "Block Printing", sizes: ["S","M","L","XL"], colors: ["Indigo","Terracotta","Charcoal"], stock: 8 },
    { designer: 0, collection: 0, name: "Geometric Print Jacket", category: "Outerwear", price: 35000, craft: "Block Printing", sizes: ["S","M","L"], colors: ["Black","Navy"], stock: 4 },
    { designer: 0, collection: 0, name: "Minimal Silk Scarf", category: "Scarves", price: 8500, craft: "Handloom", sizes: ["One Size"], colors: ["Cream","Olive"], stock: 20 },
    { designer: 0, collection: 1, name: "Summer Breeze Kurta", category: "Kurta", price: 12000, craft: "Block Printing", sizes: ["XS","S","M","L"], colors: ["White","Sky Blue"], stock: 15 },
    { designer: 1, collection: 2, name: "Ajrak Print Shirt", category: "Kurta", price: 15000, craft: "Ajrak", sizes: ["S","M","L","XL","XXL"], colors: ["Maroon","Indigo"], stock: 10 },
    { designer: 1, collection: 2, name: "Zardozi Waistcoat", category: "Outerwear", price: 38000, craft: "Zardozi", sizes: ["S","M","L","XL"], colors: ["Black","Navy","Forest"], stock: 3 },
    { designer: 1, collection: 2, name: "Heritage Shawl", category: "Accessories", price: 28000, craft: "Handloom", sizes: ["One Size"], colors: ["Charcoal","Camel"], stock: 6 },
    { designer: 1, collection: 3, name: "Evening Bandhgala", category: "Suits", price: 65000, craft: "Zardozi", sizes: ["S","M","L","XL"], colors: ["Black","Midnight Blue"], stock: 2 },
    { designer: 2, collection: 4, name: "Bridal Lehenga", category: "Bridal", price: 185000, craft: "Zardozi", sizes: ["XS","S","M","L"], colors: ["Red","Gold","Maroon"], stock: 1 },
    { designer: 2, collection: 4, name: "Mirror Work Dupatta", category: "Scarves", price: 22000, craft: "Mirror Work", sizes: ["One Size"], colors: ["Ivory","Rose Gold"], stock: 7 },
  ];

  const products = [];
  for (const p of productTemplates) {
    const designer = designerProfiles[p.designer];
    const collection = collections.find((c) => c.designer.equals(designer._id) && c.name === productTemplates.find((t) => t.name === p.name)?.name) || collections[p.collection];

    const variants = p.sizes.flatMap((size) =>
      p.colors.map((color) => ({
        size, color,
        stock: p.stock,
        sku: `${designer.slug?.substring(0,2).toUpperCase()}-${p.name.split(" ")[0].substring(0,3).toUpperCase()}-${size}-${color.substring(0,2).toUpperCase()}`,
      }))
    );

    const product = await Product.create({
      name: p.name,
      designer: designer._id,
      collection: collection._id,
      category: p.category,
      craft: p.craft,
      price: p.price,
      oneLiner: `Handcrafted ${p.craft.toLowerCase()} ${p.category.toLowerCase()} piece.`,
      description: `This ${p.category.toLowerCase()} showcases exceptional ${p.craft.toLowerCase()} craftsmanship. Each piece is handcrafted by skilled artisans in ${designer.studioCity}.`,
      craftStory: `The ${p.craft.toLowerCase()} technique used in this piece has been passed down through generations of artisans in ${designer.studioCity}.`,
      materials: "Premium fabric, hand-dyed threads",
      careInstructions: "Dry clean only. Store in a cool, dry place.",
      sizes: p.sizes,
      colors: p.colors,
      variants,
      images: [{ url: `https://placehold.co/800x1000/2d2d2d/f5f0eb?text=${encodeURIComponent(p.name)}`, label: "Front", position: 0 }],
      status: "active",
      salesCount: Math.floor(Math.random() * 30) + 5,
      viewCount: Math.floor(Math.random() * 200) + 50,
    });
    products.push(product);
  }

  console.log(`✓ Products: ${products.length}`);

  // ── Create Orders ────────────────────────────────────────────────────────
  const statuses = ["new", "in_production", "ready_to_ship", "shipped", "delivered", "delivered", "delivered"];
  const orders = [];
  for (let i = 0; i < 12; i++) {
    const product = products[i % products.length];
    const status = statuses[i % statuses.length];
    const date = new Date(Date.now() - (12 - i) * 86400000);
    const dateStr = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("");
    const orderNumber = `ADR-${dateStr}-${String(i + 1).padStart(3, "0")}`;

    const order = await Order.create({
      orderNumber,
      customer: customerUser._id,
      designer: product.designer,
      items: [{
        product: product._id,
        name: product.name,
        image: product.images[0].url,
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1,
        price: product.priceFormatted,
        priceRaw: product.price,
      }],
      status,
      shipping: { address: "123 Gulberg III", city: "Lahore", province: "Punjab", zip: "54000", country: "Pakistan" },
      financial: {
        subtotal: product.price,
        commission: Math.round(product.price * 0.1),
        commissionRate: 0.1,
        shipping: 0,
        netPayout: Math.round(product.price * 0.9),
      },
      timeline: [{ status, timestamp: date }],
    });
    orders.push(order);
  }

  console.log(`✓ Orders: ${orders.length}`);

  // ── Create Payouts ───────────────────────────────────────────────────────
  const payouts = [];
  for (let i = 0; i < 6; i++) {
    const designer = designerProfiles[i % 3];
    const payout = await Payout.create({
      designer: designer._id,
      amount: Math.floor(Math.random() * 80000) + 20000,
      commission: Math.floor(Math.random() * 10000) + 2000,
      status: i < 4 ? "processed" : "pending",
      bankDetails: { holder: designer.name, accountMasked: "****4567", bank: "HBL", branch: "Gulberg, Lahore" },
      periodStart: new Date(2026, 5 - Math.floor(i / 2), 1),
      periodEnd: new Date(2026, 5 - Math.floor(i / 2), 15),
      processedAt: i < 4 ? new Date(Date.now() - i * 14 * 86400000) : undefined,
    });
    payouts.push(payout);
  }

  console.log(`✓ Payouts: ${payouts.length}`);

  // ── Create Reviews ───────────────────────────────────────────────────────
  const reviews = [];
  for (let i = 0; i < 8; i++) {
    const product = products[i % products.length];
    const review = await Review.create({
      product: product._id,
      customer: customerUser._id,
      designer: product.designer,
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
      title: ["Beautiful craftsmanship", "Absolutely stunning", "Exceeded expectations", "Worth every penny"][i % 4],
      text: ["The attention to detail is remarkable. Truly a piece of art.", "Received so many compliments. The fabric quality is exceptional.", "Fast delivery and the packaging was beautiful. Will order again.", "The embroidery work is even more beautiful in person."][i % 4],
      status: "approved",
      verifiedPurchase: true,
    });
    reviews.push(review);
  }

  console.log(`✓ Reviews: ${reviews.length}`);

  await mongoose.disconnect();
  console.log("\n✅ Seed complete. Demo accounts:\n");
  console.log("  Admin:     admin@adorzia.com     / admin12345");
  console.log("  Customer:  customer@demo.com      / password123");
  console.log("  Designer:  zara@designer.com      / password123");
  console.log("  Designer:  bilal@designer.com     / password123");
  console.log("  Designer:  fatima@designer.com    / password123\n");
};

seed().catch((err) => { console.error(err); process.exit(1); });
