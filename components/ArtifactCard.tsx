import { memo } from "react";
import { Artifact } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getUrl } from "@lib/imgUrl";

interface ArtifactCardProps {
  artifact: Artifact;
  pieces: 2 | 4;
}

const ArtifactCard = ({ artifact, pieces }: ArtifactCardProps) => {
  return (
    <div className="bg-vulcan-900 border border-vulcan-700 mb-2 rounded mr-1 w-full">
      <div className="flex flex-col lg:flex-row h-full w-full">
        <div
          className="flex lg:flex-none bg-cover p-3 rounded lg:rounded-bl lg:rounded-tr-none rounded-bl-none rounded-br-none items-center justify-center"
          style={{
            backgroundImage: `url(${getUrl(
              `/bg_${artifact.max_rarity}star.png`
            )})`,
          }}
        >
          <LazyLoadImage
            src={getUrl(`/artifacts/${artifact.id}.png`, 76, 76)}
            height={76}
            width={76}
            alt={artifact.name}
          />
        </div>
        <div className="p-3 ">
          <div className="flex items-center relative mb-2">
            <div>
              <div className="font-bold text-white">{artifact.name}</div>
            </div>
          </div>
          <div className="flex items-start mb-1">
            <div className="text-white mr-1 font-bold">(2)</div>
            <p>{artifact["two_pc"]}</p>
          </div>
          {pieces === 4 && (
            <div className="flex items-start">
              <div className="text-white mr-1 font-bold">(4)</div>
              <p>{artifact["four_pc"]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ArtifactCard);
