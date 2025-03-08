import Link from "next/link"
import { prisma } from "@/app/lib/prisma"
import { TestList } from "@/app/components/TestList"

interface Test {
  result: string;
  id: string;
  patientName: string;
  testType: string;
  testDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default async function Home() {
  const tests: Test[] = await prisma.diagnosticTest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Diagnostic Tests</h1>
        <Link
          href="/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add New Test
        </Link>
      </div>
      <TestList tests={tests} />
    </main>
  )
}
