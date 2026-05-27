import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://g2-pulse-api.onrender.com';

function Settings() {
  const [activeTab, setActiveTab] = useState('widget');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`${API_URL}/api/campaign/campaign_demo`);
      const data = await response.json();
      setCampaign(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/campaign/campaign_demo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setCampaign({ ...campaign, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading campaign settings...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'widget', label: 'Widget Config' },
    { id: 'promoter', label: 'Promoter (9-10)' },
    { id: 'passive', label: 'Passive (7-8)' },
    { id: 'detractor', label: 'Detractor (0-6)' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaign Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure your NPS widget and post-survey experiences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-lg border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-md p-6 mb-6">
        {activeTab === 'widget' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Widget Configuration</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={campaign.headline || ''}
                onChange={(e) => updateField('headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Taskly"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suppression Window (days)
              </label>
              <input
                type="number"
                value={90}
                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long after responding should we wait before asking again?
              </p>
            </div>
          </div>
        )}

        {activeTab === 'promoter' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Promoter Experience (Scores 9-10)</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={campaign.headline || ''}
                onChange={(e) => updateField('headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="You're amazing! Want to help others find us?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subheadline
              </label>
              <input
                type="text"
                value={campaign.subheadline || ''}
                onChange={(e) => updateField('subheadline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Share your experience on G2 and help other teams discover our product."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={campaign.promoterCta || ''}
                onChange={(e) => updateField('promoterCta', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Leave a Review on G2"
              />
            </div>

            {/* Info Callout */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-900">
                  <strong>How it works:</strong> When users click the review CTA, a short-form G2 review form loads directly in the widget - no landing pages, no external links. Reviews are collected seamlessly in-app.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'passive' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Passive Experience (Scores 7-8)</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={campaign.passiveMessage || ''}
                onChange={(e) => updateField('passiveMessage', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Thanks for your feedback! Here's a resource that might help you get even more value."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Link Text
              </label>
              <input
                type="text"
                value={campaign.passiveMessage || ''}
                onChange={(e) => updateField('passiveMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Explore our resource center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Link URL
              </label>
              <input
                type="url"
                value={campaign.passiveLink || ''}
                onChange={(e) => updateField('passiveLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://learn.g2.com/resources"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showReviewLink"
                defaultChecked
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="showReviewLink" className="ml-2 text-sm text-gray-700">
                Show "Still want to review?" link
              </label>
            </div>
          </div>
        )}

        {activeTab === 'detractor' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Detractor Experience (Scores 0-6)</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empathy Message
              </label>
              <textarea
                value={campaign.detractorMessage || ''}
                onChange={(e) => updateField('detractorMessage', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="We're sorry to hear you're not satisfied. Let's make this right."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support CTA Text
              </label>
              <input
                type="text"
                value={campaign.detractorMessage || ''}
                onChange={(e) => updateField('detractorMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Talk to our support team"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support CTA URL
              </label>
              <input
                type="url"
                value={campaign.detractorLink || ''}
                onChange={(e) => updateField('detractorLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://support.g2.com/contact"
              />
            </div>

            {/* Warning Callout */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-amber-900">
                  <strong>Important:</strong> Do not offer the G2 review link to detractors. This violates FTC guidelines and G2's community guidelines.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            {saveSuccess && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Settings saved successfully
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-md text-white font-medium transition disabled:opacity-50"
            style={{ backgroundColor: '#FF492C' }}
          >
            {saving ? 'Saving...' : 'Save Campaign Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
