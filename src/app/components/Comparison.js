"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Comparison = ({ chart1, chart2 }) => {
  const colors = ["#8884d8", "#FA8072"];
  const colors2 = ["#AF69EE", "#3DED97"];
  return (
    <div>
      <ResponsiveContainer width="90%" height={300}>
        <PieChart width={730} height={250}>
          <Pie
            data={chart1}
            dataKey="value"
            nameKey="data"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            label
          >
            {chart1.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="90%" height={300}>
        <PieChart width={730} height={250}>
          <Pie
            data={chart2}
            dataKey="value"
            nameKey="data"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            label
          >
            {chart2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors2[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Comparison;
