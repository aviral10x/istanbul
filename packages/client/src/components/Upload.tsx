"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromptUploader: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [cid, setCid] = useState<string>('');
  const [retrievedData, setRetrievedData] = useState<string>('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const uploadStringData = async () => {
    setUploading(true);
    try {
      const url = 'https://api.nft.storage/upload';
      const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVkRjZjN2MwRjFiZmVCRjU3ZTlBYjQ1MDgxRkM2RTk0ZDRjNzk1MDIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NTk4Nzc3MTAwNCwibmFtZSI6Im5mdCJ9.LK8knz45WvS__jRf6DIZ5UU5t6c4C1tbBMbrNwY_-Tk";

      const blob = new Blob([prompt], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, 'data.json');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload Response:", response.data);
      const newCid = response.data.value.cid;
      setCid(newCid); // Store the CID for later retrieval
      await retrieveData(newCid); // Automatically retrieve data after upload
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const retrieveData = async (currentCid: string) => {
    try {
      const gatewayUrl = `https://${currentCid}.ipfs.nftstorage.link/data.json`;
      const response = await axios.get(gatewayUrl);
      // Prepend new data above old data
      setRetrievedData(prevData => `${response.data}\n${prevData}`);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    uploadStringData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your data"
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {retrievedData && (
        <div>
          <h3>Retrieved Data:</h3>
          <pre>{retrievedData}</pre>
        </div>
      )}
    </div>
  );
};

export default PromptUploader;
