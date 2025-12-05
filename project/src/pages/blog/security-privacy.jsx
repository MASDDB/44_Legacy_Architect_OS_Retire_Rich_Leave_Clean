import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const SecurityPrivacy = () => {
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
                        <span className="text-gray-900">Security & Privacy</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            Security
                        </span>
                        <span>December 5, 2024</span>
                        <span>•</span>
                        <span>9 min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Security, Privacy & Data Stewardship in Legacy Architect OS
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-6">
                        A plain-English overview of how we protect your data, respect your privacy, and share responsibility for security.
                    </p>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
                    <img
                        src="/blog_security.png"
                        alt="Security, Privacy & Data Stewardship"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                        <p className="text-lg text-gray-700 mb-6">
                            When you plug your business into any platform, especially one that touches your customers, your numbers, and your potential exit, the question under the surface is:
                        </p>

                        <p className="text-xl text-gray-900 font-semibold mb-8 italic">
                            "Can I trust this thing with my data and my reputation?"
                        </p>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">This article covers:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li><strong>Security</strong> (keeping bad actors out)</li>
                                <li><strong>Privacy</strong> (how your information is used)</li>
                                <li><strong>Data ownership</strong> (who owns what)</li>
                                <li><strong>Messaging compliance</strong> (staying on the right side of the rules)</li>
                                <li><strong>Shared responsibility</strong> (what we handle vs what you handle)</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8">
                            <p className="text-gray-700">
                                <strong>Important:</strong> It's not a substitute for legal or compliance advice, but it will help you understand the ground rules.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            1. How We Think About Security
                        </h2>

                        <p className="text-gray-700 mb-4">
                            Security is about keeping your data from being accessed or changed by people who shouldn't touch it.
                        </p>

                        <p className="text-gray-700 mb-4">
                            Behind the scenes, Legacy Architect OS uses industry-standard practices to help protect:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Your account (logins, passwords, session security)</li>
                            <li>Your business data (numbers, contacts, docs, notes)</li>
                            <li>Your workflows (Missions, configuration, integrations)</li>
                        </ul>

                        <p className="text-gray-700 mb-4">
                            On your side, the most important security decisions are simple but powerful:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Use strong, unique passwords for your account</li>
                            <li>Don't share logins; give appropriate access to team members using their own accounts when available</li>
                            <li>Remove access for people who leave your company</li>
                            <li>Be careful about where and how you store exports or downloaded reports</li>
                        </ul>

                        <div className="bg-blue-50 p-6 rounded-lg mb-8">
                            <p className="text-gray-900 font-semibold mb-2">Think of it as a partnership:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>We provide a locked building with security systems.</li>
                                <li>You decide who gets a key and what they're allowed to do inside.</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            2. How We Treat Your Business Data
                        </h2>

                        <p className="text-gray-700 mb-4">Legacy Architect OS needs some of your business information so it can:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Run your Hidden Profit + Exit Readiness Checkup</li>
                            <li>Power your Missions (Cash-Boost, 24/7 AI Reception, Reviews, Buyer-Ready Data Room, etc.)</li>
                            <li>Populate your dashboards and reports</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Examples of data you might store or connect:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Revenue, profit, and other financial metrics</li>
                            <li>Customer and lead information (names, contact details, history)</li>
                            <li>Call and booking activity</li>
                            <li>Documents related to operations and exit-readiness</li>
                        </ul>

                        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">In plain terms:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Your data is used to deliver the service you signed up for</li>
                                <li>We do not treat your internal business data as something to simply sell off to random third parties</li>
                                <li>Any third-party tools connected (CRMs, phone systems, messaging providers, etc.) will have their own privacy policies and terms</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-8">
                            You're always in control of what you put in, what you connect, and what you choose to export or delete.
                        </p>

                        {/* Section 3 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            3. Who Owns the Data?
                        </h2>

                        <div className="bg-blue-100 border-2 border-blue-600 rounded-lg p-6 mb-6">
                            <p className="text-xl font-bold text-gray-900 mb-2">Short version:</p>
                            <p className="text-gray-700 mb-2">
                                <strong>You own your underlying business data.</strong>
                            </p>
                            <p className="text-gray-700">
                                <strong>We own the software and the IP behind Legacy Architect OS.</strong>
                            </p>
                        </div>

                        <p className="text-gray-700 mb-4">That means:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Your customer lists, financials, and documents remain your assets</li>
                            <li>We provide the structure and tools that help you organize, analyze, and act on those assets</li>
                            <li>If you end your subscription, our policies will dictate how long certain data is retained and when it's deleted—but the business itself and its underlying information are still yours</li>
                        </ul>

                        <p className="text-gray-700 mb-4">In practice, we recommend:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Keeping your own copies of critical business documents (financials, legal docs, etc.) in a secure location you control</li>
                            <li>Using the platform as your system of action and insight, not the only place those documents exist</li>
                        </ul>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8">
                            <p className="text-gray-700">
                                If you're working with a consultant, advisor, or partner who uses Legacy Architect OS with you, your engagement agreement with them will also matter—especially if it mentions reporting, KPIs, equity, or profit-sharing.
                            </p>
                            <p className="text-gray-700 mt-2 font-semibold">
                                The platform does not give anyone ownership of your business just because they have access to your account.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            4. Messaging, Calling & Compliance: Who's Responsible?
                        </h2>

                        <p className="text-gray-700 mb-4">Some Missions and workflows involve contacting your customers and leads—for example:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Cash-Boost outreach</li>
                            <li>Follow-up sequences</li>
                            <li>Review and reputation flows</li>
                            <li>AI-assisted call handling and messaging</li>
                        </ul>

                        <p className="text-gray-700 mb-4">There are laws and guidelines in many places about:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>When you can contact people</li>
                            <li>How you obtain consent</li>
                            <li>What opt-out options must be provided</li>
                            <li>How you store and use contact information</li>
                        </ul>

                        <p className="text-gray-700 mb-4">
                            Legacy Architect OS is built to support responsible behavior—for example, by enabling:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Clear opt-out language in messages</li>
                            <li>Respecting suppression lists</li>
                            <li>Cleaner data and segmentation</li>
                        </ul>

                        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-6">
                            <p className="text-gray-900 font-semibold mb-2">But here's the key point:</p>
                            <p className="text-gray-700 mb-4">
                                <strong>You are ultimately responsible for how you use messaging and calling features.</strong>
                            </p>
                            <p className="text-gray-700 mb-2">That includes:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Making sure you have proper consent</li>
                                <li>Respecting local, state, and national regulations</li>
                                <li>Configuring any integrated tools (phone systems, SMS providers, CRMs) in a compliant way</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-8">
                            The platform is a tool. It can help you organize and execute, but it can't automatically guarantee you're obeying every law in every jurisdiction for every use case.
                        </p>

                        {/* Section 5 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            5. Integrations & Third-Party Tools
                        </h2>

                        <p className="text-gray-700 mb-4">Legacy Architect OS may interact with other services—examples might include:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>CRMs</li>
                            <li>Email and SMS providers</li>
                            <li>Call tracking or voice systems</li>
                            <li>Storage/document tools</li>
                        </ul>

                        <p className="text-gray-700 mb-4">Each of those tools has:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Its own security and privacy practices</li>
                            <li>Its own terms of service and compliance standards</li>
                        </ul>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
                            <p className="text-gray-700 mb-4">
                                When you connect one, you're effectively saying: <em>"I trust this provider to handle part of my business data and communication."</em>
                            </p>
                            <p className="text-gray-900 font-semibold mb-2">You should:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>Review their terms and privacy policy</li>
                                <li>Make sure your use of Legacy Architect OS + those tools fits your compliance and legal requirements</li>
                                <li>Periodically audit which tools are connected and which permissions they have</li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            6. Shared Responsibility: What We Handle vs What You Handle
                        </h2>

                        <p className="text-gray-700 mb-6">
                            The safest way to think about security and compliance is as a <strong>shared responsibility model</strong>.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-3">We're responsible for:</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>Building and maintaining the platform with reasonable security practices</li>
                                    <li>Giving you controls and settings to manage access and usage</li>
                                    <li>Being transparent about how the platform uses and processes your data</li>
                                    <li>Providing sensible defaults that encourage respectful, compliant use</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-3">You're responsible for:</p>
                                <ul className="list-disc pl-6 text-gray-700">
                                    <li>The accuracy and sensitivity of the data you choose to input</li>
                                    <li>Who gets access to your account and what permissions they have</li>
                                    <li>How you configure Missions, messaging, and calling in your specific use case</li>
                                    <li>How you use the results in real-world conversations, offers, and deals</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-8">
                            <p className="text-gray-900 font-semibold mb-2">When those responsibilities are respected on both sides, you end up with:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>A cleaner, safer business</li>
                                <li>Better data to support financing or exit conversations</li>
                                <li>Less stress about "what if someone saw behind the curtain?"</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                            7. This Article Is an Overview, Not Legal Advice
                        </h2>

                        <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-6 mb-6">
                            <p className="text-gray-900 font-semibold mb-3">Important reminder:</p>
                            <ul className="list-disc pl-6 text-gray-700">
                                <li>This is a high-level explanation, not a legal contract</li>
                                <li>It doesn't replace your Terms of Service, Privacy Policy, or any written agreements you sign</li>
                                <li>It is not legal advice</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 mb-4">If you're dealing with:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Heavily regulated industries</li>
                            <li>Complex ownership or financing structures</li>
                            <li>Cross-border data scenarios</li>
                        </ul>

                        <p className="text-gray-700 mb-8">
                            …you should absolutely bring in the right legal and compliance professionals.
                        </p>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 mt-12">
                            <p className="text-xl font-bold text-gray-900 text-center mb-4">
                                Legacy Architect OS is built to help you run a cleaner, more exit-ready business—
                            </p>
                            <p className="text-lg text-gray-700 text-center">
                                but you're still the one in the driver's seat when it comes to legal and regulatory decisions.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Security or Privacy?</h3>
                            <p className="text-gray-700 mb-6">
                                Review our full Terms of Service and Privacy Policy, or contact support for specific questions about your use case.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/help-center"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Icon name="HelpCircle" size={20} className="mr-2" />
                                    Visit Help Center
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

export default SecurityPrivacy;
