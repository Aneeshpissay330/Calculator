import { useState, useEffect } from 'react';

export const useCalculatorLogic = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [memory, setMemory] = useState<number | null>(null);

  const evaluateExpr = (exprStr: string): string => {
    const expr = exprStr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e/g, `(${Math.E})`)
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/log\(([^)]+)\)/g, (_m, v) => `Math.log10(${v})`)
      .replace(/ln\(([^)]+)\)/g,  (_m, v) => `Math.log(${v})`)
      .replace(/sin\(([^)]+)\)/g, (_m, v) => `Math.sin((${v})*Math.PI/180)`)
      .replace(/cos\(([^)]+)\)/g, (_m, v) => `Math.cos((${v})*Math.PI/180)`)
      .replace(/tan\(([^)]+)\)/g, (_m, v) => `Math.tan((${v})*Math.PI/180)`)
      .replace(/(\d+)!/g, (_, num) => {
        const n = parseInt(num, 10);
        const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
        return fact(n).toString();
      })
      .replace(/\^/g, '**');

    // tslint:disable-next-line: no-eval
    const raw = eval(expr);
    return new Intl.NumberFormat('en', { maximumFractionDigits: 12 }).format(raw);
  };

  const handleAllClear = () => {
    setInput('');
    setResult('');
  };

  const handleClearEntry = () => {
    setInput('');
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleToggleSign = () => {
    const regex = /(-?\d+(?:\.\d*)?)$/;
    const match = input.match(regex);
    if (!match) return;
    const num = match[0];
    const idx = input.lastIndexOf(num);
    const toggled = num.startsWith('-') ? num.slice(1) : `-${num}`;
    setInput(input.slice(0, idx) + toggled);
  };

  const handleBrackets = () => {
    const opens = (input.match(/\(/g) || []).length;
    const closes = (input.match(/\)/g) || []).length;
    setInput(prev => prev + (opens === closes || prev.endsWith('(') ? '(' : ')'));
  };

  // Memory functions
  const handleMemoryClear = () => setMemory(null);
  const handleMemoryRecall = () => {
    if (memory !== null) {
      setInput(prev => prev === '' ? memory.toString() : prev + memory.toString());
    }
  };
  const handleMemoryAdd = () => {
    const val = parseFloat(result.replace(/,/g, ''));
    if (!isNaN(val)) {
      setMemory(prev => (prev ?? 0) + val);
    }
  };

  useEffect(() => {
    if (!input) return;
    try {
      setResult(evaluateExpr(input));
    } catch {
      // swallow errors
    }
  }, [input]);

  const handleEvaluate = (): string | null => {
    try {
      const res = evaluateExpr(input);
      setResult(res);
      return res;
    } catch {
      setResult('Expression Error');
      return null;
    }
  };

  return {
    input,
    result,
    memory,
    handleInput: (v: string) => {
      setInput(prev => {
        if (prev === '' && result && !isNaN(Number(result))) {
          return result + v;
        }
        return prev + v;
      });
    },
    handleAllClear,
    handleClearEntry,
    handleBackspace,
    handleToggleSign,
    handleBrackets,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleEvaluate,
  };
};
