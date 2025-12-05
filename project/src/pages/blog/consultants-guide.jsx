import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const ConsultantsGuide = () => {
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
                        <span className="text-gray-900">Consultants Guide</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            For Partners
                        </span>
                        <span>December 5, 2024</span>
                        <span>•</span>
                        <span>11 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Using Legacy Architect OS as a Consultant, Advisor, or Partner
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-6">
                        How consultants, agencies, and advisors can use the platform as their operating system for client results.
                    </p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <img
                        src="/blog_consultants.png"
                        alt="Consultants and Partners Guide"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                        <p className="text-lg text-gray-700 mb-6">
                            Legacy Architect OS isn't just for business owners.
                        </p>

                        <p className="text-gray-700 mb-4">It's also built for people who help business owners:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Marketing and AI agencies</li>
                            <li>Operations and systems consultants</li>
                            <li>Fractional CFOs and exit planners</li>
                            <li>Acquisition entrepreneurs using a "consulting for equity" or "agency acquisition" model</li>
                        </ul>

                        <p className="text-gray-700 mb-8">
                            If you advise, implement, or acquire businesses, Legacy Architect OS can become your <strong>operating system for client results</strong>—not just another dashboard.
                        </p>

                        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">This article covers:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>The roles you can play with clients</li>
                                <li>Where Legacy Architect OS fits in your offers</li>
                                <li>How to avoid scope creep and stay in your lane</li>
                                <li>How the platform supports consulting-for-fees, consulting-for-equity, and acquisition strategies</li>
                            </ul>
                        </div>

                        {/* Section 1 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            1. The 3 Roles You Can Play With Legacy Architect OS
                        </h2>

                        <p className="text-gray-700 mb-4">As a consultant or partner, you usually show up in one (or more) of these roles:</p>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagnostician</h3>
                                <p className="text-gray-700">You run the Hidden Profit + Exit Readiness Checkup and interpret the results with the owner.</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mission Architect</h3>
                                <p className="text-gray-700">You help choose and design Missions that match the owner's goals.</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Execution Sherpa</h3>
                                <p className="text-gray-700">You guide the owner through the work, keeping everyone accountable and on track.</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">You're not just "setting up software." You're helping answer three big questions:</p>
                        <ol className="list-decimal pl-6 mb-6 text-gray-700">
                            <li><strong>Where are we now?</strong> (honest diagnosis)</li>
                            <li><strong>What should we do next?</strong> (prioritized plan)</li>
                            <li><strong>How do we make sure it actually happens?</strong> (execution and accountability)</li>
                        </ol>

                        <p className="text-gray-700 mb-8">
                            Legacy Architect OS gives you a structured way to do all three—without having to build your own framework from scratch.
                        </p>

                        {/* Section 2 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            2. Start With the Checkup: Turning Chaos Into a Clear Story
                        </h2>

                        <p className="text-gray-700 mb-4">Most consulting engagements start with some version of:</p>
                        <p className="text-gray-700 mb-6 italic">
                            "Something feels off. We're busy, but the numbers aren't where they should be."
                        </p>

                        <p className="text-gray-700 mb-4">
                            The Hidden Profit + Exit Readiness Checkup is your way of turning that feeling into a concrete story.
                        </p>

                        <p className="text-gray-700 mb-4">As a partner, you can:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Facilitate the Checkup live with the owner</li>
                            <li>Make sure answers are accurate, not sugar-coated</li>
                            <li>Use the resulting scores to frame your engagement</li>
                        </ul>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
                            <p className="text-gray-900 font-semibold mb-2">The Checkup helps you:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Show the owner where they're strong and where they're exposed</li>
                                <li>Shift the conversation from "random problems" to specific, solvable areas</li>
                                <li>Create a natural segue into your strategic and implementation work</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-8">
                            Instead of pitching from scratch, you're saying: <em>"Here's what the system sees. Based on this, here's what we should do first together."</em>
                        </p>

                        {/* Section 3 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            3. Designing Missions With Your Client
                        </h2>

                        <p className="text-gray-700 mb-4">Once you have a Checkup, the next step is co-designing the first Mission or two.</p>

                        <p className="text-gray-700 mb-4">You might recommend:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li><strong>Cash-Boost Mission</strong> if cash is tight or growth has stalled</li>
                            <li><strong>24/7 AI Reception Mission</strong> if leads and calls are being dropped</li>
                            <li><strong>Reviews & Reputation Mission</strong> if the online story doesn't match reality</li>
                            <li><strong>Buyer-Ready Data Room Mission</strong> if exit, financing, or succession is on the horizon</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Your role here:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Align Missions with the owner's timeline (1–2 years, 3–5 years, or "never selling but wants options")</li>
                            <li>Set realistic 90-day outcomes that you can measure together</li>
                            <li>Identify what parts the owner's team owns vs what you or your agency own</li>
                        </ul>

                        <p className="text-gray-700 mb-8 italic">
                            "In the next 90 days, we're going to focus on this one big lever. Here's what success looks like and who does what."
                        </p>

                        {/* Section 4 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            4. Execution: Staying in Your Lane While Driving Outcomes
                        </h2>

                        <p className="text-gray-700 mb-4">Once Missions are selected, owners often need help:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Implementing the tech or automation</li>
                            <li>Training their team</li>
                            <li>Handling copy, campaigns, or offers</li>
                            <li>Staying accountable to the plan</li>
                        </ul>

                        <p className="text-gray-700 mb-4">A simple way to frame it:</p>

                        <div className="bg-blue-50 p-6 rounded-lg mb-4">
                            <p className="font-semibold text-gray-900 mb-2">You and the platform provide:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Strategy (what Missions to run and why)</li>
                                <li>Structure (how the Mission is organized and monitored)</li>
                                <li>Support (coaching, troubleshooting, and adjustments)</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Your client and their team provide:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Access to the systems and data</li>
                                <li>Final approval on offers and messaging</li>
                                <li>Day-to-day operational follow-through</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">What you don't want to be:</p>
                            <p className="text-gray-700">
                                The person who "kind of owns everything" but isn't clearly responsible for any outcome.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            5. Using Legacy Architect OS in Consulting-for-Equity or Acquisition Models
                        </h2>

                        <p className="text-gray-700 mb-4">If you're not just consulting, but also:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Taking equity stakes in clients</li>
                            <li>Structuring performance-based fees</li>
                            <li>Or targeting future acquisitions</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Legacy Architect OS becomes even more valuable. You can use it to:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Evaluate potential partners/targets with the Checkup</li>
                            <li>Improve key metrics (cash flow, systems, retention, reviews) through Missions</li>
                            <li>Prepare a Buyer-Ready Data Room that supports financing or sale</li>
                            <li>Track value creation over time (before/after working with you)</li>
                        </ul>

                        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">Instead of saying:</p>
                            <p className="text-gray-700 mb-4 italic">"Trust me, I'll help you grow and maybe we'll do equity later…"</p>
                            <p className="text-gray-900 font-semibold mb-2">You can point to:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Clear scores</li>
                                <li>Documented improvements</li>
                                <li>A growing, organized data room</li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            6. Avoiding Scope Creep and Misaligned Expectations
                        </h2>

                        <p className="text-gray-700 mb-4">To protect your time and reputation, be clear about two things up front:</p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-green-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-2">What the platform does:</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Diagnose</li>
                                    <li>Guide Missions</li>
                                    <li>Track progress</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-2">What you do:</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Interpret results</li>
                                    <li>Help design Missions</li>
                                    <li>Provide expertise, implementation, and accountability</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Legacy Architect OS is NOT:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>A magic wand that fixes a disengaged owner</li>
                                <li>A replacement for all people and processes</li>
                                <li>A guarantee of a certain valuation or sale price</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
                            <p className="font-semibold text-gray-900 mb-2">You are NOT:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Their unpaid in-house COO</li>
                                <li>Their 24/7 tech support for everything in the business</li>
                                <li>Responsible for results if they ignore every recommendation</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            7. When to Position Yourself as a "Legacy Architect Partner"
                        </h2>

                        <p className="text-gray-700 mb-4">You might introduce yourself to owners as:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>"The person who uses this system with you to grow revenue and make your business exit-ready"</li>
                            <li>"Your guide for using Legacy Architect OS to build a business that can run without you"</li>
                            <li>"The partner who helps you turn your Checkup and Missions into a concrete exit or freedom plan"</li>
                        </ul>

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-8 mt-12">
                            <p className="text-gray-700 mb-4">You don't have to explain every technical detail.</p>
                            <p className="text-gray-700 mb-4">You just have to make it clear that:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4">
                                <li>The platform is the system</li>
                                <li>You are the guide</li>
                            </ul>
                            <p className="text-xl font-bold text-gray-900">
                                And together, you're not just "doing projects"—you're shaping what their business becomes over the next 1–5 years.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in Partnering?</h3>
                            <p className="text-gray-700 mb-6">
                                Learn more about how consultants and advisors use Legacy Architect OS to deliver measurable results for their clients.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/user-authentication"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Icon name="Users" size={20} className="mr-2" />
                                    Get Started
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

export default ConsultantsGuide;
