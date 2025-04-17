import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PanelGrid from './PanelGrid';
import { Panel } from '../types/types';

describe('PanelGrid UI', () => {
  const panels: Panel[] = [
    {id: '1', x: 0, y: 0, w: 3, h: 3, content: 'Panel 1'},
    {id: '2', x: 3, y: 0, w: 3, h: 3, content: 'Panel 2'},
  ];

  it('Grid Container가 렌더링된다.', () => {
    render(
      <PanelGrid panels={panels} cols={4} rowHeight={50} width={400}>
        {panels.map(panel => (
          <div key={panel.id}>{panel.content}</div>
        ))}
      </PanelGrid>
    );
    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
  });

  it('전달받은 panels 수만큼 렌더링한다', () => {
    render(
      <PanelGrid panels={panels} cols={4} rowHeight={50} width={400}>
        {panels.map(panel => (
          <div key={panel.id}>{panel.content}</div>
        ))}
      </PanelGrid>
    );

    const container = screen.getByTestId('grid-container');
    expect(container.childElementCount).toBe(panels.length);
  });

  it('PanelGrid에 props가 없어도 기본값으로 렌더링된다.', () => {
    render(
      <PanelGrid>
        <div>Test Panel</div>
      </PanelGrid>
    );

    const panel = screen.getByTestId('grid-panel');
    expect(panel).toBeInTheDocument();
  });
});

describe('PanelGrid - Drag and Drop', () => {
  const panels: Panel[] = [
    { id: '1', x: 0, y: 0, w: 1, h: 1, content: 'Panel 1' },
    { id: '2', x: 1, y: 0, w: 1, h: 1, content: 'Panel 2' },
    { id: '3', x: 2, y: 0, w: 1, h: 1, content: 'Panel 3' },
  ];

  it('드래그 전후 transform 좌표가 다르다', () => {
    render(
      <PanelGrid panels={panels} width={1200} rowHeight={100} cols={6}>
        <div>Panel 1</div>
        <div>Panel 2</div>
        <div>Panel 3</div>
      </PanelGrid>
    );
  
    const panelEls = screen.getAllByTestId('grid-panel');
    const panel = panelEls[0];
  
    const beforeTransform = panel.style.transform;
  
    fireEvent.dragStart(panel);
    fireEvent.drag(panel, {
      clientX: 500,
      clientY: 500,
    });
    fireEvent.dragEnd(panel);
  
    const afterTransform = panel.style.transform;
    expect(afterTransform).not.toBe(beforeTransform);
  });

  it('여러 개의 패널을 순차적으로 드래그하면 각각 위치가 변경된다', () => {
    render(
      <PanelGrid panels={panels} width={600} rowHeight={100} cols={6}>
        <div>Panel 1</div>
        <div>Panel 2</div>
        <div>Panel 3</div>
      </PanelGrid>
    );

    const panelEls = screen.getAllByTestId('grid-panel');
    const panel1 = panelEls[0];
    const panel2 = panelEls[1];
    
    const before1 = panel1.style.transform;
    const before2 = panel2.style.transform;
    
    fireEvent.dragStart(panel1);
    fireEvent.drag(panel1, { clientX: 200, clientY: 100 });
    fireEvent.dragEnd(panel1);
    
    fireEvent.dragStart(panel2);
    fireEvent.drag(panel2, { clientX: 400, clientY: 150 });
    fireEvent.dragEnd(panel2);
    
    const after1 = panel1.style.transform;
    const after2 = panel2.style.transform;
    
    expect(after1).not.toBe(before1);
    expect(after2).not.toBe(before2);    
  });
});

describe('PanelGrid - Detail Settings', () => {
  const panels: Panel[] = [
    { id: '1', x: 0, y: 0, w: 1, h: 1, content: 'Panel 1' },
    { id: '2', x: 1, y: 0, w: 1, h: 1, content: 'Panel 2' },
    { id: '3', x: 2, y: 0, w: 1, h: 1, content: 'Panel 3' },
  ];

  it('isDraggable 설정 false시 드래그시 위치 변화가 없다.', () => {
    render(
      <PanelGrid panels={panels} isDraggable={false}>
        <div>Panel 1</div>
      </PanelGrid>
    );
  
    const panel = screen.getByText('Panel 1');
  
    fireEvent.dragStart(panel);
    fireEvent.drag(panel, {
      clientX: 200,
      clientY: 200,
    });
    fireEvent.dragEnd(panel);
  
    expect(panel.style.transform, '드래그시 변화가 없으므로 기본값으로 출력된다.').toBe('translate(0px, 0px)');
  });

  it('preventCollision 설정 false시 패널간의 겹침이 허용된다.', () => {
    render(
      <PanelGrid 
        panels={panels} 
        preventCollision={false}
      >
        <div>Panel 1</div>
        <div>Panel 2</div>
      </PanelGrid>
    );
  
    const panel1 = screen.getByText('Panel 1');
  
    fireEvent.dragStart(panel1);
    fireEvent.drag(panel1, {
      clientX: 100,
      clientY: 0,
    });
    fireEvent.dragEnd(panel1);
  
    const panelElements = screen.getAllByTestId('grid-panel');
    const updatedStyles = panelElements.map((el) => el.getAttribute('style') || '');
  
    expect(updatedStyles[0], '겹쳐진 상태로 tranform style이 같음').toBe(updatedStyles[1]);
  });
})