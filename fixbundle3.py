import re

with open('src/app/(store)/quote/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'href={/products/}',
    'href={item.slug.startsWith("bundle-") ? /bundles/ : /products/}'
)

with open('src/app/(store)/quote/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
