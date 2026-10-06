"use server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export async function createCategory(formData: FormData) {
  await requireAdminDb();
  
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  
  if (!name) return { error: "Name is required" };
  
  let slug = slugify(name);
  
  try {
    await db.insert(categories).values({
      name,
      slug,
      icon,
      sortOrder,
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    if (err.code === '23505') {
       return { error: "A category with that name/slug already exists." };
    }
    return { error: "Failed to create category." };
  }
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
  await requireAdminDb();
  
  try {
    if (data.name && !data.slug) {
        data.slug = slugify(data.name);
    }
    await db.update(categories).set(data).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to update category." };
  }
}

export async function deleteCategory(id: number) {
  await requireAdminDb();
  
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete category. It might be in use by products." };
  }
}
