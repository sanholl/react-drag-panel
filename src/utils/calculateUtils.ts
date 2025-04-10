import { Panel } from "../types/types";

interface CalculatePanelStyleProps {
  /** 패널의 위치와 크기 정보 (x, y, w, h) */
  dimensions: Pick<Panel, 'w' | 'h' | 'x' | 'y'>;
  /** 1 grid column 당 픽셀 너비 */
  unitWidth: number;
  /** 1 grid row 당 픽셀 높이 */
  rowHeight: number;
}


/**
 * 개별 패널의 style 객체를 계산하는 함수
 *
 * @returns React에서 사용할 수 있는 CSSProperties 객체
 */
export function calculatePanelStyle({ 
  dimensions: { x = 0, y = 0, w = 1, h = 1 }, 
  unitWidth, 
  rowHeight 
}: CalculatePanelStyleProps): React.CSSProperties {
  return {
    width: w * unitWidth,
    height: h * rowHeight,
    transform: `translate(${x * unitWidth}px, ${y * rowHeight}px)`,
  };
}

interface CalculateContainerHeightProps {
  /** 화면에 표시할 모든 패널 배열 */
  panels: Panel[];
  /** 1 row 당 픽셀 높이 */
  rowHeight: number;
}
/**
 * 전체 grid container의 높이를 계산하는 함수
 * 모든 패널의 y+h 중 최댓값을 기준으로 계산합니다.
 *
 * @returns 컨테이너 전체 높이 (px 단위)
 */
export function calculateContainerHeight({ panels, rowHeight }: CalculateContainerHeightProps): number {
  if (panels.length === 0) return 0;
  const maxY = Math.max(...panels.map(p => (p?.y || 0) + (p?.h || 1)));
  
  return maxY * rowHeight;
}