export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Always print the full error server-side so it shows up in the terminal
  // running `npm run dev`, regardless of what gets sent back to the client.
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for field(s): ${Object.keys(err.keyValue).join(", ")}`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
