import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { month: 'Jan', yield: 400 },
  { month: 'Feb', yield: 300 },
  { month: 'Mar', yield: 600 },
  { month: 'Apr', yield: 800 },
  { month: 'May', yield: 500 },
  { month: 'Jun', yield: 900 },
  { month: 'Jul', yield: 1100 },
];

export default function YieldChart() {
  return (
    <div className="bg-white p-6 rounded-xl card-shadow border border-white/50 h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Crop Yield Estimates (Tons)</h3>
        <select className="bg-nature-bg border-none rounded-lg text-sm px-3 py-1 text-primary font-medium focus:ring-2 focus:ring-primary/20">
          <option>Wheat 2024</option>
          <option>Rice 2024</option>
        </select>
      </div>
      <div className="h-full pb-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE7D1" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#1B5E20', opacity: 0.5, fontSize: 11 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#1B5E20', opacity: 0.5, fontSize: 11 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #DDE7D1', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                backgroundColor: '#fff'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="yield" 
              stroke="#2E7D32" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorYield)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
