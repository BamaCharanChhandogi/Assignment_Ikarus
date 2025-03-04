import React, { useState, useEffect } from 'react';
import ModelViewer from './ModelViewer';
import SearchBar from './SearchBar';
import ModelList from './ModelList';

const HomePage = () => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/models');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setModels(data);
      setFilteredModels(data);
      if (data.length > 0) {
        setSelectedModel(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
  };

  return (
    <div className="home-page">
      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="content-section">
        <div className="model-list-container">
          {loading ? (
            <p>Loading models...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <ModelList 
              models={filteredModels} 
              onSelectModel={handleSelectModel} 
              selectedModel={selectedModel} 
            />
          )}
        </div>
        
        <div className="model-viewer-container">
          {selectedModel ? (
            <ModelViewer modelUrl={selectedModel.url} />
          ) : (
            <p>Select a model to view</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
