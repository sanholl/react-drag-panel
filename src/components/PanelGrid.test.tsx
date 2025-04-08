import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PanelGrid from './PanelGrid';
import { Panel } from '../types/types';

describe('PanelGrid', () => {
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

    const children = screen.getAllByTestId('grid-panel');
    expect(children.length).toBe(panels.length);
  });
});