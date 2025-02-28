'use client';

import { useState } from 'react';
import Head from 'next/head';
import styles from '@/app/Home.module.scss';

export default function Home() {
  const [videoSrc, setVideoSrc] = useState(); // Change to videoSrc instead of imageSrc
  const [uploadData, setUploadData] = useState();

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setVideoSrc(onLoadEvent.target.result); // Set video preview
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'pslab_videos'); // Adjusted to video preset

    const data = await fetch('https://api.cloudinary.com/v1_1/dipmjt9ta/video/upload', {  // Updated to the video upload endpoint
      method: 'POST',
      body: formData,
    }).then((r) => r.json());

    setVideoSrc(data.secure_url);  // Set the video URL
    setUploadData(data); // Store the Cloudinary response
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Video Uploader</title> {/* Title updated to reflect video upload */}
        <meta name="description" content="Upload your video to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Video Uploader {/* Title updated */}
        </h1>

        <p className={styles.description}>
          Upload your video to Cloudinary!
        </p>

        <form className={styles.form} method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <p>
            <input type="file" name="file" accept="video/*" /> {/* Updated to accept video files */}
          </p>

          {videoSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {/* Display the video if a preview URL is set */}
          {videoSrc && !uploadData && (
            <video controls width="300">
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {uploadData && (
            <code>
              <pre>{JSON.stringify(uploadData, null, 2)}</pre>
            </code>
          )}
        </form>
      </main>

      <footer className={styles.footer}>
        <p>Find the tutorial on <a href="https://spacejelly.dev/">spacejelly.dev</a>!</p>
      </footer>
    </div>
  );
}
