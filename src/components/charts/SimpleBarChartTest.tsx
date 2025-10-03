import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Direct', value: 11.7 },
  { name: 'CoT', value: 12.8 },
  { name: 'Sequence', value: 15.3 },
  { name: 'VS-Standard', value: 21.9 },
  { name: 'VS-CoT', value: 25.3 },
];

export default function SimpleBarChartTest() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
