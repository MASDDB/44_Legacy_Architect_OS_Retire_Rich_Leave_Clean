import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const TroubleshootingMissions = () => {
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
                        <span className="text-gray-900">Troubleshooting Missions</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                            Troubleshooting
                        </span>
                        <span>December 5, 2024</span>
                        <span>•</span>
                        <span>12 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Troubleshooting Missions: Low Replies, No Shows, or Weak Results
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-6">
                        When your Mission doesn't hit right away, use this guide to debug like an owner, not a victim.
                    </p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <img
                        src="/blog_troubleshooting.png"
                        alt="Troubleshooting Missions"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                        <p className="text-lg text-gray-700 mb-6">
                            Sometimes a Mission hits right away. Sometimes it feels like you turned on a machine… and nothing much happened.
                        </p>

                        <p className="text-gray-700 mb-6">
                            <strong>That's not failure. That's feedback.</strong>
                        </p>

                        <p className="text-gray-700 mb-6">This guide is here for the moments when you're thinking:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>"My Cash-Boost didn't really boost much."</li>
                            <li>"We're getting calls, but they're not turning into booked jobs."</li>
                            <li>"We're asking for reviews, but almost nobody responds."</li>
                            <li>"The Buyer-Ready Data Room feels stuck or overwhelming."</li>
                        </ul>

                        <p className="text-gray-700 mb-8">
                            Instead of guessing, use this to debug your Missions like an owner, not a victim.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">We'll walk through:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>A simple troubleshooting mindset</li>
                                <li>A universal 4-part checklist (applies to every Mission)</li>
                                <li>Specific fixes for each Mission type</li>
                                <li>When to persist vs pivot</li>
                                <li>When to bring in extra help</li>
                            </ul>
                        </div>

                        {/* Section 1 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            1. The Right Mindset: Missions Are Experiments, Not Magic
                        </h2>

                        <p className="text-gray-700 mb-4">Every Mission in Legacy Architect OS is designed like a 90-day experiment:</p>
                        <ol className="list-decimal pl-6 mb-6 text-gray-700">
                            <li>You make a hypothesis: "If we do X with Y audience, we'll see Z result."</li>
                            <li>You run the play.</li>
                            <li>You watch what actually happens.</li>
                        </ol>

                        <p className="text-gray-700 mb-4">When results are weak, most people get emotional:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700 italic">
                            <li>"This doesn't work."</li>
                            <li>"Our customers are weird."</li>
                            <li>"We're different."</li>
                        </ul>

                        <p className="text-gray-700 mb-4"><strong>Better question:</strong></p>
                        <p className="text-gray-700 mb-6 italic">
                            "What is this telling me about my audience, my offer, or my execution?"
                        </p>

                        <p className="text-gray-700 mb-8">
                            If you keep that mindset, Missions stop being "judgments" and start being diagnostic tools.
                        </p>

                        {/* Section 2 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            2. The Universal 4-Part Troubleshooting Checklist
                        </h2>

                        <p className="text-gray-700 mb-4">
                            No matter which Mission you're working on, your outcome is being driven by four levers:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Audience</h3>
                                <p className="text-gray-700">Who you're targeting</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Offer</h3>
                                <p className="text-gray-700">What you're promising or inviting them to do</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery / Experience</h3>
                                <p className="text-gray-700">How that promise shows up in real life</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Math</h3>
                                <p className="text-gray-700">Volume, timing, and expectations</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">When results are weak, start by asking:</p>

                        <div className="space-y-6 mb-8">
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">Audience</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Did we target the right slice of people for this Mission?</li>
                                    <li>Are they actually able and likely to say "yes" right now?</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900 mb-2">Offer</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Is the reason to respond/book/review clearly worth their time?</li>
                                    <li>Would you bother saying "yes" to this if you were them?</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900 mb-2">Delivery / Experience</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Is the experience smooth, clear, and respectful of their time?</li>
                                    <li>Are we confusing them, making them jump through hoops, or dropping the ball?</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900 mb-2">Math</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Did we reach enough people to fairly judge this?</li>
                                    <li>Are we giving it enough time (days/weeks) before deciding it "doesn't work"?</li>
                                </ul>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-8">With that in mind, let's go Mission-by-Mission.</p>

                        {/* Section 3 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            3. Troubleshooting by Mission
                        </h2>

                        {/* Cash-Boost */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            A. Cash-Boost Mission – Low Replies or Little Revenue
                        </h3>

                        <p className="text-gray-700 mb-4"><strong>Common symptoms:</strong></p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Very few people respond</li>
                            <li>Many "not interested" replies</li>
                            <li>Conversations, but not much actual booked work</li>
                        </ul>

                        <p className="text-gray-700 mb-4"><strong>Check these levers:</strong></p>

                        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Audience</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Did you go after the lukewarm middle (people who know you but aren't super recent or super ancient), or did you pick a random list?</li>
                                <li>Did you mix together totally different segments (tiny jobs + whales) with the same message?</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Offer</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Is there a clear, single reason to respond now?</li>
                                <li>Or does it feel like a generic "just checking in" with no obvious upside?</li>
                                <li>Are you asking them to make a huge decision, or just a low-friction next step (quote, tune-up, review, etc.)?</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Delivery / Experience</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Is the message long, vague, or full of jargon?</li>
                                <li>Are you coming across as needy, pushy, or unclear?</li>
                                <li>Can they respond in one simple action (reply, click, book)?</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">Math</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Did you contact enough people to fairly judge the response rate?</li>
                                <li>Are you expecting 80% response from a segment where 5–15% would already be a win?</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-4"><strong>Simple adjustments:</strong></p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>Tighten the segment (e.g., "customers from last season" instead of "everyone ever")</li>
                            <li>Simplify the reason to respond and make it time-bound</li>
                            <li>Shorten the outreach and make the next step obvious and easy</li>
                        </ul>

                        {/* AI Reception */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            B. 24/7 AI Reception Mission – Calls but Few Bookings
                        </h3>

                        <p className="text-gray-700 mb-4"><strong>Common symptoms:</strong></p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Calls come in, but not many appointments are booked</li>
                            <li>Callers seem confused or frustrated</li>
                            <li>Your team doesn't trust the leads coming through</li>
                        </ul>

                        <p className="text-gray-700 mb-4"><strong>Simple adjustments:</strong></p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>Clarify the call's purpose: "Let's get you scheduled."</li>
                            <li>Remove extra friction or unnecessary questions early in the call</li>
                            <li>Make sure the calendar and routing rules match what the AI promises</li>
                        </ul>

                        {/* Reviews */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            C. Reviews & Reputation Mission – Nobody Leaves a Review
                        </h3>

                        <p className="text-gray-700 mb-4"><strong>Common symptoms:</strong></p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>You ask for reviews, but almost no one responds</li>
                            <li>People say "I'll do it" and then never do</li>
                            <li>You see more negative reviews than positive ones</li>
                        </ul>

                        <p className="text-gray-700 mb-4"><strong>Simple adjustments:</strong></p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>Ask closer to the moment of delight (right after a job is complete)</li>
                            <li>Make the review link stupid-simple to access</li>
                            <li>Train your team to mention reviews verbally so the follow-up doesn't feel "out of nowhere"</li>
                        </ul>

                        {/* Data Room */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            D. Buyer-Ready Data Room Mission – Stalled or Overwhelming
                        </h3>

                        <p className="text-gray-700 mb-4"><strong>Common symptoms:</strong></p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>You start, then stall out</li>
                            <li>The task feels huge and vague</li>
                            <li>You're not sure what "done" even looks like</li>
                        </ul>

                        <p className="text-gray-700 mb-4"><strong>Simple adjustments:</strong></p>
                        <ul className="list-disc pl-6 mb-8 text-gray-700">
                            <li>Start with just the core 2–3 folders (basic financials + customer/revenue breakdowns)</li>
                            <li>Assign responsibilities (you, bookkeeper, ops lead, advisor)</li>
                            <li>Define a 90-day "good enough to show someone" goal, not "perfect"</li>
                        </ul>

                        {/* Section 4 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            4. When to Persist vs Pivot
                        </h2>

                        <p className="text-gray-700 mb-4">Rough rule of thumb:</p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-4">
                            <p className="text-gray-700">
                                If you've only made <strong>one attempt with a small audience</strong>, you likely need to <strong>persist and refine</strong>, not pivot.
                            </p>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-6">
                            <p className="text-gray-700 mb-2">
                                If you've had <strong>multiple attempts, with clear adjustments</strong>, and the same poor pattern, it might be time to <strong>pivot</strong>:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Different audience segment</li>
                                <li>Different type of offer</li>
                                <li>Different Mission order</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-8">
                            The question isn't "Does the platform work?" It's: <strong>"Have we found our right combination of audience, offer, experience, and math yet?"</strong>
                        </p>

                        {/* Section 5 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            5. When to Bring in Extra Help
                        </h2>

                        <p className="text-gray-700 mb-4">If you're stuck, consider:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>A consultant or advisor who uses Legacy Architect OS</li>
                            <li>A trusted team member who can own part of a Mission</li>
                            <li>A partner who specializes in marketing, finance, or operations</li>
                        </ul>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 mt-12">
                            <p className="text-xl font-bold text-gray-900 mb-4 text-center">
                                You don't get extra points for suffering alone.
                            </p>
                            <p className="text-gray-700 text-center">
                                You get points for building a business that works—with you, and eventually, without you.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need to Diagnose Your Current State?</h3>
                            <p className="text-gray-700 mb-6">
                                Run your Hidden Profit + Exit Readiness Checkup to identify which levers need adjustment.
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

export default TroubleshootingMissions;
