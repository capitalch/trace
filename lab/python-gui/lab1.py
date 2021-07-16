import simplejson as json

s = "xyz"
try:
    a = json.loads(s)
except(Exception) as e:
    mess = e.args[0] or repr(e)
    print(mess)
finally:
    # print(a)
    pass
