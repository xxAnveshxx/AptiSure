import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ScoreGraph({ results }) {
  
  const data = results?.slice(0, 5).reverse() || [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Test Scores</h2>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>No tests taken yet. Start a mock test!</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="testName" 
                tick={{ fontSize: 12 }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(data.reduce((sum, r) => sum + r.percentage, 0) / data.length)}%
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tests Taken</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ScoreGraph;