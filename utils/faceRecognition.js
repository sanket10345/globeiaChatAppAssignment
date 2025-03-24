import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const rekognition = new AWS.Rekognition();

// export async function uploadFaceData(imageBuffer) {
//   // Index the face in the specified Rekognition collection
//   const params = {
//     CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID,
//     Image: { Bytes: imageBuffer }
//   };

//   const response = await rekognition.indexFaces(params).promise();
//   if (response.FaceRecords && response.FaceRecords.length > 0) {
//     return response.FaceRecords[0].Face.FaceId;
//   }
//   throw new Error('No face detected');
// }

export async function compareFaceData(imageBuffer, faceId) {
  // Search the collection for a face matching the new image
  const searchParams = {
    CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID,
    Image: { Bytes: imageBuffer },
    FaceMatchThreshold: 95,
    MaxFaces: 1
  };

  const response = await rekognition.searchFacesByImage(searchParams).promise();
  if (response.FaceMatches && response.FaceMatches.length > 0) {
    return response.FaceMatches[0].Face.FaceId === faceId;
  }
  return false;
}
