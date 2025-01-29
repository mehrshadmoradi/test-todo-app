"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Todo from "./todo";
import { useTodos } from "../todosContext/todosContex";
import { ITodoFormData } from "./todoFormModal";

function Todos() {
  const { todos, setTodos } = useTodos();
  const [filter, setFilter] = useState<"all" | "open" | "close">("all");

  const filteredTodos = todos.filter((todo: ITodoFormData) => {
    if (filter === "all") return true;
    return filter === "open" ? !todo.is_completed : todo.is_completed;
  });

  const closedCount = todos.filter(
    (todo: ITodoFormData) => todo.is_completed
  ).length;
  const openCount = todos.filter(
    (todo: ITodoFormData) => !todo.is_completed
  ).length;

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/todos");

        setTodos(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching todos:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
    getTodos();
  }, [setTodos]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex m-auto mb-5 ">
          <button
            className="w-20 h-6 mr-4 border-2 border-transparent focus:outline-none focus:border-r-gray-500 focus:text-blue-600 group"
            autoFocus
            onClick={() => {
              setFilter("all");
            }}
          >
            All{" "}
            <span className="text-white bg-gray-300 group-focus:bg-blue-600 px-2 rounded-full">
              {todos.length}
            </span>
          </button>
          <button
            className="w-20 h-6 mr-4 border-2 border-transparent focus:border-r-gray-500 focus:text-blue-600 group"
            onClick={() => {
              setFilter("open");
            }}
          >
            open{" "}
            <span className="text-white bg-gray-300 group-focus:bg-blue-600 px-2 rounded-full">
              {openCount}
            </span>
          </button>
          <button
            className="w-20 h-6 mr-4 border-2 border-transparent focus:border-r-gray-500 focus:text-blue-600 group"
            onClick={() => {
              setFilter("close");
            }}
          >
            close{" "}
            <span className="text-white bg-gray-300 group-focus:bg-blue-600 px-2 rounded-full">
              {closedCount}
            </span>
          </button>
        </div>
        <div>
          {filteredTodos.map((todo: ITodoFormData) => {
            return (
              <div key={todo._id}>
                <Todo todo={todo} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Todos;
