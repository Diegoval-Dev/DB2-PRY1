import React, { useState } from 'react';
import './styles/Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: Array<{ nombre: string }>;
}

const Input: React.FC<InputProps> = ({ suggestions = [], ...props }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{ nombre: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.nombre.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (nombre: string) => {
    setInputValue(nombre);
    setShowSuggestions(false);
  };

  return (
    <div className="input-container">
      <input 
        className="input"
        value={inputValue} 
        onChange={handleChange} 
        {...props} 
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(suggestion.nombre)}
              className="suggestion-item"
            >
              {suggestion.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input;
