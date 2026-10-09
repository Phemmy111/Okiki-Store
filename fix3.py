import re

with open('src/app/(store)/my-orders/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { eq, inArray } from "drizzle-orm";',
    'import { eq, inArray, or } from "drizzle-orm";\nimport { auth, currentUser } from "@clerk/nextjs/server";'
)

new_func = '''export async function fetchMyOrdersAction(references: string[]) {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const conditions = [];
  if (references && references.length > 0) {
    conditions.push(inArray(orders.reference, references));
  }
  if (userId) {
    conditions.push(eq(orders.userId, userId));
  }
  if (email) {
    conditions.push(eq(orders.customerEmail, email));
  }

  if (conditions.length === 0) return [];

  const foundOrders = await db.select().from(orders).where(or(...conditions));
  
  if (foundOrders.length === 0) return [];

  const orderIds = foundOrders.map(o => o.id);
  const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

  return foundOrders.map(o => ({
    ...o,
    items: items.filter(i => i.orderId === o.id)
  })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}'''

content = re.sub(
    r'export async function fetchMyOrdersAction\(references: string\[\]\) \{.*?\n\}',
    new_func,
    content,
    flags=re.DOTALL
)

with open('src/app/(store)/my-orders/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
