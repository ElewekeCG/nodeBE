export const getProfilePhotosRootDir = function (): string {
  return __dirname + "/../uploads/images/profile/";
};

export const getUserIdProfilePhotoName = function (userId: string): string {
  return userId + ".jpg";
};

export const getUserIdProfilePhotoPath = function (userId: string): string {
  return getProfilePhotosRootDir() + getUserIdProfilePhotoName(userId);
};
