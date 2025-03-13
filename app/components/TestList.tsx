"use client";

import { useRouter } from "next/navigation";

interface Test {
  id: string;
  patientName: string;
  testType: string;
  result: string;
  testDate: Date;
  notes?: string | null;
}

interface TestListProps {
  tests: Test[];
}

export function TestList({ tests }: TestListProps) {
  const router = useRouter();

  async function deleteTest(id: string) {
    if (!confirm("Are you sure you want to delete this test?")) return;
    console.log("Received  ID:", id);

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to delete test");

      if (response.status === 404) {
        alert(data.error || "Failed to delete test");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="space-y-4 flex  items-start gap-4">
      {tests.map((test) => (
        <div
          key={test.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow "
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{test.patientName}</h3>
              <p className="text-sm text-gray-500">{test.testType}</p>
              <p className="mt-2">Result: {test.result}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(test.testDate).toLocaleDateString()}
              </p>
              {test.notes && (
                <p className="mt-2 text-sm text-gray-600">{test.notes}</p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => router.push(`/edit/${test.id}`)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTest(test.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
