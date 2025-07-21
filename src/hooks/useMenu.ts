import { useState } from "react";

const useMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return { menuOpen, toggleMenu };
};

export default useMenu;
