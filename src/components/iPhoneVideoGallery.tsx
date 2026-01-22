import { motion } from "motion/react"
import { useState, useRef, useEffect } from "react"
import { IPhoneVideoCard } from "./iPhoneVideoCard"

// Local dev assets (served from public folder)
const localVideo = "/assets/video-gallery/Test video.mp4"

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

console.log("IPhoneVideoGallery module loaded")

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Refs for all 5 video elements
  const videoRef0 = useRef<HTMLVideoElement>(null)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoRef3 = useRef<HTMLVideoElement>(null)
  const videoRef4 = useRef<HTMLVideoElement>(null)
  const videoRefs = [videoRef0, videoRef1, videoRef2, videoRef3, videoRef4]

  const cardWidth = 408 * scale
  const videos = [video1, video2, video3, video4, video5]

  // Log refs on every render
  console.log("[Gallery] Render - refs:", videoRefs.map((r, i) => `${i}:${r.current ? "yes" : "no"}`).join(", "))

  // Control video playback
  useEffect(() => {
    console.log("[Gallery] Playback effect running, isSpread:", isSpread, "activeIndex:", activeIndex)
    console.log("[Gallery] Refs in effect:", videoRefs.map((r, i) => `${i}:${r.current ? "yes" : "no"}`).join(", "))

    videoRefs.forEach((ref, index) => {
      const video = ref.current
      if (!video) {
        console.log(`[Gallery] Video ${index} ref is NULL`)
        return
      }

      if (isSpread && activeIndex === index) {
        console.log(`[Gallery] Playing video ${index}, src:`, video.src)
        video.currentTime = 0
        video.play()
          .then(() => console.log(`[Gallery] Video ${index} started playing`))
          .catch((e) => console.log(`[Gallery] Play error for video ${index}:`, e))
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [isSpread, activeIndex])

  // Track progress of active video
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration)
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [activeIndex])

  // Handle video ended - advance to next
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current
    if (!video) return

    const handleEnded = () => {
      console.log(`[Gallery] Video ${activeIndex + 1} ended, advancing to next`)
      setActiveIndex((prev) => (prev + 1) % 5)
      setProgress(0)
    }

    video.addEventListener("ended", handleEnded)
    return () => video.removeEventListener("ended", handleEnded)
  }, [activeIndex])

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
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    cardsArea: {
      position: "relative",
      flex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    cardWrapper: {
      position: "absolute",
    },
    controller: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      backgroundColor: "#3a3a3c",
      borderRadius: 30,
      padding: "12px 20px",
      marginBottom: 40,
    },
    indicatorBase: {
      position: "relative",
      height: 10,
      borderRadius: 5,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      overflow: "hidden",
      cursor: "pointer",
    },
    progressFill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 5,
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.cardsArea} onClick={() => setIsSpread(!isSpread)}>
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
            <IPhoneVideoCard
              videoRef={videoRefs[index]}
              scale={scale}
              index={index + 1}
              videoSrc={videos[index]}
            />
          </motion.div>
        ))}
      </div>

      <div style={styles.controller}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            style={styles.indicatorBase}
            animate={{
              width: activeIndex === index ? 48 : 10,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex(index)
              setProgress(0)
            }}
          >
            <motion.div
              style={styles.progressFill}
              animate={{
                width: activeIndex === index ? `${progress * 100}%` : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
