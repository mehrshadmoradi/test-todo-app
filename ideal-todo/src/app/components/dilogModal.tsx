import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useTodos } from "../todosContext/todosContex";
import { ITodoFormData } from "./todoFormModal";
import { Bounce, toast } from "react-toastify";

async function deleteTodo(id: string): Promise<void> {
  try {
    const response = await axios.delete(`http://localhost:3001/todos/${id}`);
  } catch (error) {
    console.error(error);
  }
}

export default function AlertDialog({ todo }: { todo: ITodoFormData }) {
  const [open, setOpen] = React.useState(false);
  const { setTodos } = useTodos();

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      toast.success(` task "${todo.title}" was deleted successfully`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <React.Fragment>
      <button className="mr-2" onClick={handleClickOpen}>
        <img
          src="/trash-can-solid.svg"
          alt="trash"
          style={{ width: "25px", height: "25px" }}
        />
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Deletion Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this todo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button
            onClick={() => {
              handleDelete(todo._id!);
              handleClose();
            }}
            autoFocus
          >
            yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
