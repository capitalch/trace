from rx import subject
from rx.subject import Subject
from rx.subject import BehaviorSubject
from rx.operators import filter

subject = Subject()
behaviorsubject = BehaviorSubject(0)

def emit(id, options):
    subject.on_next({'id': id, 'data': options})

def filterOn(id):
    return (subject.pipe(filter(
        lambda d: d['id'] == id
    )))
def hotEmit(id, options):
    behaviorsubject.on_next({'id': id, 'data': options})

def hotFilterOn(id):
    return (behaviorsubject.pipe(filter(
        lambda d: d['id'] == id
    )))


class Ibuki():
    def __init__(self):
        pass
    @staticmethod
    def emit(id, options):
        subject.on_next({'id': id, 'data': options})
    
    @staticmethod
    def filterOn(id):
        return (subject.pipe(filter(
            lambda d: d['id'] == id
        )))

    @staticmethod
    def hotEmit(id, options):
        behaviorsubject.on_next({'id': id, 'data': options})

    @staticmethod
    def hotFilterOn(id):
        return (behaviorsubject.pipe(filter(
        lambda d: d['id'] == id
    )))