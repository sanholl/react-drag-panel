import React, { useRef, useState } from 'react';
import PanelGrid from "../src/components/PanelGrid";

const Example2 = () => {
  const [panels, setPanels] = useState([
    {
      id: "panel1",
      layout: [
        { i: "panel1-chart1", type: "line", x: 0, y: 0, w: 6, h: 4, maxW: 12, minH: 3, maxH: 6 },
        { i: "panel1-chart2", type: "pie", x: 6, y: 0, w: 6, h: 4 },
        { i: "panel1-chart3", type: "number-score-card", x: 0, y: 4, w: 2, h: 3, minH: 3, minW: 2 },
        { i: "panel1-chart4", type: "number-score-card", x: 2, y: 4, w: 2, h: 3, minH: 3, minW: 2 },
        { i: "panel1-chart5", type: "number-score-card", x: 4, y: 4, w: 2, h: 3, minH: 3, minW: 2 },
        { i: "panel1-chart6", type: "number-score-card", x: 6, y: 4, w: 2, h: 3, minH: 3, minW: 2 },
        { i: "panel1-chart7", type: "number-score-card", x: 8, y: 4, w: 2, h: 3, minH: 3, minW: 2 },
      ],
    },
    {
      id: "panel2",
      layout: [
        { i: "panel2-chart1", type: "bar", x: 0, y: 0, w: 6, h: 4, maxW: 12, minH: 3, maxH: 6 },
        { i: "panel2-chart2", type: "sankey", x: 6, y: 0, w: 6, h: 4, maxW: 12, minH: 3, maxH: 6 },
      ],
    },
    {
      id: "panel3",
      layout: [
        { i: "panel3-chart1", type: "keyword", x: 0, y: 0, w: 4, h: 4, maxW: 12, minH: 3, maxH: 5 },
        { i: "panel3-chart2", type: "bar-with-line", x: 4, y: 0, w: 8, h: 4, maxW: 12, minH: 3, maxH: 5 },
      ],
    },
    {
      id: "panel4",
      layout: [
        { i: "panel4-chart1", type: "curved-area", x: 0, y: 0, w: 12, h: 6 },
        { i: "panel4-chart2", type: "bar", x: 0, y: 6, w: 12, h: 6 },
        { i: "panel4-chart3", type: "pie", x: 0, y: 12, w: 6, h: 4 },
        { i: "panel4-chart4", type: "pie", x: 6, y: 12, w: 6, h: 4 },
      ],
    }
  ]);
  const layoutMapRef = useRef(
    panels.reduce((acc, panel) => {
      acc[panel.id] = panel.layout;
      return acc;
    }, {})
  );

  const handleLayoutChange = (panelId, layout) => {
    layoutMapRef.current[panelId] = layout;
  };

  const handleSaveAll = () => {
    console.log("📦 전체 layout 저장:", JSON.stringify(layoutMapRef.current, null, 2));
    // 서버에 저장하거나 localStorage 등에 활용 가능
  };
  const addPanelData = () => {
    const newPanelId = `panel${panels.length + 1}`;
    const newPanelLayout = [
      { i: `${newPanelId}-chart1`, type: "line", x: 0, y: 0, w: 6, h: 4 },
    ];
    
    setPanels((prevPanels => [...prevPanels, { id: newPanelId, layout: newPanelLayout }]));
    layoutMapRef.current[newPanelId] = newPanelLayout;
  }
  const addChartData = (id) => {
    const targetPanel = panels.find(panel => panel.id === id)?.layout || [];
    const newChartId = `${id}-chart${targetPanel.length + 1}`;
    const newChartLayout = { i: newChartId, type: "line", x: 0, y: 0, w: 6, h: 4 };
    const newPanelLayout = [...targetPanel, newChartLayout];
  
    setPanels((prevPanels) => {
      return prevPanels.map((panel) => {
        if (panel.id === id) {
          return { ...panel, layout: newPanelLayout };
        }
        return panel;
      });
    });
    layoutMapRef.current[id] = newPanelLayout;
  }
  const removePanelData = (id) => {
    const newPanels = panels.filter(panel => panel.id !== id);
    setPanels(newPanels);
    delete layoutMapRef.current[id];
  }
  const removeChartData = (id, chartId) => {
    const targetPanel = panels.find(panel => panel.id === id)?.layout || [];
    const newPanelLayout = targetPanel.filter(chart => chart.i !== chartId);
  
    setPanels((prevPanels) => {
      return prevPanels.map((panel) => {
        if (panel.id === id) {
          return { ...panel, layout: newPanelLayout };
        }
        return panel;
      });
    });
    layoutMapRef.current[id] = newPanelLayout;
  }

  const DrawGridLayout = () => {
    return panels.map((panel) => (
      <div key={panel.id} className="mt20">
        <h3>{panel.id}</h3>
        <button className="mr10" onClick={() => removePanelData(panel.id)}>Panel 삭제</button>
        <button onClick={() => addChartData(panel.id)}>Chart 추가</button>
        <PanelGrid
          panels={panel.layout}
          cols={12}
          rowHeight={80}
          width={1800}
          margin={[10, 10]}
          isDraggable
          preventCollision={false}
          onLayoutChange={(layout) => handleLayoutChange(panel.id, layout)}
        >
          {panel.layout.map((chart, idx) => (
            <div key={chart.i}>
              <button className="fr" onClick={() => removeChartData(panel.id, chart.i)}>x</button>
              <div className="h-100">
                {/* <ChartComponent type={chart.type} /> */}
              </div>
            </div>
          ))}
        </PanelGrid>
      </div>
    ));
  }

  if (!panels?.length) return;
  
  return (
    <>
      <button className="mr10" onClick={handleSaveAll}>📦 현재 위치 저장</button>
      <button onClick={addPanelData}>📦 Penel 추가</button>

      <DrawGridLayout />
    </>
  );
}

export default Example2;