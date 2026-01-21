from binance.client import Client
from binance.streams import BinanceSocketManager, BinanceSocketType
from binance.exceptions import BinanceAPIException
import config
from time import sleep, strftime
from Email import Email
from datetime import datetime


#gets all of the account balances and returns them in a dictionary
def GetAccountBalances():
    #gets the account info and filters it for owned assets in the wallet and stores them in a list
    accountInfo = client.get_account()
    Dict = {}
    for balances in accountInfo['balances']:
        if float(balances['free']) != 0.00000000:
            Dict[str(balances['asset'])] = balances['free'], getAmountUSD(balances['asset'], float(balances['free']))
    return Dict

#gets the worth of an asset in USD
def getAmountUSD(asset, amount):
    try:
        if asset == 'USD':
            return float(amount)
        assetInfo = client.get_avg_price(symbol=(str(asset) + "USD"))
        return float(amount) * float(assetInfo['price'])
    except BinanceAPIException as e:
        try:
            assetInfo2 = client.get_avg_price(symbol=(str(asset) + "USDT"))
            return float(amount) * float(assetInfo2['price'])
        except:
            pass

def readAccountLog():
    file_object = open('AccountLog.txt', 'r', encoding='UTF-8')
    lines = file_object.readlines()
    count = 0
    for line in lines:
        count += 1
        print(line.strip())
    file_object.close()

def writeAccountLog(balances):
    file_object = open('AccountLog.txt', 'a', encoding='UTF-8')
    file_object.write('Cryto Account Balances: ' + datetime.now().strftime('%m/%d/%Y, %H:%M:%S') + '\n')
    for item in balances:
        file_object.write(item + ': ' + str(balances[item][0]) + ' coins; $' + str("{:.2f}".format(balances[item][1])) + '\n')
    file_object.close()

def writeLine(msg, filename):
    file_object = open(filename, 'a', encoding='UTF-8')
    file_object.write(msg + '\n')
    file_object.close()

if __name__ == '__main__':
    #instantiates a client of the python-binance class
    client = Client(config.API_KEY, config.API_SECRET, tld='US')
    AccountBalances = GetAccountBalances()
    print(AccountBalances)
    sum = 0.0
    for item in AccountBalances:
        try:
            sum += float(AccountBalances[item][1])
        except:
            pass
    print(sum)
    writeAccountLog(AccountBalances)
    writeLine('TOTAL ACCOUNT BALANCE: $' + str("{:.2f}".format(sum)), 'AccountLog.txt')
    writeLine('------------------------------------------------', 'AccountLog.txt')
    readAccountLog()