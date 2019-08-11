import React from "react";
import "./Step.css";

export default function Step({
  number,
  instructions,
  children
}: Props): React.ReactElement {
  return (
    <div className="Step">
      <div className="StepDescription">
        <span className="StepNumber">Step {number}: </span>
        <span className="StepInstructions">{instructions}</span>
      </div>

      {children}
    </div>
  );
}

interface Props {
  number: number;
  instructions?: string;
  children: React.ReactNode;
}
