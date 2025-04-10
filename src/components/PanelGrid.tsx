import React, { cloneElement, isValidElement, useRef, useState } from 'react';
import type { JSX } from 'react';
import styles from './PanelGrid.module.css';
import { calculateContainerHeight, calculatePanelStyle } from '../utils/calculateUtils';
import { Panel } from '../types/types';

interface PanelGridProps {
  /**
   * 렌더링할 패널 배열
   * @default []
   */
  panels?: Panel[];

  /**
   * 한 줄에 표시할 컬럼 개수
   * @default 12
   */
  cols?: number;

  /**
   * 한 grid row 당 높이 (px)
   * @default 100
   */
  rowHeight?: number;

  /**
   * 전체 grid의 너비 (px)
   * @default 1200
   */
  width?: number;

  /**
   * 각 패널에 매핑될 자식 컴포넌트들
   */
  children?: React.ReactNode;
}

/**
 * PanelGrid는 주어진 패널 데이터를 기반으로 고정된 컬럼 수와 행 높이에 따라
 * 격자 형태로 자식 컴포넌트를 배치하고, 드래그 앤 드롭을 통해 순서를 재배치할 수 있는 컴포넌트입니다.
 *
 * @component
 * @param {Panel[]} [panels=[]] - 렌더링할 패널 배열
 * @param {number} [cols=12] - 한 줄당 컬럼 수
 * @param {number} [rowHeight=100] - 각 행(row)의 높이(px)
 * @param {number} [width=1200] - 전체 그리드의 너비(px)
 * @param {React.ReactNode} children - 각 패널과 연결될 React 요소들
 * @returns {JSX.Element} 렌더링된 패널 그리드 컴포넌트
 */
const PanelGrid = ({
  panels = [],
  cols = 12,
  rowHeight = 100,
  width = 1200,
  children,
}: PanelGridProps): JSX.Element => {
  const [panelList, setPanelList] = useState<Panel[]>(panels);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const unitWidth = width / cols;
  const containerHeight = calculateContainerHeight({ panels: panelList, rowHeight });
  const childrenArray = React.Children.toArray(children);

  /**
   * 드래그 시작 시 호출되는 함수
   * @param e - 드래그 이벤트
   * @param position - 드래그한 패널의 인덱스
   */
  const dragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  /**
   * 드래그한 요소가 다른 요소 위에 올라갔을 때 호출되는 함수
   * @param e - 드래그 이벤트
   * @param position - 대상 요소의 인덱스
   */
  const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  /**
   * 드래그가 종료되었을 때 호출되는 함수
   * 현재 dragItem → dragOverItem 위치로 순서를 바꿈
   * @param e - 드롭 이벤트
   */
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newList = [...panelList];
    const dragItemValue = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, dragItemValue);

    dragItem.current = null;
    dragOverItem.current = null;

    setPanelList(newList);
  };

  return (
    <div
      style={{ height: containerHeight }}
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
        });

        const element = child as React.ReactElement<any, any>;

        return cloneElement(element, {
          'data-testid': 'grid-panel',
          draggable: true,
          key: panel?.id || `default-key-${index}`,
          style: { ...style, ...(element.props.style || {}) },
          className: [styles.gridItemPanel, element.props.className].filter(Boolean).join(' '),
          onDragStart: (e: React.DragEvent<HTMLDivElement>) => dragStart(e, index),
          onDragEnter: (e: React.DragEvent<HTMLDivElement>) => dragEnter(e, index),
          onDragEnd: drop,
          onDragOver: (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(),
        });
      })}
    </div>
  );
};

export default PanelGrid;