
import asyncio
import time
import random
import requests
import aiohttp
import http3
from requests.models import Response

def serial_use_requests():
    t = time.time()
    list  = [ requests.get('https://develop.cloudjiffy.net/random').text for i in range(10)]
    print(list)
    print('Time taken by serial:', time.time() - t)

serial_use_requests()

async def asyncronous():
    t = time.time()
    async with aiohttp.ClientSession() as session:
        list = [await session.get('https://develop.cloudjiffy.net/random') for i in range(10)]
        list1 = [await res.json() for res in list]
        print(list1)
    print('Time taken by async:', time.time()-t)

loop1 = asyncio.get_event_loop()
loop1.run_until_complete(asyncronous())

async def async_with_requests():
    t = time.time()
    async def request():
        return requests.get('https://develop.cloudjiffy.net/random').text
    
    lst = [await request() for i in range(10)]
    print(lst)
    print('Time for async with request:', time.time()-t)

loop2 = asyncio.get_event_loop()
loop2.run_until_complete(async_with_requests())

async def using_http3():
    client = http3.AsyncClient()
    t = time.time()
    list = [await client.get('https://develop.cloudjiffy.net/random') for i in range(10)]
    list1 = [res.text for res in list]
    print(list1)
    print('Time taken by http3:', time.time() - t)

loop3 = asyncio.get_event_loop()
loop3.run_until_complete(using_http3())





    
    # list  = [ requests.get('https://develop.cloudjiffy.net/random').text for i in range(10)]

# async def parallel_use_async():
#     async with aiohttp.ClientSession() as session:
#         async with session.get('https://develop.cloudjiffy.net/random') as response:
#             print(response.text())



# print(random.random() *10000000)
# async def print_hello():
#     time.sleep(1000)
#     print('hello')
#     t = time.time()
#     await asyncio.sleep(1)
#     print('world')
#     print(time.strftime('%x %X'))
#     print(time.time() - t)

# serial_use_requests()

# loop = asyncio.get_event_loop()
# loop.run_until_complete(parallel_use_async())

# asyncio.run(parallel_use_async())
# asyncio.wait()
# asyncio.run(print_hello())

# async def main():
#     async with aiohttp.ClientSession() as session:
#         async with session.get('https://develop.cloudjiffy.net/random') as response:

#             # print("Status:", response.status)
#             # print("Content-type:", response.headers['content-type'])

#             res = await response.json()
#             print(res)

# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())
