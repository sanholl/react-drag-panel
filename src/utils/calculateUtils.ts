import { Panel } from "../types/types";

/**
 * 개별 패널의 style 객체를 계산하는 함수
 *
 * @param panel - 위치와 크기 정보를 담은 패널 객체
 * @param unitWidth - 1 grid column 당 픽셀 너비
 * @param rowHeight - 1 grid row 당 픽셀 높이
 * @returns React에서 사용 가능한 CSSProperties 객체
 */
export function calculatePanelStyle(panel: Panel, unitWidth: number, rowHeight: number): React.CSSProperties {
  const width = panel?.w || 1;
  const height = panel?.h || 1;
  const x = panel?.x || 0;
  const y = panel?.y || 0;

  return {
    width: width * unitWidth,
    height: height * rowHeight,
    transform: `translate(${x * unitWidth}px, ${y * rowHeight}px)`,
  };
}

/**
 * 전체 grid container의 높이를 계산하는 함수
 * 모든 패널의 y+h 중 최댓값을 기준으로 계산합니다.
 *
 * @param panels - 화면에 표시할 모든 패널 배열
 * @param rowHeight - 1 row 당 픽셀 높이
 * @returns 컨테이너 전체 높이 (px 단위)
 */
export function calculateContainerHeight(panels: Panel[], rowHeight: number): number {
  if (panels.length === 0) return 0;
  const maxY = Math.max(...panels.map(p => (p?.y || 0) + (p?.h || 1)));
  
  return maxY * rowHeight;
}