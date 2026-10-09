with open('src/app/(store)/bundles/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Match the <a ... Order This Bundle on WhatsApp </a> block
content = re.sub(r'<a\s+href=\{`https://wa\.me/.*?</a\s*>',
    '''<div className="w-full max-w-sm mt-6">
              <AddToQuoteButton
                productId={-bundle.id}
                name={bundle.name + " Bundle"}
                slug={"bundle-" + bundle.slug}
                priceKobo={bundle.priceKobo}
                imagePublicId={null}
                variant="detail"
              />
            </div>''',
    content,
    flags=re.DOTALL
)

with open('src/app/(store)/bundles/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
