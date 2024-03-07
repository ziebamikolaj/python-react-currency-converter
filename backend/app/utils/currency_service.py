import datetime
import requests
import logging

from utils.models import CurrencyRate


NBP_API_URL_DOLLAR = "http://api.nbp.pl/api/exchangerates/rates/a/usd/"  
NBP_API_URL_GOLD = "http://api.nbp.pl/api/cenyzlota"

logging.basicConfig(level=logging.DEBUG)

class CurrencyService:
    def __init__(self):
        self.current_rate = self.fetch_dollar_and_gold_rate()
        self.last_fetch = datetime.datetime.now()
               
    def get_current_rate(self) -> CurrencyRate:
        # Fetch new rates if the last fetch was more than 60 seconds ago
        if self.last_fetch and (datetime.datetime.now() - self.last_fetch).seconds > 60:
            self.fetch_dollar_and_gold_rate()
        return self.current_rate
    
    def fetch_dollar_and_gold_rate(self):
        dollar_price_response = requests.get(NBP_API_URL_DOLLAR)
        gold_rate_response = requests.get(NBP_API_URL_GOLD)
        
        # Check for errors
        if dollar_price_response.status_code != 200 or gold_rate_response.status_code != 200:
            logging.error("Failed to fetch rates: %s, %s", dollar_price_response, gold_rate_response)
            return None
        
        dollar_price = dollar_price_response.json()["rates"][0]["mid"]
        gold_rate = gold_rate_response.json()[0]["cena"]
        
        self.current_rate = CurrencyRate(pln=1.0, usd=dollar_price, gold=gold_rate * 1000)
        self.last_fetch = datetime.datetime.now()
        
        logging.info("Fetched new rates: %s", self.current_rate) 
        
        return self.current_rate

    
currency_service = CurrencyService()

def get_currency_service() -> CurrencyService:
    return currency_service 
