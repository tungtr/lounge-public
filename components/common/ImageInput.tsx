'use client';

// Components - Relative
import ImagePreview from '@components/common/ImagePreview';
// Components - Common
import Link from '@components/common/Link';
// Components - Mantine
import { FileInput, Flex, Stack } from '@mantine/core';

// Types
import type { RefObject } from 'react';

const ImageInput = ({
  image,
  imageFile,
  imageRef,
  isButtonLoading,
  onChangeImage,
  onRemoveImage,
  type
}: {
  image: string | null,
  imageFile: File | null,
  imageRef: RefObject<HTMLButtonElement>,
  isButtonLoading: boolean,
  onChangeImage: (image: File | null) => void,
  onRemoveImage: () => void,
  type: string
}) => {
  return (
    <>
      {image &&
        <Flex justify='center'>
          <ImagePreview image={image} imageRef={imageRef} type={type.toLowerCase()} />
        </Flex>
      }
      <Stack spacing={4}>
        <FileInput
          accept='image/png,image/jpeg'
          placeholder='Upload image'
          disabled={isButtonLoading}
          label={type}
          onChange={(image) => { onChangeImage(image) }}
          ref={imageRef}
          value={imageFile}
        />
        {image &&
          <Flex justify='flex-end'>
            <Link onClick={onRemoveImage}>Remove {type}</Link>
          </Flex>
        }
      </Stack>
    </>
  );
};

export default ImageInput;