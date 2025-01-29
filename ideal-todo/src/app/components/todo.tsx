import { useState } from "react";
import AlertDialog from "./dilogModal";
import FormDialog, { ITodoFormData } from "./todoFormModal";
import axios from "axios";
import { useTodos } from "../todosContext/todosContex";
import { Bounce, toast } from "react-toastify";

const Todo = ({ todo }: { todo: ITodoFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const strikeThrough = {
    textDecoration: todo.is_completed ? "line-through" : "none",
  };
  const { setTodos } = useTodos();
  const handleTodoCompletion = async (id: string, isCompleted: boolean) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/todos/${id}`,
        { is_completed: isCompleted },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(
        ` task "${todo.title}" is ${isCompleted ? "done" : "NOT done yet"}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t._id === id ? { ...t, is_completed: response.data.is_completed } : t
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Todo Component */}
      <div
        onClick={openModal}
        className="flex items-center justify-between cursor-pointer bg-[#ffffff] mb-4 rounded-2xl w-[360px]"
      >
        <div className="w-[315px] m-auto">
          <div className="flex border-b-2 border-[#e7e4e4] p-3 w-[315px] rounded-sm">
            <div>
              <strong style={strikeThrough}>{todo.title}</strong>
              <br />
              <p className=" text-[#6e6c6c]">{todo.description}</p>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <input
                type="checkbox"
                className="w-[22px] h-[22px] border-2   rounded-full"
                checked={todo.is_completed}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={() => {
                  handleTodoCompletion(todo._id!, !todo.is_completed);
                  setIsStrikethrough(!todo.is_completed);
                }}
              />
            </div>
          </div>
          <div className="p-3 text-[#6e6c6c]">
            Today {todo.start_time} - {todo.end_time}
          </div>
          <div className="flex pl-4">
            <div>
              <AlertDialog todo={todo} />
            </div>
            <div>
              <FormDialog initialData={todo} />{" "}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between pb-4 border-b-gray-400 border-b-2 mt-4">
              <label>title:</label>
              <h2 className="text-xl font-bold">{todo.title}</h2>
            </div>
            <div className="flex justify-between pb-4 border-b-gray-400 border-b-2 mt-4">
              <label>description:</label>
              <p>{todo.description}</p>
            </div>
            <div className="flex justify-between pb-4 border-b-gray-400 border-b-2 mt-4">
              <label>status:</label>
              <div className="flex">
                <div>
                  {todo.is_completed ? "completed" : "not completed yet"}
                </div>
                <input
                  type="checkbox"
                  className="w-[20px] h-[20px] border-2 ml-4 rounded-full"
                  checked={todo.is_completed}
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-between pb-4 border-b-gray-400 border-b-2 mt-4">
              <label>scheduled time:</label> Today {todo.start_time} -{" "}
              {todo.end_time}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Todo;
