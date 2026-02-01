// building a wrapper for api response so that we can use it in further functions directly

class ApiResponse {  
  constructor(statusCode,data,message='success'){
    this.statusCode = statusCode
    this.message = message
    this.data = data
    this.success = statusCode <400

  }
}

export {ApiResponse}