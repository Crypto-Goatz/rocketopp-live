"use client"
// Typing text animation component
import { motion } from "framer-motion"
import { textVariant } from "@/utils/motion"

interface TypingTextProps {
  title: string
  textStyles?: string
}

export const TypingText = ({ title, textStyles }: TypingTextProps) => (
  <motion.p variants={textVariant(0.5)} className={`font-normal text-[14px] text-secondary-white ${textStyles}`}>
    {title.split("").map((char, index) => (
      <motion.span key={index} variants={textVariant(index * 0.05)}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </motion.p>
)

export default TypingText
