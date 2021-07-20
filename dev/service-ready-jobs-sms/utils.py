import simplejson as json
from os import path

class Config:
    def __init__(self):
        config = self.get_config()

    def get_config(self):
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        return(config)

config = Config()