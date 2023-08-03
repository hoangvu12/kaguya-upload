import classNames from "classnames";
import { AnimatePresence } from "framer-motion";
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from "react";
import { motion } from "framer-motion";

export interface BottomSheetProps {
  onClose?: () => void;
  onOpen?: () => void;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<
  BottomSheetRef,
  React.PropsWithChildren<BottomSheetProps>
>(({ children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);

    props?.onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);

    props?.onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      handleOpen();
    },
    close: () => {
      handleClose();
    },
  }));

  return (
    <div
      ref={bottomSheetRef}
      className={classNames(
        "w-full z-[9999] fixed inset-0 flex items-end justify-center",
        !isOpen && "pointer-events-none"
      )}
    >
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/70"
          onClick={handleClose}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bottom-sheet"
            variants={{
              initial: { y: "100%" },
              animate: { y: 0 },
              exit: { y: "100%" },
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            animate="animate"
            exit="exit"
            initial="initial"
            className="w-full relative z-[9999] max-h-[70vh] overflow-y-auto no-scrollbar"
          >
            <div
              className="bg-background-800 rounded-t-3xl overflow-y-auto shadow-xl transform transition-all w-full px-4 py-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
