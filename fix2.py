import re

with open('src/lib/actions/submit-quote.ts', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { auth }' not in content:
    content = content.replace(
        'import { db } from "@/db";',
        'import { db } from "@/db";\nimport { auth } from "@clerk/nextjs/server";'
    )

content = content.replace(
    'export async function submitQuoteAction(formData: FormData) {',
    '''export async function submitQuoteAction(formData: FormData) {
  const { userId } = await auth();'''
)

content = content.replace(
    'customerEmail: email,',
    'customerEmail: email,\n      userId: userId || null,'
)

with open('src/lib/actions/submit-quote.ts', 'w', encoding='utf-8') as f:
    f.write(content)
