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
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          VS Recovers Pretraining Distribution
        </h2>
        <p className="text-2xl text-slate-600">
          When asked to generate US state names, VS produces a distribution that closely
          aligns with the pretraining corpus (RedPajama), achieving{' '}
          <strong className="text-red-600">KL divergence = 0.12</strong>.
          Direct prompting collapses to a few popular states (KL = 2.34).
        </p>
      </div>

      <div className="flex justify-center">
        <Equation id="kl-vs-pre" displayMode>
          {`D_{\\mathrm{KL}}(p_{\\mathrm{VS}} \\Vert p_{\\mathrm{pre}}) = ${usStatesData.kl_divergence.vs.toFixed(2)}`}
        </Equation>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <DistributionChart
          data={chartData}
          title="US State Name Distribution"
          subtitle="Figure 2, p. 3 - Comparison with RedPajama pretraining corpus"
          klDivergence={usStatesData.kl_divergence}
          height={500}
        />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Pretraining Distribution
          </h3>
          <p className="text-base text-green-700">
            Reference distribution from RedPajama corpus showing actual state
            name frequencies in pretraining data.
          </p>
          <div className="mt-3 space-y-1">
            <div className="text-sm text-green-600">
              Top 3: {Object.entries(usStatesData.pretraining_distribution)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([state]) => state)
                .join(', ')}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Direct Prompting
          </h3>
          <p className="text-base text-slate-600 mb-2">
            {usStatesData.direct_distribution.description}
          </p>
          <div className="mt-3">
            <div className="text-sm font-mono text-slate-500">
              KL divergence: {usStatesData.kl_divergence.direct.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              High divergence indicates mode collapse
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Verbalized Sampling
          </h3>
          <p className="text-base text-red-600 mb-2">
            {usStatesData.vs_distribution.description}
          </p>
          <div className="mt-3">
            <div className="text-sm font-mono text-red-700 font-semibold">
              KL divergence: {usStatesData.kl_divergence.vs.toFixed(2)}
            </div>
            <div className="text-sm text-red-600 mt-1">
              Low divergence shows recovery of pretraining diversity
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <svg
            className="flex-shrink-0 text-blue-600 mt-0.5"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-1">
              What This Demonstrates
            </h4>
            <p className="text-base text-blue-800">
              This example proves that VS doesn't just increase diversity arbitrarily—it
              recovers the <em>specific distribution</em> that the base model learned during
              pretraining. The low KL divergence (0.12) shows VS approximates what the model
              "knows" before alignment flattened it into a few popular choices.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-base text-slate-700">
          <strong>Source:</strong> Figure 2, p. 3 and §G.9 of the preprint.
          Model: {usStatesData.metadata.model}.
          Reference corpus: {usStatesData.metadata.reference_corpus}.
          Results averaged over {usStatesData.metadata.trials} trials.
        </p>
      </div>
    </div>
  );
}
