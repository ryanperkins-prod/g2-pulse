import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [responses, setResponses] = useState([]);
  const [reviewGenStats, setReviewGenStats] = useState(null);
  const [sortField, setSortField] = useState('category');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    days: '30',
    category: 'All',
    trigger: 'All'
  });
  const [activeTab, setActiveTab] = useState('analytics');
  const [campaign, setCampaign] = useState(null);
  const [editedCampaign, setEditedCampaign] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch summary data
  useEffect(() => {
    fetchSummary();
    fetchResponses();
    fetchCampaign();
    fetchReviewGenStats();
  }, [filters]);

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams({
        vendorId: 'vendor_g2demo',
        days: filters.days === 'all' ? '' : filters.days
      });
      const res = await fetch(`/api/nps/summary?${params}`);
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchResponses = async () => {
    try {
      const params = new URLSearchParams({
        vendorId: 'vendor_g2demo',
        days: filters.days === 'all' ? '' : filters.days,
        category: filters.category,
        trigger: filters.trigger
      });
      const res = await fetch(`/api/nps/responses?${params}`);
      const data = await res.json();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const fetchCampaign = async () => {
    try {
      const res = await fetch('/api/campaign/campaign_demo');
      const data = await res.json();
      setCampaign(data);
      setEditedCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  const fetchReviewGenStats = async () => {
    try {
      const params = new URLSearchParams({
        vendorId: 'vendor_g2demo',
        days: filters.days === 'all' ? '' : filters.days,
        category: filters.category,
        trigger: filters.trigger
      });
      const res = await fetch(`/api/nps/review-gen-stats?${params}`);
      const data = await res.json();
      setReviewGenStats(data);
    } catch (error) {
      console.error('Error fetching review gen stats:', error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!reviewGenStats) return [];

    const sorted = [...reviewGenStats.byCategory].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Convert strings to numbers for numeric fields
      if (sortField !== 'category') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  };

  const saveCampaign = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/campaign/campaign_demo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCampaign)
      });
      const data = await res.json();
      setCampaign(data);
      alert('Campaign settings saved successfully!');
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (!summary) {
    return (
      <div className="min-h-screen bg-g2-light flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-g2-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-g2-orange rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">G2</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-g2-dark">G2 Pulse</h1>
                <p className="text-sm text-gray-600 font-medium">NPS Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-g2-orange text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid="analytics-tab"
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-g2-orange text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid="settings-tab"
              >
                Campaign Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'analytics' ? (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.days}
                    onChange={(e) => setFilters({ ...filters, days: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-g2-orange focus:border-transparent"
                    data-testid="filter-date-range"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-g2-orange focus:border-transparent"
                    data-testid="filter-category"
                  >
                    <option value="All">All</option>
                    <option value="Promoter">Promoters</option>
                    <option value="Passive">Passives</option>
                    <option value="Detractor">Detractors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Trigger Type
                  </label>
                  <select
                    value={filters.trigger}
                    onChange={(e) => setFilters({ ...filters, trigger: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-g2-orange focus:border-transparent"
                    data-testid="filter-trigger"
                  >
                    <option value="All">All</option>
                    <option value="action">Action</option>
                    <option value="delay">Delay</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <MetricCard
                title="NPS Score"
                value={summary.npsScore}
                description="Current score"
                highlight
                testId="metric-nps"
              />
              <MetricCard
                title="Total Responses"
                value={summary.totalResponses}
                description="All time"
                testId="metric-responses"
              />
              <MetricCard
                title="Response Rate"
                value={`${summary.responseRate}%`}
                description="Survey completion"
                testId="metric-rate"
              />
              <MetricCard
                title="Average Score"
                value={summary.avgScore}
                description="Out of 10"
                testId="metric-avg"
              />
            </div>

            {/* NPS Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold text-g2-dark mb-4">NPS Distribution</h2>
              <div className="space-y-4">
                <div className="flex items-center" data-testid="nps-breakdown">
                  <div className="w-32 text-sm font-medium text-gray-700">
                    {summary.breakdown.detractors}% Detractors
                  </div>
                  <div className="flex-1 h-12 flex rounded-lg overflow-hidden">
                    <div
                      className="bg-red-500 flex items-center justify-center text-white font-semibold"
                      style={{ width: `${summary.breakdown.detractors}%` }}
                    >
                      {summary.counts.detractors}
                    </div>
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white font-semibold"
                      style={{ width: `${summary.breakdown.passives}%` }}
                    >
                      {summary.counts.passives}
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-white font-semibold"
                      style={{ width: `${summary.breakdown.promoters}%` }}
                    >
                      {summary.counts.promoters}
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm font-medium text-gray-700">
                    {summary.breakdown.promoters}% Promoters
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Detractors (0-6)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Passives (7-8)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Promoters (9-10)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold text-g2-dark mb-4">NPS Trend (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300} data-testid="trend-chart">
                <LineChart data={summary.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[-100, 100]} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value}`, 'NPS']}
                  />
                  <Line
                    type="monotone"
                    dataKey="nps"
                    stroke="#FF492C"
                    strokeWidth={3}
                    dot={{ fill: '#FF492C', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Review Generation Performance */}
            {reviewGenStats && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
                <h2 className="text-lg font-bold text-g2-dark mb-4">Review Generation Performance</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Track completion rates and budget spend across the NPS funnel
                </p>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Total Respondents</div>
                    <div className="text-2xl font-bold text-g2-dark">{reviewGenStats.totalRespondents}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Reviews Completed</div>
                    <div className="text-2xl font-bold text-green-600">{reviewGenStats.completedReviews}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Completion Rate</div>
                    <div className="text-2xl font-bold text-g2-orange">{reviewGenStats.completionRate}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Total Budget Spent</div>
                    <div className="text-2xl font-bold text-g2-dark">${reviewGenStats.totalBudget}</div>
                  </div>
                </div>

                {/* Sortable Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th
                          className="text-left py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>NPS Category</span>
                            {sortField === 'category' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('totalRespondents')}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Total Respondents</span>
                            {sortField === 'totalRespondents' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('completedReviews')}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Completed Reviews</span>
                            {sortField === 'completedReviews' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('completionRate')}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Completion Rate</span>
                            {sortField === 'completionRate' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('avgNPS')}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Avg NPS</span>
                            {sortField === 'avgNPS' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort('budgetSpent')}
                        >
                          <div className="flex items-center justify-end space-x-1">
                            <span>Budget Spent</span>
                            {sortField === 'budgetSpent' && (
                              <span className="text-g2-orange">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData().map((row) => (
                        <tr key={row.category} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <CategoryBadge category={row.category} />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-800">
                            {row.totalRespondents}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            {row.completedReviews}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-g2-orange">
                            {row.completionRate}%
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-800">
                            {row.avgNPS}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-g2-dark">
                            ${row.budgetSpent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="py-3 px-4 text-gray-800">Total</td>
                        <td className="py-3 px-4 text-right text-gray-800">{reviewGenStats.totalRespondents}</td>
                        <td className="py-3 px-4 text-right text-green-600">{reviewGenStats.completedReviews}</td>
                        <td className="py-3 px-4 text-right text-g2-orange">{reviewGenStats.completionRate}%</td>
                        <td className="py-3 px-4 text-right text-gray-800">-</td>
                        <td className="py-3 px-4 text-right text-g2-dark">${reviewGenStats.totalBudget}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Cost Per Review */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-900">Average Cost Per Review</span>
                    <span className="text-xl font-bold text-blue-600">${reviewGenStats.avgCostPerReview}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Competitive Benchmark */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-bold text-g2-dark mb-4">Competitive Benchmark</h2>
              <p className="text-sm text-gray-600 mb-6">
                See how your NPS compares to industry standards
              </p>
              <div className="relative h-24" data-testid="benchmark-panel">
                {/* Benchmark scale */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                </div>
                {/* Markers */}
                <BenchmarkMarker value={summary.npsScore} label="Your Score" color="bg-g2-orange" />
                <BenchmarkMarker value={32} label="Industry Avg" color="bg-gray-400" />
                <BenchmarkMarker value={41} label="Category Avg" color="bg-blue-400" />
                <BenchmarkMarker value={67} label="Top Performer" color="bg-purple-400" />
                {/* Scale labels */}
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500">
                  <span>-100</span>
                  <span>0</span>
                  <span>+100</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-g2-orange">{summary.npsScore}</div>
                  <div className="text-sm text-gray-600">Your Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">32</div>
                  <div className="text-sm text-gray-600">Industry Avg</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">41</div>
                  <div className="text-sm text-gray-600">Category Avg</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">67</div>
                  <div className="text-sm text-gray-600">Top Performer</div>
                </div>
              </div>
            </div>

            {/* Response Feed */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-g2-dark mb-4">Recent Responses</h2>
              <div className="space-y-4" data-testid="response-feed">
                {responses.map((response) => (
                  <div
                    key={response.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-gray-700">{response.score}</div>
                        <CategoryBadge category={response.category} />
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(response.timestamp)}
                      </div>
                    </div>
                    {response.comment && (
                      <p className="text-gray-700 mb-2">{response.comment}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>User: {response.userId.substring(0, 12)}...</span>
                      <span>Trigger: {response.triggeredBy}</span>
                    </div>
                  </div>
                ))}
                {responses.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No responses match your filters</p>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Campaign Settings */
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-g2-dark mb-6">Campaign Settings</h2>
            {editedCampaign && (
              <div className="space-y-6">
                {/* Promoter Settings */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-md font-semibold text-green-600 mb-4">
                    Promoter Experience (Score 9-10)
                  </h3>
                  <div className="space-y-4">
                    <InputField
                      label="Headline"
                      value={editedCampaign.headline}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, headline: e.target.value })}
                      testId="setting-promoter-headline"
                    />
                    <InputField
                      label="Subheadline"
                      value={editedCampaign.subheadline}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, subheadline: e.target.value })}
                      testId="setting-promoter-subheadline"
                    />
                    <InputField
                      label="CTA Button Text"
                      value={editedCampaign.promoterCta}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, promoterCta: e.target.value })}
                      testId="setting-promoter-cta"
                    />
                    <InputField
                      label="G2 Review Link"
                      value={editedCampaign.promoterLink}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, promoterLink: e.target.value })}
                      testId="setting-promoter-link"
                    />
                  </div>
                </div>

                {/* Passive Settings */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-md font-semibold text-yellow-600 mb-4">
                    Passive Experience (Score 7-8)
                  </h3>
                  <div className="space-y-4">
                    <InputField
                      label="Message"
                      value={editedCampaign.passiveMessage}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, passiveMessage: e.target.value })}
                      testId="setting-passive-message"
                    />
                    <InputField
                      label="Resource Link"
                      value={editedCampaign.passiveLink}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, passiveLink: e.target.value })}
                      testId="setting-passive-link"
                    />
                  </div>
                </div>

                {/* Detractor Settings */}
                <div className="pb-6">
                  <h3 className="text-md font-semibold text-red-600 mb-4">
                    Detractor Experience (Score 0-6)
                  </h3>
                  <div className="space-y-4">
                    <InputField
                      label="Message"
                      value={editedCampaign.detractorMessage}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, detractorMessage: e.target.value })}
                      testId="setting-detractor-message"
                    />
                    <InputField
                      label="Support Link"
                      value={editedCampaign.detractorLink}
                      onChange={(e) => setEditedCampaign({ ...editedCampaign, detractorLink: e.target.value })}
                      testId="setting-detractor-link"
                    />
                  </div>
                </div>

                <button
                  onClick={saveCampaign}
                  disabled={saving}
                  className="w-full bg-g2-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 hover:shadow-lg transition-all disabled:opacity-50"
                  data-testid="save-settings-btn"
                >
                  {saving ? 'Saving...' : 'Save Campaign Settings'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, description, highlight, testId }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg border border-gray-100 ${highlight ? 'ring-2 ring-g2-orange' : ''}`} data-testid={testId}>
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    <div className={`text-3xl font-bold ${highlight ? 'text-g2-orange' : 'text-g2-dark'}`}>
      {value}
    </div>
    <p className="text-sm text-gray-600 font-medium mt-1">{description}</p>
  </div>
);

const CategoryBadge = ({ category }) => {
  const colors = {
    Promoter: 'bg-green-100 text-green-800',
    Passive: 'bg-yellow-100 text-yellow-800',
    Detractor: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[category]}`}>
      {category}
    </span>
  );
};

const BenchmarkMarker = ({ value, label, color }) => {
  // Convert -100 to 100 scale to 0-100% position
  const position = ((value + 100) / 200) * 100;

  return (
    <div className="absolute top-0" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
      <div className={`w-3 h-3 ${color} rounded-full border-2 border-white shadow-lg`}></div>
      <div className="mt-2 text-xs font-medium text-gray-700 whitespace-nowrap" style={{ transform: 'translateX(-50%)' }}>
        {label}
      </div>
      <div className="text-xs font-bold text-gray-900" style={{ transform: 'translateX(-50%)' }}>
        {value}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, testId }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-g2-orange focus:border-transparent"
      data-testid={testId}
    />
  </div>
);

export default Dashboard;
