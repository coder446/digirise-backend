const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const resolveComponentsBundlePath = () => {
    const candidates = [
        path.resolve(__dirname, '.adminjs', 'bundle.js'),
        path.resolve(__dirname, '../../.adminjs', 'bundle.js'),
        path.resolve(process.cwd(), '.adminjs', 'bundle.js'),
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const buildAdminRouter = async () => {
    const { default: AdminJS } = await import('adminjs');
    const { default: AdminJSExpress } = await import('@adminjs/express');
    const AdminJSSequelize = await import('@adminjs/sequelize');
    const { default: session } = await import('express-session');

    const sequelize = require('../models/index');
    const BlogPost = require('../models/BlogPost');
    const Project = require('../models/Project');
    const blogResource = require('./resources/blogResource');
    const projectResource = require('./resources/projectResource');

    // Only verify the database connection at runtime.
    // Schema changes should be handled by migrations, not AdminJS startup.
    await sequelize.authenticate();

    // Register the Sequelize adapter with AdminJS
    AdminJS.registerAdapter({
        Resource: AdminJSSequelize.Resource,
        Database: AdminJSSequelize.Database,
    });

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@digitalrisemarketing.in';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DigitalRise@2025!';
    const ADMIN_SESSION_MAX_AGE = parseInt(process.env.ADMIN_SESSION_MAX_AGE || '', 10) || 1000 * 60 * 60 * 24 * 7;
    const ADMIN_SESSION_SECURE = process.env.ADMIN_SESSION_SECURE === 'true';

    const admin = new AdminJS({
        resources: [blogResource(BlogPost), projectResource(Project)],
        rootPath: '/admin',
        branding: {
            companyName: 'DigitalRise CMS',
            logo: false,
            theme: {
                colors: {
                    primary100: '#d4af37',
                    primary80: '#c9a227',
                    primary60: '#b08d20',
                    accent: '#d4af37',
                    hoverBg: '#1a1a2e',
                    fg: '#ffffff',
                    bg: '#0d0d1a',
                    defaultText: '#ffffff',
                    grey100: '#1a1a2e',
                },
            },
        },
        locale: {
            language: 'en',
            translations: {
                en: {
                    labels: {
                        BlogPost: 'Blog Posts',
                    },
                },
            },
        },
    });

    const sessionStore = new session.MemoryStore();

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: async (email, password) => {
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    return { email };
                }
                return null;
            },
            cookieName: 'adminjs',
            cookiePassword: process.env.SESSION_SECRET || 'digitalrise-super-secret-session-key-2025',
        },
        null,
        {
            resave: false,
            saveUninitialized: true,
            store: sessionStore,
            secret: process.env.SESSION_SECRET || 'digitalrise-super-secret-session-key-2025',
            rolling: true,
            cookie: {
                maxAge: ADMIN_SESSION_MAX_AGE,
                sameSite: 'lax',
                secure: ADMIN_SESSION_SECURE ? 'auto' : false,
            },
        }
    );

    return { admin, adminRouter };
};

module.exports = buildAdminRouter;

const startAdminServer = async () => {
    const app = express();
    const ADMIN_PORT = process.env.ADMIN_PORT || process.env.PORT || 3001;
    const componentsBundlePath = resolveComponentsBundlePath();

    app.set('trust proxy', 1);

    try {
        const { admin, adminRouter } = await buildAdminRouter();

        app.get('/admin/frontend/assets/components.bundle.js', (req, res) => {
            try {
                if (componentsBundlePath) {
                    const bundle = fs.readFileSync(componentsBundlePath, 'utf8');
                    return res.type('application/javascript').send(bundle);
                }
            } catch (error) {
                console.warn('AdminJS components bundle could not be read; serving a minimal JavaScript fallback.');
            }

            res.type('application/javascript').send(
                'window.AdminJS = window.AdminJS || {}; window.AdminJS.UserComponents = window.AdminJS.UserComponents || {};'
            );
        });

        // CSP Fix for standalone mode
        app.use((req, res, next) => {
            res.setHeader(
                'Content-Security-Policy',
                "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors 'self';"
            );
            console.log(`[Standalone Admin] ${req.method} ${req.url}`);
            next();
        });

        app.use(admin.options.rootPath, adminRouter);
        app.get('/', (req, res) => {
            res.redirect(admin.options.rootPath);
        });

        app.listen(ADMIN_PORT, '0.0.0.0', () => {
            console.log(`AdminJS available at http://localhost:${ADMIN_PORT}${admin.options.rootPath}`);
        });
    } catch (err) {
        console.error('AdminJS failed to load:', err.message);
        process.exitCode = 1;
    }
};

if (require.main === module) {
    startAdminServer();
}
