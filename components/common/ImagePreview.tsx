// Components - Mantine
import { Tooltip } from '@mantine/core';

// Types
import type { RefObject } from 'react';

const ImagePreview = ({
  image,
  imageRef,
  type
}: {
  image: string,
  imageRef: RefObject<HTMLButtonElement>,
  type: string
}) => {
  return (
    <Tooltip
      label={`Click to change ${type}`}
      position='top'
    >
      <div
        className={`${type} image-container`}
        onClick={() => { if (imageRef && imageRef.current) imageRef.current.click(); }}
      >
        <img
          className={`${type} image`}
          src={image}
          alt='Image'
        />
      </div>
    </Tooltip>
  );
};

export default ImagePreview;