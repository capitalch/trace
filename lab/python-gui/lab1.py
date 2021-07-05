import simplejson as json


class Config:
    env = None
    url= None
    linkServerUrl = None

    @classmethod
    def __init__(cls):
        cls.env = 'env'

    def __init__(self) -> None:
        config = self.get_config()
        self.env = config['env']

    def get_config(self):
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        return(config)

# config = Config()
print(Config.env)
x = 0
