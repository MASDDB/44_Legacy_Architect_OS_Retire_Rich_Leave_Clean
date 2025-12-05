import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const ExitTimeline = () => {
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
                        <span className="text-gray-900">Exit Timeline Strategy</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            Strategy
                        </span>
                        <span>December 5, 2024</span>
                        <span>•</span>
                        <span>10 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        How to Use Legacy Architect OS Based on Your Exit Timeline
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-6">
                        Whether you're 1-2 years from exit, 3-5 years out, or never planning to sell, here's how to prioritize your Missions.
                    </p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <img
                        src="/blog_exit_timeline.png"
                        alt="Exit Timeline Strategy"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                        <p className="text-lg text-gray-700 mb-6">
                            Not every owner is on the same clock.
                        </p>

                        <p className="text-gray-700 mb-4">Some of you are thinking,</p>
                        <p className="text-gray-700 mb-4 italic">"I'd love to be out in 1–2 years if the number is right."</p>

                        <p className="text-gray-700 mb-4">Others are more like,</p>
                        <p className="text-gray-700 mb-4 italic">"I'm 3–5 years out and want to get my ducks in a row."</p>

                        <p className="text-gray-700 mb-4">And then there's the</p>
                        <p className="text-gray-700 mb-6 italic">"I'll probably never sell, I just want this thing to stop running my life."</p>

                        <p className="text-gray-700 mb-6">
                            Legacy Architect OS is built to work for all three. The difference isn't the tool—it's where you place your focus first.
                        </p>

                        <p className="text-gray-700 mb-6">This guide shows you how to use the platform based on your exit timeline:</p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>1–2 years from exit</li>
                            <li>3–5 years from exit</li>
                            <li>"Never selling, just want freedom and options"</li>
                        </ul>

                        {/* Step 1 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            Step 1: Start the Same Way (No Matter Your Timeline)
                        </h2>

                        <p className="text-gray-700 mb-4">Regardless of your plan, everyone starts here:</p>
                        <ol className="list-decimal pl-6 mb-6 text-gray-700">
                            <li>Run your Hidden Profit + Exit Readiness Checkup</li>
                            <li>Review your scores and main risk areas</li>
                            <li>Pick your first Mission (Cash-Boost, 24/7 AI Reception, Reviews, or Buyer-Ready Data Room)</li>
                        </ol>

                        <p className="text-gray-700 mb-6">
                            From there, the sequence changes based on how soon you might want to exit.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">Think of it like this:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>The Checkup tells you where you are.</li>
                                <li>Your timeline tells you what to fix first.</li>
                            </ul>
                        </div>

                        {/* 1-2 Years */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            If You're 1–2 Years from Exit
                        </h2>

                        <p className="text-gray-700 mb-6">
                            You're in the red zone. The clock is loud.
                        </p>

                        <p className="text-gray-700 mb-4">Your top priorities are:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Stabilize and prove profitability</li>
                            <li>Reduce buyer risk</li>
                            <li>Make the business less dependent on you</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            How to Use Legacy Architect OS in the 1–2 Year Window
                        </h3>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            1. Focus on deal-killers first.
                        </h4>

                        <p className="text-gray-700 mb-4">After your Checkup, you'll likely see issues like:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Revenue heavily tied to a few big customers</li>
                            <li>Messy or incomplete financials</li>
                            <li>No consistent process for leads, follow-up, or reviews</li>
                            <li>Everything runs through you</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Start Missions that directly address buyer risk:</p>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Buyer-Ready Data Room Mission</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Begin assembling core financial and operational documents</li>
                                <li>Your goal: a minimum viable "this makes sense" package, not a perfect binder</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Reviews & Reputation Mission</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Build steady, visible social proof buyers and lenders can see</li>
                                <li>A strong online reputation increases confidence in your numbers</li>
                            </ul>
                        </div>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            2. Add cash and control without chaos.
                        </h4>

                        <p className="text-gray-700 mb-4">
                            You still need good quarters to justify a strong multiple.
                        </p>

                        <p className="text-gray-700 mb-4">That's where:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li><strong>Cash-Boost Mission</strong> helps you pull extra revenue from existing customers and leads</li>
                            <li><strong>24/7 AI Reception Mission</strong> helps you stop leaking deals from missed calls and slow follow-up</li>
                        </ul>

                        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">In this window, you're trying to show:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Revenue is real</li>
                                <li>Systems are real</li>
                                <li>Risk is handled</li>
                            </ul>
                        </div>

                        {/* 3-5 Years */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            If You're 3–5 Years from Exit
                        </h2>

                        <p className="text-gray-700 mb-6">
                            You're in the build and shape window.
                        </p>

                        <p className="text-gray-700 mb-4">Here, your advantage is time. You can:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Fix deeper structural issues</li>
                            <li>Improve margins</li>
                            <li>Grow strategically, not frantically</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            How to Use Legacy Architect OS in the 3–5 Year Window
                        </h3>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            1. Use the Checkup as a design tool, not just a diagnosis.
                        </h4>

                        <p className="text-gray-700 mb-4">Ask:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>"If I were a buyer in 3 years, what would scare me?"</li>
                            <li>"If I were a buyer in 3 years, what would impress me?"</li>
                        </ul>

                        <p className="text-gray-700 mb-6">
                            Let your scores guide a 3–5 year transformation, not just a 90-day sprint.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                            2. Sequence Missions for compounding.
                        </h4>

                        <p className="text-gray-700 mb-4">A simple order that often works:</p>
                        <ol className="list-decimal pl-6 mb-6 text-gray-700">
                            <li><strong>Cash-Boost Mission</strong> – Increase revenue from your existing base, fund improvements.</li>
                            <li><strong>24/7 AI Reception Mission</strong> – Make lead handling and booking clean and reliable.</li>
                            <li><strong>Reviews & Reputation Mission</strong> – Turn that improved service and consistency into social proof.</li>
                            <li><strong>Buyer-Ready Data Room Mission</strong> – Build your "deal binder" slowly and sanely over years, not weeks.</li>
                        </ol>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">Over time, you're shaping:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Strong, diversified revenue</li>
                                <li>Dependable systems and metrics</li>
                                <li>A business that feels more like a machine and less like a personal hustle</li>
                            </ul>
                        </div>

                        {/* Never Selling */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            If You "Never Plan to Sell"
                        </h2>

                        <p className="text-gray-700 mb-6">
                            You may never sign a purchase agreement, but you still benefit from being exit-ready.
                        </p>

                        <p className="text-gray-700 mb-4">Why?</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Exit-ready usually means less chaos</li>
                            <li>Exit-ready usually means better margins</li>
                            <li>Exit-ready usually means more options (succession, management buyout, refinance, etc.)</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            How to Use Legacy Architect OS if You're "Never Selling"
                        </h3>

                        <p className="text-gray-700 mb-4">Your priorities:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Reduce the business's dependence on you</li>
                            <li>Increase predictability and peace of mind</li>
                            <li>Keep optionality in case life changes your mind</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Recommended path:</p>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Run the Checkup regularly (once per year at minimum)</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Use it like an annual physical for your business</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Start with Missions that reduce daily pain:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li><strong>24/7 AI Reception</strong> – so the phone stops owning you</li>
                                <li><strong>Cash-Boost</strong> – so you have more margin to delegate, hire, or invest in better systems</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Layer in Reviews and Buyer-Ready Data Room as medium-term projects:</p>
                            <p className="text-gray-700 mb-2">Not for a sale now, but so you can:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Hand off to a family member</li>
                                <li>Elevate a GM</li>
                                <li>Refinance or bring in an investor without scrambling</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold">
                                You're building what a buyer would love, even if the "buyer" is just your future self.
                            </p>
                        </div>

                        {/* Adjustment */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            How Often Should You Adjust Your Plan?
                        </h2>

                        <p className="text-gray-700 mb-4">At least once a year, ask yourself:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>"Has my exit timeline changed?"</li>
                            <li>"Are we moving closer to being optional, or just busier?"</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Re-run your Checkup when:</p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>You hit a big milestone (new location, new vertical, new revenue tier)</li>
                            <li>You're considering financing, partnership, or exit conversations</li>
                            <li>You feel stuck and need a fresh perspective</li>
                        </ul>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 mt-12">
                            <p className="text-xl font-bold text-gray-900 text-center">
                                Legacy Architect OS isn't just a snapshot. It's a steering wheel.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Starting Point</h3>
                            <p className="text-gray-700 mb-6">
                                Run your Hidden Profit + Exit Readiness Checkup to see where you stand and which Missions to prioritize based on your timeline.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/ai-audit"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Icon name="Activity" size={20} className="mr-2" />
                                    Run Your Checkup
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

export default ExitTimeline;
