import { lazy, Suspense } from "react";

const StructureVariant = lazy(() =>
  import("./StructureFlowBackground.jsx").then((module) => ({
    default: module.StructureFlowBackground,
  }))
);

const FALLBACK = <div className="threeui-background" style={{ background: "transparent" }} />;

export function StructureFlowCollection(props = {}) {
  const { variant: _variant, ...variantProps } = props;
  return (
    <Suspense fallback={FALLBACK}>
      <StructureVariant {...variantProps} />
    </Suspense>
  );
}
