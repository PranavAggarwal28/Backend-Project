// this is done in order not to create async functions again and again as in backend most of the functions are async so we just created a kind of blueprint that will help and improve the readability of the code and reduse reapetiton

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// const asyncHandler =(fn)=>async(req,res,next)=>{
//   try {
//     await fn(req,res,next)
//   } catch (error) {
//     res.status(error.code||500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }

export {asyncHandler};