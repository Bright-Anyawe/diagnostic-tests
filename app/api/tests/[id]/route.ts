import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { TestSchema } from "@/app/lib/validations/test";

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;


    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }

    const test = await prisma.diagnosticTest.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true
      }
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
  }  finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}


export async function PUT(request: Request,   { params }: { params: RouteParams }
) {
  try {
    const { id } = await params 
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
      data: body
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error updating diagnostic test:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic test" },
      { status: 500 }
    );
  }  finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}

export async function DELETE(request: Request,   { params }: { params: RouteParams }
) {
  try {
    const { id } = await params 
    if (!id) {
      return NextResponse.json(
        { error: "Missing diagnostic test ID" },
        { status: 400 }
      );
    }

    await prisma.diagnosticTest.delete({
      where: {
        id: id,
      }
    });

    return NextResponse.json({ message: "Diagnostic test deleted" });
  } catch (error) {
    console.error("Error deleting diagnostic test:", error);
    return NextResponse.json(
      { error: "Failed to delete diagnostic test" },
      { status: 500 }
    );
  }
  finally {
    if (process.env.NODE_ENV === "production") await prisma.$disconnect();
  }
}
