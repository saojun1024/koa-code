const url = require("url")

let request = {
  get url(){
    return this.req.url
  },

  get path(){
    const { pathname } = url.parse(this.req.url)
    return pathname
  },

  get query(){
    return url.parse(this.req.url,true).query
  }

}

module.exports = request
