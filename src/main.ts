import * as core from '@actions/core'
import {uploadFolder} from './aws'

async function run(): Promise<void> {
  try {
    const accessKeyId: string = core.getInput('accessKeyId')
    const secretAccessKey: string = core.getInput('secretAccessKey')
    const awsBucket: string = core.getInput('awsBucket')
    const s3Subfolder: string = core.getInput('s3Subfolder')
    const sourceFolder: string = core.getInput('sourceFolder')
    const tags: string = core.getInput('tags')
    core.info(`Uploaing ${sourceFolder} to ${awsBucket}/${s3Subfolder}`)
    await uploadFolder(
      accessKeyId,
      secretAccessKey,
      awsBucket,
      s3Subfolder,
      sourceFolder,
      tags
    )
    core.info('Done')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
