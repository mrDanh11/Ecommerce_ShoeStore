export const exampleMiddleware = (req, res, next) => {
  // Middleware logic here
  console.log('Example middleware executed');
  
  // Call the next middleware or route handler
  next();
}