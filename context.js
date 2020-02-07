
const COOKIES = Symbol('context#cookies');

class Cookies {
  constructor(req,res,options){
    this.request = req
    this.response = res
  }
  // 根据key获取值
  get(name){
    const cookie = this.request.headers["cookie"]
    // 格式 name=saojun;path=/;age=20
    const arr = cookie.split(';')
    let obj={}
    arr.forEach(item=>{
      const key = item.split('=')[0]
      obj[key] = item.split('=')[1]
    })
    return obj[name] 
  }

  set(name,value,opt){
    let arr =[]
    for(const key in opt){
      arr.push(`key=${opt[key]}`)
    }
    let str = arr.join(';')
    this.request.setHeader('Set-Cookie',[
      `name=key;${str}`
    ])
  }

}

let proto = {
  get cookies() {
    if (!this[COOKIES]) {
      this[COOKIES] = new Cookies(this.req, this.res, {
        keys: this.app.keys,
        secure: this.request.secure
      });
    }
    return this[COOKIES];
  },

  set cookies(_cookies) {
    this[COOKIES] = _cookies;
  }
}

function defineGetter(prop,name){
  proto.__defineGetter__(name,function(){
    return this[prop][name]
  })
}

function defineSetter(prop,name){
  proto.__defineSetter__(name,function(value){
    this[prop][name] = value
  })
}

// ctx.url 会获取 ctx.request.url
defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('request', 'query')
defineGetter('response', 'body')
defineSetter('response', 'body')


module.exports = proto
