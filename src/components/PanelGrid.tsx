import React, { cloneElement, isValidElement, useMemo, useRef, useState } from 'react';
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
   * 드래그 앤 드롭 기능 활성화 여부
   * 기본값은 true
   */
  isDraggable?: boolean;

  /**
   * 드래그 앤 드롭 시 패널 간 충돌 방지 여부
   * 기본값은 true
   */
  preventCollision?: boolean;

  /**
   * 패널 위치가 변경될 때 호출되는 콜백 함수
   */
  onLayoutChange?: (layout: Panel[]) => void;

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
 */
const PanelGrid = ({
  panels = [],
  cols = 12,
  rowHeight = 50,
  width = 1200,
  margin = [0, 0],
  padding = [0, 0],
  isDraggable = true,
  preventCollision = true,
  onLayoutChange,
  children,
}: PanelGridProps): JSX.Element => {
  const [panelList, setPanelList] = useState<Panel[]>(panels);
  const dragItem = useRef<Panel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalPanels = useRef<Panel[]>(panels);
  const lastDragOverPosRef = useRef<{ x: number; y: number } | null>(null);

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
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);


  /**
   * 드래그 시작 시 호출되는 함수
   */
  const handleDragStart = (panel: Panel) => {
    dragItem.current = panel;
    originalPanels.current = panelList.map(p => ({ ...p }));
  };

  /**
   * 드래그가 지속되는 동안 호출되는 함수
   */
  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragItem.current === null || !containerRef.current) return;

    const draggedPanel = dragItem.current;
    const { w = 1, h = 1 } = draggedPanel;

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxRows = Math.floor(containerHeight / rowHeight);

    if (event.clientX === 0 && event.clientY === 0) return;

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
        panelSize: { w, h },
      },
    });

    const last = lastDragOverPosRef.current;
    if (last && last.x === x && last.y === y) return;

    lastDragOverPosRef.current = { x, y };
    setDragOverPosition({ x, y, w, h });

    const tempDragged = { ...draggedPanel, x, y };
    const isOverlap = panelList.some(
      (panel) => panel.id !== draggedPanel.id && isColliding(tempDragged, panel)
    );

    let nextList = originalPanels.current.map((p) => ({ ...p }));
    if (preventCollision && isOverlap) {
      nextList = resolveCollisions(tempDragged, panelList);
    }

    const hasChanged = nextList.some((panel, i) => {
      const prev = panelList[i];
      return (
        panel.x !== prev.x ||
        panel.y !== prev.y ||
        panel.w !== prev.w ||
        panel.h !== prev.h
      );
    });

    if (hasChanged) {
      setPanelList(nextList);
    }
  };

  /**
   * 드래그가 종료되었을 때 호출되는 함수
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current === null || !containerRef.current) return;

    const draggedPanel = dragItem.current;
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
        panelSize: { w, h },
      },
    });

    const tempDragged = { ...draggedPanel, x, y };
    const isOverlap = panelList.some(
      (panel) => panel.id !== draggedPanel.id && isColliding(tempDragged, panel)
    );

    let updatedPanels = panelList;
    if (preventCollision && isOverlap) {
      updatedPanels = resolveCollisions(tempDragged, panelList);
    } else {
      updatedPanels = panelList.map((panel) =>
        panel.id === draggedPanel.id ? { ...panel, x, y } : panel
      );
    }

    const hasChanged = updatedPanels.some((panel, i) => {
      const prev = panelList[i];
      return (
        panel.x !== prev.x ||
        panel.y !== prev.y ||
        panel.w !== prev.w ||
        panel.h !== prev.h
      );
    });

    if (hasChanged) {
      requestAnimationFrame(() => {
        setPanelList(updatedPanels);
        onLayoutChange?.(updatedPanels);
        setDragOverPosition(null);
        lastDragOverPosRef.current = null;
      });
    } else {
      setDragOverPosition(null);
      lastDragOverPosRef.current = null;
    }
  };

  /**
   * 드래그 중인 패널의 스타일을 계산하는 함수
   */
  const dropIndicatorElement = useMemo(() => {
    if (!dragOverPosition) return null;

    return (
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
    );
  }, [dragOverPosition, unitWidth, rowHeight, cols, margin, padding]);


  /**
   * 자식 요소들을 스타일링하여 반환하는 함수
   */
  const styledChildren = useMemo(() => {
    return childrenArray.map((child, index) => {
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
        key: panel?.id || `default-key-${index}`,
        style: { ...style, ...(element.props.style || {}) },
        className: [styles.gridItemPanel, element.props.className]
        .filter(Boolean)
        .join(' '),
        draggable: isDraggable !== false,
        onDragStart: isDraggable !== false ? () => handleDragStart(panel) : undefined,
        onDrag: isDraggable !== false ? handleDrag : undefined,
        onDragEnd: isDraggable !== false ? handleDrop : undefined,
      });
    });
  }, [
    childrenArray,
    panelList,
    unitWidth,
    rowHeight,
    cols,
    margin,
    padding,
  ]);


  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, width }}
      className={styles.gridContainer}
      data-testid="grid-container"
    >
      {dropIndicatorElement}
      {styledChildren}
    </div>
  );
};

export default PanelGrid;