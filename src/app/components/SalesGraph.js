"use client";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="90%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="date" padding={{ left: 10, right: 10 }} />
        <YAxis dataKey="sales" type="number" />
        <Tooltip labelStyle={{ color: "#110F50" }} />
        <Legend verticalAlign="top" />
        <Bar
          dataKey="sales"
          fill="#C605FA"
          barSize={40}
          activeBar={false}
          name="Sales for last 10 days"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesGraph;
