import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'
//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { TodoItem } from '../models/TodoItem'
// import {parseUserId } from '../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)


export class BucketAccess {

  constructor(
    private s3 = new XAWS.S3({
        signatureVersion: 'v4' 
      }),
    private imagesBucketName = process.env.IMAGES_S3_BUCKET){
  }

  getPresignedUrl(imageId: uuid) {
    //console.log('Getting presigned url....')
    //
    const presignedUrl = this.s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
        Bucket: this.imagesBucketName, // Name of an S3 bucket
        Key: imageId, // id of an object this URL allows access to
        Expires: '300'  // A URL is only valid for 5 minutes
      })
    console.log("generated presigned url:", presignedUrl)
    return presignedUrl
  }

  getImageUrl(imageId){
      return `https://${this.imagesBucketName}.s3.amazonaws.com/${imageId}`
  }

}
