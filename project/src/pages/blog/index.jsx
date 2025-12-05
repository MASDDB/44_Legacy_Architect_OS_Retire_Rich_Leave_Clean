import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const blogArticles = [
    {
        id: 'first-30-days',
        title: 'Your First Day, First Week, and First Month in Legacy Architect OS',
        excerpt: 'A complete guide to getting started with Legacy Architect OS. Learn what to focus on Day 1, what to accomplish in your first 7 days, and how to use your first 30 days to create a new "normal" in your business.',
        image: '/C:/Users/reipr/.gemini/antigravity/brain/04df1761-6d98-495d-b66a-ccbc73bad193/blog_getting_started.webp',
        date: '2024-12-05',
        readTime: '8 min read',
        category: 'Getting Started'
    }
    // More articles will be added here
];

const BlogIndex = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Legacy Architect OS Blog</h1>
                    <p className="text-xl text-gray-600">
                        Insights, guides, and best practices for building an exit-ready business
                    </p>
                </div>
            </div>

            {/* Blog Articles Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogArticles.map((article) => (
                        <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Featured Image */}
                            <div className="aspect-video bg-gray-200 overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Meta */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {article.category}
                                    </span>
                                    <span>{article.readTime}</span>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                    {article.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                {/* Read More Link */}
                                <Link
                                    to={`/blog/${article.id}`}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Read More
                                    <Icon name="ArrowRight" size={16} className="ml-2" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                            ← Back to Home
                        </Link>
                        <p className="text-sm text-gray-600 mt-4">
                            © {new Date().getFullYear()} Legacy Architect OS. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;
