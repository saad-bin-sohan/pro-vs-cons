import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const AnalysisPanel = ({ categoryData, tags }) => {
    if (!tags.length) return null;

    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <BarChart3 size={18} />
                    Category impact
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Compare how each tag contributes to the weighted signal across pros and cons.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <CartesianGrid stroke="rgba(161,161,170,0.18)" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#71717a', fontSize: 12 }} />
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

