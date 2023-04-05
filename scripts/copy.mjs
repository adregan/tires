import { argv, cwd } from 'node:process'
import { join } from 'node:path'
import { cp } from 'node:fs/promises'

const main = async () => {
  const { sourcePath, targetPath } = parseArgs(argv)
  await cp(sourcePath, targetPath, {
    recursive: true,
  })
}

const parseArgs = args => {
  const [, , src, trg, flags] = args

  if (!src || !trg) {
    throw Error('must provide a source and a target')
  }

  return {
    sourcePath: join(cwd(), src),
    targetPath: join(cwd(), trg),
  }
}

main()
