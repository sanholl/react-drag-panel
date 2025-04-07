# 🧩 react-drag-panel

> React 기반의 드래그 & 드롭으로 재배치 가능한 격자 기반 패널 레이아웃 컴포넌트
> `react-grid-layout`보다 가볍고, 단순한 기능 위주로 설계되었습니다.

---

## 📦 설치

```bash
npm install react-drag-panel
# 또는
yarn add react-drag-panel

```
## 🧱 Layout 구조

`layout` prop은 다음과 같은 구조의 배열입니다.

```
[
  { i: '1', x: 0, y: 0, w: 2, h: 1 },
  { i: '2', x: 2, y: 0, w: 1, h: 2 },
]

```

| 필드 | 설명 |
| --- | --- |
| `i` | 패널의 고유 ID (`string`) |
| `x` | 그리드 내 가로 위치 (열 인덱스) |
| `y` | 그리드 내 세로 위치 (행 인덱스) |
| `w` | 가로 너비 (몇 칸 차지하는지) |
| `h` | 세로 높이 (몇 줄 차지하는지) |

---

## ✨ 주요 기능

- 드래그 & 드롭으로 위치 재배치
- `cols`, `rowHeight`, `width`로 격자 구성
- 콜백 제공
- 충돌 방지 옵션
- 외부에서 layout 제어 가능