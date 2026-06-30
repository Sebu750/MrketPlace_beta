/**
 * Article/Editorial Seed Script - Adorzia Marketplace
 * Run:  node src/seedArticles.js
 * 
 * Creates 4 editorial articles focused on:
 * - Fashion entrepreneurship
 * - PIFD/AIFD (Pakistan fashion institutes)
 * - Pakistani fashion startups
 * - Craft heritage and designer stories
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Article = require("./models/Article");

const seedArticles = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected\n");

  // Clear existing articles
  await Article.deleteMany({});
  console.log("Cleared existing articles\n");

  const articles = [
    {
      title: "From PIFD to Profit: How Pakistan's Fashion Graduates Are Building Sustainable Brands",
      category: "Designer Stories",
      excerpt: "Inside the journey of three PIFD graduates who transformed their thesis collections into thriving fashion businesses, and what their success means for Pakistan's creative economy.",
      content: `The corridors of Pakistan Institute of Fashion and Design (PIFD) in Lahore have long been viewed as the gateway to the country's fashion industry. But in recent years, a new narrative has emerged: students aren't just graduating to join established houses—they're building their own.

**The Thesis That Became a Brand**

When Zara Ahmad presented her final year collection "Geometry of Home" at the PIFD Graduate Show 2024, she wasn't thinking about commercial viability. The collection, which explored the intersection of traditional Chikankari embroidery with contemporary silhouettes, was purely an academic exercise—or so she thought.

"My professors kept asking me: 'Are you going to produce this?' I had no idea how to even begin," Zara recalls from her studio in Gulberg III, Lahore. "But buyers approached me after the show. Actual buyers. That's when I realized this wasn't just a student project anymore."

Six months later, ZA Studio was born. Today, the brand operates from a small atelier in Lahore, employing four artisans and selling pieces ranging from PKR 12,000 to PKR 45,000.

**The Startup Ecosystem Gap**

Zara's story, while inspiring, highlights a systemic issue. Pakistan's fashion education produces hundreds of graduates annually, yet the infrastructure to support them as entrepreneurs remains fragmented.

"PIFD teaches you design, draping, textile science—but not business," says Bilal Hussain, another PIFD alumnus who launched BH Atelier in Karachi. "I knew how to construct a garment, but I didn't know how to price it, market it, or find production."

This gap has given rise to informal mentorship networks, where recent graduates pool resources, share artisan contacts, and navigate the industry together. WhatsApp groups have become unlikely business incubators.

**Craft as Competitive Advantage**

What sets Pakistani fashion startups apart is their deep connection to craft traditions. Unlike fast fashion brands that prioritize speed and volume, these emerging designers are building businesses around heritage techniques: Chikankari from Punjab, Ajrak from Sindh, Zardozi from Mughal courts.

"We're not competing with fast fashion," explains Fatima Noor, whose bridal label Noor Couture operates from Islamabad. "We're offering something fast fashion can't replicate: story, craftsmanship, and cultural authenticity. That's our competitive advantage."

**The Road Ahead**

Despite progress, challenges remain. Access to funding, production infrastructure, and international market exposure continue to be significant barriers. Yet the resilience of this generation suggests a shift is underway.

"We're not waiting for the industry to change," Zara says. "We're building it ourselves, one collection at a time."`,
      coverImage: "/assets/images/home-hero-runway.webp",
      gallery: [
        "/assets/images/home-designer-portrait-1.webp",
        "/assets/images/home-heritage-craft.webp",
        "/assets/images/studio1.webp",
      ],
      author: "Adorzia Editorial Team",
      readTime: 8,
      featured: true,
      status: "published",
      publishedAt: new Date("2026-06-15"),
    },
    {
      title: "The Invisible Hands: Documenting Sindh's Ajrak Artisans in the Age of Fast Fashion",
      category: "Craft Documentation",
      excerpt: "A deep dive into the multigenerational artisans keeping Ajrak block printing alive—and the designers working to ensure their craft survives another century.",
      content: `In the small town of Bhit Shah, Sindh, the rhythmic sound of wooden blocks hitting fabric has echoed for over 400 years. This is the heartbeat of Ajrak—a craft so intrinsic to Sindhi identity that it transcends fashion, entering the realm of cultural heritage.

**The Process**

Ajrak printing is not for the impatient. A single piece of fabric undergoes up to 16 stages: washing, treating with natural dyes, block printing with geometric patterns, and sun-drying. The entire process takes 15-20 days and requires mastery of chemistry, pattern-making, and timing.

"You cannot rush Ajrak," says Ustad Ghulam Rasool, a third-generation Ajrak artisan. "The climate, the water, the dye mixture—everything must be in harmony. My grandfather taught my father, who taught me. Now I teach my son."

**The Threat**

Fast fashion's demand for cheap, quickly-produced textiles has put immense pressure on traditional crafts. Screen-printed imitations of Ajrak flood markets at a fraction of the cost, undercutting authentic artisans who cannot compete on price or speed.

Meanwhile, younger generations are leaving the craft for more lucrative opportunities in urban centers. The knowledge transfer that has sustained Ajrak for centuries is at risk of breaking.

**Designers as Custodians**

A new generation of Pakistani designers is stepping into an unexpected role: craft custodians. By incorporating authentic Ajrak into contemporary collections and paying artisans fair wages, they're creating economic incentives for the craft to survive.

Bilal Hussain's "Desert Bloom" collection, featured in his Karachi atelier, reinterprets Ajrak through modern menswear silhouettes. Each piece is co-created with artisans from Bhit Shah, with the designer's name appearing alongside the artisan's on product tags.

"This isn't charity," Bilal emphasizes. "This is partnership. These artisans possess knowledge that no fashion school can teach. We're not saving the craft—we're learning from it."

**The Market Reality**

Authentic Ajrak pieces command premium prices: PKR 15,000 to PKR 65,000 for garments, significantly higher than printed imitations. But designers argue that fair pricing is essential to sustaining the craft ecosystem.

"When customers understand the process—the 20 days of labor, the generational knowledge, the natural dyes—the price makes sense," says Fatima Noor, who has incorporated Ajrak-inspired patterns into her bridal work.

**Looking Forward**

The survival of Ajrak, and crafts like it, depends on more than designer partnerships. It requires consumer education, institutional support, and policy frameworks that protect traditional crafts from exploitation.

But for now, in Bhit Shah, the wooden blocks continue their rhythmic dance on fabric—a centuries-old conversation between artisan, material, and culture, refusing to be silenced by the noise of fast fashion.`,
      coverImage: "/assets/images/home-heritage-craft.webp",
      gallery: [
        "/assets/images/craft.webp",
        "/assets/images/spotlight-mission-craft-1.webp",
        "/assets/images/spotlight-mission-craft-2.webp",
      ],
      author: "Adorzia Editorial Team",
      readTime: 10,
      featured: true,
      status: "published",
      publishedAt: new Date("2026-06-08"),
    },
    {
      title: "Why Pakistani Fashion Startups Don't Need Venture Capital—Yet",
      category: "Industry Reports",
      excerpt: "An analysis of how Pakistan's emerging fashion brands are bootstrapping their way to sustainability, and why slow growth might be their greatest strength.",
      content: `In the global startup ecosystem, venture capital is often viewed as the holy grail of growth. But Pakistan's emerging fashion designers are writing a different playbook—one that prioritizes sustainability over scale, and craft over commodification.

**The Bootstrap Reality**

Unlike tech startups that require massive upfront investment in infrastructure, fashion labels can start small. A sewing machine, fabric, and design skills are the bare minimum. Many Pakistani fashion entrepreneurs begin with made-to-order models, producing garments only after receiving payment.

"I started with PKR 50,000 and a Instagram page," says Zara Ahmad of ZA Studio. "No investors, no loans, no fancy office. Just me, my designs, and a tailor who believed in the vision."

This bootstrap approach has profound implications. Without investor pressure to scale rapidly, designers can focus on quality, craft authenticity, and building genuine customer relationships.

**The Craft-First Advantage**

Pakistani fashion startups possess something that cannot be easily replicated: access to centuries-old craft traditions. Chikankari, Ajrak, Zardozi, Mirror Work—these techniques require skilled artisans and time-intensive processes that fast fashion cannot duplicate.

"This is our moat," explains Bilal Hussain. "Investors always ask: 'What's your competitive advantage?' It's not technology or distribution. It's craft. And craft cannot be rushed or scaled infinitely without losing its essence."

**The International Opportunity**

Global consumers are increasingly seeking authentic, story-driven fashion. The slow fashion movement, valued at USD 8.3 billion globally, aligns perfectly with what Pakistani designers naturally produce: small-batch, craft-intensive, culturally-rooted garments.

Yet accessing international markets remains challenging. Shipping logistics, payment gateways, and brand visibility require resources that bootstrapped startups often lack.

**The Middle Ground**

Some designers are exploring alternative funding models: pre-sales, crowdfunding, and strategic partnerships with established retailers. These approaches provide capital without sacrificing creative control or forcing premature scale.

"We don't need millions in venture capital," says Fatima Noor. "We need customers who value what we create, platforms that tell our stories authentically, and time to grow organically."

**The Warning**

There's a risk in romanticizing bootstrapping. Access to capital could accelerate growth, expand market reach, and create employment at scale. The key is finding investors who understand the fashion industry's unique dynamics and respect craft-based business models.

**The Verdict**

Pakistani fashion startups don't need venture capital—yet. They need sustainable revenue models, craft preservation partnerships, and patient growth strategies. But as the industry matures and international opportunities expand, strategic investment could play a role.

The question isn't whether Pakistani fashion startups should take venture capital. The question is: when they do, will they compromise the craft-first ethos that makes them unique?

For now, the answer seems clear: slow growth, authentic craft, sustainable businesses. Not the Silicon Valley model, but perhaps a better one for fashion.`,
      coverImage: "/assets/images/studio1.webp",
      gallery: [
        "/assets/images/home-designer-portrait-2.webp",
        "/assets/images/home-fabric-innovation.webp",
      ],
      author: "Adorzia Editorial Team",
      readTime: 9,
      featured: true,
      status: "published",
      publishedAt: new Date("2026-05-28"),
    },
    {
      title: "The Student Designer: Inside Pakistan's Fashion School Revolution",
      category: "Student Features",
      excerpt: "Meet the final-year students at PIFD and AIFD who are already building brands, selling collections, and redefining what it means to 'graduate' into fashion.",
      content: `The traditional narrative of fashion education is linear: study for four years, graduate, assist an established designer, then eventually launch your own label. But Pakistan's fashion students are rewriting this script.

**The New Normal**

At Pakistan Institute of Fashion and Design (PIFD) in Lahore and Apparel Institute of Fashion and Design (AIFD) in Karachi, final-year students are no longer waiting for graduation to launch their brands. Many are already selling pieces, building Instagram followings, and participating in trade shows.

"By the time I graduate, I'll have completed my third collection," says Ayesha Rahman, a final-year PIFD student whose minimalist shalwar kameez line has garnered 12,000 Instagram followers. "Graduation isn't the beginning for me. It's validation."

**Why Now?**

Several factors have converged to enable this shift:

**Social Commerce:** Instagram and WhatsApp have democratized fashion retail. Students can showcase collections, take orders, and process payments without physical stores or large marketing budgets.

**Craft Accessibility:** Unlike previous generations who struggled to find artisan partnerships, today's students grow up in an era where craft documentation is accessible online. They know where to find Chikankari embroiderers in Lucknow, Ajrak printers in Sindh, and Zardozi artisans in Lahore.

**Market Demand:** Pakistani consumers, particularly the diaspora, are seeking authentic, contemporary fashion that honors tradition. Student designers, unburdened by commercial pressures, are uniquely positioned to experiment and innovate.

**The Thesis Collection as Launchpad**

The most significant shift is the transformation of thesis collections from academic exercises into commercial products. What was once presented only to professors and peers is now photographed, marketed, and sold.

"My thesis collection sold out in three weeks," says Omar Farooq, an AIFD graduate whose gender-neutral streetwear line incorporates traditional Pakistani motifs. "I didn't plan to sell it. But people kept asking to buy pieces. So I started producing."

**The Challenges**

Despite enthusiasm, student designers face significant hurdles:

- **Production Knowledge:** Design schools teach creativity, not manufacturing. Students struggle with quality control, sizing consistency, and production scaling.
- **Pricing Strategy:** Many underprice their work, not accounting for labor, materials, and time. Others overprice, alienating their peer demographic.
- **Time Management:** Balancing academic requirements with business operations is exhausting. Many student designers report working 16-hour days.

**The Institutional Response**

Fashion schools are beginning to adapt. PIFD has introduced entrepreneurship modules, connecting students with mentors who have launched successful brands. AIFD has partnered with local retailers to provide student designers with retail exposure.

"We're realizing our role isn't just to teach design," says Dr. Saima Khan, Head of Design at PIFD. "It's to prepare students for the reality of building sustainable creative careers."

**What's Next?**

The student designer movement suggests a broader shift in how fashion education and industry intersect. When graduation is no longer the starting line but rather a milestone in an ongoing journey, the entire ecosystem changes.

For Pakistani fashion, this could mean a more diverse, innovative, and authentic industry—one where fresh voices aren't waiting for permission to create, but are already doing so.

The question for established brands, retailers, and platforms isn't whether to support student designers. It's how to do so without exploiting their enthusiasm or compromising their creative vision.

Because these students aren't the future of Pakistani fashion. They're its present.`,
      coverImage: "/assets/images/home-designer-portrait-3.webp",
      gallery: [
        "/assets/images/designer-1.webp",
        "/assets/images/designer-2.webp",
        "/assets/images/designer-3.webp",
      ],
      author: "Adorzia Editorial Team",
      readTime: 11,
      featured: false,
      status: "published",
      publishedAt: new Date("2026-05-15"),
    },
  ];

  const created = [];
  for (const articleData of articles) {
    const article = await Article.create(articleData);
    created.push(article);
    console.log(`✓ Created: ${article.title}`);
  }

  await mongoose.disconnect();
  console.log(`\n✅ Seed complete. ${created.length} articles created.\n`);
};

seedArticles().catch((err) => {
  console.error(err);
  process.exit(1);
});
