import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const CampaignLanding = () => {
  const { campaignId } = useParams();
  const [searchParams] = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaign/${campaignId}`);
      const data = await res.json();
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-g2-light flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-g2-light flex items-center justify-center">
        <div className="text-xl text-gray-600">Campaign not found</div>
      </div>
    );
  }

  // Determine experience type based on score
  const getExperience = () => {
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
  };

  const experience = getExperience();

  return (
    <div className="min-h-screen bg-g2-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-g2-orange rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">G2</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-g2-dark">G2 Pulse</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {experience === 'promoter' && (
          <PromoterExperience campaign={campaign} score={score} />
        )}
        {experience === 'passive' && (
          <PassiveExperience campaign={campaign} score={score} />
        )}
        {experience === 'detractor' && (
          <DetractorExperience campaign={campaign} score={score} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>Powered by G2 Pulse</p>
      </footer>
    </div>
  );
};

// Promoter Experience (Score 9-10)
const PromoterExperience = ({ campaign, score }) => (
  <div className="bg-white rounded-2xl shadow-xl p-12 text-center" data-testid="promoter-experience">
    {/* Score Badge */}
    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
      <span className="text-3xl font-bold text-green-600">{score}</span>
    </div>

    {/* Headline */}
    <h1 className="text-4xl font-bold text-g2-dark mb-4" data-testid="landing-headline">
      {campaign.headline}
    </h1>

    {/* Subheadline */}
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="landing-subheadline">
      {campaign.subheadline}
    </p>

    {/* G2 Logo Treatment */}
    <div className="mb-8 py-8 border-y border-gray-200">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-g2-orange rounded-xl flex items-center justify-center">
          <span className="text-white text-2xl font-bold">G2</span>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-500">Review us on</div>
          <div className="text-2xl font-bold text-g2-dark">G2.com</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        G2 is the world's largest and most trusted software marketplace. Your review helps other teams make better decisions.
      </p>
    </div>

    {/* CTA Button */}
    <a
      href={campaign.promoterLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-g2-orange text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      data-testid="landing-cta"
    >
      {campaign.promoterCta}
    </a>

    {/* Review Preview */}
    <div className="mt-12 p-6 bg-g2-light rounded-lg text-left max-w-2xl mx-auto">
      <div className="text-sm font-medium text-gray-700 mb-3">What to expect:</div>
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Takes just 2-3 minutes to complete</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Share what you love and where we can improve</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your feedback helps other teams discover us</span>
        </li>
      </ul>
    </div>
  </div>
);

// Passive Experience (Score 7-8)
const PassiveExperience = ({ campaign, score }) => (
  <div className="bg-white rounded-2xl shadow-xl p-12 text-center" data-testid="passive-experience">
    {/* Score Badge */}
    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
      <span className="text-3xl font-bold text-yellow-600">{score}</span>
    </div>

    {/* Headline */}
    <h1 className="text-4xl font-bold text-g2-dark mb-4">
      Thank you for your feedback!
    </h1>

    {/* Message */}
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="landing-message">
      {campaign.passiveMessage}
    </p>

    {/* Resource Link */}
    <a
      href={campaign.passiveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition shadow-lg mb-8"
      data-testid="landing-resource-link"
    >
      Explore Resources
    </a>

    {/* Secondary CTA */}
    <div className="pt-8 border-t border-gray-200">
      <p className="text-sm text-gray-600 mb-4">
        Changed your mind? We'd still love to hear from you on G2.
      </p>
      <a
        href={campaign.promoterLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-g2-orange font-medium hover:underline"
        data-testid="landing-secondary-cta"
      >
        Leave a review on G2 →
      </a>
    </div>
  </div>
);

// Detractor Experience (Score 0-6)
const DetractorExperience = ({ campaign, score }) => (
  <div className="bg-white rounded-2xl shadow-xl p-12 text-center" data-testid="detractor-experience">
    {/* Score Badge */}
    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
      <span className="text-3xl font-bold text-red-600">{score}</span>
    </div>

    {/* Headline */}
    <h1 className="text-4xl font-bold text-g2-dark mb-4">
      We want to make this right
    </h1>

    {/* Message */}
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="landing-message">
      {campaign.detractorMessage}
    </p>

    {/* Support CTA */}
    <a
      href={campaign.detractorLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-g2-dark text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition shadow-lg mb-8"
      data-testid="landing-support-link"
    >
      Contact Our Support Team
    </a>

    {/* Reassurance */}
    <div className="mt-12 p-6 bg-g2-light rounded-lg max-w-2xl mx-auto">
      <div className="text-sm font-medium text-gray-700 mb-3">What happens next?</div>
      <ul className="space-y-2 text-sm text-gray-600 text-left">
        <li className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Our support team will reach out within 24 hours</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>We'll work together to resolve your concerns</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your feedback helps us improve for everyone</span>
        </li>
      </ul>
    </div>
  </div>
);

export default CampaignLanding;
