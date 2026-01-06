import type { Metadata } from "next"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code2, Smartphone, Cloud, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Custom App Development Services | Rocket Opp",
  description:
    "Rocket Opp develops robust, scalable, and user-friendly mobile and web applications tailored to your specific business needs and objectives.",
}

const appDevServices = [
  {
    title: "Mobile App Development (iOS & Android)",
    description: "Engage your users on the go with intuitive and powerful native or cross-platform mobile apps.",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
  },
  {
    title: "Web Application Development",
    description: "Complex, data-driven web applications that streamline operations and provide rich user experiences.",
    icon: <Code2 className="h-8 w-8 text-primary" />,
  },
  {
    title: "Cloud-Based Solutions",
    description: "Scalable and secure cloud applications that grow with your business and offer global accessibility.",
    icon: <Cloud className="h-8 w-8 text-primary" />,
  },
  {
    title: "API Development & Integration",
    description:
      "Connect your systems and enable seamless data flow with custom API development and third-party integrations.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
  },
]

export default function AppDevelopmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section
          className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10 relative"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-coding-mobile-app.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container text-center relative z-10">
            <Code2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Custom App Development</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your ideas into powerful digital solutions. Rocket Opp designs and develops custom mobile and
              web applications that drive engagement and efficiency.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Application Development Expertise</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {appDevServices.map((service) => (
                <div
                  key={service.title}
                  className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center text-center"
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-6">Our Development Lifecycle</h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              We employ an agile methodology to deliver high-quality applications efficiently:
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                {
                  stage: "1. Planning & Prototyping",
                  description: "Defining scope, features, and creating interactive prototypes.",
                },
                {
                  stage: "2. Design (UI/UX)",
                  description: "Crafting intuitive and visually appealing user interfaces.",
                },
                {
                  stage: "3. Development & Testing",
                  description: "Building the application with rigorous quality assurance.",
                },
                {
                  stage: "4. Deployment & Support",
                  description: "Launching your app and providing ongoing maintenance.",
                },
              ].map((item) => (
                <div key={item.stage} className="p-4 bg-card rounded-lg shadow">
                  <h3 className="text-2xl font-semibold text-primary mb-3">{item.stage.split(".")[0]}.</h3>
                  <h4 className="text-md font-medium mb-2">{item.stage.split(".")[1].trim()}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/#contact?service=app-development">Start Your App Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
