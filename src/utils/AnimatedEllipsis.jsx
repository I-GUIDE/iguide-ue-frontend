import React, { useState, useEffect } from "react";

export default function AnimatedEllipsis(props) {
  const text = props.text;
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Change every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <span>
      {text}
      {dots}
    </span>
  );
}
