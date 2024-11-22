// User Interface
export interface iUser {
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  facebookURL?: string; // Optional
  instagramURL?: string; // Optional
  twitterURL?: string; // Optional
  linkedinURL?: string; // Optional
  phoneNumber: string;
  password: string;
  gender: string;
  country: string;
  state: string;
  occupation: string;
  posts: iPost[];
}

// Comment Interface
export interface iComment {
  authorId: any; // Reference to the user who made the comment
  text: string;
  likes: string[]; // Array of user IDs who liked the comment
  replies: iReply[]; // Nested replies
  createdAt: Date;
  updatedAt?: Date; // Optional for tracking edits
}

// Reply Interface
export interface iReply {
  authorId: any; // Reference to the user who made the reply
  text: string;
  likes: any[]; // Array of user IDs who liked the reply
  createdAt: Date;
  updatedAt?: Date; // Optional for tracking edits
}

// Post Interface
export interface iPost {
  image?: string; // Optional image URL
  imageId?: string; // Optional image ID for cloud storage
  authorId: any; // Reference to the user who created the post
  text: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: iComment[]; // Array of comments
  createdAt: Date;
  updatedAt?: Date; // Optional for tracking edits
}
