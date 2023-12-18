import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Pode adicionar lógica para carregar o username de armazenamento persistente aqui
  }, []);

  const setUsernameContext = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <DataContext.Provider value={{ username, setUsernameContext }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}
