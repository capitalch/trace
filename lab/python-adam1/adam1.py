import bcrypt
import random
import string
print('abc')

def randomStringGenerator(strSize, allowedChars):
    return ''.join(random.choice(allowedChars) for x in range(strSize))

def getRandomUserId():
    rnd = randomStringGenerator(8, string.ascii_letters + string.digits)
    # Remove all instances of ':' since clint sends credentials as 'uid:pwd'
    return(rnd.replace(':', '$'))

def getRandomPassword():
    rnd = f'@A1{randomStringGenerator(9, (string.ascii_letters + string.punctuation + string.digits))}b'
    # Remove all instances of ':' since clint sends credentials as 'uid:pwd'
    return(rnd.replace(':', '$'))

def getPasswordHash(pwd):
    interm = pwd.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    pwdHash = bcrypt.hashpw(interm, salt).decode('utf-8')
    return pwdHash

def isValidPwd(pwd, hsh):
        ret = False
        if pwd is None or hsh is None:
            return ret
        elif bcrypt.checkpw(pwd.encode('utf-8'), hsh.encode('utf-8')):
            ret = True
        return ret

userId = getRandomUserId()
pwd = getRandomPassword()
hash = getPasswordHash(pwd)
ret = isValidPwd(pwd, hash)
print(ret)