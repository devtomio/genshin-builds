import { IMGS_CDN } from "@lib/constants";
import clsx from "clsx";
import { memo } from "react";

type Props = {
  img: string;
  rarity: number;
  name: string;
  size?: number;
  className?: string;
  nameSeparateBlock?: boolean;
  classNameBlock?: string;
};

const SimpleRarityBox = ({
  name,
  img,
  rarity,
  className,
  nameSeparateBlock = false,
  classNameBlock,
}: Props) => {
  const imgAdditionalStyle = nameSeparateBlock
    ? "mb-0 rounded rounded-b-none"
    : "";
  return (
    <>
      <div
        className={clsx(
          `relative block m-1 bg-cover overflow-hidden text-center rounded group`,
          imgAdditionalStyle,
          className
        )}
        style={{
          backgroundImage: `url(${IMGS_CDN}/bg_${rarity}star.png)`,
        }}
      >
        <img className="group-hover:opacity-70" src={img} alt={name} />
        {!nameSeparateBlock && (
          <span
            className="absolute inline-block bottom-0 text-xs bg-gray-900 bg-opacity-90 rounded rounded-t-none p-1 transition-all opacity-80 group-hover:text-white group-hover:opacity-100"
            style={{ width: "calc(100% + 2px)", left: -2 }}
          >
            {name}
          </span>
        )}
      </div>
      {nameSeparateBlock && (
        <span
          className={clsx(
            "inline-block m-1 mt-0 overflow-hidden text-center text-xs bg-gray-900 bg-opacity-90 rounded rounded-t-none p-1",
            classNameBlock
          )}
        >
          {name}
        </span>
      )}
    </>
  );
};

export default memo(SimpleRarityBox);
