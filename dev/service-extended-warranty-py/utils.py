import simplejson as json
from os import path

class Config:
    def __init__(self):
        config = self.get_config()
        env = config['env']
        upload_endpoint = config['uploadDataEndpoint']
        baseUrl = config[env].get('url')
        self.selectFolder = config.get('selectFolder', None)
        self.uploadEndPoint = path.join(baseUrl,upload_endpoint).replace('\\','/')
        self.getExtendedWarrantyCustomers = path.join(baseUrl, )

    def get_config(self):
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        return(config)

config = Config()