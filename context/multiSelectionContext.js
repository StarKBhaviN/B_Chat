import { createContext, useContext, useState } from "react";

const MultiSelectionContext = createContext();

export const MultiSelectionProvider = ({ children }) => {
  const [selectedChats, setSelectedChats] = useState([]);

  const toggleChatSelection = (roomId) => {
    setSelectedChats((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const clearSelection = () => setSelectedChats([]);

  return (
    <MultiSelectionContext.Provider
      value={{ selectedChats, toggleChatSelection, clearSelection }}
    >
      {children}
    </MultiSelectionContext.Provider>
  );
};

export const useMultiSelection = () => useContext(MultiSelectionContext);
