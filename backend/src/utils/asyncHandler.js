export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


// this asynch hanler here solves the following problems 
// 1. you dont need to write try catch again and again .
// 2. and when it catches error it sends this error to express so that the 
// server does not halt or hang and express use its inbuilt or if we have provided any error handling middleware to show the proper error message.