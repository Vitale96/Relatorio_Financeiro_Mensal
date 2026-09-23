import json

with open('har/nfe.prefeitura.sp.gov.br.har', encoding='utf-8') as f:
    har = json.load(f)

print('Total de entries:', len(har['log']['entries']))
print()

# Mostra os primeiros 30 entries com tipo e URL
for i, entry in enumerate(har['log']['entries']):
    req = entry['request']
    rtype = entry.get('_resourceType', 'N/A')
    print('%d [%s][%s] %s' % (i, req['method'], rtype, req['url'][:120]))
    if req['method'] == 'POST' and req.get('postData'):
        print('   BODY:', req['postData'].get('text', '')[:300])
