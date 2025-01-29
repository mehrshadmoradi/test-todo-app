"use client";

import React, { useState } from "react";
import LabTabs from "./components/tabs";
import Todos from "./components/todos";
import { TodosProvider } from "./todosContext/todosContex";

export default function Home() {
  const [showTodos, setShowTodos] = useState(true);
  const handleTodos = (bool: boolean) => {
    setShowTodos(bool);
  };
  return (
    <TodosProvider>
      <div className=" items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
        <main className="flex flex-col row-start-2 items-center sm:items-start">
          <div>
            <LabTabs makeTodosFalse={handleTodos} />
          </div>
          <div className="w-[440px] bg-[#f5f0f0] flex items-center justify-center ">
            {showTodos && <Todos />}
          </div>
        </main>
      </div>
    </TodosProvider>
  );
}
