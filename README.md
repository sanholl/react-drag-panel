# 🧩 react-drag-panel

- React 기반의 드래그 & 드롭으로 재배치 가능한 격자 기반 패널 레이아웃 컴포넌트
- `react-grid-layout`보다 가볍고, 단순한 기능 위주로 설계되었습니다.

---

## 🎬 Examples
- 예제는 examples/ 폴더에 포함되어 있습니다:

```
cd examples
npm install
npm run dev
```

### Example1
![Example1](https://github.com/user-attachments/assets/1ad23f43-33ab-4ed1-a59f-b8a1469b1d20)

### Example2
![Example2](https://github.com/user-attachments/assets/e6cceafe-ee74-4a74-8449-a1b6d47be5dd)

---

## 📦 Install

```bash
npm install react-drag-panel
# 또는
yarn add react-drag-panel

```

## 🧱 Panel layout

`panel` prop은 다음과 같은 구조의 배열입니다.

```
type Panel = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content?: React.ReactNode;
}

```

| 필드 | 설명 |
| --- | --- |
| `id` | 패널의 고유 ID (`string`) |
| `x` | 그리드 내 가로 위치 (열 인덱스) |
| `y` | 그리드 내 세로 위치 (행 인덱스) |
| `w` | 가로 너비 (몇 칸 차지하는지) |
| `h` | 세로 높이 (몇 줄 차지하는지) |
| `content` | 렌더링할 내용 (선택) |

---

## 🧰 Usage
```
<PanelGrid
  panels={panels}
  cols={24}
  rowHeight={40}
  width={1200}
  margin={[10, 10]}
  isDraggable={true}
  preventCollision={true}
  onLayoutChange={(newLayout) => {
    console.log('Layout changed:', newLayout);
  }}
>
  {panels.map((panel) => (
    <div
      key={panel.id}
      className="h-full w-full bg-[#1b1b3a] border border-[#3f3f7f] rounded-lg shadow-md flex items-center justify-center text-lg font-semibold"
    >
      {panel.content}
    </div>
  ))}
</PanelGrid>
```

## ✨ Features

- 드래그 & 드롭으로 위치 재배치
- 충돌 방지 여부 설정 (preventCollision)
- 드래그 가능 여부 설정 (isDraggable)
- 레이아웃 변경 감지 콜백 (onLayoutChange)
- 유연한 격자 구성: cols, rowHeight, width, margin, padding
- 각 패널의 내부 UI는 자유롭게 구성 가능

---

## 🔧 Props

| Prop | Type |	설명 |	기본값
| --- | --- | --- | --- |
| panels	| Panel[]	| 렌더링할 패널 배열	| []
| cols	| number | 한 줄에 배치할 그리드 수	| 12
| rowHeight	| number	| 한 행의 높이 (px)	| 50
| width	| number	| 전체 그리드의 너비 (px)	| 1200
| margin	| [number, number]	| 패널 간 간격 (수평, 수직)	| [0, 0]
| padding	| [number, number]	| 그리드 컨테이너의 안쪽 여백 (수평, 수직)	| [0, 0]
| isDraggable	| boolean	| 드래그 가능 여부	| true
| preventCollision	| boolean	| 겹침 방지 여부	| true
| onLayoutChange	| (layout: Panel[]) => void	| 레이아웃 변경 시 호출되는 콜백 함수	| undefined
| children	| React.ReactNode	| 각 패널에 대응되는 컴포넌트	| -

## 🧪 Test

```
npm run test
```


## License

This project is licensed under the [MIT License](https://github.com/sanholl/react-drag-panel/blob/feature/grid-layout-basic/LICENSE).