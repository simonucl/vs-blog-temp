import { PostTrainingLineChart } from '@/components/charts';
import { transformPostTrainingData } from '@/utils/chartDataTransformers';
import postTrainingData from '@/data/paper-evidence/post-training.json';

export default function PostTrainingVisual() {
  const chartData = transformPostTrainingData(postTrainingData.stages);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Diversity Retention Across Post-Training Stages
        </h2>
        <p className="text-slate-600">
          VS retains <strong className="text-red-600">66.8%</strong> of base model diversity
          after alignment, compared to only <strong className="text-slate-500">23.8%</strong> for
          direct prompting.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <PostTrainingLineChart
          data={chartData}
          title="Diversity Across Training Stages (Tulu-3 Family)"
          subtitle="Figure 4, p. 9 - Poem continuation task"
          baselineDiversity={postTrainingData.base_model_diversity}
          height={450}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Direct Prompting
            </h3>
            <div className="w-12 h-1 bg-slate-400 rounded"></div>
          </div>
          <div className="text-4xl font-bold text-slate-700 mb-2">
            {postTrainingData.retention_rates.direct.percentage}%
          </div>
          <p className="text-sm text-slate-600">
            {postTrainingData.retention_rates.direct.description}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-red-900">
              Verbalized Sampling
            </h3>
            <div className="w-12 h-1 bg-red-600 rounded"></div>
          </div>
          <div className="text-4xl font-bold text-red-700 mb-2">
            {postTrainingData.retention_rates.vs.percentage}%
          </div>
          <p className="text-sm text-red-600">
            {postTrainingData.retention_rates.vs.description}
          </p>
        </div>
      </div>

      <div className="p-5 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <svg
            className="flex-shrink-0 text-green-600 mt-0.5"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Key Insight</h4>
            <p className="text-sm text-green-800">
              VS retains <strong>{postTrainingData.retention_rates.improvement.relative.toFixed(1)}× more diversity</strong> than
              direct prompting after post-training alignment. This shows that aligned models haven't
              "forgotten" diversity—it can be recovered through the right prompting strategy.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-700">
          <strong>Source:</strong> Figure 4, p. 9 of the preprint.
          Model family: {postTrainingData.metadata.model_family}.
          Stages: {postTrainingData.metadata.stages.join(' → ')}.
        </p>
      </div>
    </div>
  );
}
