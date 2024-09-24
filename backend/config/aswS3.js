import {S3Client} from "@aws-sdk/client-s3";
import {PutObjectCommand, GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {extname} from "path";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {generateS3Key} from "../utils/generate.js";
import dotenv from "dotenv";

dotenv.config();
const bucketName = process.env.BUCKET_NAME;

const awsS3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});

const putObjectCommand = async (directory, file, buffer) => {
    const key = generateS3Key() + extname(file.originalname);

    const params = {
        Bucket: bucketName,
        Key: `${directory}/${key}`,
        Body: buffer,
        ContentType: file.mimetype
    };

    try {
        const command = new PutObjectCommand(params);
        await awsS3.send(command);
        return key;
    } catch (error) {
        console.log(`ERROR putObjectCommand: ${error.message}`);
        throw error;
    }
}

const getObjectCommand = async (directory, key, maxAge) => {
    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: `${directory}/${key}`
        };
        const command = new GetObjectCommand(getObjectParams);
        return await getSignedUrl(awsS3, command, {expiresIn: maxAge});
    } catch (error) {
        console.log(`ERROR getObjectCommand: ${error.message}`);
        throw error;
    }
}

const deleteObjectCommand = async (directory, key) => {
    try {
        const deleteObjectParams = {
            Bucket: bucketName,
            Key: `${directory}/${key}`
        };
        const command = new DeleteObjectCommand(deleteObjectParams);
        await awsS3.send(command);
    } catch (error) {
        console.log(`ERROR deleteObjectCommand: ${error.message}`);
        throw error;
    }
}

export {putObjectCommand, getObjectCommand, deleteObjectCommand};
