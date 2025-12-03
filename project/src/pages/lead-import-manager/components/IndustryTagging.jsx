import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IndustryTagging = ({ selectedLeads, onApplyTags, availableTags }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const predefinedTags = [
    { id: 'technology', label: 'Technology', color: 'bg-blue-100 text-blue-800' },
    { id: 'healthcare', label: 'Healthcare', color: 'bg-green-100 text-green-800' },
    { id: 'finance', label: 'Finance', color: 'bg-purple-100 text-purple-800' },
    { id: 'real-estate', label: 'Real Estate', color: 'bg-orange-100 text-orange-800' },
    { id: 'education', label: 'Education', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'retail', label: 'Retail', color: 'bg-pink-100 text-pink-800' },
    { id: 'manufacturing', label: 'Manufacturing', color: 'bg-gray-100 text-gray-800' },
    { id: 'consulting', label: 'Consulting', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev?.includes(tagId) 
        ? prev?.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag?.trim() && !selectedTags?.includes(customTag?.trim())) {
      setSelectedTags(prev => [...prev, customTag?.trim()]);
      setCustomTag('');
      setShowCustomInput(false);
    }
  };

  const handleApplyTags = () => {
    onApplyTags(selectedLeads, selectedTags);
    setSelectedTags([]);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Industry Tagging</h3>
          <p className="text-sm text-muted-foreground">
            Apply industry tags to {selectedLeads?.length} selected leads
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Custom Tag
        </Button>
      </div>
      {showCustomInput && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter custom industry tag"
              value={customTag}
              onChange={(e) => setCustomTag(e?.target?.value)}
              className="flex-1"
              onKeyPress={(e) => e?.key === 'Enter' && handleAddCustomTag()}
            />
            <Button variant="outline" size="sm" onClick={handleAddCustomTag}>
              Add
            </Button>
          </div>
        </div>
      )}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Predefined Tags</h4>
        <div className="flex flex-wrap gap-2">
          {predefinedTags?.map((tag) => (
            <button
              key={tag?.id}
              onClick={() => handleTagToggle(tag?.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTags?.includes(tag?.id)
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                  : tag?.color + ' hover:opacity-80'
              }`}
            >
              {tag?.label}
              {selectedTags?.includes(tag?.id) && (
                <Icon name="Check" size={14} className="ml-1 inline" />
              )}
            </button>
          ))}
        </div>
      </div>
      {selectedTags?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-3">Selected Tags</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags?.map((tagId) => {
              const predefinedTag = predefinedTags?.find(t => t?.id === tagId);
              return (
                <span
                  key={tagId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {predefinedTag ? predefinedTag?.label : tagId}
                  <button
                    onClick={() => handleTagToggle(tagId)}
                    className="ml-2 hover:text-primary/70"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-primary" />
          Tagging Benefits
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Improved campaign targeting and personalization</li>
          <li>• Better lead segmentation for follow-up strategies</li>
          <li>• Enhanced analytics and reporting by industry</li>
          <li>• Automated workflow triggers based on industry type</li>
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          onClick={handleApplyTags}
          disabled={selectedTags?.length === 0 || selectedLeads?.length === 0}
          className="flex-1"
        >
          <Icon name="Tag" size={16} className="mr-2" />
          Apply Tags to {selectedLeads?.length} Leads
        </Button>
        <Button variant="outline" className="flex-1">
          <Icon name="Eye" size={16} className="mr-2" />
          Preview Changes
        </Button>
      </div>
    </div>
  );
};

export default IndustryTagging;