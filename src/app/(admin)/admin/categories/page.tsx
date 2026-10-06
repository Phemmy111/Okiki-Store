import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import CategoriesClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const allCategories = await db.select().from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">Categories</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Manage product categories and navigation links.
        </p>
      </div>

      <CategoriesClient initialCategories={allCategories} />
    </div>
  );
}
