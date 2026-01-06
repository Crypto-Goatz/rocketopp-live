import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
      <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Crafting Your Custom AI Assessment...
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Our AI is analyzing your information to build a personalized strategy for RocketOpp. This might take a moment.
      </p>
    </div>
  )
}
