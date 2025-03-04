import React, { useState } from 'react';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const convertDropboxUrlToDirectLink = (url) => {
    // Check if it's a Dropbox URL
    if (!url.includes('dropbox.com')) {
      return url; // Not a Dropbox URL, return as is
    }
    
    try {
      // Extract the file name from the preview parameter
      const previewMatch = url.match(/preview=([^&]+)/);
      if (!previewMatch) {
        return url; // Can't find the preview parameter
      }
      
      const fileName = decodeURIComponent(previewMatch[1]);
      
      // Extract the folder path
      let folderPath = url.split('dropbox.com')[1].split('?')[0];
      
      // Create direct download URL
      return `https://dl.dropboxusercontent.com${folderPath}/${fileName}?dl=1`;
    } catch (error) {
      console.error('Error converting Dropbox URL:', error);
      return url; // Return original URL if anything goes wrong
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      setMessage('Name and URL are required!');
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert Dropbox URL if needed
      const processedUrl = convertDropboxUrlToDirectLink(formData.url);
      
      const response = await fetch('https://assignment-ikarus.onrender.com/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          url: processedUrl // Use the converted URL
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload model');
      }
      
      const result = await response.json();
      setMessage('Model uploaded successfully!');
      setFormData({
        name: '',
        description: '',
        url: ''
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload New 3D Model</h1>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Model Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="url">Model URL (GLB/GLTF)*</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com/model.glb"
            required
          />
          <small>
            Dropbox sharing links will be automatically converted to direct download links.
            For best results, use direct links to GLB/GLTF files.
          </small>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Model'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;