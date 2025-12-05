import Image from "next/image";
import React from "react";

interface propsInterface {
  title: string;
  imgPath: string;
  width: number;
  height: number;
}
export function Accordion(props: propsInterface) {
  const { title, imgPath, width, height } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="flex items-center justify-center">
          <Image
            src={imgPath}
            alt={title}
            className="rounded-lg object-contain"
            width={width}
            height={height}
          />
        </div>
      )}
    </div>
  );
}
