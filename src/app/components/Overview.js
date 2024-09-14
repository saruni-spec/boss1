import React from "react";

const Overview = () => {
  return (
    <div>
      Total Milk Cost: {milkCostToday.toFixed(2)} Total Sales:{" "}
      {paidToday.toFixed(2)} Current Gross Profit: {grossProfit.toFixed(2)}{" "}
      Expected Gross Profit: {expectedProfit.toFixed(2)}
    </div>
  );
};

export default Overview;
