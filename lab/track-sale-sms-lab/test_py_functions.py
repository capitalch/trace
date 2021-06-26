def func1(a, *argv, **arg):
    print('a:', a)
    print('b:', arg['b'])
    print('argv:', argv)
    print('arg:', arg)

func1(1, 2,9,10,11, b=2, c=3)
