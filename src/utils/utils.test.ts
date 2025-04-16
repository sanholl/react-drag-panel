import { describe, expect, it } from "vitest";
import { clamp, isColliding } from "./utils";

describe('clamp()', () => {
  it('값이 최소와 최대 범위를 벗어나지 않도록 제한한다', () => {
    expect(clamp(5, 0, 10), '최대 범위인 10을 벗어나지 않았으므로 5를 반환').toBe(5);
    expect(clamp(-1, 0, 10), '최소 범위인 0을 벗어났으므로 0을 반환').toBe(0);
    expect(clamp(20, 0, 10), '최대 범위인 10을 벗어났으므로 10을 반환').toBe(10);
  });
});

describe('isColliding()', () => {
  it('두 패널이 겹치는 경우 true를 반환한다', () => {
    const a = { x: 0, y: 0, w: 2, h: 2 };
    const b = { x: 1, y: 1, w: 2, h: 2 };
    expect(isColliding(a, b)).toBe(true);
  });

  it('두 패널이 겹치지 않는 경우 false를 반환한다', () => {
    const a = { x: 0, y: 0, w: 2, h: 2 };
    const b = { x: 3, y: 3, w: 2, h: 2 };
    expect(isColliding(a, b)).toBe(false);
  });
});