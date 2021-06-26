import json

def get_config():
    config_data = None
    with open('config.json','r') as config_file: 
        config_data= json.load(config_file)
    return(config_data)
