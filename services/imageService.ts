// Essentials
import { storage } from '@services/third-party/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

// Assets
import PlaceholderAvatar from '@public/images/placeholder-avatar.jpg';
import PlaceholderCover from '@public/images/placeholder-cover.jpg';
import PlaceholderProfile from '@public/images/placeholder-profile.jpg';

// Interfaces
import { ImageITF } from '@interfaces/ImageITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

export const uploadImage = async (image: File, folder: string, oldImage: ImageITF | null) => {
  if (!image) return { url: '', path: '' };

  const imagePath = `${folder}/${image.name}_${v4()}`;

  // Upload to storage
  const imageRef = ref(storage, imagePath);
  await uploadBytes(imageRef, image);

  // Get image url
  const imageUrl = await getDownloadURL(imageRef);

  // Delete old image
  if (oldImage && oldImage.path.length > 0) {
    const oldImageRef = ref(storage, oldImage.path);
    await deleteObject(oldImageRef);
  }

  return { url: imageUrl, path: imagePath };
};

export const getImageUrl = (image: ImageITF, type: string) => {
  let placeholder = null;
  switch (type) {
    case 'avatar':
      placeholder = PlaceholderAvatar;
      break;
    case 'cover':
      placeholder = PlaceholderCover;
      break;
    case 'profile':
      placeholder = PlaceholderProfile;
      break;
  }
  return image.url.length > 0 ? image.url : placeholder ? placeholder.src : undefined;
};

export const getBase64Image = (image: File, setImage: Dispatch<SetStateAction<string | null>>) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(image);
  fileReader.onload = () => {
    setImage(fileReader.result as string);
  };
};