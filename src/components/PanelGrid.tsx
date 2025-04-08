import React, { cloneElement, isValidElement, JSX } from 'react';
import styles from './PanelGrid.module.css';
import { calculateContainerHeight, calculatePanelStyle } from '../utils/calculateUtils';
import { Panel } from '../types/types';

interface PanelGridProps {
  panels: Panel[],
  cols: number,
  rowHeight: number,
  width: number,
  children: React.ReactNode;
}

/**
 * 패널 목록을 격자(grid) 형태로 렌더링하는 컴포넌트입니다.
 *
 * @param props - 패널 데이터 및 그리드 설정 정보
 * @returns JSX.Element
 */
const PanelGrid = ({ panels, cols, rowHeight, width, children }: PanelGridProps): JSX.Element => {
  const unitWidth = width / cols;
  const containerHeight = calculateContainerHeight(panels, rowHeight);
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
        const style = calculatePanelStyle(panel, unitWidth, rowHeight);
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