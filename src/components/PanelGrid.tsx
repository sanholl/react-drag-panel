import React, { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import styles from './PanelGrid.module.css';
import { autoReposition, calculateContainerHeight, calculatePanelStyle, getDropPosition } from '../utils/calculateUtils';
import type { Panel } from '../types/types';

interface PanelGridProps {
  panels?: Panel[];
  cols?: number;
  rowHeight?: number;
  width?: number;
  margin?: [number, number];
  padding?: [number, number];
  children?: React.ReactNode;
}

interface GridChildProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  className?: string;
  'data-testid'?: string;
};

/**
 * PanelGrid는 주어진 패널 데이터를 기반으로 고정된 컬럼 수와 행 높이에 따라
 * 격자 형태로 자식 컴포넌트를 배치하고, 드래그 앤 드롭을 통해 순서를 재배치할 수 있는 컴포넌트입니다.
 *
 * @component
 * @param {Panel[]} [panels=[]] - 렌더링할 패널 배열
 * @param {number} [cols=12] - 한 줄당 컬럼 수
 * @param {number} [rowHeight=100] - 각 행(row)의 높이(px)
 * @param {number} [width=1200] - 전체 그리드의 너비(px)
 * @param {[number, number]} [margin=[0, 0]] - 각 grid 간의 간격(px)
 * @param {[number, number]} [padding=[0, 0]] - grid 컨테이너의 안쪽 여백(px)
 * @param {React.ReactNode} children - 각 패널과 연결될 React 요소들
 * @returns {JSX.Element} 렌더링된 패널 그리드 컴포넌트
 */
const PanelGrid = ({
  panels = [],
  cols = 12,
  rowHeight = 50,
  width = 1200,
  margin = [0, 0],
  padding = [0, 0],
  children,
}: PanelGridProps): JSX.Element => {
  const [panelList, setPanelList] = useState<Panel[]>(panels);
  const dragItem = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const unitWidth = width / cols;
  const containerHeight = calculateContainerHeight({
    panels: panelList,
    rowHeight,
    marginY: margin[1],
    paddingY: padding[1],
  });
  const childrenArray = React.Children.toArray(children);

  /**
   * 드래그 시작 시 호출되는 함수
   * @param position - 드래그한 패널의 인덱스
   */
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  /**
   * 드래그가 종료되었을 때 호출되는 함수
   * @param e - 드롭 이벤트
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current === null || !containerRef.current) return;

    const draggedIndex = dragItem.current;
    const draggedPanel = panelList[draggedIndex];
    const { w = 1, h = 1 } = draggedPanel;

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxRows = Math.floor(containerHeight / rowHeight);

    const { x, y } = getDropPosition({
      event,
      config: {
        containerRect,
        unitWidth,
        rowHeight,
        padding,
        margin,
        cols,
        maxRows,
        panelSize: { w, h }
      },
    });

    const updatedPanels = autoReposition(
      panelList.map((panel, index) =>
        index === draggedIndex ? { ...panel, x, y } : panel
      )
    );

    setPanelList(updatedPanels);
  };

  useEffect(() => {
    setPanelList(prev => autoReposition(prev));
  }, [panelList]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, width }}
      className={styles.gridContainer}
      data-testid="grid-container"
    >
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return null;

        const panel = panelList[index];
        const style = calculatePanelStyle({
          dimensions: {
            x: panel?.x,
            y: panel?.y,
            w: panel?.w,
            h: panel?.h,
          },
          unitWidth,
          rowHeight,
          cols,
          marginX: margin[0],
          marginY: margin[1],
          paddingX: padding[0],
          paddingY: padding[1],
        });

        const element = child as React.ReactElement<GridChildProps>;

        return cloneElement(element, {
          draggable: true,
          key: panel?.id || `default-key-${index}`,
          style: { ...style, ...(element.props.style || {}) },
          className: [styles.gridItemPanel, element.props.className]
            .filter(Boolean)
            .join(' '),
          onDragStart: () => handleDragStart(index),
          onDragEnd: handleDrop,
          onDragOver: (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(),
        });
      })}
    </div>
  );
};

export default PanelGrid;