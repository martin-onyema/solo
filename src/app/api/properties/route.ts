import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (type && type !== "All") where.type = type;
    if (city) where.city = city;
    if (featured === "true") where.featured = true;
    if (status) where.status = status;

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseInt(minPrice) } : {}),
        ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { city: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const properties = await db.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    if (!body.price || body.price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than zero" },
        { status: 400 }
      );
    }
    if (!body.location || !body.location.trim()) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }
    if (!body.image || !body.image.trim()) {
      return NextResponse.json(
        { error: "Main image is required" },
        { status: 400 }
      );
    }

    const property = await db.property.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        price: body.price,
        location: body.location,
        city: body.city,
        type: body.type,
        tag: body.tag,
        beds: body.beds || 0,
        baths: body.baths || 0,
        size: body.size,
        image: body.image,
        images: body.images ? JSON.stringify(body.images) : "[]",
        features: body.features ? JSON.stringify(body.features) : "[]",
        featured: body.featured || false,
        status: body.status || "available",
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
