"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ease } from "@/components/motion";

export default function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  caption,
}: {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  caption?: (i: number) => string;
}) {
  const open = index !== null;
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grain fixed inset-0 z-[100] flex flex-col bg-ink text-white"
        >
          <div className="relative flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <p className="flex min-w-0 items-center gap-4">
              <span className="font-display text-2xl tabular-nums">
                {String(index + 1).padStart(2, "0")} <span className="text-white/40">/ {String(images.length).padStart(2, "0")}</span>
              </span>
              {caption && (
                <span className="hidden min-w-0 items-center gap-2 text-sm text-white/65 sm:flex">
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-300" />
                  <span className="truncate">{caption(index)}</span>
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-brass-300 hover:bg-brass-300 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                className="absolute inset-x-0 inset-y-5 px-4 sm:px-24"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={images[index].src}
                    alt={images[index].alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    className="pointer-events-none object-contain"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/40 backdrop-blur-md transition-colors hover:border-brass-300 hover:bg-brass-300 hover:text-ink sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/40 backdrop-blur-md transition-colors hover:border-brass-300 hover:bg-brass-300 hover:text-ink sm:flex"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="no-scrollbar relative flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-4 sm:px-8">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                ref={i === index ? (el) => el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }) : undefined}
                onClick={() => onIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden transition-opacity ${i === index ? "opacity-100 ring-1 ring-brass-300" : "opacity-40 hover:opacity-80"}`}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
