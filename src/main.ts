import * as core from '@actions/core'
import {uploadFolder} from './aws'

async function run(): Promise<void> {
  try {
    const awsSecretId: string = core.getInput('aws_secret_id')
    const awsSecretKey: string = core.getInput('aws_secret_key')
    const awsBucket: string = core.getInput('aws_bucket')
    const awsSubfolder: string = core.getInput('aws_subfolder')
    const folderToUpload: string = core.getInput('folder_to_upload')
    core.info(`Uploaing ${folderToUpload} to ${awsBucket}/${awsSubfolder}`) 
    await uploadFolder(awsSecretKey, awsSecretId, awsBucket , awsSubfolder, folderToUpload)
    core.info('Done')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
