import React, { createContext, useState, useContext } from "react";

type LockContextType = {
  locked: boolean;
  setLocked: (val: boolean) => void;
  unlockApp: () => void;
};

export const LockContext = createContext<LockContextType>({
  locked: false,
  setLocked: () => {},
  unlockApp: () => {},
});

export const LockProvider = ({ children }: { children: React.ReactNode }) => {
  const [locked, setLocked] = useState(false);

  const unlockApp = () => setLocked(false);

  return (
    <LockContext.Provider value={{ locked, setLocked, unlockApp }}>
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => useContext(LockContext);
