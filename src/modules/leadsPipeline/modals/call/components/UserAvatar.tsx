import React from "react";

interface Props {
  name: string;
  size?: number;
}

const UserAvatar: React.FC<Props> = ({ name, size = 48 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0 select-none rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue},55%,90%)`,
        color: `hsl(${hue},45%,35%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
