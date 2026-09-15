import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const AnalysisPanel = ({ categoryData, tags }) => {
    if (!tags.length) return null;

    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-base font-medium text-ink">
                    <BarChart3 size={18} />
                    Category impact
                </h2>
                <p className="text-sm text-ink-secondary">
                    Compare how each tag contributes to the weighted signal across pros and cons.
                </p>
            </div>

            {/*
              recharts renders `tick`/`stroke`/`fill` as raw SVG presentation
              attributes rather than className-based styles, so these need a
              literal colour rather than a Tailwind class or var(--token) —
              #726C64 is the same corrected --color-ink-muted value used
              everywhere else (previously #A8A39D, ~2.5:1 contrast; see
              index.css for the full explanation).
            */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <CartesianGrid stroke="rgba(114,108,100,0.18)" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#726C64', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#726C64', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pros" fill="#059669" name="Pros Weight" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cons" fill="#e11d48" name="Cons Weight" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalysisPanel;
