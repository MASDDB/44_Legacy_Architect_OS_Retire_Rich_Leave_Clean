import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const First30Days = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <Icon name="ChevronRight" size={16} className="mx-2" />
                        <Link to="/blog" className="hover:text-blue-600">Blog</Link>
                        <Icon name="ChevronRight" size={16} className="mx-2" />
                        <span className="text-gray-900">Your First 30 Days</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            Getting Started
                        </span>
                        <span>December 5, 2024</span>
                        <span>•</span>
                        <span>8 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Your First Day, First Week, and First Month in Legacy Architect OS
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-6">
                        A complete guide to getting started with Legacy Architect OS and creating momentum from day one.
                    </p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <img
                        src="/C:/Users/reipr/.gemini/antigravity/brain/04df1761-6d98-495d-b66a-ccbc73bad193/blog_getting_started_1764973287545.png"
                        alt="Getting Started with Legacy Architect OS"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                        <p className="text-lg text-gray-700 mb-6">
                            So you've found Legacy Architect OS, and you're wondering: <strong>"What exactly am I supposed to do first?"</strong>
                        </p>

                        <p className="text-gray-700 mb-6">
                            Good. That question alone puts you ahead of most owners who sign up for tools and never really turn them on.
                        </p>

                        <p className="text-gray-700 mb-6">This guide walks you through:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>What to focus on Day 1</li>
                            <li>What to accomplish in your First 7 Days</li>
                            <li>How to use your First 30 Days to create a new "normal" in your business</li>
                        </ul>

                        <p className="text-gray-700 mb-8">
                            The goal isn't perfection. The goal is clarity + momentum, so the system starts putting money and time back in your pocket instead of just giving you another login.
                        </p>

                        {/* Part 1 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            Part 1: Your First Day – Get Clarity, Not Complexity
                        </h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Log In and Run Your Hidden Profit + Exit Readiness Checkup
                        </h3>

                        <p className="text-gray-700 mb-4">Your very first task is simple:</p>
                        <p className="text-gray-700 mb-4"><strong>Run the Hidden Profit + Exit Readiness Checkup.</strong></p>

                        <p className="text-gray-700 mb-4">
                            This is your "X-ray." You'll answer questions about:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Revenue and profitability</li>
                            <li>Lead flow and follow-up</li>
                            <li>How calls are handled right now</li>
                            <li>How dependent the business is on you</li>
                            <li>What systems and documentation you already have (or don't)</li>
                        </ul>

                        <p className="text-gray-700 mb-6">
                            This is not about looking good on paper. It's about getting an honest snapshot so the platform can point you in the right direction. You can't improve what you won't measure.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Look at Your Scores Without Judging Yourself
                        </h3>

                        <p className="text-gray-700 mb-4">
                            When your Checkup is done, you'll see key scores (names may vary by plan), such as:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li><strong>Hidden Profit Score</strong> – How much money you might be leaving on the table right now</li>
                            <li><strong>Exit Readiness Score</strong> – How attractive your business looks to a buyer, lender, or successor</li>
                            <li><strong>AI/Automation Readiness Score (if enabled)</strong> – How ready your operations are for automation</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Your job on Day 1 is not to fix the scores.</p>
                        <p className="text-gray-700 mb-4">Your job is to:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Notice where you're strong</li>
                            <li>Notice where you're exposed</li>
                            <li>Notice which themes keep popping up: missed calls, weak follow-up, inconsistent reviews, chaos in documentation, etc.</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. Choose ONE Mission to Start With
                        </h3>

                        <p className="text-gray-700 mb-4">Before you log off on Day 1, pick one primary focus:</p>
                        <p className="text-gray-700 mb-4">Most owners start with one of these:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li><strong>Cash-Boost Mission</strong> – "I want more revenue from customers and leads I already have."</li>
                            <li><strong>24/7 AI Reception Mission</strong> – "I'm tired of losing money every time a call goes to voicemail."</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Don't overthink it. Pick the one that:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Hits the biggest pain you feel right now, and</li>
                            <li>Looks like it can move the needle in the next 30–90 days</li>
                        </ul>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">Day 1 Success</p>
                            <p className="text-gray-700">
                                If you end Day 1 having run your Checkup, looked at your scores, and chosen your first Mission, you are off to a strong start.
                            </p>
                        </div>

                        {/* Part 2 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            Part 2: Your First 7 Days – Secure a Quick, Simple Win
                        </h2>

                        <p className="text-gray-700 mb-6">
                            The first week is about proving to yourself that this is not "just another platform."
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Set a 7-Day Outcome
                        </h3>

                        <p className="text-gray-700 mb-4">Ask yourself:</p>
                        <p className="text-gray-700 mb-4 italic">
                            "If this week goes well, what would I like to see that proves we're moving in the right direction?"
                        </p>

                        <p className="text-gray-700 mb-4">Examples:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>5–10 extra booked appointments from old leads</li>
                            <li>Fewer missed calls on busy days</li>
                            <li>A few new 5-star reviews starting to come in</li>
                            <li>A clearer view of your numbers and where they're going</li>
                        </ul>

                        <p className="text-gray-700 mb-6">
                            You're not trying to double the business in a week. You're looking for a signal that the system works when you use it.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Put Your First Mission in Motion (Light Version)
                        </h3>

                        <p className="text-gray-700 mb-4">Depending on which Mission you chose:</p>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Cash-Boost:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Identify a simple group of past customers or leads to focus on (for example, "anyone who hasn't booked with us in 6–12 months")</li>
                                <li>Clarify one basic reason to reach out (check-up, annual review, tune-up, etc.)</li>
                                <li>Get your first small wave of outreach ready inside whatever tools you're using</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">24/7 AI Reception:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Decide what a "good" outcome looks like for a call (lead captured, appointment booked, or both)</li>
                                <li>Clarify the essential questions you need to ask new callers (name, issue, urgency, budget, etc.)</li>
                                <li>Make at least one improvement in how missed calls are handled (even if it's just improvement #1 of many)</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-6">
                            The key for Week 1: do a simple, real-world version, not the perfect, fully-automated masterpiece. You can refine later.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. Check Your Dashboard, But Don't Micromanage It
                        </h3>

                        <p className="text-gray-700 mb-4">By the end of the first week, check your data:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Did more leads get contacted or booked than usual?</li>
                            <li>Did fewer calls slip through the cracks?</li>
                            <li>Are there early signs of more cash or better control?</li>
                        </ul>

                        <p className="text-gray-700 mb-6">
                            If you see even small improvements, that's a win. You've moved from "thinking about it" to owning a better system.
                        </p>

                        {/* Part 3 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            Part 3: Your First 30 Days – Build a New "Normal"
                        </h2>

                        <p className="text-gray-700 mb-6">
                            The first month is about shifting from one-time push to repeatable process.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Measure What Changed
                        </h3>

                        <p className="text-gray-700 mb-4">Compare:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>The 30 days before you started using Legacy Architect OS</li>
                            <li>The first 30 days with your first Mission active</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Look at:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Booked jobs / appointments</li>
                            <li>Missed calls vs handled calls</li>
                            <li>Incoming reviews and rating averages</li>
                            <li>How you feel about the chaos level in the business</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Even if the numbers aren't dramatic yet, ask:</p>
                        <p className="text-gray-700 mb-6 italic">"Would I rather go back to the old way?"</p>
                        <p className="text-gray-700 mb-6">If the honest answer is "no," you're on the right track.</p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Decide: Deepen Mission #1 or Add Mission #2
                        </h3>

                        <p className="text-gray-700 mb-4">Once you've got some momentum, you'll face a decision:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Go deeper on your first Mission (optimize it, scale it), or</li>
                            <li>Add Mission #2 (for example: add Reviews & Reputation after Cash-Boost, or start Buyer-Ready Data Room if exit is on your mind)</li>
                        </ul>

                        <p className="text-gray-700 mb-4">A simple rule of thumb:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>If your first Mission still feels fragile, strengthen it before adding more.</li>
                            <li>If it feels solid and predictable, add the next Mission to grow or de-risk another part of the business.</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. Re-Run Your Checkup (Optional but Powerful)
                        </h3>

                        <p className="text-gray-700 mb-4">
                            If you've made real moves in your first 30–60 days, re-running your Checkup can:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Show improved scores</li>
                            <li>Confirm that what you're doing matters</li>
                            <li>Help you decide your next focus with more confidence</li>
                        </ul>

                        <p className="text-gray-700 mb-8">
                            The whole point is to see that Legacy Architect OS is not just tracking your chaos—it's actively helping you reduce it.
                        </p>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Summary: What Success Looks Like After 30 Days
                            </h2>

                            <p className="text-gray-700 mb-4">If your first month goes well, you should be able to say:</p>
                            <ul className="list-disc pl-6 mb-6 text-gray-700">
                                <li>"I know where my business stands, not just where I feel it stands."</li>
                                <li>"We have at least one Mission that is consistently making things better."</li>
                                <li>"I can see a path where my business becomes less dependent on me personally."</li>
                            </ul>

                            <p className="text-gray-700 mb-2">That's the foundation.</p>
                            <p className="text-gray-700">
                                From there, the system isn't just "software." It becomes your operating rhythm for creating more profit now and a cleaner exit later.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                            <p className="text-gray-700 mb-6">
                                Run your Hidden Profit + Exit Readiness Checkup and see where your business stands today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/ai-audit"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Icon name="Activity" size={20} className="mr-2" />
                                    Start Your Free Checkup
                                </Link>
                                <Link
                                    to="/blog"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                                    Back to Blog
                                </Link>
                            </div>
                        </div>

                    </div>
                </article>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default First30Days;
