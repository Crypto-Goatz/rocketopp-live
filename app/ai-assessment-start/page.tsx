"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Image from "next/image"

const AiAssessmentStartPage = () => {
  const { toast } = useToast()

  return (
    <div className="container mx-auto p-4">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>AI Assessment</CardTitle>
          <CardDescription>Start your AI-powered assessment here.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center">
            <Image src="/images/rocketopp-logo.png" alt="RocketOpp Logo" width={200} height={100} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Your Email" type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={() =>
              toast({
                title: "Assessment Started!",
                description: "You've started the AI assessment.",
                action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
              })
            }
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AiAssessmentStartPage
