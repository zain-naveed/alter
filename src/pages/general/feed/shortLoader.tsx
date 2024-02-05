import React from "react";
import GameCardLoader from "shared/components/gameCardLoader";
interface Props {
  isInProfile: boolean;
  isSelf: boolean;
  isStream: boolean;
  count:number
}

function ShortLoader(props: Props) {
  const { isInProfile, isSelf, isStream,count } = props;

  return (
    <>
      {Array.from(Array(count).keys()).map((item, inx) => {
        return (
          <GameCardLoader
            key={inx}
            isStream={isStream}
            isInProfile={isInProfile}
            isSelf={isSelf}
          />
        );
      })}
    </>
  );
}

export default ShortLoader;
