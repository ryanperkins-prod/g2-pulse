/**
 * G2 Pulse - Embeddable NPS Widget
 *
 * Usage: <script src="http://localhost:5173/g2-pulse-widget.js"
 *          data-vendor-id="vendor_g2demo"
 *          data-campaign-id="campaign_demo"
 *          data-product-name="Your Product"
 *          data-trigger="delay"
 *          data-delay="5"
 *          data-theme="light"></script>
 */

(function() {
  'use strict';

  // Get configuration from script tag attributes
  const script = document.currentScript || document.querySelector('script[src*="g2-pulse-widget"]');
  const config = {
    vendorId: script.getAttribute('data-vendor-id') || 'vendor_g2demo',
    campaignId: script.getAttribute('data-campaign-id') || 'campaign_demo',
    productName: script.getAttribute('data-product-name') || 'Our Product',
    trigger: script.getAttribute('data-trigger') || 'manual',
    delay: parseInt(script.getAttribute('data-delay') || '5'),
    theme: script.getAttribute('data-theme') || 'light',
    apiUrl: script.getAttribute('data-api-url') || 'http://localhost:3001/api',
    landingUrl: script.getAttribute('data-landing-url') || 'http://localhost:5173/campaign'
  };

  // Get or create user ID (anonymous tracking)
  function getUserId() {
    let userId = localStorage.getItem('g2pulse_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('g2pulse_user_id', userId);
    }
    return userId;
  }

  // Widget state
  let widgetState = {
    shown: false,
    dismissed: false,
    currentStep: 'score', // 'score', 'comment', 'thankyou'
    selectedScore: null,
    comment: ''
  };

  // Create widget HTML
  function createWidget() {
    const isDark = config.theme === 'dark';
    const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
    const mutedColor = isDark ? '#A0A0A0' : '#6B7280';

    const widgetHTML = `
      <div id="g2pulse-widget" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-width: calc(100vw - 40px);
        background: ${bgColor};
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        z-index: 999999;
        display: none;
        animation: g2pulse-slide-up 0.3s ease-out;
      " data-testid="nps-widget">
        <!-- Header -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid ${isDark ? '#333' : '#E5E7EB'};
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 32px;
              height: 32px;
              background: #FF492C;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
            ">G2</div>
            <span style="font-weight: 600; color: ${textColor}; font-size: 14px;">Quick Feedback</span>
          </div>
          <button id="g2pulse-close" style="
            background: none;
            border: none;
            color: ${mutedColor};
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          " data-testid="close-widget-btn">×</button>
        </div>

        <!-- Content -->
        <div style="padding: 24px 20px;">
          <!-- Score Step -->
          <div id="g2pulse-step-score" style="display: block;">
            <p style="
              color: ${textColor};
              font-size: 16px;
              font-weight: 500;
              margin: 0 0 20px 0;
              line-height: 1.5;
            " data-testid="widget-question">
              How likely are you to recommend ${config.productName} to a friend or colleague?
            </p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;" id="g2pulse-scores" data-testid="nps-scale">
              ${Array.from({length: 11}, (_, i) => `
                <button class="g2pulse-score-btn" data-score="${i}" style="
                  width: 32px;
                  height: 32px;
                  border: 2px solid ${isDark ? '#444' : '#D1D5DB'};
                  background: ${bgColor};
                  color: ${textColor};
                  border-radius: 6px;
                  font-weight: 600;
                  font-size: 14px;
                  cursor: pointer;
                  transition: all 0.2s;
                " data-testid="score-${i}">
                  ${i}
                </button>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: ${mutedColor};">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
          </div>

          <!-- Comment Step -->
          <div id="g2pulse-step-comment" style="display: none;">
            <p style="
              color: ${textColor};
              font-size: 16px;
              font-weight: 500;
              margin: 0 0 16px 0;
            " data-testid="comment-question">
              What's the main reason for your score?
            </p>
            <textarea id="g2pulse-comment" placeholder="Share your thoughts..." style="
              width: 100%;
              height: 100px;
              padding: 12px;
              border: 2px solid ${isDark ? '#444' : '#D1D5DB'};
              border-radius: 8px;
              background: ${bgColor};
              color: ${textColor};
              font-size: 14px;
              font-family: inherit;
              resize: none;
              box-sizing: border-box;
              margin-bottom: 16px;
            " data-testid="comment-textarea"></textarea>
            <button id="g2pulse-submit" style="
              width: 100%;
              padding: 12px;
              background: #FF492C;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: background 0.2s;
            " data-testid="submit-btn">
              Submit Feedback
            </button>
          </div>

          <!-- Thank You Step -->
          <div id="g2pulse-step-thankyou" style="display: none; text-align: center;">
            <div style="
              width: 60px;
              height: 60px;
              background: #10B981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 16px;
              color: white;
              font-size: 30px;
            ">✓</div>
            <p style="
              color: ${textColor};
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 8px 0;
            ">Thank you!</p>
            <p style="
              color: ${mutedColor};
              font-size: 14px;
              margin: 0;
            " data-testid="thankyou-message">Your feedback helps us improve.</p>
          </div>
        </div>
      </div>

      <style>
        @keyframes g2pulse-slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .g2pulse-score-btn:hover {
          border-color: #FF492C !important;
          transform: scale(1.1);
        }

        .g2pulse-score-btn.selected {
          background: #FF492C !important;
          color: white !important;
          border-color: #FF492C !important;
        }

        #g2pulse-close:hover {
          opacity: 0.7;
        }

        #g2pulse-submit:hover {
          background: #E63E1C !important;
        }
      </style>
    `;

    // Insert widget into page
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    // Attach event listeners
    attachEventListeners();
  }

  // Attach event listeners to widget elements
  function attachEventListeners() {
    // Close button
    document.getElementById('g2pulse-close').addEventListener('click', hideWidget);

    // Score buttons
    document.querySelectorAll('.g2pulse-score-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.g2pulse-score-btn').forEach(b => b.classList.remove('selected'));

        // Mark as selected
        this.classList.add('selected');
        widgetState.selectedScore = parseInt(this.getAttribute('data-score'));

        // Move to comment step after short delay
        setTimeout(() => {
          showStep('comment');
        }, 300);
      });
    });

    // Submit button
    document.getElementById('g2pulse-submit').addEventListener('click', submitFeedback);

    // Allow Enter key in textarea (Shift+Enter for new line)
    document.getElementById('g2pulse-comment').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitFeedback();
      }
    });
  }

  // Show widget
  function showWidget() {
    if (widgetState.shown || widgetState.dismissed) return;

    const widget = document.getElementById('g2pulse-widget');
    if (widget) {
      widget.style.display = 'block';
      widgetState.shown = true;
    }
  }

  // Hide widget
  function hideWidget() {
    const widget = document.getElementById('g2pulse-widget');
    if (widget) {
      widget.style.display = 'none';
      widgetState.dismissed = true;
    }
  }

  // Show specific step
  function showStep(step) {
    document.getElementById('g2pulse-step-score').style.display = step === 'score' ? 'block' : 'none';
    document.getElementById('g2pulse-step-comment').style.display = step === 'comment' ? 'block' : 'none';
    document.getElementById('g2pulse-step-thankyou').style.display = step === 'thankyou' ? 'block' : 'none';
    widgetState.currentStep = step;
  }

  // Submit feedback
  async function submitFeedback() {
    const comment = document.getElementById('g2pulse-comment').value;
    const userId = getUserId();

    const data = {
      vendorId: config.vendorId,
      campaignId: config.campaignId,
      score: widgetState.selectedScore,
      comment: comment,
      triggeredBy: config.trigger,
      userId: userId
    };

    try {
      const response = await fetch(`${config.apiUrl}/nps/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Show thank you message
        showStep('thankyou');

        // Redirect to landing page after 2 seconds
        setTimeout(() => {
          window.location.href = `${config.landingUrl}/${config.campaignId}?score=${widgetState.selectedScore}`;
        }, 2000);
      } else {
        console.error('Failed to submit feedback');
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  }

  // Initialize widget based on trigger mode
  function initWidget() {
    createWidget();

    if (config.trigger === 'delay') {
      // Show after delay
      setTimeout(showWidget, config.delay * 1000);
    } else if (config.trigger === 'action') {
      // Listen for custom event
      window.addEventListener('g2pulse-action-completed', showWidget);
    }
    // Manual trigger is handled via global API
  }

  // Global API
  window.G2Pulse = {
    show: showWidget,
    hide: hideWidget,
    config: config
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
