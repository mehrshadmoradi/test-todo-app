"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TodayDate from "./todayDate";
import TomorrowDate from "./tomorrowDate";
import FormDialog from "./todoFormModal";

export default function LabTabs({
  makeTodosFalse,
}: {
  makeTodosFalse: (bool: boolean) => void;
}) {
  const [value, setValue] = React.useState("1");
  const [disable, setDisable] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === "2") {
      setDisable(true);
      makeTodosFalse(false);
    } else {
      setDisable(false);
      makeTodosFalse(true);
    }
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            className="rounded-t-3xl bg-[#ffffff]"
            TabIndicatorProps={{
              style: { backgroundColor: "black" },
            }}
          >
            <Tab
              label="Today’s Task"
              value="1"
              sx={{
                "&.Mui-selected": {
                  color: "black",
                },
                width: "220px",
              }}
            />
            <Tab
              label="Tomorrow’s Task"
              value="2"
              sx={{
                "&.Mui-selected": {
                  color: "black",
                },
                width: "220px",
              }}
            />
          </TabList>
        </Box>
        <div className="bg-[#f5f0f0] pb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <TabPanel value="1" className="font-extrabold pb-1">
                Today’s Task
              </TabPanel>
              <TabPanel value="2" className="font-extrabold pb-1">
                Tomorrow’s Task
              </TabPanel>
              {value === "1" ? <TodayDate /> : <TomorrowDate />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center h-full">
                <FormDialog disable={disable} />
              </div>
            </div>
          </div>
        </div>
      </TabContext>
    </Box>
  );
}
