import os
import logging
import configparser
import datetime
import requests

from binance.client import Client

# region Logger setup
logger = logging.getLogger('crypto_logger')
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(thread)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

file_handler = logging.FileHandler('./Logs/CryptoTrader.log')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
# endregion

# region Config setup
config = configparser.ConfigParser()
config.read('config.ini')

apikey = config['DEFAULT']['apikey']
secretkey = config['DEFAULT']['secretkey']
# endregion



def main():

    client = Client(api_key=apikey, api_secret=secretkey, testnet=True, tld='us', requests_params={'timeout': 10})

    #status = client.get_system_status()

    #logger.debug(f'Binance system status: {status}')

    accountsnap = client.get_account_snapshot(type='SPOT')

    logger.debug(f'Account snapshot: {accountsnap}')



if __name__ == '__main__':
    logger.debug('Starting CryptoTrader application')

    main()

