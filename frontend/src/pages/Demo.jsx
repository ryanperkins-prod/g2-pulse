import React, { useState, useEffect } from 'react';

function Demo() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Check if widget script is already loaded
    if (window.G2Pulse) {
      setWidgetLoaded(true);
      return;
    }

    // Load the widget script
    const script = document.createElement('script');
    script.src = 'https://ryanperkins-prod.github.io/g2-pulse/g2-pulse-widget.js';
    script.setAttribute('data-vendor-id', 'vendor_g2demo');
    script.setAttribute('data-campaign-id', 'campaign_demo');
    script.setAttribute('data-product-name', 'G2 Pulse Demo');
    script.setAttribute('data-trigger', 'manual');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-api-url', import.meta.env.VITE_API_URL || 'https://g2-pulse-api.onrender.com');

    script.onload = () => {
      setWidgetLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: hide widget if showing
      if (window.G2Pulse) {
        window.G2Pulse.hide();
      }
    };
  }, []);

  const showWidget = () => {
    if (window.G2Pulse) {
      window.G2Pulse.show();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Demo</h1>
        <p className="text-gray-600">
          Experience the G2 Pulse widget as your users would see it
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 mb-8 border border-orange-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Try it yourself</h2>
        <p className="text-gray-700 mb-6">
          Click the button below to launch the NPS widget. Go through the full flow:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
          <li>Select your NPS score (0-10)</li>
          <li>Add a comment about your experience</li>
          <li>See the personalized thank you screen</li>
          <li>Try the review form (loads inline, no landing page!)</li>
        </ol>
        <button
          onClick={showWidget}
          disabled={!widgetLoaded}
          className="px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FF492C' }}
        >
          {widgetLoaded ? '🚀 Launch Widget' : '⏳ Loading widget...'}
        </button>
      </div>

      {/* Feature Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">😊</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Promoters (9-10)</h3>
          <p className="text-sm text-gray-600">
            See a big, prominent "Leave a review" CTA. The review form loads right in the widget - no redirects!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">😐</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Passives (7-8)</h3>
          <p className="text-sm text-gray-600">
            Resource link takes priority, with a secondary review option. Both actions available.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">😞</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Detractors (0-6)</h3>
          <p className="text-sm text-gray-600">
            Support CTA is primary, but review option is still available (de-emphasized at bottom).
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What makes this special?</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">No Landing Pages</h3>
              <p className="text-sm text-gray-600">
                The review form loads directly in the widget. Users never leave your app - keeping conversion rates high and friction low.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Personalization</h3>
              <p className="text-sm text-gray-600">
                Each score range sees a different experience. Promoters get review prompts, passives get resources, detractors get support.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Always Offer Reviews</h3>
              <p className="text-sm text-gray-600">
                All users can leave a G2 review if they want - the emphasis just changes based on their sentiment. This maximizes genuine reviews.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tracks Everything</h3>
              <p className="text-sm text-gray-600">
                Every click, every submission, every completed review is tracked and visible in your dashboard with budget attribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">For Developers</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Lightweight:</strong> The widget is ~15KB gzipped and loads asynchronously without blocking page render.
          </p>
          <p>
            <strong>Privacy-friendly:</strong> Uses anonymous user IDs stored in localStorage. No cookies, no cross-site tracking.
          </p>
          <p>
            <strong>Customizable:</strong> Control trigger timing (delay, action, manual), theme (light/dark), and all copy via the Settings page.
          </p>
          <p>
            <strong>Production-ready:</strong> Deployed to GitHub Pages (frontend) and Render.com (backend). Fully functional with SQLite database.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Demo;
