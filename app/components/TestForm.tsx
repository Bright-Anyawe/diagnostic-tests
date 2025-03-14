"use client";

import { useState } from "react";
import { TestSchema } from "@/app/lib/validations/test";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from "react-spinners";

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
  const [notesLength, setNotesLength] = useState(test?.notes?.length || 0);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      patientName: test?.patientName || "",
      testType: test?.testType || "",
      result: test?.result || "",
      testDate: test?.testDate || null,
      notes: test?.notes || "",
    },
  });

  async function onSubmit(data: any) {
    setLoading(true);

    try {
      const url = mode === "create" ? "/api/tests" : `/api/tests/${test?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  function onCancel() {
    router.push("/");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "create" ? "Create New Test" : "Edit Test"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium">
              Patient Name
            </label>
            <Controller
              name="patientName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="patientName"
                  className="mt-1 block w-full rounded-md border p-2"
                />
              )}
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.patientName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="testType" className="block text-sm font-medium">
              Test Type
            </label>
            <Controller
              name="testType"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="testType"
                  className="mt-1 block w-full rounded-md border p-2"
                />
              )}
            />
            {errors.testType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.testType.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="result" className="block text-sm font-medium">
              Result
            </label>
            <Controller
              name="result"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="result"
                  className="mt-1 block w-full rounded-md border p-2"
                />
              )}
            />
            {errors.result && (
              <p className="text-red-500 text-xs mt-1">
                {errors.result.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="testDate" className="block text-sm font-medium">
              Test Date
            </label>
            <Controller
              name="testDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="yyyy-MM-dd"
                  className="mt-1 block w-full rounded-md border p-2"
                />
              )}
            />
            {errors.testDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.testDate.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes ({notesLength}/255)
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="notes"
                  className="mt-1 block w-full rounded-md border p-2"
                  onChange={(e) => {
                    field.onChange(e);
                    setNotesLength(e.target.value.length);
                  }}
                  maxLength={255}
                />
              )}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-70"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : mode === "create" ? (
                "Create Test"
              ) : (
                "Update Test"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}