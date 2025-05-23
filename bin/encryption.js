const fs = require('fs-extra')
const path = require('path')
const md5 = require('md5-js')

let num = 0

const ignore = [
  'game.rmmzproject',
  'src/icu',
  'src/module/devtools.js',
  'src/game/js/env/dev.js$'
]

if (!process.env.STEAM) {
  ignore.push('src/lib')
  ignore.push('src/module/steam')
  console.log('Mode: Normal')
} else {
  console.log('Mode: STEAM')
}

if (process.env.NODE_ENV != 'development') {
  ignore.push('src/game/js/env/test.js$')
  console.log('Build: 开发')
} else {
  console.log('Build: 发行')
}

function md5Dir(dir, name) {
  const oldDir = path.join(dir, name)
  const newDir = path.join(oldDir, `../${md5(name).substr(8, 16)}`)
  fs.renameSync(oldDir, newDir)
  // console.log(`  ${oldDir}\n→ ${newDir}\n`)
  md5Filename(newDir)
}

function md5Filename(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file)
    const newPath = path.join(fullPath, `../${md5(file).substr(8, 16)}`)
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.renameSync(fullPath, newPath)
      // console.log(`  ${fullPath}\n→ ${newPath}\n`)
      md5Filename(newPath)
    } else {
      num++
      // console.log(`  ${fullPath}\n→ ${newPath}\n→ ${num}\n`)
      fs.renameSync(fullPath, newPath)
    }
  })
}

const dir = path.join(__dirname, '../dist')

let s = Date.now()
console.log('开始复制文件')

const reg = new RegExp(ignore.join('|').replace(new RegExp(`/`, 'g'), `\\${path.sep}`))
fs.emptyDirSync(dir)
fs.copySync(path.join(__dirname, '../src'), dir, {
  filter: src => {
    if (reg.test(src)) {
      console.log('已忽略 ', src)
      return false
    } else {
      return true
    }
  }
})
console.log(`复制文件结束 ${((Date.now() - s) / 1000).toFixed(2)}s`)

s = Date.now()
console.log('开始加密文件')

md5Dir(path.join(dir, 'game'), 'audio')
md5Dir(path.join(dir, 'game'), 'img')
md5Dir(path.join(dir, 'game'), 'movies')

console.log(`加密文件完成 ${((Date.now() - s) / 1000).toFixed(2)}s\n`)
