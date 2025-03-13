"use client";

import { useState } from "react";
import { TestSchema } from "@/app/lib/validations/test";
import { useRouter } from "next/navigation";

interface TestFormProps {
  test?: {
    id: string;
    patientName: string;
    testType: string;
    result: string;
    testDate: Date;
    notes?: string | null;
  };
  mode: "create" | "edit";
}

export function TestForm({ test, mode }: TestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      patientName: formData.get("patientName") as string,
      testType: formData.get("testType") as string,
      result: formData.get("result") as string,
      testDate: formData.get("testDate") as string,
      notes: formData.get("notes") as string | null,
    };

    try {
      const validatedData = TestSchema.parse(data);
      const url = mode === "create" ? "/api/tests" : `/api/tests/${test?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save test");
      }
      console.log("Save successful!");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Submit error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="patientName" className="block text-sm font-medium">
          Patient Name
        </label>
        <input
          type="text"
          id="patientName"
          name="patientName"
          defaultValue={test?.patientName}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>
      <div>
        <label htmlFor="testType" className="block text-sm font-medium">
          Test Type
        </label>
        <input
          type="text"
          id="testType"
          name="testType"
          defaultValue={test?.testType}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>
      <div>
        <label htmlFor="result" className="block text-sm font-medium">
          Result
        </label>
        <input
          type="text"
          id="result"
          name="result"
          defaultValue={test?.result}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>
      <div>
        <label htmlFor="testDate" className="block text-sm font-medium">
          Test Date
        </label>
        <input
          type="date"
          id="testDate"
          name="testDate"
          defaultValue={test?.testDate.toISOString().split("T")[0]}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={test?.notes || ""}
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Test"
          : "Update Test"}
      </button>
    </form>
  );
}
