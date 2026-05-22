const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Project = sequelize.define(
    'Project',
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
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        techStack: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        liveUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        githubUrl: {
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
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        // ✅ SEO FIX: Enable updatedAt for accurate sitemap lastmod
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'projects',
        timestamps: true,
        // ✅ SEO FIX: was updatedAt: false
        updatedAt: 'updatedAt',
    }
);

module.exports = Project;
