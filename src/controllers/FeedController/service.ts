import FeedModel, { IFeedModel } from './model'
import { IFeedService } from './interface'
import fetch from 'node-fetch'

const fetchData = async () => {
  try {
    const url =
      'http://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=8a9afeca4d304bc294fb6b6b9114dd51'
    const res = await fetch(url)
    const json = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = json.articles.map((arr: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { source, ...all } = arr
      return {
        ...all
      }
    })
    return await map
  } catch (e) {
    console.log(e)
  }
}

const FeedService: IFeedService = {
  async allfeed(): Promise<IFeedModel[] | Error> {
    return await FeedModel.find({})
      .populate('source', '-password')
      .catch((error) => new Error(error))
  },

  async insert(
    body: IFeedModel,
    _id: string
  ): Promise<IFeedModel | null | Error> {
    try {
      return await FeedModel.create({
        ...body,
        source: _id
      })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async insertMany(): Promise<void> {
    try {
      const data = await fetchData()
      console.log(data)

      await FeedModel.insertMany(data)
        .then((val) => console.log(val))
        .catch((e) => console.log(e))
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async remove(feedId, userId): Promise<IFeedModel | null | Error> {
    try {
      const feed = await FeedModel.findOne({ _id: feedId }).then((feed) => {
        if (feed?.source == userId.toString()) {
          const deletedFeed = FeedModel.findByIdAndDelete({ _id: feedId })
          return deletedFeed
        }
        return null
      })
      return feed
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async addToFavorites(feedId, userId): Promise<IFeedModel | null | Error> {
    return await FeedModel.findOneAndUpdate(
      { _id: feedId },
      { $addToSet: { favoriteOf: userId } },
      { new: true }
    )
  },

  async findUserFavorites(userId: string): Promise<IFeedModel[] | Error> {
    return await FeedModel.aggregate([{ $match: { favoriteOf: userId } }])
  },

  async removeFromFavorites(
    feedId: string,
    userId: string
  ): Promise<IFeedModel | Error | null> {
    return await FeedModel.findOne({ _id: feedId })
      .then((feed) => {
        if (feed?.favoriteOf.includes(userId)) {
          return FeedModel.findByIdAndUpdate(
            { _id: feedId },
            { $pull: { favoriteOf: userId } },
            { new: true }
          )
        }
        return null
      })
      .catch((error) => new Error(error))
  }
}
export default FeedService
