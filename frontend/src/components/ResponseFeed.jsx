import React, { useState } from 'react';

function ResponseFeed({ responses }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getCategoryColor = (category) => {
    if (category === 'Promoter') return 'bg-green-100 text-green-700';
    if (category === 'Passive') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getScoreBadgeColor = (category) => {
    if (category === 'Promoter') return 'bg-green-500';
    if (category === 'Passive') return 'bg-amber-400';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Responses</h3>

      <div className="space-y-4">
        {responses.map((response) => {
          const isExpanded = expandedIds.has(response.id);
          const commentText = response.comment || '';
          const needsTruncate = commentText.length > 80;
          const displayText = isExpanded ? commentText : commentText.slice(0, 80);

          return (
            <div key={response.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start space-x-4">
                {/* Score Badge */}
                <div className={`w-10 h-10 rounded-full ${getScoreBadgeColor(response.category)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {response.score}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {/* Category */}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(response.category)}`}>
                      {response.category}
                    </span>

                    {/* Trigger */}
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {response.triggeredBy}
                    </span>

                    {/* Review completed badge */}
                    {response.reviewCompleted === 1 && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        → Reviewed on G2
                      </span>
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-gray-500 ml-auto">
                      {getTimeAgo(response.timestamp)}
                    </span>
                  </div>

                  {/* Comment */}
                  {commentText && (
                    <div className="text-sm text-gray-700">
                      {displayText}
                      {needsTruncate && !isExpanded && '...'}
                      {needsTruncate && (
                        <button
                          onClick={() => toggleExpand(response.id)}
                          className="ml-2 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResponseFeed;
