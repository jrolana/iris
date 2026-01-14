import { useEffect, useState } from "react";

//T allows to have dynamic type (you can define it) when hook is used
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  //it relies on the fact that `value` is always changed thru some input thru some setState
  //it always rebuilds this timer every time `value` is changed
  //it will only set the debouncedValue whenever the timer runs down (when the user stops typing)

  return debouncedValue;
}

export default useDebounce;