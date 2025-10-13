import RankFrequencyLineChart from '@/components/charts/RankFrequencyLineChart';
import usStatesData from '@/data/paper-evidence/us-states.json';

// State code mapping for abbreviated names
const STATE_CODES: Record<string, string> = {
  'New York': 'NY', 'California': 'CA', 'Washington': 'WA', 'Texas': 'TX',
  'Florida': 'FL', 'Virginia': 'VA', 'Georgia': 'GA', 'Michigan': 'MI',
  'Ohio': 'OH', 'Colorado': 'CO', 'Illinois': 'IL', 'Pennsylvania': 'PA',
  'Arizona': 'AZ', 'Minnesota': 'MN', 'Massachusetts': 'MA', 'North Carolina': 'NC',
  'New Jersey': 'NJ', 'Kansas': 'KS', 'Wisconsin': 'WI', 'Oregon': 'OR',
};

function transformToRankFrequency() {
  // Get all unique states
  const allStates = new Set<string>();
  Object.keys(usStatesData.pretraining_distribution).forEach((s) => {
    if (s !== 'other') allStates.add(s);
  });
  Object.keys(usStatesData.vs_distribution).forEach((s) => {
    if (s !== 'other' && s !== 'description') allStates.add(s);
  });
  Object.keys(usStatesData.direct_distribution).forEach((s) => {
    if (s !== 'other' && s !== 'description') allStates.add(s);
  });

  // Create data points
  const dataPoints = Array.from(allStates).map((state) => ({
    stateName: state,
    stateCode: STATE_CODES[state] || state.substring(0, 2).toUpperCase(),
    reference: (usStatesData.pretraining_distribution as any)[state] || 0,
    direct: (usStatesData.direct_distribution as any)[state] || 0,
    vs: (usStatesData.vs_distribution as any)[state] || 0,
  }));

  // Sort by reference distribution (descending)
  dataPoints.sort((a, b) => b.reference - a.reference);

  // Add rank
  return dataPoints.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

export default function USStatesDemo() {
  const chartData = transformToRankFrequency();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <RankFrequencyLineChart
          data={chartData}
          title="US State Name Distribution"
          subtitle="Rank-frequency (non-cumulative), explicit zeros and log scales"
          height={450}
          klDivergence={usStatesData.kl_divergence}
        />
      </div>

      {/* KL Divergence Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-lg text-red-600 mb-1">Direct Prompting</div>
          <div className="text-2xl font-bold text-red-700">
            KL = {usStatesData.kl_divergence.direct.toFixed(2)}
          </div>
          <div className="text-base text-red-600 mt-1">
            High divergence → mode collapse
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-lg text-blue-600 mb-1">VS</div>
          <div className="text-2xl font-bold text-blue-700">
            KL = {usStatesData.kl_divergence.vs.toFixed(2)}
          </div>
          <div className="text-base text-blue-600 mt-1">
            Low divergence → close alignment with pretraining
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Pretraining Distribution
          </h3>
          <p className="text-base text-green-700">
            Reference distribution from RedPajama corpus showing actual state
            name frequencies in pretraining data.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Direct Prompting
          </h3>
          <p className="text-base text-slate-600 mb-2">
            {usStatesData.direct_distribution.description}. High divergence indicates mode collapse.
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Verbalized Sampling
          </h3>
          <p className="text-base text-red-600 mb-2">
            {usStatesData.vs_distribution.description}. Low KL divergence shows recovery of pretraining diversity
          </p>
        </div>
      </div>

      <div>
        <p className="text-xl">
          This example proves that VS doesn't just increase diversity arbitrarily—it
          recovers the <em>specific distribution</em> that the base model learned during
          pretraining. The low KL divergence (0.12) shows VS approximates what the model
          "knows" before alignment flattened it into a few popular choices.
        </p>
      </div>
    </div>
  );
}
