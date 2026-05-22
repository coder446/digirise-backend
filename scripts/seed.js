const sequelize = require('../src/models/index');
const BlogPost = require('../src/models/BlogPost');
const Project = require('../src/models/Project');

async function seed() {
    try {
        console.log('Synchronizing database...');
        await sequelize.sync({ alter: true });

        console.log('Clearing existing data...');
        // Clear existing data to avoid unique constraint errors
        await BlogPost.destroy({ where: {}, truncate: true });
        await Project.destroy({ where: {}, truncate: true });

        console.log('Adding demo blogs...');
        await BlogPost.bulkCreate([
            {
                title: 'Mastering Local SEO for Badlapur Businesses',
                slug: 'mastering-local-seo-badlapur',
                content: `
                    <h2>Why Local SEO Matters</h2>
                    <p>For businesses in growing hubs like Badlapur, local SEO is the difference between being invisible and being the top choice for customers. In 2026, Google's algorithms prioritize hyper-local relevance.</p>
                    <h3>1. Optimize Your Google Business Profile</h3>
                    <p>Ensure your address, phone number, and operating hours are consistent across the web. Badlapur residents often search for services "near me" on their mobile devices.</p>
                    <h3>2. Use Local Keywords</h3>
                    <p>Incorporate terms like "Marketing Agency in Badlapur East" or "Best SEO Services in Ambernath" naturally into your content.</p>
                    <h2>Conclusion</h2>
                    <p>Starting with local SEO is the fastest way to see ROI from your digital marketing efforts.</p>
                `,
                excerpt: 'Discover how to dominate the local search results in Badlapur and attract more customers to your storefront.',
                category: 'SEO',
                authorName: 'Yashashree P.',
                metaTitle: 'Local SEO Guide for Badlapur Businesses | DigitalRise',
                metaDescription: 'Learn how to optimize your business for local search in Badlapur. Step-by-step guide to Google Business Profile and local keywords.',
                focusKeyword: 'Local SEO Badlapur',
                readTime: '6 MIN READ',
                date: '2026-04-25',
                image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1000&auto=format&fit=crop'
            },
            {
                title: 'The Impact of AI on Modern Web Design',
                slug: 'ai-impact-web-design-2026',
                content: `
                    <h2>AI: The New Designer Assistant</h2>
                    <p>Artificial Intelligence has transformed from a gimmick into a core part of the web design workflow. From layout generation to color palette optimization, AI is everywhere.</p>
                    <h3>Generative Visuals</h3>
                    <p>Using AI-generated imagery allows for unique branding that doesn't rely on overused stock photos. This creates a premium feel for modern websites.</p>
                    <h3>Personalization at Scale</h3>
                    <p>AI enables websites to adapt their content in real-time based on user behavior, leading to significantly higher conversion rates.</p>
                `,
                excerpt: 'How AI is reshaping the way we build websites and what it means for the future of user experience.',
                category: 'DESIGN',
                authorName: 'DigitalRise Team',
                metaTitle: 'AI in Web Design 2026 | DigitalRise Marketing',
                metaDescription: 'Explore the revolutionary impact of AI on web design trends, personalization, and creative workflows in 2026.',
                focusKeyword: 'AI Web Design',
                readTime: '8 MIN READ',
                date: '2026-04-24',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop'
            }
        ]);

        console.log('Adding demo project...');
        await Project.create({
            title: 'Zayka POS Dashboard',
            slug: 'zayka-pos-dashboard',
            description: 'A high-performance point-of-sale system for the hospitality industry, featuring real-time inventory and analytics.',
            content: `
                <h2>Project Overview</h2>
                <p>Zayka POS was built to streamline operations for medium-sized restaurants. The focus was on speed and reliability during peak hours.</p>
                <h2>Key Achievements</h2>
                <p>We achieved a 30% reduction in order processing time and integrated a seamless UPI payment gateway for local Indian merchants.</p>
            `,
            techStack: ['Next.js', 'Node.js', 'MySQL', 'Framer Motion'],
            images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000'],
            liveUrl: 'https://zayka-pos.example.com',
            githubUrl: 'https://github.com/digitalrise/zayka-pos',
            metaTitle: 'Zayka POS Dashboard Case Study | DigitalRise',
            metaDescription: 'Case study of the Zayka POS system, a modern hospitality management solution built for scale.'
        });

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
