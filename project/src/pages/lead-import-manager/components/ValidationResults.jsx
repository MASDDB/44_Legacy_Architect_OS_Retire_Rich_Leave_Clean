import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationResults = ({ validationStats, errors, onFixErrors }) => {
  const { total, valid, invalid, duplicates } = validationStats;
  const validPercentage = total > 0 ? Math.round((valid / total) * 100) : 0;
  const invalidPercentage = total > 0 ? Math.round((invalid / total) * 100) : 0;
  const duplicatePercentage = total > 0 ? Math.round((duplicates / total) * 100) : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Validation Results</h3>
        {errors?.length > 0 && (
          <Button variant="outline" size="sm" onClick={onFixErrors}>
            <Icon name="Wrench" size={16} className="mr-2" />
            Fix Errors
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">{valid}</p>
              <p className="text-sm text-success/80">Valid Leads</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-success/20 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${validPercentage}%` }}
              />
            </div>
            <p className="text-xs text-success/80 mt-1">{validPercentage}% of total</p>
          </div>
        </div>

        <div className="bg-error/10 rounded-lg p-4 border border-error/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-error">{invalid}</p>
              <p className="text-sm text-error/80">Invalid Leads</p>
            </div>
            <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
              <Icon name="XCircle" size={24} className="text-error" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-error/20 rounded-full h-2">
              <div
                className="bg-error h-2 rounded-full transition-all duration-300"
                style={{ width: `${invalidPercentage}%` }}
              />
            </div>
            <p className="text-xs text-error/80 mt-1">{invalidPercentage}% of total</p>
          </div>
        </div>

        <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">{duplicates}</p>
              <p className="text-sm text-warning/80">Duplicates</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name="Copy" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-warning/20 rounded-full h-2">
              <div
                className="bg-warning h-2 rounded-full transition-all duration-300"
                style={{ width: `${duplicatePercentage}%` }}
              />
            </div>
            <p className="text-xs text-warning/80 mt-1">{duplicatePercentage}% of total</p>
          </div>
        </div>
      </div>
      {errors?.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <h4 className="font-medium text-error mb-3 flex items-center">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            Validation Errors ({errors?.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {errors?.slice(0, 10)?.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <Icon name="AlertCircle" size={14} className="text-error mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-error font-medium">Row {error?.row}: {error?.field}</p>
                  <p className="text-error/80">{error?.message}</p>
                </div>
              </div>
            ))}
            {errors?.length > 10 && (
              <p className="text-sm text-muted-foreground italic">
                And {errors?.length - 10} more errors...
              </p>
            )}
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="default" className="flex-1">
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Process Valid Leads ({valid})
        </Button>
        <Button variant="outline" className="flex-1">
          <Icon name="Download" size={16} className="mr-2" />
          Export Validation Report
        </Button>
      </div>
    </div>
  );
};

export default ValidationResults;