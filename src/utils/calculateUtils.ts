import { Panel } from "../types/types";

type Dimension = Pick<Panel, 'w' | 'h' | 'x' | 'y'>;
interface CalculatePanelStyleProps {
  /** 패널의 위치와 크기 정보 (x, y, w, h) */
  dimensions: Dimension;
  /** 1 grid column 당 픽셀 너비 */
  unitWidth: number;
  /** 1 grid row 당 픽셀 높이 */
  rowHeight: number;

  /** grid 컬럼 수 (x 범위 제한에 사용) - 기본값: 12*/
  cols?: number;

  /**
   * 각 grid column 사이의 수평 margin(px) — 기본값: 0  
   * → x축 방향으로 패널 간 간격을 두고 싶을 때 사용
   */
  marginX?: number;

  /**
   * 각 grid row 사이의 수직 margin(px) — 기본값: 0 
   * → y축 방향으로 패널 간 간격을 두고 싶을 때 사용
   */
  marginY?: number;

  /**
   * 전체 grid의 왼쪽 padding(px) — 기본값: 0  
   * → 전체 컨테이너에서 좌측 여백을 지정할 때 사용
   */
  paddingX?: number;

  /**
   * 전체 grid의 상단 padding(px) — 기본값: 0  
   * → 전체 컨테이너에서 상단 여백을 지정할 때 사용
   */
  paddingY?: number;
}
interface CalculateContainerHeightProps {
  /** 렌더링할 패널 배열 */
  panels: Panel[];
  /** 한 row의 픽셀 높이 */
  rowHeight: number;
  /** 각 row 간의 수직 마진 (px) */
  marginY?: number;
  /** 컨테이너의 상하 padding 값 (px) */
  paddingY?: number;
}
interface isCollidingProps {
  /** 교체할 패널 */
  panel1: Dimension;
  /** 기존에 위치한 패널 */
  panel2: Dimension;
}


/**
 * 개별 패널의 style 객체를 계산하는 함수
 *
 * @returns React에서 사용할 수 있는 객체
 */
export function calculatePanelStyle({
  dimensions: { x = 0, y = 0, w = 1, h = 1 },
  unitWidth,
  rowHeight,
  cols = 12,
  marginX = 0,
  marginY = 0,
  paddingX = 0,
  paddingY = 0,
}: CalculatePanelStyleProps) {
  const clampedX = Math.min(x, cols - w);

  const left = clampedX * (unitWidth + marginX) + paddingX;
  const top = y * (rowHeight + marginY) + paddingY;
  const width = unitWidth * w + marginX * (w - 1);
  const height = rowHeight * h + marginY * (h - 1);

  return {
    transform: `translate(${left}px, ${top}px)`,
    width,
    height
  };
}

/**
 * 전체 grid container의 높이를 계산하는 함수
 * 모든 패널의 y+h 중 최댓값을 기준으로 계산합니다.
 *
 * @returns 컨테이너 전체 높이 (px 단위)
 */
export function calculateContainerHeight({
  panels,
  rowHeight,
  marginY = 0,
  paddingY = 0,
}: CalculateContainerHeightProps): number {
  if (panels.length === 0) return 0;
  const maxY = Math.max(...panels.map(p => (p?.y || 0) + (p?.h || 1)));

  return (
    maxY * rowHeight +
    (maxY - 1) * marginY +
    paddingY * 2
  );
}

/**
 * container 내부로만 배치되도록 제한 (좌표 제한)
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}