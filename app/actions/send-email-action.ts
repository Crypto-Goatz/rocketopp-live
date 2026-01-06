"use server"

import { z } from "zod"
import type { FormData } from "next/server"

export interface PersonalizationEmailData {
  userName: string
  userEmail: string
  userPhone: string
  userTitle: string
  companyName: string
  industry: string
  zipCode: string
  primaryNeed: string
  hasWebsite: boolean
  websiteAddress?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}

const personalizationSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email("Valid email is required"),
  userPhone: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  userTitle: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  primaryNeed: z.string().min(1, "Primary need is required"),
  hasWebsite: z.boolean(),
  websiteAddress: z.string().optional(),
})

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

export async function sendPersonalizationEmail(formData: FormData) {
  try {
    // Parse form data
    const data = {
      userName: formData.get("userName") as string,
      userEmail: formData.get("userEmail") as string,
      userPhone: formData.get("userPhone") as string,
      userTitle: formData.get("userTitle") as string,
      companyName: formData.get("companyName") as string,
      industry: formData.get("industry") as string,
      zipCode: formData.get("zipCode") as string,
      primaryNeed: formData.get("primaryNeed") as string,
      hasWebsite: formData.get("hasWebsite") === "true",
      websiteAddress: formData.get("websiteAddress") as string,
    }

    // Validate data
    const validatedData = personalizationSchema.parse(data)

    // Log the data for now - replace with actual email service
    console.log("Personalization form submission:", {
      timestamp: new Date().toISOString(),
      recipient: "Mike@rocketopp.com",
      subject: `New AI Assessment Request from ${validatedData.userName}`,
      data: validatedData,
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Implement actual email sending using your preferred service
    // Example with Resend:
    // const { data: emailResult, error } = await resend.emails.send({
    //   from: 'noreply@rocketopp.com',
    //   to: 'Mike@rocketopp.com',
    //   subject: `New AI Assessment Request from ${validatedData.userName}`,
    //   html: generatePersonalizationEmailTemplate(validatedData)
    // })

    return { success: true, message: "Assessment request sent successfully!" }
  } catch (error) {
    console.error("Error sending personalization email:", error)
    return { success: false, message: "Failed to send assessment request. Please try again." }
  }
}

export async function sendContactFormEmail(formData: FormData) {
  try {
    // Parse form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    }

    // Validate data
    const validatedData = contactFormSchema.parse(data)

    // Log the data for now - replace with actual email service
    console.log("Contact form submission:", {
      timestamp: new Date().toISOString(),
      recipient: "Mike@rocketopp.com",
      subject: `New Contact Form Submission from ${validatedData.name}`,
      data: validatedData,
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Implement actual email sending using your preferred service
    // Example with Resend:
    // const { data: emailResult, error } = await resend.emails.send({
    //   from: 'noreply@rocketopp.com',
    //   to: 'Mike@rocketopp.com',
    //   subject: `New Contact Form Submission from ${validatedData.name}`,
    //   html: generateContactEmailTemplate(validatedData)
    // })

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}

// Helper function to generate email template for personalization data
function generatePersonalizationEmailTemplate(data: PersonalizationEmailData): string {
  return `
    <h2>New AI Assessment Request</h2>
    <p><strong>Name:</strong> ${data.userName}</p>
    <p><strong>Email:</strong> ${data.userEmail}</p>
    <p><strong>Phone:</strong> ${data.userPhone}</p>
    <p><strong>Title:</strong> ${data.userTitle}</p>
    <p><strong>Company:</strong> ${data.companyName}</p>
    <p><strong>Industry:</strong> ${data.industry}</p>
    <p><strong>Zip Code:</strong> ${data.zipCode}</p>
    <p><strong>Primary Need:</strong> ${data.primaryNeed}</p>
    <p><strong>Has Website:</strong> ${data.hasWebsite ? "Yes" : "No"}</p>
    ${data.websiteAddress ? `<p><strong>Website:</strong> ${data.websiteAddress}</p>` : ""}
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
  `
}

// Helper function to generate email template for contact form
function generateContactEmailTemplate(data: ContactFormData): string {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
  `
}
