"use client";

import { type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useDragControls,
  type PanInfo,
} from "motion/react";

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CLOSE_THRESHOLD = 150;
const VELOCITY_THRESHOLD = 500;

export function MobileBottomSheet({
  isOpen,
  onClose,
  children,
}: MobileBottomSheetProps) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const backdropOpacity = useTransform(y, [0, 300], [1, 0]);
  const borderRadius = useTransform(y, [0, 100], [24, 32]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const shouldClose =
      info.offset.y > CLOSE_THRESHOLD || info.velocity.y > VELOCITY_THRESHOLD;

    if (shouldClose) {
      onClose();
    }
  }

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        style={{ opacity: backdropOpacity }}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 400 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        style={{ y, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-db-glass shadow-2xl lg:hidden flex flex-col border-t border-db-border/50 touch-none"
      >
        {/* Drag Handle Area */}
        <div
          onPointerDown={startDrag}
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <motion.div
            className="w-12 h-1.5 rounded-full bg-db-border/80"
            whileHover={{ scaleX: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
            whileTap={{ scaleX: 0.95 }}
            transition={{ duration: 0.15 }}
          />
          <div className="absolute inset-x-0 top-0 h-10" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </motion.div>
    </>
  );
}
