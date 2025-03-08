import { notFound } from "next/navigation"
import { TestForm } from "../../components/TestForm"
import { prisma } from "@/app/lib/prisma"

interface EditTestPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTestPage({ params }: EditTestPageProps) {
  const { id } = await params 
  
  const test = await prisma.diagnosticTest.findUnique({
    where: { id },
  })

  if (!test) notFound()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Edit Diagnostic Test</h1>
      <TestForm mode="edit" test={test} />
    </main>
  )
}
