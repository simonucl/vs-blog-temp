import { DiversityBarChart } from '@/components/charts';
import { transformDiversityGains } from '@/utils/chartDataTransformers';
import diversityData from '@/data/paper-evidence/diversity-gains.json';

type TaskType = 'poem' | 'story' | 'joke';

interface DiversityGainsVisualProps {
  task?: TaskType;
  showAll?: boolean;
}

export default function DiversityGainsVisual({
  task = 'poem',
  showAll = false,
}: DiversityGainsVisualProps) {
  const taskLabels = {
    poem: 'Poem Generation',
    story: 'Story Writing',
    joke: 'Joke Creation',
  };

  if (showAll) {
    return (
      <div className="space-y-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Diversity Gains Across Creative Writing Tasks
          </h2>
          <p className="text-slate-600">
            VS-Standard achieves <strong className="text-red-600">1.6-2.1× higher diversity</strong> compared to direct prompting across all tasks.
          </p>
        </div>

        {(['poem', 'story', 'joke'] as TaskType[]).map((taskType) => {
          const taskData = transformDiversityGains(
            diversityData.tasks[taskType],
            taskType
          );

          return (
            <div key={taskType} className="bg-white p-6 rounded-lg shadow-md">
              <DiversityBarChart
                data={taskData}
                title={taskLabels[taskType]}
                subtitle={`Semantic diversity scores (Figure 3${
                  taskType === 'poem' ? 'a' : taskType === 'story' ? 'b' : 'c'
                })`}
                height={350}
              />
            </div>
          );
        })}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600 font-medium mb-1">Poem</div>
            <div className="text-3xl font-bold text-red-700">
              {diversityData.improvements.poem.vs_over_direct.toFixed(1)}×
            </div>
            <div className="text-xs text-red-600 mt-1">
              improvement over Direct
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600 font-medium mb-1">Story</div>
            <div className="text-3xl font-bold text-red-700">
              {diversityData.improvements.story.vs_over_direct.toFixed(1)}×
            </div>
            <div className="text-xs text-red-600 mt-1">
              improvement over Direct
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600 font-medium mb-1">Joke</div>
            <div className="text-3xl font-bold text-red-700">
              {diversityData.improvements.joke.vs_over_direct.toFixed(1)}×
            </div>
            <div className="text-xs text-red-600 mt-1">
              improvement over Direct
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Source:</strong> Figure 3a-c, pp. 7-8 of the preprint.
            Metric: Semantic diversity (1 - mean pairwise cosine similarity).
            Higher values indicate greater diversity.
            Results averaged across GPT-4.1, GPT-4.1-mini, Gemini-2.5-Pro, Gemini-2.5-Flash
            with N=30 samples per task.
          </p>
        </div>
      </div>
    );
  }

  // Single task view
  const taskData = transformDiversityGains(diversityData.tasks[task], task);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <DiversityBarChart
        data={taskData}
        title={`${taskLabels[task]} Diversity`}
        subtitle={`Comparison across prompting methods`}
        height={400}
      />

      <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
        <p className="text-sm text-slate-700">
          VS-Standard achieves <strong className="text-red-600">
            {diversityData.improvements[task].vs_over_direct.toFixed(1)}× higher diversity
          </strong> compared to direct prompting on this task.
        </p>
      </div>
    </div>
  );
}
