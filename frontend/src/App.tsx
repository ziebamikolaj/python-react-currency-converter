import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./components/ui/input";
import { ModeToggle } from "./components/ui/mode-toggle";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const resSchema = z.object({
  pln: z.number(),
  usd: z.number(),
  gold: z.number(),
});
type Currency = z.infer<typeof resSchema>;

const getCurrency = async () => {
  const res = await fetch(`http://localhost:8000`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  const currency = resSchema.parse(data);
  return currency;
};

function App() {
  const {
    data: currency,
    error,
    isError,
  } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    refetchInterval: 1000,
  });

  const [inputCurrency, setInputCurrency] = useState<string>("pln");
  const [outputCurrency, setOutputCurrency] = useState<string>("usd");
  const [inputValue, setInputValue] = useState<number>(0);

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
        return Math.round(((inputValue * tempPLN) / currency[key as keyof Currency]) * 100) / 100;
      }
    }
  }, [inputCurrency, outputCurrency, inputValue, currency]);

  // If there is no connection to the api then display error message
  if (isError) {
    return <div className="text-red-500 bg-white p-4 rounded-md shadow-md">{error.message}</div>;
  }

  if (!currency) {
    return <div className="flex items-center justify-center h-screen text-2xl text-blue-500">Loading...</div>;
  }

  return (
    <>
      <div className="absolute">
        <ModeToggle />
      </div>
      <div className="grid bg-stone-200 dark:bg-[#030712] place-items-center h-screen">
        <div className="grid place-items-center gap-6">
          <div className="flex">
            <Input className="bg-stone-100 dark:bg-[#030712]" onChange={(event) => setInputValue(parseFloat(event.target.value))}></Input>
            <Select onValueChange={setInputCurrency}>
              <SelectTrigger className="w-[10rem]">
                <SelectValue placeholder="PLN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pln">PLN</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="gold">GOLD (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex">
            <Input disabled value={converted}></Input>
            <Select onValueChange={setOutputCurrency}>
              <SelectTrigger className="w-[10rem]">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pln">PLN</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="gold">GOLD (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
