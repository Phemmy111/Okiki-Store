with open('src/lib/email.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We will just replace any occurrence of corrupted characters.
# Look for the exact line: <p style="margin:0;color:#0a1628;font-weight:bold;font-size:15px;">A,??T New Quote Request A,?? #${quoteId}</p>
# And: subject: `A,??T New Quote Request from ${customerDetails.name} A,?? #${quoteId}`,

content = re.sub(r'A,\?\?T\s+New Quote Request\s+A,\?\?', '🚨 New Quote Request —', content)
content = re.sub(r'A\ufffd,\ufffd\?\ufffd\?T\s+New Quote Request\s+A\ufffd,\ufffd\?\?', '🚨 New Quote Request —', content)
content = re.sub(r'A\uFFFD,\uFFFD\?\uFFFD\?T', '🚨', content)
content = re.sub(r'A\uFFFD,\uFFFD\?\?', '—', content)
# Just in case, replace the entire bad substrings if they exist
content = re.sub(r'A[\x00-\x7F\u0080-\uFFFF]{3,10}T\s+New Quote Request\s+A[\x00-\x7F\u0080-\uFFFF]{3,10}\s+#', '🚨 New Quote Request — #', content)

with open('src/lib/email.ts', 'w', encoding='utf-8') as f:
    f.write(content)
