import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { TestSchema } from "@/app/lib/validations/test"

export async function GET() {
  try {
    const tests = await prisma.diagnosticTest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(tests)
  } catch (error) {
    console.error("Error fetching diagnostic tests:", error)
    return NextResponse.json(
      { error: "Failed to fetch diagnostic tests" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = TestSchema.parse(json)

    const test = await prisma.diagnosticTest.create({
      data: body,
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error creating diagnostic test:", error)
    return NextResponse.json(
      { error: "Failed to create diagnostic test" },
      { status: 500 }
    )
  }
} 