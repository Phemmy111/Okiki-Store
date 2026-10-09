import re

with open('src/app/(store)/bundles/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { ChevronRight, PackageCheck } from "lucide-react";',
    'import { ChevronRight } from "lucide-react";\nimport AddToQuoteButton from "@/components/store/AddToQuoteButton";'
)

# Replace the whatsapp block with AddToQuoteButton block
content = re.sub(
    r'<a\s+href=\{https://wa.me.*?Order This Bundle on WhatsApp\s+</a>',
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
