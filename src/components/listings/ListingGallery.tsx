"use client";
import { useState } from "react";
import { Box, IconButton, Modal, Skeleton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [direction, setDirection] = useState(1);

  function navigate(dir: number) {
    setDirection(dir);
    setActiveIndex((i) => (i + dir + images.length) % images.length);
  }

  return (
    <>
      {/* Main gallery grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 1,
          borderRadius: 2,
          overflow: "hidden",
          height: { xs: 280, md: 480 },
        }}
      >
        {/* Main image */}
        <Box
          sx={{
            position: "relative",
            cursor: "zoom-in",
            gridRow: images.length > 1 ? "1 / 3" : "1",
          }}
          onClick={() => {
            setActiveIndex(0);
            setLightboxOpen(true);
          }}
        >
          <Image
            src={images[0]}
            alt={`${title} – photo 1`}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </Box>

        {/* Thumbnails */}
        {images.slice(1, 3).map((src, i) => (
          <Box
            key={src}
            sx={{ position: "relative", cursor: "zoom-in" }}
            onClick={() => {
              setActiveIndex(i + 1);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={src}
              alt={`${title} – photo ${i + 2}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            {i === 1 && images.length > 3 && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                +{images.length - 3}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Lightbox */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "95vw", md: "85vw" },
            height: { xs: "70vh", md: "85vh" },
            outline: "none",
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0 }}
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} – photo ${activeIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="90vw"
              />
            </motion.div>
          </AnimatePresence>

          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{ position: "absolute", top: -48, right: 0, color: "white" }}
            aria-label="Close gallery"
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            }}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(1)}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            }}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: -32,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => {
                  setDirection(i > activeIndex ? 1 : -1);
                  setActiveIndex(i);
                }}
                sx={{
                  width: i === activeIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor:
                    i === activeIndex
                      ? "secondary.main"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
              />
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
