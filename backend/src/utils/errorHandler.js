export const errorHandler = (err,req,res,next)=>{
  res.status(err.statuscode || 500)
  .json({
    success:false,
    message:err.message || "Internal sever error"
  })
}


// this is a custom error handler middleware 
// in order to use this we need to make api error also 