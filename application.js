const http = require("http")
const Stream = require('stream')
const request = require('./request')
const response = require('./response')
const context = require('./context')
const EventEmitter = require('events')

module.exports = class Application extends EventEmitter {
  constructor(){
    super()
    this.middlewares = []
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.context = Object.create(context)
    
  }

  use(fn){
    this.middlewares.push(fn)
  }

  compose(middlewares,ctx){
    function dispatch(index){
      if(index === middlewares.length){
        return 
      }
      let current = middlewares[index]
      let next = dispatch.bind(null, i + 1)
      return Promise.resolve(current(ctx,next))    
    }
    return dispatch(0)
  }

  createContext(req,res){
    let ctx = this.context
    // 原生 req res
    ctx.req = req
    ctx.res = res
    // 封装的request,response
    ctx.request = this.request
    ctx.response = this.response
    ctx.request.req = ctx.req
    ctx.response.res = ctx.res
    return ctx
  }

  handleRequest(req,res){ // 每个请求到来前执行这里
    let ctx = this.createContext(req,res)
    //this.fn(ctx)
    this.compose(this.middlewares,ctx).then(()=>{
      if(typeof ctx.body === 'object'){
        res.setHeader('Content-Type', 'application/json;charset=utf8')
        res.end(JSON.stringify(ctx.body))
      }else if(ctx.body instanceof Stream){
        ctx.body.pipe(res)
      }else if(typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)){
        res.setHeader('Content-Type', 'text/htmlcharset=utf8')
        res.end(ctx.body)
      }else{
        res.end('Not found')
      }
    }).catch(()=>{
        this.emit('error', err)
        res.statusCode = 500
        res.end('server error')
    })
    
  }


  listen(port){
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...arguments)
    console.log("app start on port:",port)
  }
}



