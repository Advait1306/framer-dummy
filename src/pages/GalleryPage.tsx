import { useState, useRef, useEffect } from "react"
import { motion } from "motion/react"

// Local dev assets
import localVideo from "../assets/video-gallery/Test video.mp4"
import localFrame from "../assets/video-gallery/iPhone 16 Pro.png"

console.log("GalleryPage module loaded")

export function GalleryPage() {
  console.log("GalleryPage rendering")

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

  const scale = 1
  const gap = 24
  const centerOffset = 0
  const videos = [localVideo, localVideo, localVideo, localVideo, localVideo]

  const cardWidth = 408 * scale
  const cardHeight = 736 * scale
  const frameWidth = 320 * scale
  const frameHeight = 654 * scale
  const videoWidth = 287 * scale
  const videoHeight = 623 * scale
  const videoLeft = ((320 - 287) / 2) * scale
  const videoTop = ((654 - 623) / 2) * scale

  // Control video playback
  useEffect(() => {
    console.log("[GalleryPage] Playback effect - isSpread:", isSpread, "activeIndex:", activeIndex)

    videoRefs.forEach((ref, index) => {
      const video = ref.current
      console.log(`[GalleryPage] Video ${index} ref:`, video ? "exists" : "null")

      if (!video) return

      if (isSpread && activeIndex === index) {
        console.log(`[GalleryPage] Playing video ${index}`)
        video.currentTime = 0
        video.play()
          .then(() => console.log(`[GalleryPage] Video ${index} started`))
          .catch((e) => console.log(`[GalleryPage] Play error:`, e))
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [isSpread, activeIndex])

  // Track progress
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

  // Handle video ended
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current
    if (!video) return

    const handleEnded = () => {
      console.log(`[GalleryPage] Video ${activeIndex} ended`)
      setActiveIndex((prev) => (prev + 1) % 5)
      setProgress(0)
    }

    video.addEventListener("ended", handleEnded)
    return () => video.removeEventListener("ended", handleEnded)
  }, [activeIndex])

  const initialPositions = [
    { x: centerOffset, y: -12, rotate: 0, zIndex: 5 },
    { x: centerOffset - 57, y: 0, rotate: -3, zIndex: 4 },
    { x: centerOffset + 57, y: 0, rotate: 4, zIndex: 3 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 2 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 1 },
  ]

  const spreadPositions = [
    { x: -1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 5 },
    { x: 0, y: 0, rotate: 0, zIndex: 4 },
    { x: 1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 3 },
    { x: 2 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 2 },
    { x: 3 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 1 },
  ]

  const styles: Record<string, React.CSSProperties> = {
    page: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "#1a1a1a",
    },
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
    card: {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: "#f2f2f2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32 * scale,
    },
    phoneContainer: {
      position: "relative",
      width: frameWidth,
      height: frameHeight,
    },
    frame: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 2,
      pointerEvents: "none",
    },
    videoContainer: {
      position: "absolute",
      top: videoTop,
      left: videoLeft,
      width: videoWidth,
      height: videoHeight,
      borderRadius: 40 * scale,
      overflow: "hidden",
      backgroundColor: "#000",
      zIndex: 1,
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    indexLabel: {
      position: "absolute",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 48 * scale,
      fontWeight: 700,
      color: "#000",
      zIndex: 10,
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
    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      cursor: "pointer",
    },
    activeIndicator: {
      position: "relative",
      width: 48,
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
    <div style={styles.page}>
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
                x: isSpread ? spreadPositions[index].x : initialPositions[index].x,
                y: isSpread ? spreadPositions[index].y : initialPositions[index].y,
                rotate: isSpread ? spreadPositions[index].rotate : initialPositions[index].rotate,
              }}
              transition={{
                type: "spring",
                stiffness: 97,
                damping: 16,
                mass: 1.1,
                delay: isSpread ? index * 0.05 : (4 - index) * 0.05,
              }}
            >
              <div style={styles.card}>
                <div style={styles.indexLabel}>{index + 1}</div>
                <div style={styles.phoneContainer}>
                  <div style={styles.videoContainer}>
                    <video
                      ref={videoRefs[index]}
                      style={styles.video}
                      src={videos[index]}
                      muted
                      playsInline
                      preload="auto"
                    />
                  </div>
                  <img src={localFrame} alt="iPhone Frame" style={styles.frame} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={styles.controller}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              style={activeIndex === index ? styles.activeIndicator : styles.indicator}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(index)
                setProgress(0)
              }}
            >
              {activeIndex === index && (
                <div style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
