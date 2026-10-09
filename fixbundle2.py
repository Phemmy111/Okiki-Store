import re

with open('src/lib/actions/submit-quote.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'productId: item.productId,',
    'productId: item.productId > 0 ? item.productId : null,'
)

with open('src/lib/actions/submit-quote.ts', 'w', encoding='utf-8') as f:
    f.write(content)
