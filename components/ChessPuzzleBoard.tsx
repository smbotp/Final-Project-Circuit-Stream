// filepath: components/ChessPuzzleBoard.tsx
import { Chessboard } from "react-chessboard";

interface ChessPuzzleBoardProps {
  fen?: string;
}

export default function ChessPuzzleBoard({ fen = "start" }: ChessPuzzleBoardProps) {
  return (
    <div style={{ width: 350 }}>
      {/* @ts-expect-error: boardPosition is valid for react-chessboard v5 */}
      <Chessboard boardPosition={fen} />
    </div>
  );
}