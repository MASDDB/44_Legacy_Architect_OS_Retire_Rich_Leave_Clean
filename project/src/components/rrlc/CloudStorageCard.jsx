import React from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const CloudStorageCard = ({
    provider,
    icon,
    title,
    description,
    connected,
    onConnect,
    onDisconnect
}) => {
    return (
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-14 h-14 bg-background rounded-lg">
                        <Icon name={icon} size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{description}</p>

                        {connected ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                    <span className="text-sm font-medium text-success">Connected</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onDisconnect}
                                    className="ml-2"
                                >
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onConnect}
                                iconName="Link"
                            >
                                Connect {title}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloudStorageCard;
