import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataRoomDemoSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <Icon name="FolderOpen" size={20} className="text-primary" />
                            <span className="text-sm font-semibold text-primary">M&A Data Room Demo</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            See a Buyer-Ready <span className="text-primary">Data Room</span> in Action
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8">
                            Explore three real-world examples of M&A data rooms built with our platform.
                            See how businesses at different stages of completion organize their critical documents
                            for maximum buyer confidence.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                                    <Icon name="CheckCircle" size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Industry-Standard 0-10 Structure</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pre-organized folders that buyers expect, reducing diligence time by weeks
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                                    <Icon name="TrendingUp" size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">10-20% Higher Exit Valuations</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Well-organized data rooms demonstrate operational maturity and command premium valuations
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                                    <Icon name="Zap" size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Close Deals 30% Faster</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Buyers trust organized sellers - speed up your transaction timeline
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/data-room-demo">
                                <Button size="lg" iconName="Eye" className="px-8 py-4 font-semibold">
                                    View Interactive Demo
                                </Button>
                            </Link>
                            <Link to="/user-authentication">
                                <Button size="lg" variant="outline" iconName="Rocket" className="px-8 py-4 font-semibold">
                                    Build Your Own
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Visual Preview */}
                    <div className="relative">
                        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                            {/* Mock Browser Bar */}
                            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-warning/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-success/50"></div>
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground">
                                        rrlc.com/data-room-demo
                                    </div>
                                </div>
                            </div>

                            {/* Mock Data Room Content */}
                            <div className="p-6 bg-background">
                                {/* Stats Bar */}
                                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-muted-foreground">Data Room Completeness</span>
                                        <span className="text-2xl font-bold text-primary">91%</span>
                                    </div>
                                    <div className="h-2 bg-background rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '91%' }}></div>
                                    </div>
                                </div>

                                {/* Sample Folders */}
                                <div className="space-y-2">
                                    {[
                                        { name: '0. Executive Summary', complete: true, docs: '1/1' },
                                        { name: '1. Corporate Structure', complete: true, docs: '3/3' },
                                        { name: '2. Financial Information', complete: true, docs: '3/3' },
                                        { name: '3. Customer Contracts', complete: false, docs: '2/3' }
                                    ].map((folder, index) => (
                                        <div key={index} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                                    <Icon name="Folder" size={16} className="text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-foreground">{folder.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {folder.docs} documents
                                                    </div>
                                                </div>
                                            </div>
                                            {folder.complete && (
                                                <Icon name="CheckCircle" size={14} className="text-success" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
                            <Icon name="Star" size={16} />
                            <span className="text-sm font-semibold">Try It Free!</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">3</div>
                        <div className="text-sm text-muted-foreground">
                            Real business examples to explore
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">11</div>
                        <div className="text-sm text-muted-foreground">
                            Standard M&A folder categories
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">100%</div>
                        <div className="text-sm text-muted-foreground">
                            Interactive - click to explore
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DataRoomDemoSection;
