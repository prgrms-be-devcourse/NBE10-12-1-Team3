import { ReactNode } from "react";

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export default function MainCard({ left, right }: Props) {
  return (
    <div className="flex rounded-2xl shadow-lg overflow-hidden bg-white">
      <div className="w-3/5">{left}</div>
      <div className="w-2/5">{right}</div>
    </div>
  );
}
