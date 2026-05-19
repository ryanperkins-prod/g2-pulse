import React from 'react';

function NPSBreakdownBar({ promoterPct, passivePct, detractorPct, promoterCount, passiveCount, detractorCount }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">NPS Category Breakdown</h3>

      {/* Horizontal Bar */}
      <div className="flex w-full h-12 rounded-lg overflow-hidden mb-4">
        {/* Detractor */}
        {detractorPct > 0 && (
          <div
            className="bg-red-500 flex items-center justify-center text-white font-semibold text-sm"
            style={{ width: `${detractorPct}%` }}
          >
            {detractorPct > 8 && `${detractorPct.toFixed(0)}%`}
          </div>
        )}

        {/* Passive */}
        {passivePct > 0 && (
          <div
            className="bg-amber-400 flex items-center justify-center text-white font-semibold text-sm"
            style={{ width: `${passivePct}%` }}
          >
            {passivePct > 8 && `${passivePct.toFixed(0)}%`}
          </div>
        )}

        {/* Promoter */}
        {promoterPct > 0 && (
          <div
            className="bg-green-500 flex items-center justify-center text-white font-semibold text-sm"
            style={{ width: `${promoterPct}%` }}
          >
            {promoterPct > 8 && `${promoterPct.toFixed(0)}%`}
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-700">{detractorCount} Detractors</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-400 rounded"></div>
          <span className="text-gray-700">{passiveCount} Passives</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-700">{promoterCount} Promoters</span>
        </div>
      </div>
    </div>
  );
}

export default NPSBreakdownBar;
