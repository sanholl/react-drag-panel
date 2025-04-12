import React, { cloneElement, isValidElement } from 'react';
import type { JSX } from 'react';
import styles from './PanelGrid.module.css';
import { calculateContainerHeight, calculatePanelStyle } from '../utils/calculateUtils';
import { Panel } from '../types/types';

interface PanelGridProps {
  /** 렌더링할 패널 리스트 */
  panels: Panel[];
  /** 한 줄에 표시할 column 개수 */
  cols: number;
  /** 한 grid row 당 높이(px) */
  rowHeight: number;
  /** 전체 grid의 너비(px) */
  width: number;
  /** 각 패널에 매핑될 자식 컴포넌트들 */
  children: React.ReactNode;
}

/**
 * 패널 목록을 격자(grid) 형태로 렌더링하는 컴포넌트입니다.
 *
 * @param panels - 렌더링할 패널 배열
 * @param cols - 한 줄당 column 개수
 * @param rowHeight - 각 grid row의 높이(px)
 * @param width - 전체 컨테이너의 너비(px)
 * @param children - 각 패널과 매핑될 React 요소들
 * @returns JSX.Element
 */
const PanelGrid = ({ panels, cols, rowHeight, width, children }: PanelGridProps): JSX.Element => {
  const unitWidth = width / cols;
  const containerHeight = calculateContainerHeight({ panels, rowHeight });
  const childrenArray = React.Children.toArray(children);

  return (
    <div 
      style={{ height: containerHeight }} 
      className={styles.gridContainer} 
      data-testid="grid-container"
    >
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return null;

        const panel = panels[index];
        const style = calculatePanelStyle({
          dimensions: {
            x: panel.x,
            y: panel.y,
            w: panel.w,
            h: panel.h,
          },
          unitWidth,
          rowHeight,
        });
        const element = child as React.ReactElement<any, any>;

        return cloneElement(element, {
          'data-testid': 'grid-panel',
          key: panel?.id || `default-key-${index}`,
          style: { ...style, ...(element.props.style || {}) },
          className: [styles.gridItemPanel, element.props.className]
            .filter(Boolean)
            .join(' '),
        });
      })}
    </div>
  );
}

export default PanelGrid;