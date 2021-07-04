import simplejson as json
jData = {
    'name':'xxx',
    'address':'abc'
}

jString = json.dumps(jData)
escaped = jString.encode('utf-8')

unescaped = escaped.decode()
jOut = json.loads(unescaped)
z = 1