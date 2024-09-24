import {putObjectCommand, getObjectCommand} from "../config/aswS3.js";
import sharp from "sharp";
import {imageDir, videoDir} from "./directory.js";

const height = 800, width = 800;
const putSingleImage = async (directory, file) => {
    if (!file || !directory) return null;

    try {
        const buffer = await sharp(file.buffer)
            .resize({height: height, width: width, fit: "cover"})
            .toBuffer();

        return await putObjectCommand(directory, file, buffer);
    } catch (error) {
        console.log("ERROR putSingleImage: ", error);
        return null;
    }
}

const putSingleVideo = async (directory, file) => {
    if (!file || !directory) return null;

    try {
        return await putObjectCommand(directory, file, file.buffer);
    } catch (error) {
        console.log("ERROR putSingleVideo: ", error);
        return null;
    }
}

const putFiles = async (directory, files) => {
    if (!files || files.length === 0 || !directory) return null;
    const images = [];
    const videos = [];

    for (const file of files) {
        const mimeType = file.mimetype;
        try {
            if (mimeType.startsWith('image/')) {
                const buffer = await sharp(file.buffer)
                    .resize({height: height, width: width, fit: "cover"})
                    .toBuffer();
                const fileName = await putObjectCommand(`${directory}/${imageDir}`, file, buffer);
                images.push(fileName);
            } else if (mimeType.startsWith('video/')) {
                const fileName = await putObjectCommand(`${directory}/${videoDir}`, file, file.buffer);
                videos.push(fileName);
            }
        } catch (error) {
            console.log(`ERROR putFiles ${mimeType.startsWith('image/') ? 'image' : 'video'}: `, error.message);
        }
    }

    return {images, videos};
}

const getSingleImage = async (directory, key, maxAge) => {
    if (!key || !directory) return null;
    return {
        url: await getObjectCommand(directory, key, maxAge)
    }
}

const getFiles = async (directory, keys, maxAge, includeKey = false) => {
    if (!keys || keys.length === 0 || !directory) return null;

    return await Promise.all(
        keys.map(async (key) => {
            const filesData = {
                url: await getObjectCommand(directory, key, maxAge)
            };

            if (includeKey) {
                filesData.key = key;
            }

            return filesData;
        })
    );
}

export {
    putSingleImage,
    putSingleVideo,
    putFiles,
    getSingleImage,
    getFiles
}
