import { useMemo } from "react"
import { motion } from "motion/react";
import { cn } from "@/lib/utils"

export function TextReveal({
  text,
  mode = "letter",
  as = "span",
  delay = 0.1,
  stagger = 0.025,
  duration = 0.5,
  blur = "8px",
  y = 0,
  once = true,
  className,
  ...props
}) {
  // Memoize variants to prevent unnecessary recalculations on re-render
  const childVariants = useMemo(() => {
    return {
      hidden: {
        opacity: 0,
        filter: `blur(${blur})`,
        y: y,
      },
      visible: (i) => ({
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration: duration,
          delay: delay + i * stagger,
          ease: "easeOut",
        },
      }),
    };
  }, [blur, y, duration, delay, stagger])

  const parentVariants = useMemo(() => {
    return {
      hidden: {},
      visible: {},
    }
  }, [])

  const words = useMemo(() => text.split(" "), [text])

  // Get the motion tag dynamically
  const MotionComponent = motion[as]

  let charIndex = 0

  return (
    <MotionComponent
      variants={parentVariants}
      initial={props.initial ?? "hidden"}
      whileInView={props.whileInView ?? "visible"}
      viewport={props.viewport ?? { once, amount: 0.2 }}
      className={cn("inline-block", className)}
      {...props}>
      {mode === "letter"
        ? words.map((word, wordIdx) => {
          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIdx) => {
                const idx = charIndex++
                return (
                  <motion.span
                    key={charIdx}
                    custom={idx}
                    variants={childVariants}
                    className="inline-block">
                    {char}
                  </motion.span>
                );
              })}
              {wordIdx < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })
        : words.map((word, wordIdx) => {
          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              <motion.span custom={wordIdx} variants={childVariants} className="inline-block">
                {word}
              </motion.span>
              {wordIdx < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
    </MotionComponent>
  );
}

const TextRevealMotion = ({ text }) => {
  return (
    <TextReveal
      text={text}
      as="p"
      className="text-xl sm:text-2xl" />
  );
}

export default TextRevealMotion