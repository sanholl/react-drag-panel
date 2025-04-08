import { describe, expect, it } from "vitest";
import { calculateContainerHeight, calculatePanelStyle } from "./calculateUtils";
import { Panel } from '../types/types';

describe('calculatePanelStyle', () => {
  const defaultPanel: Panel = { id: '1', x: 1, y: 2, w: 2, h: 1, content: 'A' };
  const unitWidth = 100;
  const rowHeight = 50;

  it('패널의 위치와 크기를 계산하여 스타일 객체를 반환한다', () => {
    const panel = {...defaultPanel};
    const style = calculatePanelStyle(panel, unitWidth, rowHeight);

    expect(style).toEqual({
      width: 200,
      height: 50,
      transform: 'translate(100px, 100px)',
    });
  });

  it('빈 객체를 넘기면 기본값을 사용하여 스타일이 계산된다', () => {
    const style = calculatePanelStyle({}, unitWidth, rowHeight);
  
    expect(style).toEqual({
      width: 100,
      height: 50,
      transform: 'translate(0px, 0px)',
    });
  });
});

describe('calculateContainerHeight', () => {
  const defaultPanel: Panel[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 1, content: 'A' },
    { id: '2', x: 1, y: 1, w: 1, h: 2, content: 'B' },
    { id: '3', x: 2, y: 3, w: 1, h: 3, content: 'C' },
  ];
  const rowHeight = 50;

  it('패널들의 y + h 값 중 최댓값을 기준으로 컨테이너 높이를 계산한다', () => {
    const panels = [...defaultPanel];
    const containerHeight = calculateContainerHeight(panels, rowHeight);
    expect(containerHeight, 'containerHeight는 300이 나와야 한다.').toBe(300);
  });

  it('패널이 하나만 있을 때, 컨테이너 높이는 해당 패널의 높이로 계산된다', () => {
    const panels = defaultPanel.slice(0, 1);
    const containerHeight = calculateContainerHeight(panels, rowHeight);
    expect(containerHeight, 'containerHeight는 50이 나와야 한다.').toBe(50);
  });

  it('패널들이 2개 이상일 경우, 최댓값을 기준으로 높이를 계산한다', () => {
    const panels = defaultPanel.slice(0, 2);
    const containerHeight = calculateContainerHeight(panels, rowHeight);
    expect(containerHeight, 'containerHeight는 150이 나와야 한다.').toBe(150);
  });

  it('패널들이 하나도 없는 경우 0을 반환한다.', () => {
    const containerHeight = calculateContainerHeight([], rowHeight);
    expect(containerHeight, 'containerHeight는 0이 나와야 한다.').toBe(0);
  });
});