import { argv, cwd } from 'node:process'
import { extname, join } from 'node:path'
import { cp, watch, copyFile } from 'node:fs/promises'

const main = async () => {
  const { sourcePath, targetPath, flags } = parseArgs(argv)
  await cp(sourcePath, targetPath, { recursive: true })

  if (flags.watch) {
    watchAndCopy(sourcePath, targetPath)
  }
}

const parseArgs = args => {
  const [, , source, target, flags] = args

  if (!source || !target) {
    throw Error('must provide a source and a target')
  }

  return {
    sourcePath: join(cwd(), source),
    targetPath: join(cwd(), target),
    flags: {
      watch: flags?.includes('-w') ?? false,
    },
  }
}

const watchAndCopy = async (source, target) => {
  const watcher = watch(source, { recursive: true, persistent: true })

  for await (const { filename } of watcher) {
    if (extname(filename) === '.html' && !filename.includes('~')) {
      const sourcePath = join(source, filename)
      const targetPath = join(target, filename)
      await copyFile(sourcePath, targetPath)
      console.log(`Copying ${sourcePath} -> ${targetPath}`)
    }
  }
}

main()
