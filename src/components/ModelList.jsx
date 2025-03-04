import React from 'react';

const ModelList = ({ models, onSelectModel, selectedModel }) => {
  if (models.length === 0) {
    return <p>No models found</p>;
  }

  return (
    <div className="model-list">
      <h2>Available Models</h2>
      <ul>
        {models.map(model => (
          <li 
            key={model.id}
            className={selectedModel && selectedModel.id === model.id ? 'selected' : ''}
            onClick={() => onSelectModel(model)}
          >
            <h3>{model.name}</h3>
            <p>{model.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelList;