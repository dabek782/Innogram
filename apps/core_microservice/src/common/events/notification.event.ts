import { DomainEvent } from './event.interface';

export interface UserCommentedOnPostEvent extends DomainEvent {
  type: 'UserCommentedOnPost';
  data: {
    postId: string;
    commentId: string;
    userId: string;
    commentText: string;
    content: string;
    createdAt: Date;
  };
}

export interface UserMessagedSendEvent extends DomainEvent {
  type: 'UserMessagedSend';
  data: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    isEdited: boolean;
    assets: {
      id: string;
      url: string;
      type: string;
    }[];
  };
}

export interface UserCreatedPostEvent extends DomainEvent {
  type: 'user.created.post';
  userId: string;        
  postId: string;        
  postContent: string;   

}


export interface UserRepliedToCommentEvent extends DomainEvent {
  type: 'user.replied.to.comment';
  userId: string;          
  commentId: string;        
  originalCommentId: string; 
  originalCommenterId: string; 
  postId: string;           
  replyPreview: string;     
}


export interface UserDeletedPostEvent extends DomainEvent {
  type: 'user.deleted.post';
  userId: string;        
  postId: string;        
  postOwnerId: string;   

}

export interface UserLikedPostEvent extends DomainEvent {
  type: 'user.liked.post';
  userId: string;        
  postId: string;        
  postOwnerId: string;   
  postTitle?: string;    
}

export interface UserLikedCommentEvent extends DomainEvent {
  type: 'user.liked.comment';
  userId: string;          
  commentId: string;       
  commentOwnerId: string;   
  postId: string;           
}

export interface UserRepliedToChatMessageEvent extends DomainEvent {
  type: 'user.replied.to.chat.message';
  userId: string;           
  messageId: string;        
  originalMessageId: string; 
  chatId: string;           
  replyPreview: string;     
}

export interface UserCreatedGroupChatEvent extends DomainEvent {
  type: 'user.created.group.chat';
  userId: string;           
  chatId: string;           
  chatName: string;         
  memberIds: string[];      
}

export interface UserLeftGroupChatEvent extends DomainEvent {
  type: 'user.left.group.chat';
  userId: string;          
  chatId: string;          
  chatName: string;        
  remainingMemberIds: string[];
}



export interface UserFollowedEvent extends DomainEvent {
  type: 'user.followed';
  followerId: string;    
  followedId: string;    
}

export interface UserUnfollowedEvent extends DomainEvent {
  type: 'user.unfollowed';
  followerId: string;   
  followedId: string;   
}

export interface UserJoinedGroupChatEvent extends DomainEvent {
  type: 'user.joined.group.chat';
  userId: string;          
  chatId: string;          
  chatName: string;        
  invitedById: string;      
  existingMemberIds: string[]; 