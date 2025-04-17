import { PanelGrid } from '../../src';

const Example1 = () => {
  const panels = [
    { id: '1', x: 0, y: 0, w: 4, h: 8, content: 'Panel 1' },
    { id: '2', x: 4, y: 0, w: 4, h: 4, content: 'Panel 2' },
    { id: '3', x: 8, y: 0, w: 4, h: 4, content: 'Panel 3' },
    { id: '4', x: 12, y: 0, w: 4, h: 4, content: 'Panel 4' },
    { id: '5', x: 0, y: 8, w: 12, h: 4, content: 'Panel 5' },
    { id: '6', x: 12, y: 12, w: 4, h: 4, content: 'Panel 6' }
  ];

  return (
    <div className="bg-[#0e0e2c] min-h-screen text-white px-10 py-8">
      <h1 className="text-2xl font-bold mb-6">🧱 react-drag-panel 예제 1</h1>
      <PanelGrid
        panels={panels}
        cols={24}
        rowHeight={40}
        width={1200}
        margin={[10, 10]}
        onLayoutChange={(newLayout) => {
          console.log('Layout changed:', newLayout);
        }}
        isDraggable={true}
        preventCollision={true}
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="h-full w-full bg-[#1b1b3a] border border-[#3f3f7f] rounded-lg shadow-md flex items-center justify-center text-lg font-semibold"
          >
            {panel.content}
          </div>
        ))}
      </PanelGrid>
    </div>
  );
};

export default Example1;