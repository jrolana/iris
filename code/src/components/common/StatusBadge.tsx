interface StatusBadgeProps {
  label: string;
  className: string;
}

export function StatusBadge(props: StatusBadgeProps) {
  const { label, className } = props;
  return (
    <span
      className={`text-theme-xs inline-flex items-center rounded-full px-2.5 py-1 font-medium ${className}`}
    >
      {label}
    </span>
  );
}
