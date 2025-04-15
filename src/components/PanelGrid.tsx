import React, { cloneElement, isValidElement, useRef, useState } from 'react';
import type { JSX } from 'react';
import styles from './PanelGrid.module.css';
import { calculateContainerHeight, calculatePanelStyle, getDropPosition, resolveCollisions } from '../utils/calculateUtils';
import type { Panel } from '../types/types';
import { isColliding } from '../utils/utils';

interface PanelGridProps {
  /** 
   * 렌더링할 패널 배열 
   * 각 패널은 위치(x, y), 크기(w, h), 고유 id 등을 포함함
   */
  panels?: Panel[];

  /** 
   * 한 줄에 배치할 컬럼 수 
   * 기본값은 12
   */
  cols?: number;

  /** 
   * 한 grid row 당 높이 (px 단위) 
   * 패널 높이 계산에 사용됨 
   */
  rowHeight?: number;

  /** 
   * 전체 grid 컨테이너의 너비 (px 단위) 
   */
  width?: number;

  /** 
   * 각 패널 사이의 간격: [수평(px), 수직(px)] 
   * 기본값은 [0, 0]
   */
  margin?: [number, number];

  /** 
   * grid 컨테이너의 안쪽 여백: [좌우(px), 상하(px)] 
   * 기본값은 [0, 0]
   */
  padding?: [number, number];

  /** 
   * 각 패널에 대응되는 자식 React 요소들 
   */
  children?: React.ReactNode;
}

interface GridChildProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 
   * 외부에서 전달할 style 속성 (override 가능)
   */
  style?: React.CSSProperties;

  /** 
   * 클래스명을 문자열 형태로 전달
   */
  className?: string;

  /** 
   * 테스트 용도의 식별자 (data-testid)
   */
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
  const originalPanels = useRef<Panel[]>(panels); // 드래그 시작 전에 백업

  const [dragOverPosition, setDragOverPosition] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);  

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
    originalPanels.current = panelList.map(p => ({ ...p }));
  };

  /**
   * 드래그가 지속되는 동안 호출되는 함수
   * @param event - 드래그 이벤트
   */
  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
  
    setDragOverPosition({ x, y, w, h });
  
    const tempDragged = { ...draggedPanel, x, y };
  
    const isOverlap = panelList.some((panel, idx) => {
      if (idx === draggedIndex) return false;
      return isColliding(tempDragged, panel);
    });
  
    if (isOverlap) {
      const updated = resolveCollisions(tempDragged, panelList);
      setPanelList(updated);
    } else {
      setPanelList(originalPanels.current.map(p => ({ ...p })));
    }
  };  

  /**
   * 드래그가 종료되었을 때 호출되는 함수
   * @param event - 드롭 이벤트
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

    const updatedPanels = resolveCollisions(
      { ...draggedPanel, x: x, y: y },
      panelList
    );

    setPanelList(updatedPanels);
    setDragOverPosition(null);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, width }}
      className={styles.gridContainer}
      data-testid="grid-container"
    >
      {dragOverPosition && (
        <div
          className={styles.dropIndicator}
          style={calculatePanelStyle({
            dimensions: dragOverPosition,
            unitWidth,
            rowHeight,
            cols,
            marginX: margin[0],
            marginY: margin[1],
            paddingX: padding[0],
            paddingY: padding[1],
          })}
        />
      )}

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
          'data-testid': 'grid-panel',
          draggable: true,
          key: panel?.id || `default-key-${index}`,
          style: { ...style, ...(element.props.style || {}) },
          className: [styles.gridItemPanel, element.props.className]
            .filter(Boolean)
            .join(' '),
          onDragStart: () => handleDragStart(index),
          onDragEnd: handleDrop,
          onDrag: handleDrag,
        });
      })}
    </div>
  );
};

export default PanelGrid;