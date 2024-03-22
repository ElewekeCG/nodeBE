export interface CreatePostParams {
  text: string;
  type: PostType;
  originalPostId?: string;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  type: PostType;
  createdAt: Date;
  updatedAt: Date;
  attachmentId?: string;
}

export enum PostType {
  post = "post",
  repost = "repost",
  reply = "reply",
}

export enum ReactionType {
  like = "like",
}

export interface Reaction {
  id: string;
  userId: string;
  postId: string;
  type: ReactionType;
}

export interface CreateReactionParams {
  type: ReactionType;
}

export interface Attachment {
  id: string;
  mimeType: string;
}

export interface PostAttachmentInfo {
  photoName: string;
  options: any;
}