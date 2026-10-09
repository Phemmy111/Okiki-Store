with open('src/lib/email.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('A\xef\xbf\xbd,\xef\xbf\xbd?\xef\xbf\xbd?T', '🚨')
content = content.replace('A\xef\xbf\xbd,\xef\xbf\xbd??', '—')
content = content.replace('A,??T', '🚨')
content = content.replace('A,??', '—')

with open('src/lib/email.ts', 'w', encoding='utf-8') as f:
    f.write(content)
