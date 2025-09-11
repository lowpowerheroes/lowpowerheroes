import { useEffect, useState } from "react";

const useDebouncedSearch = (initialValue: string, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { value, setValue, debouncedValue };
};

export default useDebouncedSearch;
