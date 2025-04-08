import React from 'react';
import PanelGrid from '../src/components/PanelGrid';
import './index.css';

const App = () => {
  const panels = [
    { id: '1', x: 0, y: 0, w: 1, h: 1, content: 'Panel 1' },
    { id: '2', x: 1, y: 0, w: 1, h: 1, content: 'Panel 2' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4 font-bold">react-drag-panel 예제</h1>
      <PanelGrid panels={[]} cols={12} rowHeight={80} width={1800} >
        {panels.map(panel => (
          <div key={panel.id} className="border border-gray-300 text-center">{panel.content}</div>
        ))}
      </PanelGrid>
    </div>
  );
};

export default App;