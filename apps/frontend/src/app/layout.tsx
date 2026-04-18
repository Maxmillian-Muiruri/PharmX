import { LayoutWrapper } from "../components/dev/core";
import type { TNodeChildrentType } from "../types";

export default function RootLayout({ children }: Readonly<TNodeChildrentType>) {
  return (
    <LayoutWrapper
      {...{
        children: children,
      }}
    />
  );
}
