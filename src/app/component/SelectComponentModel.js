import React, { useState } from 'react';

const SelectionComponent = (props) => {
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    { value: 'llama3:8b', label: 'llama3:8b' },
    { value: 'wizard-vicuna-uncensored:7b', label: 'wizard-vicuna-uncensored:7b' },
    // { value: 'option3', label: 'Option 3' },
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
    props.onmodel(event.target.value)
  };

  return (
    <div className='fixed right-5 top-10'>
      <h1>Choisissez une option</h1>
      <select value={selectedOption} onChange={handleChange}>
        <option value="" disabled>
          Sélectionnez un model 
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption && <p>Vous avez sélectionné : {selectedOption}</p>}
    </div>
  );
};

export default SelectionComponent;
