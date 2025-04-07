

interface Panel {
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  content: string
}

interface PanelGridProps {
  panels: Panel[]
}

const PanelGrid = ({ panels }: PanelGridProps) => {
  console.log(panels);

  return (
    <></>
  );
}

export default PanelGrid;