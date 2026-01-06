"use server"

import { Resend } from "resend"
import * as z from "zod"
import type { FormData } from "next"

const resend = new Resend(process.env.RESEND_API_KEY)

const personalizationSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
})

export async function createPersonalizationAction(prevState: any, formData: FormData) {
  const validatedFields = personalizationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    }
  }

  const { firstName, lastName } = validatedFields.data

  try {
    const { data, error } = await resend.emails.send({
      from: "RocketOpp Lead <onboarding@resend.dev>", // IMPORTANT: This must be a verified domain on Resend
      to: ["Mike@rocketopp.com"],
      subject: "New Lead from RocketOpp Website",
      html: `
        <h1>New Personalization Lead</h1>
        <p>A new user has provided their details on the RocketOpp website.</p>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
      `,
    })

    if (error) {
      console.error("Resend Error:", error)
      return {
        message: "Failed to send email. Please try again later.",
        errors: {},
        success: false,
      }
    }

    return {
      message: `Thank you, ${firstName}! Your personalization has been submitted.`,
      errors: {},
      success: true,
    }
  } catch (error) {
    console.error("Email sending exception:", error)
    return {
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
      success: false,
    }
  }
}
