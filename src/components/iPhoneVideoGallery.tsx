import { motion, useInView } from "motion/react"
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Controller intro animation phases: "circle" | "expanded" | "visible"
  const [controllerPhase, setControllerPhase] = useState<"circle" | "expanded" | "visible">("circle")

  // Ref for viewport detection
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  // Refs for all 5 video elements
  const videoRef0 = useRef<HTMLVideoElement>(null)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoRef3 = useRef<HTMLVideoElement>(null)
  const videoRef4 = useRef<HTMLVideoElement>(null)
  const videoRefs = [videoRef0, videoRef1, videoRef2, videoRef3, videoRef4]

  // Refs for card wrappers (for scrolling into view)
  const cardRef0 = useRef<HTMLDivElement>(null)
  const cardRef1 = useRef<HTMLDivElement>(null)
  const cardRef2 = useRef<HTMLDivElement>(null)
  const cardRef3 = useRef<HTMLDivElement>(null)
  const cardRef4 = useRef<HTMLDivElement>(null)
  const cardRefs = [cardRef0, cardRef1, cardRef2, cardRef3, cardRef4]

  const cardWidth = 408 * scale
  const videos = [video1, video2, video3, video4, video5]

  // Control video playback and scroll active card into view
  useEffect(() => {
    videoRefs.forEach((ref, index) => {
      const video = ref.current
      if (!video) {
        console.log(`[Gallery] Video ${index} ref is NULL`)
        return
      }

      if (isInView && activeIndex === index) {
        console.log(`[Gallery] Playing video ${index}, src:`, video.src)
        video.currentTime = 0
        video.play()
          .then(() => console.log(`[Gallery] Video ${index} started playing`))
          .catch((e) => console.log(`[Gallery] Play error for video ${index}:`, e))

        // Scroll the active card into view
        const card = cardRefs[index]?.current
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [isInView, activeIndex])

  // Track progress of active video using requestAnimationFrame for smooth updates
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current
    if (!video) return

    let animationId: number

    const updateProgress = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration)
      }
      animationId = requestAnimationFrame(updateProgress)
    }

    animationId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationId)
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

  // Controller intro animation sequence - only starts when in view
  useEffect(() => {
    if (!isInView) return

    // Phase 1 -> 2: After scale animation completes (0 -> 1.2 -> 1 takes ~600ms)
    const expandTimer = setTimeout(() => {
      setControllerPhase("expanded")
    }, 600)

    // Phase 2 -> 3: After width expansion (~300ms after phase 2)
    const visibleTimer = setTimeout(() => {
      setControllerPhase("visible")
    }, 900)

    return () => {
      clearTimeout(expandTimer)
      clearTimeout(visibleTimer)
    }
  }, [isInView])

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

  // Calculate inner container width to fit all spread cards
  // Spread goes from -1*(cardWidth+gap) to 3*(cardWidth+gap), plus half card on each side
  const innerWidth = 5 * cardWidth + 4 * gap

  // Controller dimensions for intro animation
  // Height: indicator (10px) + padding (12px * 2) = 34px
  const controllerHeight = 34
  // Final width: padding (20px * 2) + 5 indicators (4*10 + 48) + 4 gaps (4*12) = 176px
  const controllerFinalWidth = 176

  const styles: Record<string, React.CSSProperties> = {
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    scrollContainer: {
      width: "100%",
      flex: 1,
      minHeight: 0,
      overflowX: "scroll",
      overflowY: "visible",
    },
    cardsArea: {
      position: "relative",
      width: innerWidth,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardWrapper: {
      position: "absolute",
    },
    controller: {
      position: "absolute",
      bottom: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      backgroundColor: "#3a3a3c",
      borderRadius: 30,
      padding: "12px 20px",
      marginBottom: 40,
      overflow: "hidden",
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
    <div ref={containerRef} style={styles.container}>
      <div style={styles.scrollContainer}>
        <div style={styles.cardsArea}>
          {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            ref={cardRefs[index]}
            style={{
              ...styles.cardWrapper,
              zIndex: isInView
                ? spreadPositions[index].zIndex
                : initialPositions[index].zIndex,
            }}
            initial={{
              x: initialPositions[index].x,
              y: initialPositions[index].y,
              rotate: initialPositions[index].rotate,
            }}
            animate={{
              x: isInView
                ? spreadPositions[index].x
                : initialPositions[index].x,
              y: isInView
                ? spreadPositions[index].y
                : initialPositions[index].y,
              rotate: isInView
                ? spreadPositions[index].rotate
                : initialPositions[index].rotate,
            }}
            transition={{
              type: "spring",
              stiffness: 97,
              damping: 16,
              mass: 1.1,
              delay: isInView ? index * 0.05 : (4 - index) * 0.05,
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
      </div>

      <motion.div
        style={styles.controller}
        initial={{
          width: controllerHeight,
          scale: 0,
        }}
        animate={isInView ? {
          width: controllerPhase === "circle" ? controllerHeight : controllerFinalWidth,
          scale: controllerPhase === "circle" ? [0, 1.2, 1] : 1,
        } : {
          width: controllerHeight,
          scale: 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 25 },
          scale: { duration: 0.5, times: [0, 0.6, 1] },
        }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            style={styles.indicatorBase}
            animate={{
              width: activeIndex === index ? 48 : 10,
              opacity: controllerPhase === "visible" ? 1 : 0,
            }}
            transition={{
              width: { type: "spring", stiffness: 300, damping: 25 },
              opacity: { duration: 0.2 },
            }}
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex(index)
              setProgress(0)
            }}
          >
            <div
              style={{
                ...styles.progressFill,
                width: activeIndex === index ? `${progress * 100}%` : "0%",
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
