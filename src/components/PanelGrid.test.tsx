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
      <PanelGrid panels={panels} width={600} rowHeight={100} cols={6}>
        <div>Panel 1</div>
        <div>Panel 2</div>
        <div>Panel 3</div>
      </PanelGrid>
    );

    const panel = screen.getByText('Panel 1').closest('.gridItemPanel') as HTMLElement;
    const beforeTransform = panel.style.transform;

    fireEvent.dragStart(panel);
    fireEvent.dragEnd(panel, {
      clientX: 300,
      clientY: 200,
    });

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

    const panel1 = screen.getByText('Panel 1').closest('.gridItemPanel') as HTMLElement;
    const panel2 = screen.getByText('Panel 2').closest('.gridItemPanel') as HTMLElement;

    const before1 = panel1.style.transform;
    const before2 = panel2.style.transform;

    fireEvent.dragStart(panel1);
    fireEvent.dragEnd(panel1, { clientX: 200, clientY: 100 });

    fireEvent.dragStart(panel2);
    fireEvent.dragEnd(panel2, { clientX: 400, clientY: 150 });

    const after1 = panel1.style.transform;
    const after2 = panel2.style.transform;

    expect(after1).not.toBe(before1);
    expect(after2).not.toBe(before2);
  });
});