"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TestSchema } from "@/app/lib/validations/test";
import { z } from "zod";

// Define the form data type based on the TestSchema
type TestFormData = z.infer<typeof TestSchema>;

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
  const maxNotesLength = 500; // Maximum characters allowed for notes

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      patientName: test?.patientName || "",
      testType: test?.testType || "",
      result: test?.result || "",
      testDate: test?.testDate 
        ? test.testDate
        : new Date(),
      notes: test?.notes || "",
    },
  });

  // Watch the notes field to display a character counter
  const notesValue = watch("notes") || "";

  async function onSubmit(data: TestFormData) {
    setLoading(true);
    try {
      const url = mode === "create" ? "/api/tests" : `/api/tests/${test?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      // data.testDate is already a string in the "yyyy-MM-dd" format
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
    } catch (error: unknown) {
      console.error("Submit error:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred");
      }
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
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium">
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              {...register("patientName")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.patientName.message}
              </p>
            )}
          </div>

          {/* Test Type */}
          <div>
            <label htmlFor="testType" className="block text-sm font-medium">
              Test Type
            </label>
            <input
              type="text"
              id="testType"
              {...register("testType")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.testType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.testType.message}
              </p>
            )}
          </div>

          {/* Result */}
          <div>
            <label htmlFor="result" className="block text-sm font-medium">
              Result
            </label>
            <input
              type="text"
              id="result"
              {...register("result")}
              className="mt-1 block w-full rounded-md border p-2"
            />
            {errors.result && (
              <p className="text-red-500 text-xs mt-1">
                {errors.result.message}
              </p>
            )}
          </div>

          {/* Test Date using DatePicker */}
          <div>
            <label htmlFor="testDate" className="block text-sm font-medium">
              Test Date
            </label>
            <Controller
              control={control}
              name="testDate"
              render={({ field }) => (
                <DatePicker
                  id="testDate"
                  // Convert stored string value to a Date object for DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      // Convert the date to a string in "yyyy-MM-dd" format
                      field.onChange(date.toISOString().split("T")[0]);
                    } else {
                      field.onChange("");
                    }
                  }}
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

          {/* Notes with character counter */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              className="mt-1 block w-full rounded-md border p-2"
              maxLength={maxNotesLength}
            />
            <div className="flex justify-between items-center text-xs mt-1">
              {errors.notes && (
                <p className="text-red-500">
                  {errors.notes.message}
                </p>
              )}
              <span className="text-gray-500">
                {notesValue.length}/{maxNotesLength}
              </span>
            </div>
          </div>

          {/* Action buttons */}
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-70 flex items-center"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Test"
                : "Update Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
