const slugify = require('slugify');
const BlogPost = require('../models/BlogPost');

const generateUniqueSlug = async (title, currentId = null, Model = BlogPost) => {
    let base = slugify(title, { lower: true, strict: true, trim: true });
    let slug = base;
    let counter = 1;

    while (true) {
        const existing = await Model.findOne({ where: { slug } });
        if (!existing || (currentId && existing.id === currentId)) break;

        slug = `${base}-${counter++}`;
    }

    return slug;
};

module.exports = { generateUniqueSlug };
