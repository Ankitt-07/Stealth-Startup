
import React, { useState, useEffect } from 'react';


const FORM_TYPE_CONFIGS = {
  'User Information': {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false }
    ]
  },
  'Address Information': {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { 
        name: "state", 
        type: "dropdown", 
        label: "State", 
        options: ["California", "Texas", "New York"], 
        required: true 
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false }
    ]
  },
  'Payment Information': {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
    ]
  }
};

const DynamicForm = () => {
  const [selectedFormType, setSelectedFormType] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (selectedFormType) {
      const config = FORM_TYPE_CONFIGS[selectedFormType];
      setFormFields(config.fields);
      setFormData({});
      setErrors({});
      calculateProgress(config.fields, {});
    }
  }, [selectedFormType]);

  const calculateProgress = (fields, currentData) => {
    const requiredFields = fields.filter(field => field.required);
    const completedFields = requiredFields.filter(field => 
      currentData[field.name] && currentData[field.name].trim() !== ''
    );
    const progressPercentage = (completedFields.length / requiredFields.length) * 100;
    setProgress(progressPercentage);
  };

  const handleFieldChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    calculateProgress(formFields, newFormData);
  };

  const validateForm = () => {
    const newErrors = {};
    formFields.forEach(field => {
      const value = formData[field.name];
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'number' && value && isNaN(Number(value))) {
        newErrors[field.name] = `${field.label} must be a number`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = { ...formData, id: Date.now() };
      setSubmittedData([...submittedData, submissionData]);
      setSubmitMessage('Sign-up Successful!');
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleEdit = (id) => {
    const editItem = submittedData.find(item => item.id === id);
    setFormData(editItem);
    const editedDataWithoutItem = submittedData.filter(item => item.id !== id);
    setSubmittedData(editedDataWithoutItem);
  };

  const handleDelete = (id) => {
    const updatedData = submittedData.filter(item => item.id !== id);
    setSubmittedData(updatedData);
  };

  const renderFormField = (field) => {
    if (field.type === 'dropdown') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
        </div>
      );
    }

    return (
      <div key={field.name} className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
        <input
          type={field.type}
          value={formData[field.name] || ''}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          required={field.required}
          className={`w-full px-3 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Dynamic Form Generator</h2>

        {/* Form Type Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Form Type</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setSelectedFormType(e.target.value)}
            value={selectedFormType}
          >
            <option value="">Choose Form Type</option>
            {Object.keys(FORM_TYPE_CONFIGS).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Progress Bar */}
        {selectedFormType && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Form Completion: {progress.toFixed(0)}%
            </p>
          </div>
        )}

        {/* Dynamic Form Fields */}
        {formFields.map(renderFormField)}

        {/* Submit Button */}
        {selectedFormType && (
          <button 
            onClick={handleSubmit} 
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Form
          </button>
        )}

        {/* Success Message */}
        {submitMessage && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {submitMessage}
          </div>
        )}

        {/* Submitted Data Table */}
        {submittedData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Submitted Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(submittedData[0])
                      .filter(key => key !== 'id')
                      .map(key => (
                        <th key={key} className="border p-2 text-left">{key}</th>
                      ))}
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData.map(data => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      {Object.keys(data)
                        .filter(key => key !== 'id')
                        .map(key => (
                          <td key={key} className="border p-2">{data[key]}</td>
                        ))}
                      <td className="border p-2">
                        <button 
                          onClick={() => handleEdit(data.id)}
                          className="mr-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(data.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;