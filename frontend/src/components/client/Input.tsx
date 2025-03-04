// Input.tsx
import React, { useState } from 'react';
import './styles/Input.css';

// Tipo base para sugerencias: cualquier objeto que tenga al menos "nombre"
interface BaseSuggestion {
  nombre: string;
}

interface InputProps<T extends BaseSuggestion> extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: T[];
  onSelectSuggestion?: (suggestion: T) => void;
  // Opcionalmente, puedes permitir especificar qué propiedad mostrar (por defecto "nombre")
  displayField?: keyof T;
}

const Input = <T extends BaseSuggestion>({
  suggestions = [],
  onSelectSuggestion,
  displayField = 'nombre',
  ...props
}: InputProps<T>) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        String(suggestion[displayField])
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: T) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    setInputValue(String(suggestion[displayField]));
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
              onClick={() => handleSelect(suggestion)}
              className="suggestion-item"
            >
              {String(suggestion[displayField])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input;
