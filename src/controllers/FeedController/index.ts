/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import FeedService from './service'

export async function create(
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feed = await FeedService.insert(req.body, req.user?.id)

    res.status(201).json(feed)
  } catch (error) {
    next(new Error(error.message))
  }
}
export async function createByFetch(): Promise<void> {
  try {
    await FeedService.insertMany()
  } catch (error) {
    throw new Error()
  }
}

export async function readall(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feed = await FeedService.allfeed()

    res.status(200).json(feed)
  } catch (error) {
    next(new Error(error.message))
  }
}

export async function deleteUserFeed(
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feedId = req.params.id
    const userId = req.user.id

    const feed = await FeedService.remove(feedId, userId)
    if (feed) {
      res.status(200).json({ msg: 'Feed succesfully removed', feed })
    }
    res.status(200).json({
      msg: `Requested news does not exist or you dont have permissions to delete it`
    })
  } catch (error) {
    next(new Error(error.message))
  }
}

export async function addToFavorites(
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feedId = req.params.id
    const userId = req.user.id

    const feed = await FeedService.addToFavorites(feedId, userId)
    if (feed) {
      res.status(200).json({ msg: 'Favorite successfully added', feed })
    }
    res.status(200).json({ msg: 'Requested article does not exist' })
  } catch (error) {
    next(new Error(error.message))
  }
}
export async function removeUserFavorite(
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const feedId = req.params.id
    const userId = req.user.id
    const feed = await FeedService.removeFromFavorites(feedId, userId)
    if (feed) {
      res.status(200).json({ msg: 'Removed from favorites', feed })
    }
    res.status(200).json({
      msg: 'Requested article does not exist in db nor user favorites'
    })
  } catch (error) {
    next(new Error(error.mesaage))
  }
}

export async function getUserFavorites(
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user.id
    const feed = await FeedService.findUserFavorites(userId)
    res.status(200).json({ msg: 'User favorites: ', feed })
  } catch (error) {
    next(new Error(error.message))
  }
}
