"use client";

import { useEffect, useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setLastResult(null);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Agar input khali ya operator pe end ho to lastResult show karo
      if (!input || /[+\-*/.]$/.test(input)) {
        if (lastResult !== null) setInput(lastResult);
        return;
      }

      const result = new Function("return " + input)();
      setInput(result.toString());
      setLastResult(result.toString());
    } catch {
      setInput("Error");
    }
  };

  // ✅ Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9+\-*/.]$/.test(e.key)) {
        setInput((prev) => prev + e.key);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, lastResult]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl">
        {/* Display */}
        <div className="mb-6">
          <input
            type="text"
            value={input}
            readOnly
            className="w-full text-right text-4xl md:text-5xl p-6 rounded-lg border border-gray-600 bg-gray-900 text-white font-mono focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={handleClear}
            className="col-span-2 bg-red-600 hover:bg-red-700 text-white py-6 rounded-lg text-2xl font-bold"
          >
            C (Esc)
          </button>
          <button
            onClick={handleBackspace}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-6 rounded-lg text-2xl font-bold"
          >
            ⌫ (Back)
          </button>
          <button
            onClick={() => handleClick("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg text-2xl font-bold"
          >
            ÷
          </button>

          {["7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+"].map(
            (btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className="bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-lg text-3xl font-semibold"
              >
                {btn}
              </button>
            )
          )}

          <button
            onClick={() => handleClick("0")}
            className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-lg text-3xl font-semibold"
          >
            0
          </button>
          <button
            onClick={() => handleClick(".")}
            className="bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-lg text-3xl font-semibold"
          >
            .
          </button>
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-lg text-3xl font-bold"
          >
            = (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
