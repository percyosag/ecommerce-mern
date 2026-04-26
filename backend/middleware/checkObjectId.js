import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  // If the ID in the URL is not a mathematically valid Mongoose ObjectId, reject it instantly
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectId of: ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
