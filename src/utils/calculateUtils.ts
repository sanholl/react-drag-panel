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
interface DropPositionConfig {
  /**
   * grid 컨테이너의 DOM 좌표 (client 기준 좌상단 좌표와 너비/높이 정보 포함)
   * → 마우스 위치를 grid 내부 좌표로 환산하기 위해 필요
   */
  containerRect: DOMRect;

  /**
   * 1 grid column의 너비 (px)
   * → 마우스 위치를 컬럼 단위로 환산할 때 사용
   */
  unitWidth: number;

  /**
   * 1 grid row의 높이 (px)
   * → 마우스 위치를 row 단위로 환산할 때 사용
   */
  rowHeight: number;

  /**
   * [왼쪽 padding, 위쪽 padding] (px)
   * → 전체 grid의 바깥쪽 여백 (container 기준 내부 시작 위치 보정용)
   */
  padding: [number, number];

  /**
   * [컬럼 간 간격, 행 간 간격] (px)
   * → 각 grid 요소 사이의 간격 (패널 사이 여백 포함)
   */
  margin: [number, number];

  /**
   * grid의 총 컬럼 수
   * → 배치 가능한 x 범위를 제한하는데 사용
   */
  cols: number;

  /**
   * grid에서 배치 가능한 최대 row 수
   * → 배치 가능한 y 범위를 제한하는데 사용
   */
  maxRows: number;

  /**
   * 드래그 중인 패널의 크기 (w: 너비 컬럼 수, h: 높이 row 수)
   * → 현재 좌표가 이 panel을 담을 수 있는 공간인지 판단하기 위해 필요
   */
  panelSize: {
    w: number;
    h: number;
  };
}
interface DropPositionInput {
  /**
   * 드래그 종료 시 전달되는 마우스 이벤트 (clientX, clientY 좌표 포함)
   */
  event: React.DragEvent<HTMLDivElement>;

  /**
   * 위치 계산에 필요한 컨텍스트 정보
   */
  config: DropPositionConfig;
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
};


/**
 * 마우스 좌표를 기반으로 grid 좌표를 계산합니다.
 * @returns grid 상의 x, y 좌표
 */
export function getDropPosition({
  event,
  config: {
    containerRect,
    unitWidth,
    rowHeight,
    padding,
    margin,
    cols,
    maxRows,
    panelSize
  }
}: DropPositionInput): { x: number; y: number } {
  const mouseLeft = event.clientX - containerRect.left;
  const mouseTop = event.clientY - containerRect.top;

  const maxX = cols - panelSize.w;
  const maxY = maxRows - panelSize.h;

  const newX = Math.round((mouseLeft - padding[0]) / (unitWidth + margin[0]));
  const newY = Math.round((mouseTop - padding[1]) / (rowHeight + margin[1]));

  return {
    x: clamp(newX, 0, maxX),
    y: clamp(newY, 0, maxY),
  };
};


/**
 * container 내부로만 배치되도록 제한 (좌표 제한)
 * @return container 내부 좌표 최대값을 넘어갈 경우 최대값으로 반환
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
};


/**
 * 두 패널이 겹치는지 여부를 반환합니다.
 * @returns true = 겹침, false = 겹치지 않음
 */
export function isColliding({ panel1, panel2 }: isCollidingProps): boolean {
  const a = { x: 0, y: 0, w: 0, h: 0, ...panel1 };
  const b = { x: 0, y: 0, w: 0, h: 0, ...panel2 };

  return !(
    a.x + a.w <= b.x || // 오른쪽
    a.x >= b.x + b.w || // 왼쪽
    a.y + a.h <= b.y || // 아래
    a.y >= b.y + b.h    // 위
  );
};

/**
 * 겹치는 패널이 있을 경우, 아래로 한 칸씩 밀어 재배치하는 함수
 * @returns 충돌 없이 재배치된 패널 배열
 */
export function autoReposition(panels: Panel[]): Panel[] {
  const sorted = [...panels].sort(
    (a, b) => (a.y || 0) - (b.y || 0) || (a.x || 0) - (b.x || 0)
  );
  const result: Panel[] = [];

  for (const panel of sorted) {
    let newY = panel.y || 0;
    while (
      result.some(p =>
        isColliding({ panel1: { ...panel, y: newY }, panel2: p })
      )
    ) {
      newY++;
    }
    result.push({ ...panel, y: newY });
  }

  return result;
};