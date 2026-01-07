"use client"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/utils/motion"
import { TypingText } from "@/components/typing-text"
import { Globe, Cpu, Megaphone, Code, Zap, BarChart3 } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Globe,
    title: "Website Design",
    description: "Custom, responsive websites that captivate visitors and drive conversions.",
    href: "/services/website-design",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description: "Transform your business with enterprise-level AI solutions.",
    href: "/services/ai-integration",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that deliver measurable results.",
    href: "/services/web-marketing",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Code,
    title: "App Development",
    description: "Custom applications built for performance and scalability.",
    href: "/services/app-development",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Streamline operations with intelligent workflow automation.",
    href: "/services/automation",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: BarChart3,
    title: "SEO Services",
    description: "Dominate search rankings with expert optimization strategies.",
    href: "/services/website-development/seo-services",
    color: "from-indigo-500 to-violet-500",
  },
]

const ServicesPageClient = () => {
  return (
    <section className="sm:p-16 xs:p-8 py-12 max-w-7xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="2xl:max-w-[1280px] w-full mx-auto flex flex-col"
      >
        <TypingText title="| Our Services" textStyles="text-center" />

        <motion.p
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="mt-[8px] font-normal text-[20px] text-center text-secondary-white"
        >
          Enterprise-level technology solutions at 90% less than industry standard.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.title} variants={fadeIn("up", "tween", 0.3 + index * 0.1, 1)}>
              <Link href={service.href}>
                <div className="flex flex-col p-6 card-lifted-xl h-full">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default ServicesPageClient
