import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { prefersReducedMotion } from "../lib/motion.js";
import { cn } from "../lib/utils.js";

const DEFAULT_SPRING = { mass: 0.12, stiffness: 260, damping: 22 };

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  itemSlotWidth,
  label,
  reducedMotion,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !Number.isFinite(val)) return distance;
    return val - rect.x - rect.width / 2;
  });

  const targetScale = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [1, magnification / baseItemSize, 1]
  );
  const scale = useSpring(targetScale, spring);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{ width: itemSlotWidth, height: magnification }}
    >
      <motion.div
        ref={ref}
        style={{
          width: baseItemSize,
          height: baseItemSize,
          scale: reducedMotion ? 1 : scale,
          transformOrigin: "50% 100%",
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn("dock-item", className)}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-label={typeof label === "string" ? label : undefined}
      >
        {Children.map(children, (child) =>
          isValidElement(child) ? cloneElement(child, { isHovered }) : child
        )}
      </motion.div>
    </div>
  );
}

function DockLabel({ children, className = "", isHovered }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.16 }}
          className={cn("dock-label", className)}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center text-[var(--theme-dock-fg)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = DEFAULT_SPRING,
  magnification = 64,
  distance = 140,
  panelHeight = 60,
  baseItemSize = 46,
  itemSlotWidth = 56,
}) {
  const reducedMotion = prefersReducedMotion();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className="pointer-events-none mx-2 flex max-w-full items-end justify-center"
      style={{ height: magnification + 12 }}
    >
      <div
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn("dock-shell", className)}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Site navigation dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={item.label ?? index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            itemSlotWidth={itemSlotWidth}
            label={item.label}
            reducedMotion={reducedMotion}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  );
}
