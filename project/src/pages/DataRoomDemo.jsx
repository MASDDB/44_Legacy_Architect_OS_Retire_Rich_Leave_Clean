import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataRoomFolder from '../components/rrlc/DataRoomFolder';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { demoBusiness } from '../data/demoDataRoomData';

const DataRoomDemo = () => {
    const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(2); // Start with most complete
    const currentBusiness = demoBusiness[selectedBusinessIndex];

    const totalFolders = currentBusiness.folders.length;
    const completedFolders = currentBusiness.folders.filter(f => f.is_complete).length;
    const totalDocuments = currentBusiness.folders.reduce((sum, f) => sum + f.document_count, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">RRLC</h1>
                            <p className="text-xs text-muted-foreground">M&A Data Room Demo</p>
                        </div>
                    </div>
                    <Link to="/">
                        <Button iconName="X" variant="ghost" size="sm">
                            Close Demo
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Business Selector */}
                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/30 rounded-xl p-6 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                🎯 Interactive Data Room Demo
                            </h2>
                            <p className="text-muted-foreground">
                                Explore three real examples of M&A data rooms at different stages of completion
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {demoBusiness.map((business, index) => (
                            <button
                                key={business.id}
                                onClick={() => setSelectedBusinessIndex(index)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${selectedBusinessIndex === index
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'border-border bg-card hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-foreground">{business.name}</h3>
                                    {selectedBusinessIndex === index && (
                                        <Icon name="CheckCircle" size={20} className="text-primary" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${business.completion}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-primary">
                                        {business.completion}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {business.folders.filter(f => f.is_complete).length}/{business.folders.length} folders complete
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Business Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {currentBusiness.name} - Data Room
                    </h2>
                    <p className="text-muted-foreground">
                        Professional M&A data room organized with industry-standard 0-10 structure
                    </p>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                Data Room Completeness
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {completedFolders} of {totalFolders} folders complete • {totalDocuments} documents uploaded
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-primary">
                                {currentBusiness.completion}%
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Overall Progress</div>
                        </div>
                    </div>
                    <div className="mt-4 h-3 bg-background rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${currentBusiness.completion}%` }}
                        />
                    </div>
                </div>

                {/* Folders */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Data Room Structure (0-10 Sections)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Standard M&A diligence folder structure. Click any folder to view its contents.
                    </p>
                    <div className="space-y-4">
                        {currentBusiness.folders.map((folder) => (
                            <DataRoomFolder
                                key={folder.id}
                                folder={folder}
                                documents={folder.documents}
                                onUpload={() => { }} // Demo mode - no upload
                                onDelete={() => { }} // Demo mode - no delete
                            />
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary via-accent to-primary rounded-xl p-8 text-center text-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
                            <Icon name="TrendingUp" size={20} />
                            <span className="text-sm font-medium">Increase Your Exit Valuation</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Build Your Own Data Room?
                        </h2>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            A well-organized data room demonstrates operational maturity and can increase your exit valuation by
                            10-20%. Start building yours today and be buyer-ready.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/user-authentication">
                                <Button
                                    size="lg"
                                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
                                    iconName="Rocket"
                                >
                                    Start Building Your Data Room
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
                                    iconName="ArrowLeft"
                                >
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-white/70 mt-6">
                            ⚡ Free to start • No credit card required • Full M&A readiness suite
                        </p>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Clock" size={28} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Save Weeks of Time</h3>
                        <p className="text-sm text-muted-foreground">
                            Pre-organized structure means you can focus on collecting documents, not organizing them
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Shield" size={28} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Professional Impression</h3>
                        <p className="text-sm text-muted-foreground">
                            Show buyers you're organized and serious about the transaction from day one
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="TrendingUp" size={28} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Higher Valuation</h3>
                        <p className="text-sm text-muted-foreground">
                            Well-documented businesses command premium valuations and close faster
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border mt-16 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2024 RRLC - Retire Rich, Leave Clean. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default DataRoomDemo;
