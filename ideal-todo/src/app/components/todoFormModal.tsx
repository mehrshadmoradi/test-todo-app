import React from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useTodos } from "../todosContext/todosContex";
import BasicTimePicker from "./time-picker";
import dayjs, { Dayjs } from "dayjs";
import { Bounce, toast } from "react-toastify";

export interface ITodoFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  _id?: string;
  is_completed: boolean;
}

export default function FormDialog({
  disable,
  initialData,
}: {
  disable?: boolean;
  initialData?: ITodoFormData;
}) {
  const [open, setOpen] = React.useState(false);
  const [formKey, setFormKey] = React.useState(0);
  const { setTodos } = useTodos();

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ITodoFormData>({
    defaultValues: initialData || {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      is_completed: false,
    },
  });

  const watchStartTime = watch("start_time");

  const onSubmit = async (data: ITodoFormData) => {
    const createOrUpdateTodo = async (
      todo: ITodoFormData,
      isUpdate: boolean
    ) => {
      const url = isUpdate
        ? `http://localhost:3001/todos/${todo._id}`
        : "http://localhost:3001/todos";

      try {
        const response = await axios({
          method: isUpdate ? "put" : "post",
          url,
          data: todo,
          headers: {
            "Content-Type": "application/json",
          },
        });

        setTodos((prevTodos) =>
          isUpdate
            ? prevTodos.map((t) =>
                t._id === response.data._id ? response.data : t
              )
            : [response.data, ...prevTodos]
        );

        toast.success(
          isUpdate
            ? `Task "${todo.title}" was updated successfully`
            : `Task "${todo.title}" was created successfully`,
          { position: "top-right", theme: "colored", transition: Bounce }
        );

        reset();
        handleClose();

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error(error.response.data.message, {
            position: "top-right",
            theme: "colored",
            transition: Bounce,
          });
        } else {
          console.error("Unexpected error:", error);
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
            theme: "colored",
            transition: Bounce,
          });
        }
      }
    };
    const isUpdate = !!initialData;
    const updatedTodo = await createOrUpdateTodo(data, isUpdate);
  };

  const handleClickOpenEdit = () => {
    setOpen(true);
    setTimeout(() => {
      reset(initialData);
      setFormKey((prev) => prev + 1);
    }, 0);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <React.Fragment>
        {initialData ? (
          <button
            className="mr-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleClickOpenEdit();
            }}
          >
            <img
              src="/pen-to-square-regular.svg"
              alt="trash"
              style={{ width: "25px", height: "25px" }}
            />
          </button>
        ) : (
          <button
            disabled={disable}
            type="button"
            className="text-[#0750fb] disabled:bg-gray-500 disabled:text-gray-100 bg-[#61a5edd6] w-[125px] h-[40px] rounded-[10px]"
            onClick={handleClickOpen}
          >
            + New Task
          </button>
        )}

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>
              {initialData ? "Edit" : "Enter"} Your Task
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-col mt-2">
                <label htmlFor="title" className="mb-1">
                  Title
                </label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="h-[50px]  border focus:border-2 border-gray-300 hover:border-black focus:border-blue-500 focus:outline-none text-gray-900 text-base rounded-md block w-full p-2.5"
                    />
                  )}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2">
                <label htmlFor="description" className="mb-1">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="h-[50px]  border focus:border-2 border-gray-300 hover:border-black focus:border-blue-500 focus:outline-none text-gray-900 text-base rounded-md block w-full p-2.5"
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2">
                <label>Start Time</label>
                <Controller
                  name="start_time"
                  control={control}
                  rules={{ required: "Start time is required" }}
                  render={({ field }) => (
                    <BasicTimePicker
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      onTimeChange={(sTime: Dayjs | null) => {
                        const formatted = sTime?.format("HH:mm") || "";
                        setValue("start_time", formatted, {
                          shouldValidate: true,
                        });
                        field.onChange(formatted);
                      }}
                    />
                  )}
                />
                {errors.start_time && (
                  <span className="text-red-500 text-sm">
                    {errors.start_time.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-2">
                <label>End Time</label>
                <Controller
                  name="end_time"
                  control={control}
                  rules={{
                    required: "End time is required",
                    validate: (end_time) =>
                      !watchStartTime || end_time > watchStartTime
                        ? true
                        : "End time must be after start time",
                  }}
                  render={({ field }) => (
                    <BasicTimePicker
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      onTimeChange={(eTime: Dayjs | null) => {
                        const formatted = eTime?.format("HH:mm");
                        setValue("end_time", formatted!);
                        field.onChange(formatted);
                      }}
                    />
                  )}
                />
                {errors.end_time && (
                  <span className="text-red-500 text-sm">
                    {errors.end_time.message}
                  </span>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Add"} Todo
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </React.Fragment>
    </>
  );
}
