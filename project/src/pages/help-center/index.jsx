import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Legacy Architect OS – Help Center</h1>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>Note:</strong> This Help Center page is a public overview of Legacy Architect OS.
                            It's designed to help you understand what the platform does, who it's for,
                            and how it works at a high level.
                        </p>
                        <p className="text-sm text-blue-900 mt-2">
                            Once you create an account and log in, you'll unlock additional in-app guides,
                            templates, and step-by-step resources.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-blue max-w-none">

                    {/* 1. Start Here */}
                    <section id="start-here" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Start Here</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.1 What is Legacy Architect OS?</h3>
                        <p className="text-gray-700 mb-4">
                            Legacy Architect OS is a growth and exit-readiness system for service-based business owners.
                        </p>
                        <p className="text-gray-700 mb-4">It helps you:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Find hidden profit in your existing business</li>
                            <li>Stop losing money from missed calls and slow follow-up</li>
                            <li>Boost online reviews and reputation</li>
                            <li>Get your business "exit-ready" so you can sell, step back, or hand it down on your terms</li>
                        </ul>
                        <p className="text-gray-700 mb-4">It combines three things in one place:</p>
                        <ol className="list-decimal pl-6 mb-4 text-gray-700">
                            <li>A Hidden Profit + Exit Readiness Checkup (your "X-ray")</li>
                            <li>A set of guided Missions that drive results in 90 days or less</li>
                            <li>A dashboard that shows revenue wins and exit-readiness progress over time</li>
                        </ol>
                        <p className="text-gray-700 mb-6">
                            If you're a business owner who's tired of chaos, wants more cash now, and wants the option to sell or step back later, this platform was built for you.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.2 Who is Legacy Architect OS For?</h3>
                        <p className="text-gray-700 mb-4">Legacy Architect OS is designed for:</p>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Local service businesses</p>
                            <p className="text-gray-700">HVAC, plumbing, roofing, electrical, home services, etc.</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Professional services</p>
                            <p className="text-gray-700">Accountants, financial planners, insurance agencies, law firms, etc.</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Owners who want options</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Retire in the next few years</li>
                                <li>Keep the business but work less</li>
                                <li>Make the company attractive to buyers or successors</li>
                            </ul>
                        </div>
                        <p className="text-gray-700 mb-4">It's not ideal for:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Businesses with no customers yet</li>
                            <li>People looking for a "push-button get rich quick" hack</li>
                            <li>Owners unwilling to share basic numbers (revenue, margins, call volume, etc.)</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you're willing to be honest about your numbers and take simple, consistent action, Legacy Architect OS can help you move from "stuck operator" to "architect of your exit."
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.3 How Legacy Architect OS Works (At a Glance)</h3>
                        <p className="text-gray-700 mb-4">The platform follows a simple path:</p>
                        <ol className="list-decimal pl-6 mb-4 text-gray-700">
                            <li><strong>Checkup</strong> – Run your Hidden Profit + Exit Readiness Checkup</li>
                            <li><strong>Choose Missions</strong> – Based on your results, pick your first Mission(s):
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Cash-Boost</li>
                                    <li>24/7 AI Reception</li>
                                    <li>Reviews & Reputation</li>
                                    <li>Buyer-Ready Data Room</li>
                                </ul>
                            </li>
                            <li><strong>Execute</strong> – Follow the guided steps inside each Mission</li>
                            <li><strong>Track</strong> – Watch your revenue wins and exit-readiness scores move over time</li>
                            <li><strong>Repeat</strong> – When one Mission stabilizes, add the next</li>
                        </ol>
                        <p className="text-gray-700 mb-4">Think of it like this:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>The Checkup tells you where you're leaking money and value</li>
                            <li>The Missions give you focused projects to plug those leaks</li>
                            <li>The Dashboard keeps score so you can see your progress</li>
                        </ul>
                    </section>

                    {/* 2. Getting Started */}
                    <section id="getting-started" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Getting Started</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">2.1 Your First 24 Hours in Legacy Architect OS</h3>
                        <p className="text-gray-700 mb-4">In your first 24 hours, your only goal is to get clarity.</p>
                        <ol className="list-decimal pl-6 mb-4 text-gray-700">
                            <li><strong>Create your account / log in</strong></li>
                            <li><strong>Complete the Hidden Profit + Exit Readiness Checkup</strong>
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Answer questions about revenue, profit, leads, calls, and operations</li>
                                    <li>Be honest; this is for you, not the internet</li>
                                </ul>
                            </li>
                            <li><strong>Review your scores</strong>
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Hidden Profit Score</li>
                                    <li>Exit Readiness Score</li>
                                    <li>AI Infrastructure Score (if available)</li>
                                </ul>
                            </li>
                            <li><strong>Pick ONE Mission to start with</strong>
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Most owners start with Cash-Boost or 24/7 AI Reception</li>
                                </ul>
                            </li>
                        </ol>
                        <p className="text-gray-700 mb-6">
                            Don't try to do everything on day one. The win for Day 1 is: <em>"I see where I am and I know my first focus."</em>
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">2.2 Your First 7 Days: Get a Quick Win</h3>
                        <p className="text-gray-700 mb-4">In your first week, your main objective is a simple, measurable win.</p>
                        <p className="text-gray-700 mb-4">Recommended flow:</p>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Cash-Boost Mission (common first pick)</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Identify one segment of past customers you want to re-engage</li>
                                <li>Choose a simple offer or reason to reach out (seasonal tune-up, annual review, etc.)</li>
                                <li>Prepare your outreach inside whatever tools or systems you use</li>
                            </ul>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Or: 24/7 AI Reception Mission</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Decide how you want missed calls handled</li>
                                <li>Clarify your ideal outcome: booked appointments, lead capture, or both</li>
                            </ul>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Check your Dashboard</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Look for early signs of activity: responses, booked calls, or new reviews</li>
                                <li>Don't obsess over perfection; focus on momentum</li>
                            </ul>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Your first 7 days are about activity, not mastery. You're turning the system on and letting it start working for you.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">2.3 Your First 30 Days: Build a New Baseline</h3>
                        <p className="text-gray-700 mb-4">In the first 30 days, you're aiming for a new "normal" in your business.</p>
                        <p className="text-gray-700 mb-4">Typical goals:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li><strong>Cash-Boost Mission:</strong> A measurable bump in revenue from past customers / leads</li>
                            <li><strong>24/7 AI Reception Mission:</strong> Fewer missed calls, more booked appointments from calls that used to slip through the cracks</li>
                            <li><strong>Reviews & Reputation Mission (optional):</strong> A steady trickle of new 4–5 star reviews each week</li>
                        </ul>
                        <p className="text-gray-700 mb-4">By the end of 30 days, you should be able to say:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>"We respond to more leads, faster, with less chaos."</li>
                            <li>"We have at least one mission that reliably brings in extra revenue."</li>
                            <li>"I can see how this ties into a higher future valuation."</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you haven't chosen your second Mission yet, Day 30–45 is usually the right time.
                        </p>
                    </section>

                    {/* Continue with remaining sections... */}
                    {/* Due to length, I'll create the rest in a structured way */}

                    <section id="checkup" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Hidden Profit + Exit Readiness Checkup</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">3.1 What is the Hidden Profit + Exit Readiness Checkup?</h3>
                        <p className="text-gray-700 mb-4">The Checkup is your starting line snapshot.</p>
                        <p className="text-gray-700 mb-4">It looks at:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Revenue and profit stability</li>
                            <li>Lead flow and follow-up</li>
                            <li>Call handling and missed-call recovery</li>
                            <li>Customer concentration and retention</li>
                            <li>Systems, processes, and owner dependence</li>
                        </ul>
                        <p className="text-gray-700 mb-4">
                            You'll answer a series of straightforward questions. The system uses your answers to calculate:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li><strong>Hidden Profit Score</strong> – How much money you might be leaving on the table now</li>
                            <li><strong>Exit Readiness Score</strong> – How attractive your business looks to a buyer, successor, or lender</li>
                            <li><strong>AI Infrastructure Score (if enabled)</strong> – How ready your business is to leverage automation</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You don't need to be perfect. You just need to be honest.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">3.2 How to Use Your Checkup Results</h3>
                        <p className="text-gray-700 mb-4">Once your scores are generated, you'll see:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>A quick summary of where you're strong and where you're exposed</li>
                            <li>Priority themes (e.g., missed calls, follow-up gaps, review weakness, owner dependence)</li>
                            <li>Recommended Missions to focus on first</li>
                        </ul>
                        <p className="text-gray-700 mb-4">Generally:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Low Hidden Profit Score → Start with Cash-Boost or 24/7 AI Reception</li>
                            <li>Low Exit Readiness Score → Start with Buyer-Ready Data Room or Reviews</li>
                            <li>Low AI Infrastructure Score → Start small and layer automation in as you go</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You don't need to fix everything at once. The system is built to help you sequence your moves.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">3.3 How Often Should I Re-Run the Checkup?</h3>
                        <p className="text-gray-700 mb-4">Recommended cadence:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li><strong>Baseline</strong> – As soon as you create your account</li>
                            <li><strong>Follow-up</strong> – After your first 60–90 days of focused Missions</li>
                            <li><strong>Ongoing</strong> – 1–2 times per year, or before major financing / exit conversations</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            Over time, you'll be able to see how your scores improve and how close you are to being "exit optional."
                        </p>
                    </section>

                    {/* Missions Overview */}
                    <section id="missions" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Missions Overview</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.1 What Are Missions?</h3>
                        <p className="text-gray-700 mb-4">
                            Missions are guided projects that help you solve one important problem at a time.
                        </p>
                        <p className="text-gray-700 mb-4">Each Mission is designed to:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Be focused (one clear outcome)</li>
                            <li>Be time-bound (90 days or less)</li>
                            <li>Tie directly to either more cash now or higher valuation later</li>
                        </ul>
                        <p className="text-gray-700 mb-4">Instead of leaving you with a vague "to-do" list, Missions help you:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Choose your priority</li>
                            <li>Follow a clear path</li>
                            <li>Measure the result</li>
                        </ul>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.2 Cash-Boost Mission – Turn Old Leads into New Revenue</h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Goal:</strong> Turn past customers and leads into booked work and new revenue.
                        </p>
                        <p className="text-gray-700 mb-4">Common outcomes:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Extra jobs from customers who haven't heard from you in a while</li>
                            <li>Upsells and add-ons for people you've already served</li>
                            <li>Re-activation of "stale" leads who never booked</li>
                        </ul>
                        <p className="text-gray-700 mb-4">You'll decide:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Which customers or leads to focus on first</li>
                            <li>What kind of offers or reasons to contact them</li>
                            <li>How to measure success (e.g., extra revenue, number of booked jobs)</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            This Mission is usually the fastest way to see immediate cash flow improvements.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.3 24/7 AI Reception Mission – Stop Losing Money from Missed Calls</h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Goal:</strong> Reduce the revenue you lose when calls go unanswered or follow-up is slow.
                        </p>
                        <p className="text-gray-700 mb-4">Common outcomes:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>More booked appointments from inbound calls</li>
                            <li>Fewer leads slipping through the cracks</li>
                            <li>Less stress on your team trying to answer 100% of calls live</li>
                        </ul>
                        <p className="text-gray-700 mb-4">You'll define:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>What a "good" outcome looks like for your calls (lead capture, booked job, etc.)</li>
                            <li>What questions matter most when qualifying a new inquiry</li>
                            <li>How and when calls should be handed off to humans</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            The Mission helps you treat call handling as a system instead of a daily fire drill.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.4 Reviews & Reputation Mission – Turn Happy Customers into Social Proof</h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Goal:</strong> Build a steady pipeline of 4–5 star reviews and a stronger reputation online.
                        </p>
                        <p className="text-gray-700 mb-4">Common outcomes:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>More reviews on your chosen platforms</li>
                            <li>A more accurate reflection of your quality of work</li>
                            <li>Stronger positioning when prospects compare you to competitors</li>
                        </ul>
                        <p className="text-gray-700 mb-4">You'll decide:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Where you most want reviews (Google, Facebook, niche directories, etc.)</li>
                            <li>When to ask (e.g., after job completion, at handoff, after first invoice is paid)</li>
                            <li>How to respond to both positive and negative feedback</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            This Mission turns happy customers into visible proof that you're the better choice.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.5 Buyer-Ready Data Room Mission – Get Your Business "Exit Ready"</h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Goal:</strong> Organize your key business information so you're ready for buyers, lenders, or successors.
                        </p>
                        <p className="text-gray-700 mb-4">Common outcomes:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Centralized financial and operational documents</li>
                            <li>Cleaner numbers that are easier to explain</li>
                            <li>Less scrambling if someone asks, "Can I see your books?"</li>
                        </ul>
                        <p className="text-gray-700 mb-4">You'll work toward having:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>A basic financial package (P&L, balance sheet, cash flow, etc.)</li>
                            <li>Customer and revenue breakdowns</li>
                            <li>Key contracts, processes, and documentation accessible in one place</li>
                        </ul>
                        <p className="text-gray-700 mb-4">This Mission makes it easier to:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Raise your valuation</li>
                            <li>Reduce deal risk</li>
                            <li>Move faster when opportunity shows up</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You don't need everything perfect on day one; progress here is about reducing chaos over time.
                        </p>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Plans, Pricing & Free Trial (High-Level)</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            <em>Note: This article is intentionally high-level so you can adjust details (like specific dollar amounts or trial length) without rewriting the whole thing.</em>
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">5.1 Do You Offer a Free Trial?</h3>
                        <p className="text-gray-700 mb-4">Yes, we offer a free trial so you can:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Run your Hidden Profit + Exit Readiness Checkup</li>
                            <li>Explore the Missions dashboard</li>
                            <li>Understand how the system fits your business</li>
                        </ul>
                        <p className="text-gray-700 mb-4">During the trial, we recommend you:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Complete the Checkup</li>
                            <li>Start one Mission (even in a light way)</li>
                            <li>Decide if you want to keep building your exit-ready operating system with us</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            Check your pricing page or in-app billing section for current trial terms.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">5.2 What Happens After the Trial?</h3>
                        <p className="text-gray-700 mb-4">After your trial, you'll choose a paid plan (if you decide to stay) and:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Your data and settings will remain intact</li>
                            <li>You can keep refining Missions and improving your scores</li>
                            <li>You'll unlock access to additional resources, support, and deeper implementation content</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you choose not to continue, you can cancel before the trial ends according to the terms in the app.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">5.3 What's Included in a Typical Subscription?</h3>
                        <p className="text-gray-700 mb-4">While exact features may vary by plan, a typical subscription can include:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Ongoing access to the Hidden Profit + Exit Readiness Checkup</li>
                            <li>Full access to core Missions (Cash-Boost, AI Reception, Reviews, Data Room)</li>
                            <li>Dashboards and reporting</li>
                            <li>Access to standard support and knowledge resources</li>
                        </ul>
                        <p className="text-gray-700 mb-4">Some plans may also include:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Advanced automations or integrations</li>
                            <li>Partner/consultant features</li>
                            <li>Priority or concierge support</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            Refer to your Pricing or Plans page in-app for specifics.
                        </p>
                    </section>

                    {/* Security & Privacy */}
                    <section id="security" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Security, Privacy & Data Ownership</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">6.1 How Do You Handle My Data?</h3>
                        <p className="text-gray-700 mb-4">We take data protection seriously. In plain language:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Your business data is used to run your Checkup, Missions, and dashboards</li>
                            <li>We do not sell your internal business data to third parties</li>
                            <li>We follow reasonable security practices for storing and transmitting data</li>
                        </ul>
                        <p className="text-gray-700 mb-4">We encourage you to:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Use strong, unique passwords</li>
                            <li>Limit access to trusted team members</li>
                            <li>Review any connected tools you integrate (CRMs, phone systems, etc.)</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            For full legal details, please review our Privacy Policy and Terms of Service (linked in your account or on our website).
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">6.2 Who Owns My Data?</h3>
                        <p className="text-gray-700 mb-4">You own your underlying business data.</p>
                        <p className="text-gray-700 mb-4">Within Legacy Architect OS:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>You can update or delete information you've entered</li>
                            <li>You can request data export options where available</li>
                            <li>If you cancel, we will retain or delete data according to our documented policies</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you work with a consultant or partner using Legacy Architect OS, you may also have a separate agreement with them. That agreement controls how they use your data; we only provide the platform.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">6.3 Are You Compliant With Calling & Messaging Laws?</h3>
                        <p className="text-gray-700 mb-4">We design features with compliance in mind, especially around:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Opt-out language for messaging</li>
                            <li>Consent-based communication practices</li>
                            <li>Respecting platform and carrier guidelines where applicable</li>
                        </ul>
                        <p className="text-gray-700 mb-4">However, you are ultimately responsible for:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>How you upload and contact customers</li>
                            <li>Obtaining appropriate consent for messaging or calling</li>
                            <li>Following any industry, local, or country-specific regulations</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            Legacy Architect OS is a tool. We help you operate more cleanly and professionally, but we cannot provide legal advice. When in doubt, consult your attorney or compliance advisor.
                        </p>
                    </section>

                    {/* Consultants & Partners */}
                    <section id="partners" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Working With Consultants, Advisors & Partners</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">7.1 Can My Consultant or Advisor Use Legacy Architect OS With Me?</h3>
                        <p className="text-gray-700 mb-4">Yes. Many owners choose to work with:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>A marketing or AI agency</li>
                            <li>A consultant</li>
                            <li>A fractional CFO or advisor</li>
                        </ul>
                        <p className="text-gray-700 mb-4">They may use Legacy Architect OS to:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Run your Hidden Profit + Exit Readiness Checkup</li>
                            <li>Design and manage Missions with you</li>
                            <li>Help you organize for a future exit</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You remain the business owner. They help you use the system more effectively.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">7.2 What is a Legacy Architect OS "AI Partnership" or "Legacy Architect Partner"?</h3>
                        <p className="text-gray-700 mb-4">In some cases, you may meet a certified partner or advisor who offers:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Done-with-you or done-for-you implementation using Legacy Architect OS</li>
                            <li>Strategic planning around valuation, exit-readiness, and automation</li>
                            <li>Ongoing support to keep your Missions on track</li>
                        </ul>
                        <p className="text-gray-700 mb-4">
                            These partners operate their own businesses; they simply use the platform as part of their service model.
                        </p>
                        <p className="text-gray-700 mb-6">
                            If you're unsure whether someone is an official partner, reach out to support via the app and we'll help you verify.
                        </p>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Frequently Asked Questions</h2>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.1 Is This Just Another CRM?</h3>
                        <p className="text-gray-700 mb-4">No.</p>
                        <p className="text-gray-700 mb-4">Legacy Architect OS is not a general-purpose CRM. It is:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>A diagnostic and execution system for hidden profit and exit-readiness</li>
                            <li>A set of Missions that guide you through specific revenue and valuation projects</li>
                            <li>A dashboard that makes your path to a better exit more visible</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You may integrate your CRM or other tools, but Legacy Architect OS focuses on what to do and in what order, not just where to store contacts.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.2 How Fast Will I See Results?</h3>
                        <p className="text-gray-700 mb-4">Typical patterns:</p>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Fast wins (0–30 days):</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Improvements in missed calls, follow-up, and small cash boosts</li>
                            </ul>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900">Structural wins (30–90 days):</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>More consistent reviews</li>
                                <li>Cleaner operations and documentation</li>
                                <li>Better visibility into exit-readiness</li>
                            </ul>
                        </div>
                        <p className="text-gray-700 mb-4">Your outcomes depend on:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>The current state of your business</li>
                            <li>How quickly you implement basic steps in each Mission</li>
                            <li>Whether you work alone or with an advisor/partner</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            The platform is a force multiplier, not a magic wand.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.3 Do I Need to Be "Good With Tech" to Use This?</h3>
                        <p className="text-gray-700 mb-4">No.</p>
                        <p className="text-gray-700 mb-4">We built Legacy Architect OS for busy owners who:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Don't want to live inside software</li>
                            <li>Don't want to become full-time tech people</li>
                            <li>Do want a clear, guided path</li>
                        </ul>
                        <p className="text-gray-700 mb-4">You'll see:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Plain-English explanations</li>
                            <li>Step-by-step guidance inside Missions</li>
                            <li>Simple dashboards with practical insights</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you want deeper automation or integrations, you can involve a consultant or technical partner.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.4 Is My Business Too Small or Too Messy?</h3>
                        <p className="text-gray-700 mb-4">Probably not.</p>
                        <p className="text-gray-700 mb-4">Legacy Architect OS is ideal for:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Established businesses with real customers and cash flow</li>
                            <li>Owners who feel like the business is "stuck in their head"</li>
                            <li>Companies where the owner still makes too many decisions</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            If you have no customers yet, you're likely too early. If you have some chaos but real revenue, you're in the right place.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.5 What If I Never Plan to Sell My Business?</h3>
                        <p className="text-gray-700 mb-4">You don't have to sell to benefit from being exit-ready.</p>
                        <p className="text-gray-700 mb-4">Owners who "never plan to sell" still get value from:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>More organized operations</li>
                            <li>Less dependence on the owner</li>
                            <li>Better customer experience and reputation</li>
                            <li>A business that is easier to insure, finance, or pass on</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            You're always free to keep the business. We just help you build it so you have options.
                        </p>

                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.6 How Do I Get Support?</h3>
                        <p className="text-gray-700 mb-4">You can get support by:</p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                            <li>Clicking the Help Center link inside the app</li>
                            <li>Browsing these articles for quick answers</li>
                            <li>Using any in-app support options (chat/email) listed in your account</li>
                        </ul>
                        <p className="text-gray-700 mb-6">
                            For account-specific or billing questions, please use the channels provided in your subscription confirmation or billing portal.
                        </p>
                    </section>

                    {/* Call to Action */}
                    <section id="cta" className="mb-0">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Ready to See Legacy Architect OS in Action?
                            </h2>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                If you haven't created your account yet:
                            </p>
                            <ul className="text-left max-w-xl mx-auto mb-8 space-y-2">
                                <li className="flex items-start text-white">
                                    <Icon name="CheckCircle" size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Run your <strong>Hidden Profit + Exit Readiness Checkup</strong></span>
                                </li>
                                <li className="flex items-start text-white">
                                    <Icon name="CheckCircle" size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                                    <span>See which <strong>Missions</strong> we recommend for your business</span>
                                </li>
                                <li className="flex items-start text-white">
                                    <Icon name="CheckCircle" size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Decide if you want to keep building an exit-ready operating system with us</span>
                                </li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/ai-audit"
                                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <Icon name="Activity" size={20} className="mr-2" />
                                    Start Your Free Checkup
                                </Link>
                                <Link
                                    to="/user-authentication"
                                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors border-2 border-white"
                                >
                                    <Icon name="LogIn" size={20} className="mr-2" />
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default HelpCenter;
