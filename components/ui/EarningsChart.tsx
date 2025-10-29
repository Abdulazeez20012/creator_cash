import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 3000 },
  { name: 'Mar', earnings: 5000 },
  { name: 'Apr', earnings: 4500 },
  { name: 'May', earnings: 6000 },
  { name: 'Jun', earnings: 5500 },
  { name: 'Jul', earnings: 7000 },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--border-color)] p-3 rounded-lg shadow-lg">
          <p className="label font-bold text-[var(--text-primary)]">{`${label}`}</p>
          <p className="intro text-[var(--brand-green)]">{`Earnings : $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
  
    return null;
  };

const EarningsChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand-green)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--brand-green)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <YAxis stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="earnings" stroke="var(--brand-green)" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;