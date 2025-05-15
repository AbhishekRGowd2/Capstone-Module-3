import { useState, useEffect } from 'react';
import { FiUpload, FiTrash2, FiEdit } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FlashcardPage = () => {
  const [terms, setTerms] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const initialFlashcardValues = {
    title: '',
    description: '',
    imageBase64: '',
  };

  const flashcardValidationSchema = Yup.object({
    title: Yup.string().required('Group title is required'),
    description: Yup.string().required('Description is required'),
    imageBase64: Yup.string().required('Image is required'),
  });

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setFieldValue('imageBase64', reader.result);
      };
    }
  };

  const clearForm = (resetForm) => {
    setImageFile(null);
    setImageBase64(null);
    localStorage.removeItem('flashcardTitle');
    localStorage.removeItem('flashcardDescription');
    localStorage.removeItem('flashcardImage');
    resetForm();
  };

  const handleFlashcardSubmit = (values, { resetForm }) => {
    setGroupTitle(values.title);
    alert('Flashcard created!');
    clearForm(resetForm);
  };

  useEffect(() => {
    const storedTerms = JSON.parse(localStorage.getItem("terms")) || [];
    setTerms(storedTerms);
  }, []);

  useEffect(() => {
    localStorage.setItem("terms", JSON.stringify(terms));
  }, [terms]);

  const handleAddMore = async () => {
    if (terms.length === 0) {
      setTerms([...terms, { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true }]);
      return;
    }

    const lastTerm = terms[terms.length - 1];

    // Validate the last form manually
    const errors = {};
    if (!lastTerm.title.trim()) errors.title = 'Term is required';
    if (!lastTerm.definition.trim()) errors.definition = 'Definition is required';

    if (Object.keys(errors).length > 0) {
      return;
    }

    setTerms([...terms, { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true }]);
  };

  const updateTerm = (index, field, value) => {
    const updatedTerms = [...terms];
    updatedTerms[index][field] = value;
    setTerms(updatedTerms);
  };

  const removeTerm = (index) => {
    const updatedTerms = terms.filter((_, i) => i !== index);
    setTerms(updatedTerms);
  };

  const toggleEdit = (index) => {
    const updatedTerms = [...terms];
    updatedTerms[index].isEditing = !updatedTerms[index].isEditing;
    setTerms(updatedTerms);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedTerms = [...terms];
        updatedTerms[index].imageFile = base64Image;
        updatedTerms[index].imagePreview = base64Image;
        setTerms(updatedTerms);
      };
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Flashcard</h1>

      {/* Display success alert */}
      {alertMessage && (
        <div className="bg-green-500 text-white p-4 rounded-md text-center mb-4">
          {alertMessage}
        </div>
      )}

      {/* Flashcard form */}
      <Formik
        initialValues={initialFlashcardValues}
        validationSchema={flashcardValidationSchema}
        onSubmit={handleFlashcardSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            <div className="flex gap-8 items-center">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Create Group</label>
                <Field name="title">
                  {({ field, form }) => (
                    <input
                      {...field}
                      className="p-2 border w-full"
                      placeholder="Enter group name"
                      onChange={(e) => {
                        form.setFieldValue('title', e.target.value);
                        setGroupTitle(e.target.value);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex-1">
                <label className="block font-semibold mb-1">Upload Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center border border-gray-400 text-blue-600 px-4 py-2 rounded cursor-pointer">
                    <FiUpload size={18} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                  </label>
                  {imageBase64 && (
                    <img
                      src={imageBase64}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                </div>
                <ErrorMessage name="imageBase64" component="div" className="text-red-500 text-sm mt-1" />
                {imageFile && <p className="text-sm mt-1 text-gray-600">{imageFile.name}</p>}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Add Description</label>
              <Field
                as="textarea"
                name="description"
                className="p-2 border w-full h-32"
                placeholder="Describe the roles, responsibilities, skills required..."
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Term Form */}
            <div className="space-y-6">
              {terms.length === 0 && <div className="text-gray-500 italic">Click "+ Add More" to add terms</div>}
              {terms.map((term, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="font-bold text-xl w-8">{index + 1}.</div>
                  <div className="flex flex-col w-1/3">
                    <label className="font-semibold mb-1">Enter Term</label>
                    <input
                      value={term.title}
                      onChange={(e) => updateTerm(index, 'title', e.target.value)}
                      className="p-2 border"
                      placeholder="Term"
                      disabled={!term.isEditing}
                    />
                    {index === terms.length - 1 && <div className="text-red-500 text-sm">Term is required</div>}
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label className="font-semibold mb-1">Enter Definition</label>
                    <input
                      value={term.definition}
                      onChange={(e) => updateTerm(index, 'definition', e.target.value)}
                      className="p-2 border"
                      placeholder="Definition"
                      disabled={!term.isEditing}
                    />
                    {index === terms.length - 1 && <div className="text-red-500 text-sm">Definition is required</div>}
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center border border-gray-400 text-blue-600 px-4 py-2 rounded cursor-pointer gap-2 mt-6">
                        <FiUpload size={18} />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(index, e)}
                          disabled={!term.isEditing}
                        />
                      </label>

                      {term.imagePreview && (
                        <img
                          src={term.imagePreview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <p className="text-xs text-gray-500 mt-1">Image Preview</p>
                    </div>

                    <button onClick={() => toggleEdit(index)} className="text-blue-600">
                      <FiEdit size={20} />
                    </button>
                    <button onClick={() => removeTerm(index)} className="text-red-500">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddMore}
                className="bg-green-500 text-white p-2 rounded"
              >
                + Add More
              </button>
            </div>

            {/* Create Button */}
            <div className="text-center mt-6">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded">Create Flashcard</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FlashcardPage;
