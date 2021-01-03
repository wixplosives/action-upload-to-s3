import * as core from '@actions/core'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import AWS from 'aws-sdk'
import mime from 'mime'

export class AWSS3Client {
  s3Client: AWS.S3
  constructor(accessKeyIdPar: string, secretAccessKeyPar: string) {
    AWS.config.setPromisesDependency(Promise)
    this.s3Client = new AWS.S3({
      signatureVersion: 'v4',
      accessKeyId: accessKeyIdPar,
      secretAccessKey: secretAccessKeyPar,
      region: 'us-east-1'
    })
  }

  async internalUploadFolder(
    s3BucketName: string,
    s3subFolder: string,
    localFolder: string,
    tags: string
  ): Promise<void> {
    const filesPaths = glob
      .sync(path.join(localFolder, '**/*.*'), {absolute: true})
      .map(p => path.normalize(p))
    const numFiles = filesPaths.length
    for (const [i, filePath] of filesPaths.entries()) {
      const statistics = `(${i + 1}/${numFiles}, ${Math.round(
        ((i + 1) / numFiles) * 100
      )}%)`
      const fileContent = fs.readFileSync(filePath)
      // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
      const relativeToBaseFilePath = path.normalize(
        path.relative(localFolder, filePath)
      )
      let relativeToBaseFilePathForS3 = relativeToBaseFilePath
        .split(path.sep)
        .join('/')
      relativeToBaseFilePathForS3 = path.join(
        s3subFolder,
        relativeToBaseFilePathForS3
      )
      const mimeType = mime.getType(filePath)
      core.info(`Uploading ${statistics}, ${relativeToBaseFilePathForS3}`)
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      await this.s3Client
        .putObject({
          Bucket: s3BucketName,
          Key: relativeToBaseFilePathForS3,
          Body: fileContent,
          ContentType: mimeType,
          Tagging: `Buisness Unit=core3&${tags}`
        } as AWS.S3.PutObjectRequest)
        .promise()

      core.info(`Uploaded ${statistics} ${relativeToBaseFilePathForS3}`)
    }
  }

  async uploadFolder(
    awsBucket: string,
    s3Subfolder: string,
    sourceFolder: string,
    tags: string
  ): Promise<void> {
    const folderStats = fs.statSync(sourceFolder)
    if (!folderStats.isDirectory()) {
      throw new Error(`${sourceFolder} is not a directory.`)
    }
    return await this.internalUploadFolder(
      awsBucket,
      s3Subfolder,
      sourceFolder,
      tags
    )
  }

  async updateLatest(
    s3BucketName: string,
    targetSubfolder: string,
    projectName: string
  ): Promise<void> {
    const linkText = `<meta http-equiv="refresh" content="0; URL=https://bo.wix.com/core3-proxy/${targetSubfolder}/index.html"/>`
    const targetPath = `${projectName}/index.html`
    await this.s3Client
      .putObject({
        Bucket: s3BucketName,
        Key: targetPath,
        Body: linkText,
        ContentType: 'text/html;charset=UTF-8',
        Tagging: 'Buisness Unit=core3'
      } as AWS.S3.PutObjectRequest)
      .promise()
  }
}
