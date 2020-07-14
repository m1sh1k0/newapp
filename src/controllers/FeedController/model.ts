import mongoose, { Schema, Document } from 'mongoose'
const { ObjectId } = mongoose.Types

export interface IFeedModel extends Document {
  source: string
  author: string
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  favoriteOf: string[]
}

const FeedSchema: Schema = new Schema(
  {
    source: { type: ObjectId, ref: 'UserModel' },
    author: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    urlToImage: {
      type: String
    },
    favoriteOf: [{ type: ObjectId, ref: 'UserModel' }]
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'publishedAt' }
  }
)

export default mongoose.model<IFeedModel>('FeedModel', FeedSchema)
