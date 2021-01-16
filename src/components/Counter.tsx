import * as React from "react";

export let Counter = ({fieldName, value, text}: any) => {
  const props = {[fieldName]: value};
  return (
    <div className="number" {...props}>
      {value}
      <span className="unit">{text}</span>
    </div>
  )
}
