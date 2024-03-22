export const getProfilePhotosRootDir = function (): string {
  return __dirname + "/../uploads/images/profile/";
};

export const getUserIdProfilePhotoName = function (userId: string): string {
  return userId + ".jpg";
};

export const getUserIdProfilePhotoPath = function (userId: string): string {
  return getProfilePhotosRootDir() + getUserIdProfilePhotoName(userId);
};

export const getAttachmentPath = function (attachmentId: string): string {
  return getAttachmentRootDir() + getAttachmentPhotoName(attachmentId);
}; export const getAttachmentRootDir = function (): string {
  return __dirname + "/../uploads/images/attachment";
};

export const getAttachmentPhotoName = function (attachmentId: string): string {
  return attachmentId + ".jpg";
};
