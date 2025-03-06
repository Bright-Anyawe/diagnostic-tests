import { TestForm } from "../components/TestForm"

export default function NewTestPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Add New Diagnostic Test</h1>
      <TestForm mode="create" />
    </main>
  )
} 