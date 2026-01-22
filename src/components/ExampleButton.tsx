import { motion } from "motion/react"
import { useState } from "react"

/**
 * FRAMER-COMPATIBLE COMPONENT
 *
 * To use in Framer:
 * 1. Create a new Code Component in Framer
 * 2. Copy this entire file's content
 * 3. Paste into the Framer code editor
 *
 * Available props (configure in Framer's property controls):
 * - label: Button text
 * - variant: "primary" | "secondary"
 */

interface ExampleButtonProps {
  label?: string
  variant?: "primary" | "secondary"
  onClick?: () => void
}

export function ExampleButton({
  label = "Button",
  variant = "primary",
  onClick,
}: ExampleButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyles: React.CSSProperties = {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: isHovered ? "#0052cc" : "#0066ff",
      color: "#ffffff",
    },
    secondary: {
      backgroundColor: isHovered ? "#e0e0e0" : "#f0f0f0",
      color: "#1a1a1a",
    },
  }

  return (
    <motion.button
      style={{ ...baseStyles, ...variantStyles[variant] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}
