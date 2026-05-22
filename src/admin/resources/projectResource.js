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

const projectResource = (Project) => ({
    resource: Project,
    options: {
        navigation: {
            name: 'Project Management',
            icon: 'Briefcase',
        },

        actions: {
            new: {
                before: async (request) => {
                    if (request.payload && !request.payload.slug && request.payload.title) {
                        request.payload.slug = await generateUniqueSlug(request.payload.title, null, Project);
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
                            request.payload.id,
                            Project
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

            description: {
                type: 'textarea',
                description: 'Short description of the project.',
                isVisible: { list: true, show: true, edit: true, filter: false },
                props: { rows: 3 },
            },

            content: {
                type: 'richtext',
                description: 'Full project details (HTML supported).',
                isVisible: { list: false, show: true, edit: true, filter: false },
                props: { rows: 15 },
            },

            techStack: {
                type: 'string', // Stored as JSON, but we can manage as string or arrays in adminjs via custom components. Using standard string for CSV for simplicity unless we configure arrays. AdminJS arrays:
                isArray: true,
                description: 'Add technologies used (press enter to add multiple).',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            images: {
                type: 'string',
                isArray: true,
                description: 'Add URLs to images (press enter to add multiple).',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            liveUrl: {
                description: 'Link to the live project.',
                isVisible: { list: true, show: true, edit: true, filter: false },
            },

            githubUrl: {
                description: 'Link to the GitHub repository.',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            metaTitle: {
                description: 'Appears in Google search results. Max 60 characters.',
                isVisible: { list: false, show: true, edit: true, filter: false },
            },

            metaDescription: {
                type: 'textarea',
                description: 'Short description for SEO. Max 160 characters.',
                isVisible: { list: false, show: true, edit: true, filter: false },
                props: { rows: 3 },
            },

            createdAt: {
                isVisible: { list: true, show: true, edit: false, filter: true },
            },
        },
    },
});

module.exports = projectResource;
