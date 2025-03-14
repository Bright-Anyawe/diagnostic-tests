import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { TestSchema } from "@/app/lib/validations/test";
import { Prisma } from "@prisma/client";



export async function GET(request: Request,   { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }
    console.log("ID type:", typeof id, "Value:", id);

    const test = await prisma.diagnosticTest.findUnique({
      where: {
        id: String(id),
      },
      select: {
        id: true,
        patientName: true,
        testType: true,
        result: true,
        testDate: true,
        notes: true,
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Diagnostic test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error fetching diagnostic test:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnostic test" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}

export async function PUT(request: Request,   { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid diagnostic test ID" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const body = TestSchema.parse(json);

    const test = await prisma.diagnosticTest.update({
      where: { id: id },
      data: body,
    });

    return NextResponse.json(test, { status: 200 });
  } catch (error) {
    //+
    console.error("Error updating diagnostic test:", error);
    //+
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: error?.message || "Failed to update diagnostic test" }, //+
        { status: 500 } //+
      );
    }
  } finally {
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect();
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Received DELETE request for ID:", id);

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid diagnostic test ID" },
        { status: 400 }
      );
    }

    // Attempt to delete the diagnostic test
    await prisma.diagnosticTest.delete({
      where: { id: id }, // Use the correct variable name
    });

    return NextResponse.json(
      { message: "Diagnostic test deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting diagnostic test:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Diagnostic test not found" },
          { status: 404 }
        );
      }
    }
  } finally {
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect(); // Ensure disconnect only if necessary
    }
  }
}
