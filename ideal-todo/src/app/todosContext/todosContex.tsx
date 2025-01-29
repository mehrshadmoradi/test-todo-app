"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ITodoFormData } from "../components/todoFormModal";

interface TodosContextType {
  todos: ITodoFormData[];
  setTodos: React.Dispatch<React.SetStateAction<ITodoFormData[]>>;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
};

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<ITodoFormData[]>([]);
  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  );
};
