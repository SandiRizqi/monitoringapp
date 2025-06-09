import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function MapControlsContainer({ children }: Props) {
  return (
    <div className="absolute top-2 right-4 z-50 flex gap-2">
      {children}
    </div>
  );
}
