import { motion } from "motion/react"
import { RefObject } from "react"

// Local dev assets
import localFrame from "../assets/video-gallery/iPhone 16 Pro.png"
import localVideo from "../assets/video-gallery/Test video.mp4"

interface IPhoneVideoCardProps {
  videoSrc?: string
  frameSrc?: string
  scale?: number
  index?: number
  videoRef?: RefObject<HTMLVideoElement>
}

export function IPhoneVideoCard({
  videoSrc = localVideo,
  frameSrc = localFrame,
  scale = 1,
  index,
  videoRef,
}: IPhoneVideoCardProps) {
  // Card dimensions
  const cardWidth = 408 * scale
  const cardHeight = 736 * scale

  // iPhone 16 Pro frame dimensions and screen positioning
  const frameWidth = 320 * scale
  const frameHeight = 654 * scale

  // Video dimensions (centered within frame)
  const videoWidth = 287 * scale
  const videoHeight = 623 * scale
  const videoLeft = ((320 - 287) / 2) * scale
  const videoTop = ((654 - 623) / 2) * scale

  const styles: Record<string, React.CSSProperties> = {
    card: {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: "#f2f2f2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32 * scale,
    },
    container: {
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
      borderRadius: `${40 * scale}px`,
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
  }

  return (
    <div style={styles.card}>
      {index !== undefined && <div style={styles.indexLabel}>{index}</div>}
      <motion.div style={styles.container}>
        <div style={styles.videoContainer}>
          <video
            ref={videoRef}
            style={styles.video}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
          />
        </div>
        {frameSrc && (
          <img src={frameSrc} alt="iPhone Frame" style={styles.frame} />
        )}
      </motion.div>
    </div>
  )
}
