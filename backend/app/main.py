from utils.models import CurrencyRate

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from utils.currency_service import CurrencyService, get_currency_service
from utils.models import CurrencyRate


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

currency_service = CurrencyService() 

@app.get("/", response_model=CurrencyRate)
async def get_current_rate( service: CurrencyService = Depends(get_currency_service)):
    return service.get_current_rate()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
    