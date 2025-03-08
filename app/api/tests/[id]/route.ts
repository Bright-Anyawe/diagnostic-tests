import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { TestSchema } from "@/app/lib/validations/test"

export async function GET(
  request: Request,
  { params }: {  params: { id: string | string[] | number}}
) {
  try {
    const test = await prisma.diagnosticTest.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!test) {
      return NextResponse.json(
        { error: "Diagnostic test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error fetching diagnostic test:", error)
    return NextResponse.json(
      { error: "Failed to fetch diagnostic test" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Record<string, string>}
) {
  try {
    const json = await request.json()
    const body = TestSchema.parse(json)

    const test = await prisma.diagnosticTest.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error updating diagnostic test:", error)
    return NextResponse.json(
      { error: "Failed to update diagnostic test" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: {  params: Record<string, string> }
) {
  try {
    await prisma.diagnosticTest.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Diagnostic test deleted" })
  } catch (error) {
    console.error("Error deleting diagnostic test:", error)
    return NextResponse.json(
      { error: "Failed to delete diagnostic test" },
      { status: 500 }
    )
  }
} 