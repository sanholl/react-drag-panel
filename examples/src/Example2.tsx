import { PanelGrid } from '../../src';
import ChartComponent from './components/ChartComponent';
import InfoCard from './components/InfoCard';

export interface Panel {
  id?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  content?: string;
}

const initialPanels: Panel[] = [
  { id: 'revenue', x: 0, y: 0, w: 2, h: 2, content: 'revenue' },
  { id: 'expense', x: 2, y: 0, w: 2, h: 2, content: 'expense' },
  { id: 'profit', x: 4, y: 0, w: 2, h: 2, content: 'profit' },
  { id: 'per-employee', x: 6, y: 0, w: 2, h: 2, content: 'revenue-per-employee' },
  { id: 'customers1', x: 8, y: 0, w: 2, h: 2, content: 'active-customers1' },
  { id: 'customers2', x: 10, y: 0, w: 2, h: 2, content: 'active-customers2' },

  { id: 'bar-revenue-expense', x: 0, y: 2, w: 8, h: 3, content: 'bar-revenue-expense' },
  { id: 'donut-revenue-projects', x: 8, y: 2, w: 4, h: 3, content: 'donut-revenue-projects' },
  { id: 'bar', x: 0, y: 5, w: 8, h: 3, content: 'bar' },
  { id: 'pie', x: 8, y: 5, w: 4, h: 3, content: 'pie' },
];

const Example2 = () => {
  const handleLayoutChange = (layout: Panel[]) => {
    // 패널 위치 정보 저장
    console.log(layout);
  };

  const renderChart = (type?: string) => {
    switch (type) {
      case 'revenue':
        return <InfoCard title="Revenue: Q1 2020" value="$2.32M" subtext="Q4 2019: $1.87M" trend="up" />;
      case 'expense':
        return <InfoCard title="Expense: Q1 2020" value="$42.76K" subtext="Q4 2019: $148.90K" trend="down" />;
      case 'profit':
        return <InfoCard title="Profit: Q1 2020" value="$516.76K" subtext="Q4 2019: $471.63K" trend="up" />;
      case 'revenue-per-employee':
        return <InfoCard title="Revenue per Employee" value="$110.01K" />;
      case 'active-customers1':
        return <InfoCard title="Active Customers" value="3.63K" />;
      case 'active-customers2':
        return <InfoCard title="Active Customers" value="5.63K" />;
      default:
        return <ChartComponent type={type ?? ''} />;
    }
  };

  return (
    <div className="bg-[#0e0e2c] min-h-screen p-8 text-white">
      <PanelGrid
        panels={initialPanels}
        cols={12}
        rowHeight={80}
        width={1200}
        margin={[16, 16]}
        isDraggable={true}
        preventCollision={true}
        onLayoutChange={(layout) => handleLayoutChange(layout)}
      >
        {initialPanels.map((panel) => (
          <div
            key={panel.id}
            className="bg-[#1b1b3a] border border-[#3f3f7f] rounded-lg shadow-md p-4"
          >
            {renderChart(panel.content)}
          </div>
        ))}
      </PanelGrid>
    </div>
  );
};

export default Example2;