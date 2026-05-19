import React from 'react';

function BenchmarkBar({ vendorScore }) {
  const benchmarks = [
    { label: 'Industry avg', score: 32, color: '#9ca3af' },
    { label: 'G2 category avg', score: 41, color: '#9ca3af' },
    { label: 'Top performer', score: 67, color: '#9ca3af' },
    { label: 'You', score: vendorScore, color: '#FF492C', large: true }
  ];

  // Calculate badge
  const aboveIndustry = vendorScore > 32;
  const belowCategory = vendorScore < 41;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Benchmark</h3>
      <p className="text-sm text-gray-600 mb-6">
        See how your NPS compares to industry standards
      </p>

      {/* Badges */}
      <div className="flex gap-2 mb-6">
        {aboveIndustry && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            ✓ Above industry avg
          </span>
        )}
        {belowCategory && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            Below category avg
          </span>
        )}
      </div>

      {/* Benchmark Bar */}
      <div className="relative">
        {/* Background bar */}
        <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

        {/* Markers */}
        <div className="relative pt-6 pb-4">
          {benchmarks.map((benchmark, idx) => {
            const position = ((benchmark.score + 100) / 200) * 100; // Map -100 to 100 range to 0-100%

            return (
              <div
                key={idx}
                className="absolute"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                {/* Label above */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <div className={`text-xs font-semibold ${benchmark.large ? 'text-orange-600' : 'text-gray-600'}`}>
                    {benchmark.label}
                  </div>
                  <div className={`text-sm font-bold ${benchmark.large ? 'text-orange-600' : 'text-gray-900'}`}>
                    {benchmark.score}
                  </div>
                </div>

                {/* Dot marker */}
                <div
                  className={`rounded-full border-2 border-white shadow-md ${benchmark.large ? 'w-5 h-5' : 'w-4 h-4'}`}
                  style={{ backgroundColor: benchmark.color }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>-100</span>
          <span>0</span>
          <span>+100</span>
        </div>
      </div>
    </div>
  );
}

export default BenchmarkBar;
