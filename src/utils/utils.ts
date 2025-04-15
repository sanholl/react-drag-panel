import { Panel } from "../types/types";

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
export function isColliding(panel1: Panel, panel2: Panel): boolean {
  const a = { x: 0, y: 0, w: 0, h: 0, ...panel1 };
  const b = { x: 0, y: 0, w: 0, h: 0, ...panel2 };

  return !(
    a.x + a.w <= b.x || // 오른쪽
    a.x >= b.x + b.w || // 왼쪽
    a.y + a.h <= b.y || // 아래
    a.y >= b.y + b.h    // 위
  );
};