const { Worker } = require("bullmq");
const { spawn } = require("child_process");
const { bucket } = require("../firebase-config");
const { sendEmail } = require("../utils/mailer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const baseVideoDirectory = process.env.BASE_VIDEO_DIRECTORY;
const anacondaEnvPythonPath = process.env.ANACONDA_ENV_PYTHON_PATH;

async function downloadFile(url, destPath) {
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream(destPath));

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      console.log("File downloaded successfully");
      resolve();
    });

    response.data.on("error", (err) => {
      console.error("Error downloading the file", err);
      reject(err);
    });
  });
}

const songWorker = new Worker(
  "songProcessing",
  async (job) => {
    const { filename, modelName, userId, song, videoId, userEmail } = job.data;

    const fileRef = bucket.file(`${song.owner}/${song._id}/${song._id}`);
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });
    console.log("Download URL obtained:", url);

    const videoDirectory = path.join(
      baseVideoDirectory,
      "songs",
      song.owner,
      song._id,
      "videos"
    );
    console.log("Video directory path:", videoDirectory);
    await fs.promises.mkdir(videoDirectory, { recursive: true });
    console.log("Video directory ensured.");

    const audioFilePath = path.join(videoDirectory, song._id + ".mp3");
    console.log("Audio file path:", audioFilePath);

    await downloadFile(url, audioFilePath);
    console.log("Audio file downloaded and saved successfully.");

    const outputFilePath = path.join(__dirname, "output", `${filename}.mp4`);
    const stylePath = path.join(__dirname, "models", `${modelName}.pkl`);
    const scriptPath = path.join(__dirname, "script.py");

    console.log(`Python Path: ${anacondaEnvPythonPath}`);
    console.log(`Script Path: ${scriptPath}`);
    console.log(`Model Path: ${stylePath}`);
    console.log(`File Path: ${audioFilePath}`);

    // Use spawn to run the Python script using the Python executable from the Anaconda environment
    const command = anacondaEnvPythonPath;
    const args = [scriptPath, audioFilePath, outputFilePath, stylePath];

    const process = spawn(command, args, { shell: true });

    process.stdout.on("data", (data) => {
      console.log(`Progress update: ${data.toString()}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`Error: ${data.toString()}`);
    });

    process.on("close", async (code) => {
      if (code === 0) {
        console.log(
          `Processing song with ID: ${job.id} completed successfully`
        );

        const firebase_destination = `${song.owner}/${song._id}/${videoId}.mp4`;

        try {
          await bucket.upload(outputFilePath, {
            destination: firebase_destination,
            public: true,
          });

          console.log(
            `File uploaded to Firebase Storage at ${firebase_destination}`
          );

          // Send email
          try {
            console.log("Sending email to ", userEmail);
            const emailInfo = await sendEmail(userEmail);
            console.log("Email sent successfully:", emailInfo);
          } catch (error) {
            console.error("Failed to send email", error);
          }
        } catch (error) {
          console.error(
            `Failed to upload file to Firebase Storage: ${error.message}`
          );
        }
      } else {
        console.error(
          `Processing song with ID: ${job.id} failed with code ${code}`
        );
      }
    });
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

module.exports = { songWorker };
