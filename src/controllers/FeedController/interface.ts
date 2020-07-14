import { IFeedModel } from './model'

export interface IFeedService {
  allfeed(): Promise<IFeedModel[] | Error>
  insert(obj: IFeedModel, user: string): Promise<IFeedModel | null | Error>
  insertMany(): Promise<void>
  remove(feed: string, user: string): Promise<IFeedModel | null | Error>
  addToFavorites(feed: string, user: string): Promise<IFeedModel | null | Error>
  findUserFavorites(user: string): Promise<IFeedModel[] | Error>
  removeFromFavorites(
    feed: string,
    user: string
  ): Promise<IFeedModel | Error | null>
}
