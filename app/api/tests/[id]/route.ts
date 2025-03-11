import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { TestSchema } from "@/app/lib/validations/test";

type RouteParams = { id: string };

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }

    const test = await prisma.diagnosticTest.findUnique({
      where: {
        id: String(id), // Ensure id is a string
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

export async function PUT(request: Request, { params }: { params: RouteParams }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const body = TestSchema.parse(json);

    const test = await prisma.diagnosticTest.update({
      where: {
        id: id,
      },
      data: body,
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error updating diagnostic test:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update diagnostic test" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }

    await prisma.diagnosticTest.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Diagnostic test deleted" });
  } catch (error) {
    console.error("Error deleting diagnostic test:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete diagnostic test" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}
