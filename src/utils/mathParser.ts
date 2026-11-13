// Safe deterministic mathematical expression evaluator (no arbitrary JS execution)

const ALLOWED_IDENTIFIERS: Record<string, string> = {
  sin: 'Math.sin',
  cos: 'Math.cos',
  tan: 'Math.tan',
  asin: 'Math.asin',
  acos: 'Math.acos',
  atan: 'Math.atan',
  sinh: 'Math.sinh',
  cosh: 'Math.cosh',
  tanh: 'Math.tanh',
  sqrt: 'Math.sqrt',
  abs: 'Math.abs',
  ln: 'Math.log',
  log: 'Math.log10',
  log2: 'Math.log2',
  exp: 'Math.exp',
  floor: 'Math.floor',
  ceil: 'Math.ceil',
  round: 'Math.round',
  pow: 'Math.pow',
  min: 'Math.min',
  max: 'Math.max',
  pi: 'Math.PI',
  e: 'Math.E',
};

export function compileMathExpression(
  expr: string,
  useDegrees = false
): ((x?: number) => number) | null {
  try {
    let cleaned = expr.trim().toLowerCase();
    if (!cleaned) return null;

    // Replace ^ with **
    cleaned = cleaned.replace(/\^/g, '**');
    // Implicit multiplication like 2x or 2(x) or )x
    cleaned = cleaned.replace(/(\d)(x|\()/g, '$1*$2');
    cleaned = cleaned.replace(/(\))(x|\d|\()/g, '$1*$2');
    cleaned = cleaned.replace(/(x)(\()/g, '$1*$2');

    // Validate only safe characters remain before replacing tokens
    if (!/^[0-9a-z_+\-*/%.,()\s]+$/.test(cleaned)) {
      return null;
    }

    // Check every identifier token
    const tokens = cleaned.match(/[a-z_][a-z0-9_]*/g) || [];
    for (const token of tokens) {
      if (token !== 'x' && !(token in ALLOWED_IDENTIFIERS)) {
        return null;
      }
    }

    const trigScale = useDegrees ? '*(Math.PI/180)' : '';
    const invTrigScale = useDegrees ? '*(180/Math.PI)' : '';

    // Token replacement using word boundaries
    const transformed = cleaned.replace(/[a-z_][a-z0-9_]*/g, (token) => {
      if (token === 'x') return 'x';
      if (useDegrees && (token === 'sin' || token === 'cos' || token === 'tan')) {
        return `((v)=>Math.${token}(v${trigScale}))`;
      }
      if (useDegrees && (token === 'asin' || token === 'acos' || token === 'atan')) {
        return `((v)=>Math.${token}(v)${invTrigScale})`;
      }
      return ALLOWED_IDENTIFIERS[token];
    });

    const fn = new Function('x', `"use strict"; return Number(${transformed});`) as (x?: number) => number;
    // Smoke test
    void fn(1);
    return fn;
  } catch {
    return null;
  }
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}
