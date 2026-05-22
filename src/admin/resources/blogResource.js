const { generateUniqueSlug } = require('../../utils/slugUtils');
const { pingSitemap } = require('../../utils/pingSitemap');
const ValidationError = require('adminjs').ValidationError;

const buildLengthErrors = (request) => {
    const errors = {};

    if (request.payload.metaTitle && request.payload.metaTitle.length > 60) {
        errors.metaTitle = {
            message: 'Meta title must be 60 characters or fewer.',
            type: 'validationError',
        };
    }

    if (request.payload.metaDescription && request.payload.metaDescription.length > 160) {
        errors.metaDescription = {
            message: 'Meta description must be 160 characters or fewer.',
            type: 'validationError',
        };
    }

    return errors;
};

const blogResource = (BlogPost) => ({
    resource: BlogPost,
    options: {
        navigation: {
            name: 'Blog Management',
            icon: 'Edit',
        },

        // --- Actions ---
        actions: {
            new: {
                before: async (request) => {
                    // Auto-generate slug from title if not provided
                    if (request.payload && !request.payload.slug && request.payload.title) {
                        request.payload.slug = await generateUniqueSlug(request.payload.title);
                    }
                    const errors = buildLengthErrors(request);
                    if (Object.keys(errors).length > 0) {
                        throw new ValidationError(errors, {
                            message: 'Meta fields exceed the allowed length.',
                        });
                    }

                    return request;
                },
                after: async (response) => {
                    pingSitemap();
                    return response;
                },
            },
            edit: {
                before: async (request) => {
                    if (request.payload && !request.payload.slug && request.payload.title) {
                        request.payload.slug = await generateUniqueSlug(
                            request.payload.title,
                            request.payload.id
                        );
                    }
                    const errors = buildLengthErrors(request);
                    if (Object.keys(errors).length > 0) {
                        throw new ValidationError(errors, {
                            message: 'Meta fields exceed the allowed length.',
                        });
                    }
                    return request;
                },
                after: async (response) => {
                    pingSitemap();
                    return response;
                },
            },
            delete: {
                after: async (response) => {
                    pingSitemap();
                    return response;
                },
            },
        },

        // --- Properties / Field Configuration ---
        properties: {
            id: { isVisible: { list: false, show: true, edit: false, filter: false } },

            title: {
                isTitle: true,
                isVisible: { list: true, show: true, edit: true, filter: true },
            },

            slug: {
                description: 'Auto-generated from title if left blank. Must be unique and URL-safe.',
                isVisible: { list: true, show: true, edit: true, filter: true },
            },

            content: {
                type: 'textarea',
                description: 'Full blog post content (Plain text supported. Newlines are auto-formatted).',
                isVisible: { list: false, show: true, edit: true, filter: false },
                props: { rows: 20 },
            },

            excerpt: {
                type: 'textarea',
                description: 'A short summary of the post shown on the blog listing page.',
                isVisible: { list: false, show: true, edit: true, filter: false },
                props: { rows: 3 },
            },

            image: {
                description: 'URL or path to the main featured image (e.g. /images/blogs/my-post.png).',
                isVisible: { list: true, show: true, edit: true, filter: false },
            },

            image1: {
                description: 'URL or path to an additional content image.',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            image2: {
                description: 'URL or path to a second additional content image.',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            date: {
                isVisible: { list: true, show: true, edit: true, filter: true },
            },

            readTime: {
                description: 'e.g. "5 MIN READ"',
                isVisible: { list: true, show: true, edit: true, filter: false },
            },

            category: {
                description: 'e.g. "LOCAL SEO & SMM"',
                isVisible: { list: true, show: true, edit: true, filter: true },
            },

            authorName: {
                isVisible: { list: true, show: true, edit: true, filter: true },
            },

            createdAt: {
                isVisible: { list: true, show: true, edit: false, filter: true },
            },

            // --- SEO Fields ---
            metaTitle: {
                description: '⚡ Appears in Google search results. Max 60 characters.',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            metaDescription: {
                type: 'textarea',
                description: '📝 Short description for SEO (150–160 chars recommended). Max 160 characters.',
                isVisible: { list: false, show: true, edit: true, filter: false },
                props: { rows: 3 },
            },

            focusKeyword: {
                description: '🎯 Main keyword this blog post targets (e.g. "digital marketing badlapur").',
                isVisible: { list: true, show: true, edit: true, filter: true },
            },
        },
    },
});

module.exports = blogResource;
