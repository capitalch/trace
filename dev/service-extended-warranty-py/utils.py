import simplejson as json
from os import path

class Config:
    def __init__(self):
        config = self.get_config()
        env = config['env']
        upload_endpoint = config['uploadDataEndpoint']
        extended_warranty_customers_endpoint = config['extendedWarrantyCustomers']
        baseUrl = config[env].get('url')
        self.selectFolder = config.get('selectFolder', None)
        self.uploadEndPoint = path.join(baseUrl,upload_endpoint).replace('\\','/')
        self.extendedWarrantyCustomersEndPoint = path.join(baseUrl, extended_warranty_customers_endpoint).replace('\\','/')

    def get_config(self):
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        return(config)

config = Config()