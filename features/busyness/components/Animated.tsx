"use client";

import { useEffect, useState } from "react";

export const Animated = () => {
  const [expression, setExpression] = useState("🤖");

  useEffect(() => {
    const expressions = ["🤖", "😊", "😎", "🤔", "😴"];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % expressions.length;

      const expression = expressions[index];

      if (expression) {
        setExpression(expression);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <div className="text-7xl mt-6 animate-bounce">{expression}</div>;
};
