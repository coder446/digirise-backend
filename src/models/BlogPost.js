const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const BlogPost = sequelize.define(
    'BlogPost',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        excerpt: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        readTime: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        image1: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        image2: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        metaTitle: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        metaDescription: {
            type: DataTypes.STRING(160),
            allowNull: true,
        },
        focusKeyword: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        authorName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'author',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        // ✅ SEO FIX: Enable updatedAt so sitemap lastmod reflects actual edits
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'blog_posts',
        timestamps: true,
        // ✅ SEO FIX: was updatedAt: false — now enabled for accurate sitemap lastmod
        updatedAt: 'updatedAt',
    }
);

module.exports = BlogPost;
