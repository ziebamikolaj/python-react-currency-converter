import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./components/ui/input";
import { ModeToggle } from "./components/ui/mode-toggle";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import React from "react";

const resSchema = z.object({
  pln: z.number(),
  usd: z.number(),
  gold: z.number(),
});
type Currency = z.infer<typeof resSchema>;

const getCurrency = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  const currency = resSchema.parse(data);
  return currency;
};

function App() {
  const [currency, setCurrency] = React.useState<Currency | null>(null);
  useEffect(() => {
    getCurrency().then((currency: Currency) => {
      setCurrency(currency);
    });
  }, []);

  const [inputCurrency, setInputCurrency] = React.useState<string>("pln");
  const [outputCurrency, setOutputCurrency] = React.useState<string>("usd");
  const [inputValue, setInputValue] = React.useState<number>(0);

  const converted = useMemo(() => {
    let tempPLN = 0;
    if (!currency) return;
    if (Number.isNaN(inputValue)) return 0;

    for (const key in currency) {
      if (key === inputCurrency) {
        tempPLN = currency[key as keyof Currency];
      }
    }
    for (const key in currency) {
      if (key === outputCurrency) {
        return (
          Math.round(
            ((inputValue * tempPLN) / currency[key as keyof Currency]) * 100
          ) / 100
        );
      }
    }
  }, [inputCurrency, outputCurrency, inputValue, currency]);

  return (
    <>
      <div className="absolute">
        <ModeToggle />
      </div>
      <div className="grid bg-stone-200 dark:bg-[#030712] place-items-center h-screen">
        <div className="grid place-items-center gap-6">
          <div className="flex">
            <Input
              className="bg-stone-100 dark:bg-[#030712]"
              onChange={(event) =>
                setInputValue(parseFloat(event.target.value))
              }
            ></Input>
            <Select onValueChange={setInputCurrency}>
              <SelectTrigger className="w-[6rem]">
                <SelectValue placeholder="PLN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pln">PLN</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="gold">GOLD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex">
            <Input disabled value={converted}></Input>
            <Select onValueChange={setOutputCurrency}>
              <SelectTrigger className="w-[6rem]">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pln">PLN</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="gold">GOLD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
