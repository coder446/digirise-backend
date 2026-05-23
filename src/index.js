const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// API Routes
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const serviceRoutes = require('./routes/services');
const submissionRoutes = require('./routes/submissions');
const buildAdminRouter = require('./admin/index');

const resolveComponentsBundlePath = () => {
    const candidates = [
        path.resolve(__dirname, 'admin', '.adminjs', 'bundle.js'),
        path.resolve(__dirname, '../.adminjs', 'bundle.js'),
        path.resolve(process.cwd(), '.adminjs', 'bundle.js'),
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        'https://digital-rise-marketing-eight.vercel.app',
        'https://digitalrisemarketing.in',
        'https://www.digitalrisemarketing.in',
        'https://digitalrise-marketing.onrender.com',
        'https://www.digitalrise-marketing.onrender.com',
        'https://captivating-purpose-production-88fb.up.railway.app'
    ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const startServer = async () => {
    try {
        app.set('trust proxy', 1);

        // Global CSP Middleware (to fix the 'none' error on all routes)
        app.use((req, res, next) => {
            res.setHeader(
                'Content-Security-Policy',
                "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors 'self';"
            );
            next();
        });

        app.use(express.json());

        // Public API routes should remain available even if AdminJS fails to bootstrap.
        app.use('/api/projects', projectRoutes);
        app.use('/api/blog', blogRoutes);
        app.use('/api/blogs', blogRoutes);
        app.use('/api/services', serviceRoutes);
        app.use('/api/api/services', serviceRoutes);
        app.use('/api/submissions', submissionRoutes);

        app.get('/api/health', (req, res) => {
            res.json({ ok: true, service: 'DigitalRise Marketing API' });
        });

        app.get('/', (req, res) => {
            res.json({ message: 'DigitalRise Marketing API is running...' });
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
            console.log(`🛡️  AdminJS:    initializing separately...\n`);
        });

        void (async () => {
            try {
                const { admin, adminRouter } = await buildAdminRouter();
                const componentsBundlePath = resolveComponentsBundlePath();

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

                app.use(admin.options.rootPath, (req, res, next) => {
                    console.log(`[AdminJS] Serving request: ${req.method} ${req.url}`);
                    next();
                }, adminRouter);

                console.log(`🛡️  AdminJS mounted at http://localhost:${PORT}${admin.options.rootPath}`);
            } catch (error) {
                console.warn('⚠️  AdminJS failed to initialize; public API remains available.', error.message);
            }
        })();
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
