import { useState, useEffect } from "react";

function ProgressBar({ completed, total, title }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setBarWidth((completed / total) * 100);
  }, [completed]);

  return (
    <div id="outer-progress-bar" className="w-70 m-auto border-2 border-white ">
      <div
        id="inner-progress-bar"
        className="border-blue-800 bg-emerald-200 transition-all duration-700"
        style={{ width: `${barWidth}%` }}
      >
        <p className="whitespace-nowrap text-center p-2 ">
          <i>
            {title} {completed} of {total}
          </i>
        </p>
      </div>
    </div>
  );
}

export default ProgressBar;
