/**
 * Custom icon list
 * All icons are loaded here for easy management
 * @see https://vue.ant.design/components/icon/#Custom-Font-Icon
 *
 * 自定义图标加载表
 * 所有图标均从这里加载，方便管理
 */
// import bxAnaalyse from '@/assets/icons/bx-analyse.svg?inline' // path to your '*.svg?inline' file.
// console.log(bxAnaalyse)

const req = require.context('@/assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const rule = /\.\/(.*)\.svg/

const svgs = requireAll(req).map(i => {
  return i.match(rule)[1]
})

const icons = {}
for (let index = 0; index < svgs.length; index++) {
    const svgName = svgs[index]
    try {
        const icon = require(`@/assets/icons/${svgName}.svg?inline`)
        icons[svgName] = icon.default
    } catch (e) {
        console.log(e)
    }
}

export default icons
