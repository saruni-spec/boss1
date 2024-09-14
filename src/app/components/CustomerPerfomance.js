import React from "react";

const CustomerPerfomance = () => {
  return (
    <div>
      <div>Highest Buyer: {best?.name || "N/A"}</div>
      <div>Highest debtor: {worst?.name || "N/A"}</div>
    </div>
  );
};

export default CustomerPerfomance;
