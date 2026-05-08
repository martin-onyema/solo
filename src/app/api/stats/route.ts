import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalProperties = await db.property.count();
    const availableProperties = await db.property.count({
      where: { status: "available" },
    });
    const soldProperties = await db.property.count({
      where: { status: "sold" },
    });
    const pendingProperties = await db.property.count({
      where: { status: "pending" },
    });
    const totalInquiries = await db.inquiry.count();
    const unreadInquiries = await db.inquiry.count({
      where: { read: false },
    });
    const featuredProperties = await db.property.count({
      where: { featured: true },
    });

    const propertiesByType = await db.property.groupBy({
      by: ["type"],
      _count: true,
    });

    const propertiesByCity = await db.property.groupBy({
      by: ["city"],
      _count: true,
    });

    const totalValue = await db.property.aggregate({
      _sum: { price: true },
      where: { status: "available" },
    });

    return NextResponse.json({
      totalProperties,
      availableProperties,
      soldProperties,
      pendingProperties,
      totalInquiries,
      unreadInquiries,
      featuredProperties,
      totalValue: totalValue._sum.price || 0,
      propertiesByType: propertiesByType.map((p) => ({
        type: p.type,
        count: p._count,
      })),
      propertiesByCity: propertiesByCity.map((p) => ({
        city: p.city,
        count: p._count,
      })),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
