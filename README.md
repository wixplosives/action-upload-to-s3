# wixplosives/action-upload-to-s3 recursively upload folder to s3 bucket

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```



## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

In order to use this action you need bucket in aws s3 and proper credentials for it.

```yaml
uses: wixplosives/action-upload-to-s3@v1
with:
  accessKeyId: YOUR_AWS_SECRET_ID
  secretAccessKey: YOUR_AWS_SECRET_KEY
  awsBucket: test-bucket
  s3Subfolder: test-folder
  sourceFolder: my-folder
```

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
