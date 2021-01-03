import * as core from '@actions/core'
import {AWSS3Client} from './aws'

async function run(): Promise<void> {
  try {
    const accessKeyId: string = core.getInput('accessKeyId')
    const secretAccessKey: string = core.getInput('secretAccessKey')
    const awsBucket: string = core.getInput('awsBucket')
    const s3Subfolder: string = core.getInput('s3Subfolder')
    const sourceFolder: string = core.getInput('sourceFolder')
    const tags: string = core.getInput('tags')
    const publishAsProject: string = core.getInput('publishAsVirtualProject')
    core.info(`Uploading ${sourceFolder} to ${awsBucket}/${s3Subfolder}`)
    const s3Client = new AWSS3Client(accessKeyId, secretAccessKey)
    await s3Client.uploadFolder(awsBucket, s3Subfolder, sourceFolder, tags)
    if (publishAsProject && publishAsProject !== '') {
      await s3Client.updateLatest(awsBucket, s3Subfolder, publishAsProject)
    }
    core.info('Done')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
