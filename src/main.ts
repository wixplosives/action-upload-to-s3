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
    const specificFile: string = core.getInput('specificFile')
    core.info(`Uploading ${sourceFolder} to ${awsBucket}/${s3Subfolder}`)
    const s3Client = new AWSS3Client(accessKeyId, secretAccessKey)
    await s3Client.uploadFolder(awsBucket, s3Subfolder, sourceFolder, tags)
    if (publishAsProject && publishAsProject !== '') {
      if (specificFile !== '') {
        await s3Client.updateLatestWithSpecificFile(awsBucket, s3Subfolder, publishAsProject, specificFile)
        core.info(
          `Create static link ${awsBucket}/${publishAsProject} for ${awsBucket}/${s3Subfolder}/${specificFile}`
        )
      }
      await s3Client.updateLatest(awsBucket, s3Subfolder, publishAsProject)
      core.info(
        `Create static link ${awsBucket}/${publishAsProject} for ${awsBucket}/${s3Subfolder}`
      )
    }
    core.info('Done')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
