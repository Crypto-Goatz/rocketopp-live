import type React from "react"
import type { Metadata } from "next/types"
import type { RocketClientsClient } from "@/types/rocket-clients"
import { notFound } from "next/navigation"
import Image from "next/image"

type Props = {
  params: Promise<{
    clientId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params

  const client: RocketClientsClient | undefined = {
    id: clientId,
    name: `Client ${clientId}`,
    logo: "/generic-company-logo.png",
    description: `Description for Client ${clientId}`,
    website: "https://example.com",
  }

  if (!client) {
    return {
      title: "Client Not Found",
    }
  }

  return {
    title: client.name,
    description: client.description,
  }
}

const RocketClientsClientPage: React.FC<Props> = async ({ params }) => {
  const { clientId } = await params

  const client: RocketClientsClient | undefined = {
    id: clientId,
    name: `Client ${clientId}`,
    logo: "/generic-company-logo.png",
    description: `Description for Client ${clientId}`,
    website: "https://example.com",
  }

  if (!client) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Visit Website
        </a>
      </div>
      <div className="flex">
        <div className="w-1/4">
          <Image
            src={client.logo || "/placeholder.svg"}
            alt={`${client.name} Logo`}
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <div className="w-3/4 pl-4">
          <p>{client.description}</p>
        </div>
      </div>
    </div>
  )
}

export default RocketClientsClientPage
