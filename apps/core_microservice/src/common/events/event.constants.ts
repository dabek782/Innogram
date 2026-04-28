export const ROUTING_KEYS = {
  createdComment: 'notification.comment.created',
  createdPost: 'notification.post.created',
  likedPost: 'notification.post.liked',
  likedComment: 'notification.comment.liked',
  repliedComment: 'notification.comment.replied',
  deletedPost: 'notification.post.deleted',

  followUser: 'notification.follow.user',
  unfollowUser: 'notification.unfollow.user',

  sendMessage: 'notification.message.send',
  replyMessage: 'notification.message.reply',
  createGroupChat: 'notification.chat.group.created',
  addToGroupChat: 'notification.chat.group.added',
  joinGroupChat: 'notification.chat.group.joined',
  leaveGroupChat: 'notification.chat.group.left',

  COMMENT_ALL: 'notification.comment.*',
  POST_ALL: 'notification.post.*',
  CHAT_ALL: 'notification.chat.*',
  MESSAGES_ALL: 'notification.message.*',
  ALL: 'notification.*',
} as const;

export const EXCHANGES = {
  EVENTS: 'innogram.events',
  DEAD_LETTER: 'innogram.dlx',
} as const;

export const QUEUES = {
  NOTIFICATIONS: 'notification.events',
  CORE_EVENTS: 'core.events',
  AUTH_EVENTS: 'auth.events',
} as const;
