export default function TomorrowDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayName = tomorrow.toLocaleDateString("en-US", { weekday: "long" });
  const date = tomorrow.getDate();
  const monthName = tomorrow.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="text-left pl-7 text-[#9F9F9F]">
      {dayName}, {date} {monthName}
    </div>
  );
}
