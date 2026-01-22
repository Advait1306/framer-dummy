import { motion } from "motion/react"
import { useState } from "react"
import { IPhoneVideoCard } from "./iPhoneVideoCard"

// Local dev assets
import localVideo from "../assets/video-gallery/Test video.mp4"

interface IPhoneVideoGalleryProps {
  gap?: number
  scale?: number
  centerOffset?: number
  video1?: string
  video2?: string
  video3?: string
  video4?: string
  video5?: string
}

export function IPhoneVideoGallery({
  gap = 24,
  scale = 1,
  centerOffset = 0,
  video1 = localVideo,
  video2 = localVideo,
  video3 = localVideo,
  video4 = localVideo,
  video5 = localVideo,
}: IPhoneVideoGalleryProps) {
  const [isSpread, setIsSpread] = useState(false)

  const cardWidth = 408 * scale
  const videos = [video1, video2, video3, video4, video5]

  // Initial bunched positions (relative to centerOffset line)
  const initialPositions = [
    { x: centerOffset, y: -12, rotate: 0, zIndex: 5 },
    { x: centerOffset - 57, y: 0, rotate: -3, zIndex: 4 },
    { x: centerOffset + 57, y: 0, rotate: 4, zIndex: 3 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 2 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 1 },
  ]

  // Spread positions (centered, no offset)
  const spreadPositions = [
    { x: -1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 5 },
    { x: 0, y: 0, rotate: 0, zIndex: 4 },
    { x: 1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 3 },
    { x: 2 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 2 },
    { x: 3 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 1 },
  ]

  const styles: Record<string, React.CSSProperties> = {
    container: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      height: 736 * scale,
      width: "100%",
    },
    cardWrapper: {
      position: "absolute",
    },
  }

  return (
    <div style={styles.container} onClick={() => setIsSpread(!isSpread)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          style={{
            ...styles.cardWrapper,
            zIndex: isSpread
              ? spreadPositions[index].zIndex
              : initialPositions[index].zIndex,
          }}
          initial={{
            x: initialPositions[index].x,
            y: initialPositions[index].y,
            rotate: initialPositions[index].rotate,
          }}
          animate={{
            x: isSpread
              ? spreadPositions[index].x
              : initialPositions[index].x,
            y: isSpread
              ? spreadPositions[index].y
              : initialPositions[index].y,
            rotate: isSpread
              ? spreadPositions[index].rotate
              : initialPositions[index].rotate,
          }}
          transition={{
            type: "spring",
            stiffness: 97,
            damping: 16,
            mass: 1.1,
            delay: isSpread ? index * 0.05 : (4 - index) * 0.05,
          }}
        >
          <IPhoneVideoCard scale={scale} index={index + 1} videoSrc={videos[index]} />
        </motion.div>
      ))}
    </div>
  )
}
