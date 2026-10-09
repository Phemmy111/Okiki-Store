import re
with open('src/lib/email.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<p style="margin:0;color:#0a1628;font-weight:bold;font-size:15px;">.*?New Quote Request.*?</p>', 
                 r'<p style="margin:0;color:#0a1628;font-weight:bold;font-size:15px;">🚨 New Quote Request — #${quoteId}</p>', content)

content = re.sub(r'subject: `.*?New Quote Request from \$\{customerDetails\.name\}.*?`,', 
                 r'subject: `🚨 New Quote Request from ${customerDetails.name} — #${quoteId}`,', content)

with open('src/lib/email.ts', 'w', encoding='utf-8') as f:
    f.write(content)
