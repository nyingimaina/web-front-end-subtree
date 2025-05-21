import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PortifyProps = {
  portal?: Element;
  children: ReactNode;
  className?: string;
};

const Portify = ({ portal, children, className }: PortifyProps) => {
  const [target, setTarget] = useState<Element | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finalPortal = portal || document.body;
    setTarget(finalPortal);

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [portal]);

  return target ? (
    createPortal(
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          zIndex: 9999,
        }}
      >
        {children}
      </div>,
      target
    )
  ) : (
    <div ref={ref} className={className}>
      {children}
    </div>
  ); // Render normally before portalizing
};

export default Portify;
