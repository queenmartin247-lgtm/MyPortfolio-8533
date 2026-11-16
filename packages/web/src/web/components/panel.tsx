import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function Panel({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const nodes = panel.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input, textarea, select",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === panel.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === panel.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [close]);
  return (
    <div className="panel-backdrop">
      <button className="dismiss-screen" aria-label="Close overlay" tabIndex={-1} onClick={close} />
      <dialog
        open
        className={`panel ${wide ? "wide" : ""}`}
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panel}
      >
        <div className="panel-top">
          <span className="eyebrow">{title}</span>
          <button className="icon-button" aria-label="Close panel" onClick={close}>
            <X size={21} />
          </button>
        </div>
        {children}
      </dialog>
    </div>
  );
}
