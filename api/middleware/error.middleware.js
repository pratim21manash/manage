import { CatchError } from "../utils/error.util.js";

const errorMiddleware = (err, req, res, next) => {
  CatchError(err, res, "Something went wrong");
};

export default errorMiddleware;