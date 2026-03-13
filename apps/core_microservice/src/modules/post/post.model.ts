import { Post, PostAsset, Asset } from '@prisma/client';

type PostAssetWithAsset = PostAsset & {
  asset?: Asset;
};

export type PostResponseData = Pick<
  Post,
  'id' | 'content' | 'profileId' | 'isArchived'
> & {
  postAssets?: PostAssetWithAsset[];
};
