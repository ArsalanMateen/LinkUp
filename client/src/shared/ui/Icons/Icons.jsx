import React from "react";

function Icon({ children, fontSize, style, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{
        fontSize: fontSize === "small" ? 20 : 24,
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeRounded = (props) => (
  <Icon {...props}>
    <path d="m3 10 9-7 9 7v10H15v-7H9v7H3Z" />
  </Icon>
);

export const PeopleAltOutlined = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3" />
  </Icon>
);

export const PersonOutline = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
  </Icon>
);

export const ExitToApp = (props) => (
  <Icon {...props}>
    <path d="M9 4H4v16h5M10 12h11m-4-4 4 4-4 4" />
  </Icon>
);

export const KeyboardArrowDown = (props) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
