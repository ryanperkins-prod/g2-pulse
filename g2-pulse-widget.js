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
    comment: '',
    responseId: null
  };

  // Campaign settings (fetched from API)
  let campaignSettings = null;

  // Load campaign settings
  async function loadCampaignSettings() {
    try {
      const response = await fetch(`${config.apiUrl}/campaign/${config.campaignId}`);
      if (response.ok) {
        campaignSettings = await response.json();
      }
    } catch (error) {
      console.error('[G2 Pulse] Failed to load campaign settings:', error);
    }
  }

  // Track review CTA click
  async function trackReviewClick(responseId) {
    try {
      await fetch(`${config.apiUrl}/nps/click-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId })
      });
      console.log('[G2 Pulse] Review click tracked');
    } catch (error) {
      console.error('[G2 Pulse] Failed to track review click:', error);
    }
  }

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
          <div id="g2pulse-step-thankyou" style="display: none;">
            <!-- Dynamic content inserted here -->
          </div>

          <!-- Review Form Step -->
          <div id="g2pulse-step-reviewform" style="display: none;">
            <h3 style="
              color: ${textColor};
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 16px 0;
            " data-testid="review-form-title">Share Your Experience on G2</h3>

            <div style="margin-bottom: 16px;">
              <label style="
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: ${textColor};
                margin-bottom: 6px;
              ">Overall Rating *</label>
              <div style="display: flex; gap: 8px;" id="g2pulse-star-rating">
                ${[1,2,3,4,5].map(star => `
                  <button class="g2pulse-star-btn" data-star="${star}" style="
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: ${isDark ? '#555' : '#D1D5DB'};
                    transition: color 0.2s;
                    padding: 0;
                  ">★</button>
                `).join('')}
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: ${textColor};
                margin-bottom: 6px;
              ">Review Title *</label>
              <input
                id="g2pulse-review-title"
                type="text"
                placeholder="Sum up your experience in one line"
                style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid ${isDark ? '#444' : '#D1D5DB'};
                  border-radius: 6px;
                  background: ${bgColor};
                  color: ${textColor};
                  font-size: 14px;
                  font-family: inherit;
                  box-sizing: border-box;
                " />
            </div>

            <div style="margin-bottom: 16px;">
              <label style="
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: ${textColor};
                margin-bottom: 6px;
              ">What do you like best? *</label>
              <textarea
                id="g2pulse-review-pros"
                placeholder="What are the main benefits?"
                rows="3"
                style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid ${isDark ? '#444' : '#D1D5DB'};
                  border-radius: 6px;
                  background: ${bgColor};
                  color: ${textColor};
                  font-size: 14px;
                  font-family: inherit;
                  resize: vertical;
                  box-sizing: border-box;
                "></textarea>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: ${textColor};
                margin-bottom: 6px;
              ">What could be improved?</label>
              <textarea
                id="g2pulse-review-cons"
                placeholder="Optional - any suggestions?"
                rows="2"
                style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid ${isDark ? '#444' : '#D1D5DB'};
                  border-radius: 6px;
                  background: ${bgColor};
                  color: ${textColor};
                  font-size: 14px;
                  font-family: inherit;
                  resize: vertical;
                  box-sizing: border-box;
                "></textarea>
            </div>

            <button id="g2pulse-submit-review" style="
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
              margin-bottom: 8px;
            " data-testid="submit-review-btn">
              Submit Review
            </button>

            <button id="g2pulse-skip-review" style="
              width: 100%;
              padding: 10px;
              background: transparent;
              color: ${mutedColor};
              border: none;
              font-size: 13px;
              cursor: pointer;
              text-decoration: underline;
            ">
              Skip for now
            </button>
          </div>

          <!-- Final Thank You Step -->
          <div id="g2pulse-step-final" style="display: none; text-align: center;">
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
            " data-testid="final-thank-you">Review submitted!</p>
            <p style="
              color: ${mutedColor};
              font-size: 14px;
              margin: 0;
            ">Thank you for helping others discover ${config.productName}.</p>
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

        .g2pulse-star-btn:hover {
          color: #FFD700 !important;
          transform: scale(1.1);
        }

        .g2pulse-star-btn.selected {
          color: #FFD700 !important;
        }

        #g2pulse-submit-review:hover {
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

        // For promoters (9-10), skip comment and go straight to incentive CTA
        // For others, show comment step
        setTimeout(() => {
          if (widgetState.selectedScore >= 9) {
            submitPromoterScore();
          } else {
            showStep('comment');
          }
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
    document.getElementById('g2pulse-step-reviewform').style.display = step === 'reviewform' ? 'block' : 'none';
    document.getElementById('g2pulse-step-final').style.display = step === 'final' ? 'block' : 'none';
    widgetState.currentStep = step;
  }

  // Show thank you with dynamic content based on score
  function showThankYou(score, responseId) {
    const isDark = config.theme === 'dark';
    const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
    const mutedColor = isDark ? '#A0A0A0' : '#6B7280';

    // Determine category
    let category;
    if (score >= 9) category = 'Promoter';
    else if (score >= 7) category = 'Passive';
    else category = 'Detractor';

    // Get campaign settings or use defaults
    const promoterCta = campaignSettings?.promoterCta || 'Leave us a review!';
    const promoterLink = campaignSettings?.promoterLink || `${config.landingUrl}/${config.campaignId}?score=${score}`;
    const resourceCta = campaignSettings?.resourceCta || 'Check out our resources';
    const resourceLink = campaignSettings?.resourceLink || 'https://example.com/resources';
    const supportCta = campaignSettings?.supportCta || 'Contact Support';
    const supportLink = campaignSettings?.supportLink || 'https://example.com/support';

    let html = '';

    if (category === 'Promoter') {
      // Promoter: Gift card incentive CTA
      html = `
        <div style="text-align: center;">
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
          ">🎁</div>
          <p style="
            color: ${textColor};
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 8px 0;
          ">Get a $25 Gift Card!</p>
          <p style="
            color: ${mutedColor};
            font-size: 14px;
            margin: 0 0 24px 0;
            line-height: 1.5;
          ">Share your experience on G2 and we'll send you a $25 Amazon gift card as a thank you.</p>
          <button id="g2pulse-review-cta" style="
            width: 100%;
            padding: 14px;
            background: #FF492C;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
            box-shadow: 0 4px 6px rgba(255, 73, 44, 0.3);
          " data-testid="review-cta-btn">Leave a G2 Review →</button>
          <p style="
            color: ${mutedColor};
            font-size: 11px;
            margin: 12px 0 0 0;
          ">Takes less than 2 minutes</p>
        </div>
      `;
    } else if (category === 'Passive') {
      // Passive: Resource primary, review secondary
      html = `
        <div style="text-align: center;">
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
            margin: 0 0 20px 0;
          ">Your feedback helps us improve.</p>
          <a href="${resourceLink}" target="_blank" style="
            display: block;
            width: 100%;
            padding: 12px;
            background: #FF492C;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            text-align: center;
            margin-bottom: 12px;
            transition: background 0.2s;
          ">${resourceCta}</a>
          <button id="g2pulse-review-cta" style="
            width: 100%;
            padding: 10px;
            background: transparent;
            color: #FF492C;
            border: 2px solid #FF492C;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          " data-testid="review-cta-btn">Share your experience on G2</button>
        </div>
      `;
    } else {
      // Detractor: Support primary, review link small at bottom
      html = `
        <div style="text-align: center;">
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
          ">Thank you for your feedback</p>
          <p style="
            color: ${mutedColor};
            font-size: 14px;
            margin: 0 0 20px 0;
          ">We're sorry we didn't meet your expectations. Let us help.</p>
          <a href="${supportLink}" target="_blank" style="
            display: block;
            width: 100%;
            padding: 12px;
            background: #FF492C;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            text-align: center;
            margin-bottom: 16px;
            transition: background 0.2s;
          ">${supportCta}</a>
          <button id="g2pulse-review-cta" style="
            background: none;
            border: none;
            color: ${mutedColor};
            font-size: 12px;
            text-decoration: underline;
            cursor: pointer;
            padding: 0;
          " data-testid="review-cta-btn">Or share your experience on G2</button>
        </div>
      `;
    }

    // Insert HTML
    const thankYouDiv = document.getElementById('g2pulse-step-thankyou');
    thankYouDiv.innerHTML = html;
    showStep('thankyou');

    // Add click handler to review CTA button if present
    const reviewCta = document.getElementById('g2pulse-review-cta');
    if (reviewCta) {
      reviewCta.addEventListener('click', function() {
        trackReviewClick(responseId);
        showReviewForm(responseId);
      });
    }
  }

  // Show review form
  function showReviewForm(responseId) {
    showStep('reviewform');

    // Star rating functionality
    let selectedRating = 0;
    document.querySelectorAll('.g2pulse-star-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-star'));

        // Update star display
        document.querySelectorAll('.g2pulse-star-btn').forEach((star, idx) => {
          if (idx < selectedRating) {
            star.classList.add('selected');
          } else {
            star.classList.remove('selected');
          }
        });
      });
    });

    // Submit review button
    document.getElementById('g2pulse-submit-review').addEventListener('click', async function() {
      const title = document.getElementById('g2pulse-review-title').value.trim();
      const pros = document.getElementById('g2pulse-review-pros').value.trim();
      const cons = document.getElementById('g2pulse-review-cons').value.trim();

      // Basic validation
      if (!selectedRating || !title || !pros) {
        alert('Please fill in all required fields');
        return;
      }

      // Submit to backend (we'd send this to G2 in production)
      try {
        await fetch(`${config.apiUrl}/nps/submit-review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            responseId: responseId,
            rating: selectedRating,
            title: title,
            pros: pros,
            cons: cons
          })
        });

        // Show final thank you
        showStep('final');
        setTimeout(() => {
          hideWidget();
        }, 3000);
      } catch (error) {
        console.error('[G2 Pulse] Failed to submit review:', error);
        alert('Failed to submit review. Please try again.');
      }
    });

    // Skip button
    document.getElementById('g2pulse-skip-review').addEventListener('click', function() {
      hideWidget();
    });
  }

  // Submit promoter score (skip comment step)
  async function submitPromoterScore() {
    const userId = getUserId();

    const data = {
      vendorId: config.vendorId,
      campaignId: config.campaignId,
      score: widgetState.selectedScore,
      comment: '', // No comment for promoters
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
        const result = await response.json();
        widgetState.responseId = result.responseId;

        // Show dynamic thank you based on score
        showThankYou(widgetState.selectedScore, result.responseId);
      } else {
        console.error('Failed to submit feedback');
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
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
        const result = await response.json();
        widgetState.responseId = result.responseId;

        // Show dynamic thank you based on score
        showThankYou(widgetState.selectedScore, result.responseId);
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
    loadCampaignSettings(); // Load campaign settings from API

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
