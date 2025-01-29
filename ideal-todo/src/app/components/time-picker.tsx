import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

interface BasicTimePickerProps {
  value: Dayjs | null;
  onTimeChange: (newValue: Dayjs | null) => void;
}

export default function BasicTimePicker({
  value,
  onTimeChange,
}: BasicTimePickerProps) {
  const handleChange = (newValue: Dayjs | null) => {
    onTimeChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker
          label="Basic time picker"
          value={value}
          onChange={handleChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
