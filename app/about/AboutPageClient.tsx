"use client"
import Image from "next/image"

const AboutPageClient = () => {
  return (
    <section className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We are a team of passionate individuals dedicated to providing high-quality services and products. Our
            mission is to help our customers achieve their goals by offering innovative solutions and exceptional
            support.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            With years of experience in the industry, we have developed a deep understanding of our customers' needs and
            challenges. We are committed to continuous improvement and strive to exceed expectations in everything we
            do.
          </p>
        </div>
        <div className="relative w-full h-[300px]">
          <Image src="/professional-team-working-on-ai-technology.jpg" alt="About Us" fill className="rounded-lg shadow-md object-cover" />
        </div>
      </div>
    </section>
  )
}

export default AboutPageClient
