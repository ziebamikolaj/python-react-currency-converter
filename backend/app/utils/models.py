from pydantic import BaseModel

#     Represents the current currency rate and gold price in PLN.

class CurrencyRate(BaseModel):
    pln: float
    usd: float
    gold: float

