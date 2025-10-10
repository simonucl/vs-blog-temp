import { DistributionChart } from '@/components/charts';
import { transformDistributionData } from '@/utils/chartDataTransformers';
import usStatesData from '@/data/paper-evidence/us-states.json';
import Equation from '@/components/academic/Equation';

export default function USStatesDemo() {
  const chartData = transformDistributionData(
    usStatesData.pretraining_distribution,
    usStatesData.direct_distribution,
    usStatesData.vs_distribution
  );

  return (
    <div className="space-y-6">
      {/* <div className="mb-6">
        <p className="text-lg text-slate-600">
          We asked the VS to generate all possible US state with corresponding probabilities, and VS produces a distribution that closely
          aligns with the pretraining corpus (RedPajama), achieving{' '}
          <strong>KL divergence = 0.12</strong>.
          Direct prompting collapses to a few popular states (KL = 16.16).
        </p>
      </div> */}

      {/* <div className="flex justify-center">
        <Equation id="kl-vs-pre" displayMode>
          {`D_{\\mathrm{KL}}(p_{\\mathrm{VS}} \\Vert p_{\\mathrm{pre}}) = ${usStatesData.kl_divergence.vs.toFixed(2)}`}
        </Equation>
      </div> */}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <DistributionChart
          data={chartData}
          title="US State Name Distribution"
          subtitle="Comparison with RedPajama Pretraining Corpus (Top 20 states shown)"
          klDivergence={usStatesData.kl_divergence}
          height={400}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Pretraining Distribution
          </h3>
          {/* <div className="text-sm text-green-600 mb-2">
            Top 3: {Object.entries(usStatesData.pretraining_distribution)
              .filter(([state]) => state !== 'other')
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([state]) => state)
              .join(', ')}
          </div> */}
          <p className="text-base text-green-700">
            Reference distribution from RedPajama corpus showing actual state
            name frequencies in pretraining data.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Direct Prompting
          </h3>
          {/* <div className="text-sm text-slate-600 mb-2">
            Top 3: {Object.entries(usStatesData.direct_distribution)
              .filter(([state]) => state !== 'other' && state !== 'description')
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([state]) => state)
              .join(', ')}
          </div> */}
          <p className="text-base text-slate-600 mb-2">
            {usStatesData.direct_distribution.description}. High divergence indicates mode collapse.
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Verbalized Sampling
          </h3>
          {/* <div className="text-sm text-red-600 mb-2">
            Top 3: {Object.entries(usStatesData.vs_distribution)
              .filter(([state]) => state !== 'other' && state !== 'description')
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([state]) => state)
              .join(', ')}
          </div> */}
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
