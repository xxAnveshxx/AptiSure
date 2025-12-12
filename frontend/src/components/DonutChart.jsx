import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function DonutChart({ stats }) {
  const data = [
    { name: 'Easy', value: stats?.easy || 0, color: '#10b981' },
    { name: 'Medium', value: stats?.medium || 0, color: '#f59e0b' },
    { name: 'Hard', value: stats?.hard || 0, color: '#ef4444' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions Solved</h2>
      
      {total === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>No questions solved yet. Start practicing!</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {data.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">Total Solved</p>
            <p className="text-3xl font-bold text-primary">{total}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default DonutChart;