import React from "react";

const TodayDate = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateNumber = today.getDate();
  const monthName = today.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="text-left pl-7 text-[#9F9F9F]">
      {dayName}, {dateNumber} {monthName}
    </div>
  );
};

export default TodayDate;
