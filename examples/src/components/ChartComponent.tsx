import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ChartComponentProps {
  type: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type }) => {
  if (type === 'bar-revenue-expense') {
    const data = [
      { name: 'Oct 2019', revenue: 116.21, expenses: 45.4 },
      { name: 'Nov 2019', revenue: 282.98, expenses: 71.47 },
      { name: 'Dec 2019', revenue: 221.35, expenses: 32.04 },
      { name: 'Jan 2020', revenue: 214.04, expenses: 17.88 },
      { name: 'Feb 2020', revenue: 214.37, expenses: 23.4 },
      { name: 'Mar 2020', revenue: 131.1, expenses: 1.48 },
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#34d399" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'donut-revenue-projects') {
    const data = [
      { name: 'ERP', value: 52, color: '#6366f1' },
      { name: 'Consulting Services', value: 23, color: '#3b82f6' },
      { name: 'OEM Mobile Apps', value: 13, color: '#f97316' },
      { name: 'Certification Program', value: 6, color: '#eab308' },
      { name: 'App Builder', value: 6, color: '#10b981' },
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    const data = [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 60 },
      { month: 'Mar', value: 80 },
      { month: 'Apr', value: 65 },
      { month: 'May', value: 90 },
      { month: 'Jun', value: 100 },
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    const data = [
      { name: 'Product A', value: 40 },
      { name: 'Product B', value: 25 },
      { name: 'Product C', value: 20 },
      { name: 'Product D', value: 15 },
    ];

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    const data = [
      { name: 'Jan', bar: 400, line: 240 },
      { name: 'Feb', bar: 300, line: 139 },
      { name: 'Mar', bar: 200, line: 980 },
      { name: 'Apr', bar: 278, line: 390 },
      { name: 'May', bar: 189, line: 480 },
    ];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="bar" fill="#6366f1" />
          <Line type="monotone" dataKey="line" stroke="#f59e0b" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return <div className="text-gray-400 text-sm text-center">Unknown Chart Type</div>;
};

export default ChartComponent;