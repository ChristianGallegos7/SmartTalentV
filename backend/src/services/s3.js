const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

async function uploadToS3(buffer, mimetype, filename) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: `cvs/${filename}`,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/cvs/${filename}`;
}

async function descargarDeS3(resumeUrl) {
  // Extrae el Key de la URL: https://bucket.s3.region.amazonaws.com/cvs/filename.pdf
  const url = new URL(resumeUrl);
  const key = url.pathname.slice(1); // quita el "/" inicial

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const respuesta = await s3.send(command);

  const chunks = [];
  for await (const chunk of respuesta.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = { uploadToS3, descargarDeS3 };
