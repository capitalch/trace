from datetime import datetime, date
from tkinter import Button, Radiobutton, StringVar
from typing_extensions import IntVar

class Animal:
    mew='Iam mewing'
    def __init__(self) -> None:
        pass
    
    @classmethod
    def do_mew(self):
        print(self.mew)
    
animal = Animal()
animal.do_mew()
Animal.do_mew()
