import path from 'path';
import fs from 'fs';
import glob from 'glob';
import AWS from 'aws-sdk';
import mime from 'mime';

async function internalUploadFolder(
    accessKeyIdPar: string,
    secretAccessKeyPar: string,
    s3BucketName: string,
    s3subFolder: string,
    localFolder: string
) {
    AWS.config.setPromisesDependency(Promise);
    const s3 = new AWS.S3({
        signatureVersion: 'v4',
        accessKeyId: accessKeyIdPar,
        secretAccessKey: secretAccessKeyPar,
        region: 'us-east-1'
    });

    const filesPaths = glob.sync(path.join(localFolder, '**/*.*'), { absolute: true }).map(p => path.normalize(p));

    const numFiles = filesPaths.length;
    for (const [i, filePath] of filesPaths.entries()) {
        const statistics = `(${i + 1}/${numFiles}, ${Math.round(((i + 1) / numFiles) * 100)}%)`;
        const fileContent = fs.readFileSync(filePath);
        // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
        const relativeToBaseFilePath = path.normalize(path.relative(localFolder, filePath));
        let relativeToBaseFilePathForS3 = relativeToBaseFilePath.split(path.sep).join('/');
        relativeToBaseFilePathForS3 = path.join(s3subFolder, relativeToBaseFilePathForS3);
        const mimeType = mime.getType(filePath);
        console.log(`Uploading`, statistics, relativeToBaseFilePathForS3);
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        await s3
            .putObject({
                Bucket: s3BucketName,
                Key: relativeToBaseFilePathForS3,
                Body: fileContent,
                ContentType: mimeType,
                Metadata: {
                  'cijoe': 'True'
                 }
            } as AWS.S3.PutObjectRequest)
            .promise();

        console.log(`Uploaded `, statistics, relativeToBaseFilePathForS3);
    }
}

export async function uploadFolder(accessKeyId: string, secretAccessKey: string, awsBucket:string , s3Subfolder: string, sourceFolder: string) {   
    const folderStats = fs.statSync(sourceFolder);
    if (!folderStats.isDirectory()) {
        throw new Error(`${sourceFolder} is not a directory.`);
    }
    return await internalUploadFolder(accessKeyId, secretAccessKey, awsBucket, s3Subfolder, sourceFolder);
}