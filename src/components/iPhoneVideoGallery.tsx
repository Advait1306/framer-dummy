import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { IPhoneVideoCard } from "./iPhoneVideoCard";

// Local dev assets (served from public folder)
const localVideo = "/assets/video-gallery/Test video.mp4";

interface IPhoneVideoGalleryProps {
  gap?: number;
  scale?: number;
  centerOffset?: number;
  enterThreshold?: number;
  exitThreshold?: number;
  frameSrc?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
}


export function IPhoneVideoGallery({
  gap = 24,
  scale = 1,
  centerOffset = 0,
  enterThreshold = 0.8,
  exitThreshold = 0.4,
  frameSrc,
  video1 = localVideo,
  video2 = localVideo,
  video3 = localVideo,
  video4 = localVideo,
  video5 = localVideo,
}: IPhoneVideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Controller intro animation phases: "circle" | "expanded" | "visible"
  const [controllerPhase, setControllerPhase] = useState<
    "circle" | "expanded" | "visible"
  >("circle");

  // Custom in-view state with hysteresis (different enter/exit thresholds)
  const [isInView, setIsInView] = useState(false);
  const isInViewRef = useRef(false);

  // Separate state for visual animations (delays collapse until scroll completes)
  const [isExpanded, setIsExpanded] = useState(false);

  // Track if anchor controller is visible (to switch from fixed to anchor)
  const [useFixedController, setUseFixedController] = useState(true);
  const anchorControllerRef = useRef<HTMLDivElement>(null);

  // Ref for viewport detection
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for all 5 video elements
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1, videoRef2, videoRef3, videoRef4];

  // Refs for card wrappers (for scrolling into view)
  const cardRef0 = useRef<HTMLDivElement>(null);
  const cardRef1 = useRef<HTMLDivElement>(null);
  const cardRef2 = useRef<HTMLDivElement>(null);
  const cardRef3 = useRef<HTMLDivElement>(null);
  const cardRef4 = useRef<HTMLDivElement>(null);
  const cardRefs = [cardRef0, cardRef1, cardRef2, cardRef3, cardRef4];

  // Ref for scroll container (horizontal scroll only)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 408 * scale;
  const videos = [video1, video2, video3, video4, video5];

  // Control video playback and scroll active card into view
  useEffect(() => {
    videoRefs.forEach((ref, index) => {
      const video = ref.current;
      if (!video) return;

      if (isInView && activeIndex === index) {
        video.currentTime = 0;
        video.play().catch(() => {});

        // Scroll the active card into view (horizontal only)
        const card = cardRefs[index]?.current;
        const scrollContainer = scrollContainerRef.current;
        if (card && scrollContainer) {
          const cardRect = card.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const scrollLeft =
            scrollContainer.scrollLeft +
            (cardRect.left - containerRect.left) -
            (containerRect.width - cardRect.width) / 2;
          scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [isInView, activeIndex]);

  // Track progress of active video using requestAnimationFrame for smooth updates
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current;
    if (!video) return;

    let animationId: number;

    const updateProgress = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
      }
      animationId = requestAnimationFrame(updateProgress);
    };

    animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [activeIndex]);

  // Handle video ended - advance to next
  useEffect(() => {
    const video = videoRefs[activeIndex]?.current;
    if (!video) return;

    const handleEnded = () => {
      setActiveIndex((prev) => (prev + 1) % 5);
      setProgress(0);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [activeIndex]);

  // Handle expand/collapse transitions with proper sequencing
  useEffect(() => {
    if (isInView) {
      // Expand immediately when entering view
      setIsExpanded(true);
    } else {
      // When leaving: first scroll, then collapse after scroll completes
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
      // Delay collapse to allow scroll animation to complete (~300ms)
      const collapseTimer = setTimeout(() => {
        setIsExpanded(false);
      }, 300);
      return () => clearTimeout(collapseTimer);
    }
  }, [isInView]);

  // Controller intro animation sequence - starts when expanded, resets when collapsed
  useEffect(() => {
    if (!isExpanded) {
      // Reset to initial state when collapsed
      setControllerPhase("circle");
      setActiveIndex(0);
      setProgress(0);
      return;
    }

    // Phase 1 -> 2: After scale animation completes (0 -> 1.2 -> 1 takes ~600ms)
    const expandTimer = setTimeout(() => {
      setControllerPhase("expanded");
    }, 600);

    // Phase 2 -> 3: After width expansion (~300ms after phase 2)
    const visibleTimer = setTimeout(() => {
      setControllerPhase("visible");
    }, 900);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(visibleTimer);
    };
  }, [isExpanded]);

  // Track scroll to switch between fixed and anchor controller
  useEffect(() => {
    const checkControllerPosition = () => {
      const anchor = anchorControllerRef.current;
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const fixedBottomOffset = 40;
      const anchorPaddingTop = 40;

      // Fixed controller top position from viewport top
      const fixedControllerTop = viewportHeight - fixedBottomOffset - controllerHeight;

      // Anchor's actual controller pill is anchorPaddingTop below the wrapper's top
      const anchorControllerTop = anchorRect.top + anchorPaddingTop;

      // Switch to anchor when anchor's pill reaches the fixed controller's position
      const shouldUseAnchor = anchorControllerTop <= fixedControllerTop;

      setUseFixedController(!shouldUseAnchor);
    };

    window.addEventListener("scroll", checkControllerPosition, { passive: true });
    window.addEventListener("resize", checkControllerPosition, { passive: true });
    checkControllerPosition(); // Initial check

    return () => {
      window.removeEventListener("scroll", checkControllerPosition);
      window.removeEventListener("resize", checkControllerPosition);
    };
  }, []);

  // Track scroll to manage in-view state with hysteresis
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Skip if container has no height yet
      if (rect.height === 0) return;

      // Calculate how much of the container is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / rect.height;

      // Hysteresis: use different thresholds for entering vs exiting
      let newIsInView = isInViewRef.current;
      if (!isInViewRef.current && visibleRatio >= enterThreshold) {
        newIsInView = true;
      } else if (isInViewRef.current && visibleRatio < exitThreshold) {
        newIsInView = false;
      }

      if (newIsInView !== isInViewRef.current) {
        isInViewRef.current = newIsInView;
        setIsInView(newIsInView);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [enterThreshold, exitThreshold]);

  // Initial bunched positions (relative to centerOffset line)
  const initialPositions = [
    { x: centerOffset, y: -12, rotate: 0, zIndex: 5 },
    { x: centerOffset - 57, y: 0, rotate: -3, zIndex: 4 },
    { x: centerOffset + 57, y: 0, rotate: 4, zIndex: 3 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 2 },
    { x: centerOffset, y: 0, rotate: 0, zIndex: 1 },
  ];

  // Spread positions (centered, no offset)
  const spreadPositions = [
    { x: -1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 5 },
    { x: 0, y: 0, rotate: 0, zIndex: 4 },
    { x: 1 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 3 },
    { x: 2 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 2 },
    { x: 3 * (cardWidth + gap), y: 0, rotate: 0, zIndex: 1 },
  ];

  // Calculate inner container width to fit all spread cards
  // Spread goes from -1*(cardWidth+gap) to 3*(cardWidth+gap), plus half card on each side
  const innerWidth = 5 * cardWidth + 4 * gap;

  // Controller dimensions for intro animation
  // Height: indicator (10px) + padding (12px * 2) = 34px
  const controllerHeight = 34;
  // Final width: padding (20px * 2) + 5 indicators (4*10 + 48) + 4 gaps (4*12) = 176px
  const controllerFinalWidth = 176;

  const styles: Record<string, React.CSSProperties> = {
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflowX: "hidden",
      overflowY: "visible",
    },
    scrollContainer: {
      width: "100%",
      flex: 1,
      minHeight: 0,
      overflowX: "hidden",
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
    fixedControllerWrapper: {
      position: "fixed",
      bottom: 40,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
    },
    anchorControllerWrapper: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 40,
      paddingBottom: 40,
    },
    controller: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      backgroundColor: "#3a3a3c",
      borderRadius: 30,
      padding: "12px 20px",
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
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <div ref={scrollContainerRef} style={styles.scrollContainer}>
        <div style={styles.cardsArea}>
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              ref={cardRefs[index]}
              style={{
                ...styles.cardWrapper,
                zIndex: isExpanded
                  ? spreadPositions[index].zIndex
                  : initialPositions[index].zIndex,
              }}
              initial={{
                x: initialPositions[index].x,
                y: initialPositions[index].y,
                rotate: initialPositions[index].rotate,
              }}
              animate={{
                x: isExpanded
                  ? spreadPositions[index].x
                  : initialPositions[index].x,
                y: isExpanded
                  ? spreadPositions[index].y
                  : initialPositions[index].y,
                rotate: isExpanded
                  ? spreadPositions[index].rotate
                  : initialPositions[index].rotate,
              }}
              transition={{
                type: "spring",
                stiffness: 97,
                damping: 16,
                mass: 1.1,
                delay: isExpanded ? index * 0.05 : (4 - index) * 0.05,
              }}
            >
              <IPhoneVideoCard
                videoRef={videoRefs[index]}
                scale={scale}
                index={index + 1}
                videoSrc={videos[index]}
                frameSrc={frameSrc}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed controller - visible when anchor is out of viewport */}
      <div
        style={{
          ...styles.fixedControllerWrapper,
          visibility: useFixedController ? "visible" : "hidden",
        }}
      >
        <motion.div
          style={styles.controller}
          initial={{
            width: controllerHeight,
            scale: 0,
          }}
          animate={
            isExpanded
              ? {
                  width:
                    controllerPhase === "circle"
                      ? controllerHeight
                      : controllerFinalWidth,
                  scale: controllerPhase === "circle" ? [0, 1.2, 1] : 1,
                }
              : {
                  width: controllerHeight,
                  scale: 0,
                }
          }
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
                e.stopPropagation();
                setActiveIndex(index);
                setProgress(0);
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

      {/* Anchor controller - visible when it's in viewport */}
      <div
        ref={anchorControllerRef}
        style={{
          ...styles.anchorControllerWrapper,
          visibility: useFixedController ? "hidden" : "visible",
        }}
      >
        <motion.div
          style={styles.controller}
          initial={{
            width: controllerHeight,
            scale: 0,
          }}
          animate={
            isExpanded
              ? {
                  width:
                    controllerPhase === "circle"
                      ? controllerHeight
                      : controllerFinalWidth,
                  scale: controllerPhase === "circle" ? [0, 1.2, 1] : 1,
                }
              : {
                  width: controllerHeight,
                  scale: 0,
                }
          }
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
                e.stopPropagation();
                setActiveIndex(index);
                setProgress(0);
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
    </div>
  );
}
