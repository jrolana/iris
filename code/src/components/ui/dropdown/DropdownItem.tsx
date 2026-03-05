import type React from "react";
import Link from "next/link";

interface DropdownItemProps {
  tag?: "a" | "button" | "div";
  href?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  href,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    // Only prevent default for actual buttons
    if (tag === "button") event.preventDefault();
    onClick?.();
    onItemClick?.();
  };

  // Anchor behavior (navigation)
  if ((tag === "a") && href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  // If tag is explicitly "a" but no href, or tag is "div",
  // use a non-button wrapper to avoid nested button issues.
  if (tag === "a" || tag === "div") {
    return (
      <div
        className={combinedClasses}
        role="menuitem"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // trigger same click behavior
            onClick?.();
            onItemClick?.();
          }
        }}
      >
        {children}
      </div>
    );
  }

  // Default: real button item
  return (
    <button type="button" onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};