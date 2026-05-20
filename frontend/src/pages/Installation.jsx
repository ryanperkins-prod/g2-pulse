import React, { useState } from 'react';

function Installation() {
  const [copied, setCopied] = useState(false);
  const [triggerMode, setTriggerMode] = useState('action');
  const [delay, setDelay] = useState(5);
  const [theme, setTheme] = useState('light');

  // Generate embed code based on settings
  const generateEmbedCode = () => {
    return `<script
  src="https://ryanperkins-prod.github.io/g2-pulse/g2-pulse-widget.js"
  data-vendor-id="vendor_g2demo"
  data-campaign-id="campaign_demo"
  data-product-name="Your Product Name"
  data-trigger="${triggerMode}"
  data-delay="${delay}"
  data-theme="${theme}"
  data-api-url="https://g2-pulse-api.onrender.com"
></script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerCode = {
    action: `// Trigger manually when user completes an action
document.getElementById('submit-btn').addEventListener('click', () => {
  if (window.G2Pulse) {
    window.G2Pulse.show();
  }
});`,
    delay: `// Auto-show after ${delay} seconds
// No code needed - widget shows automatically`,
    manual: `// Show widget programmatically
function showNPSSurvey() {
  if (window.G2Pulse) {
    window.G2Pulse.show();
  }
}

// Call it when ready
showNPSSurvey();`
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Installation Guide</h1>
        <p className="text-gray-600">
          Get your G2 Pulse widget up and running in 5 minutes
        </p>
      </div>

      {/* Step 1: Embed Code */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Step 1: Copy Your Embed Code</h2>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-md text-white font-medium transition"
            style={{ backgroundColor: copied ? '#10b981' : '#FF492C' }}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
          <pre>{generateEmbedCode()}</pre>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Mode
            </label>
            <select
              value={triggerMode}
              onChange={(e) => setTriggerMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="action">Action (Manual)</option>
              <option value="delay">Delay (Auto-show)</option>
              <option value="manual">Manual (Code trigger)</option>
            </select>
          </div>

          {triggerMode === 'delay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay (seconds)
              </label>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                min="1"
                max="60"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Paste this code right before your closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag.
            The widget will load asynchronously without affecting page performance.
          </p>
        </div>
      </div>

      {/* Step 2: Configure Trigger */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Step 2: Configure Your Trigger</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {triggerMode === 'action' && '🎯 Action Mode (Recommended)'}
              {triggerMode === 'delay' && '⏱️ Delay Mode'}
              {triggerMode === 'manual' && '⚙️ Manual Mode'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {triggerMode === 'action' && 'Show the NPS widget when users complete a meaningful action (submit form, finish task, etc.)'}
              {triggerMode === 'delay' && 'Automatically show the widget after a set delay when page loads'}
              {triggerMode === 'manual' && 'Full control - trigger the widget programmatically from your code'}
            </p>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{triggerCode[triggerMode]}</pre>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Action Mode</h4>
              <p className="text-xs text-gray-600">
                Best for: Post-purchase, task completion, feature usage
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Delay Mode</h4>
              <p className="text-xs text-gray-600">
                Best for: New users, onboarding flows, time-based triggers
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Manual Mode</h4>
              <p className="text-xs text-gray-600">
                Best for: Custom logic, A/B testing, conditional display
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Test */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Step 3: Test Your Installation</h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add the embed code to your site</h3>
              <p className="text-sm text-gray-600">Paste the script tag before your closing <code>&lt;/body&gt;</code> tag</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Open your browser console</h3>
              <p className="text-sm text-gray-600">Press <code className="bg-gray-100 px-1 rounded">F12</code> or <code className="bg-gray-100 px-1 rounded">Cmd+Option+I</code></p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Verify the widget loaded</h3>
              <p className="text-sm text-gray-600 mb-2">Type this in the console:</p>
              <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs">
                window.G2Pulse
              </div>
              <p className="text-sm text-gray-600 mt-2">✅ Should return an object with <code>show()</code> and <code>hide()</code> methods</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Test the widget</h3>
              <p className="text-sm text-gray-600 mb-2">Run this in the console:</p>
              <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs">
                window.G2Pulse.show()
              </div>
              <p className="text-sm text-gray-600 mt-2">✅ The NPS widget should appear in the bottom-right corner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Advanced Options</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Custom Product Name</h3>
            <p className="text-sm text-gray-600 mb-2">
              Change <code className="bg-gray-100 px-1 rounded">data-product-name</code> to match your product:
            </p>
            <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs">
              data-product-name="Acme CRM"
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Suppression Window</h3>
            <p className="text-sm text-gray-600">
              By default, users won't see the widget again for 90 days after responding.
              This prevents survey fatigue and improves response quality.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Programmatic Control</h3>
            <p className="text-sm text-gray-600 mb-2">JavaScript API:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs space-y-2">
              <div>// Show widget</div>
              <div>window.G2Pulse.show();</div>
              <div className="mt-2">// Hide widget</div>
              <div>window.G2Pulse.hide();</div>
              <div className="mt-2">// Reset (clear localStorage)</div>
              <div>localStorage.removeItem('g2pulse_responded');</div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-4">🔧 Troubleshooting</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-amber-900">Widget not appearing?</strong>
            <p className="text-amber-800">Check browser console for errors. Make sure the script tag is before <code>&lt;/body&gt;</code></p>
          </div>
          <div>
            <strong className="text-amber-900">Already responded?</strong>
            <p className="text-amber-800">Clear localStorage: <code className="bg-amber-100 px-1 rounded">localStorage.removeItem('g2pulse_responded')</code></p>
          </div>
          <div>
            <strong className="text-amber-900">Need help?</strong>
            <p className="text-amber-800">Check the demo page at <a href="/demo/index.html" className="underline">demo/index.html</a> for a working example</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Installation;
