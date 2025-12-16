const svgModules = import.meta.glob('../assets/svgs/*.svg', {
  as: 'raw',
  eager: true
})

type SvgAsset = {
  key: string
  name: string
  content: string
}

const svgAssets: SvgAsset[] = Object.entries(svgModules).map(([path, content]) => {
  const filename = path.split('/').pop() || 'unknown.svg'
  const name = filename.replace(/\.svg$/i, '')
  return {
    key: path,
    name,
    content: content as string
  }
})

export function getSvgAssets() {
  return svgAssets
}

