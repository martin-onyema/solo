import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const inquiries = await db.inquiry.findMany({
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inquiry = await db.inquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        message: body.message,
        propertyId: body.propertyId || null,
      },
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}
