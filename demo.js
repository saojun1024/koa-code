const Koa = require("./application")
const app = new Koa()

app.use((ctx,next)=>{
  ctx.body="hello,world"
  next()
})

app.use((ctx,next)=>{
  console.log(ctx.path)
  if(ctx.path === '/home'){
    ctx.body="this is home page!"
  }
})

app.listen(8087)
