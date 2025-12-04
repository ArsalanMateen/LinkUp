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
export const MailOutline = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 6 9 7 9-7" />
  </Icon>
);
export const CalendarTodayOutlined = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M7 3v4m10-4v4M3 11h18" />
  </Icon>
);
export const MoreHoriz = (props) => (
  <Icon {...props}>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </Icon>
);
export const DeleteOutline = (props) => (
  <Icon {...props}>
    <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
  </Icon>
);
export const ImageOutlined = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="2" />
    <path d="m3 18 5-5 4 4 4-6 5 7" />
  </Icon>
);
export const Close = (props) => (
  <Icon {...props}>
    <path d="m6 6 12 12M6 18 18 6" />
  </Icon>
);
export const Favorite = (props) => (
  <Icon {...props}>
    <path
      fill="currentColor"
      d="M12 21 3.5 12.5C-2 6 6 0 12 6c6-6 14 0 8.5 6.5Z"
    />
  </Icon>
);
export const ChatBubbleOutline = (props) => (
  <Icon {...props}>
    <path d="M21 4H3v14h4v4l5-4h9Z" />
  </Icon>
);
export const ThumbUpAltOutlined = (props) => (
  <Icon {...props}>
    <path d="M8 10V21H3V10Zm0 0 5-8c3 0 3 3 1 7h6c1 0 2 1 1.5 3l-2 7c-.3 1-1 2-2 2H8" />
  </Icon>
);
export const KeyboardArrowDown = (props) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
