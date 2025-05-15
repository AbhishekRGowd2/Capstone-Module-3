import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FlashcardForm = ({ onSubmit, setGroupTitle }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const initialValues = {
    title: '',
    description: '',
    imageBase64: '',
  };

  const validationSchema = Yup.object({
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        setGroupTitle(values.title);
        onSubmit({
          id: Date.now(),
          title: values.title,
          description: values.description,
          imageFile: values.imageBase64,
        });
        alert('Flashcard created!');
        clearForm(resetForm);
      }}
    >
      {({ setFieldValue, values }) => (
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
                      setGroupTitle(e.target.value); // Restore your logic
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
                    data-testid="file-input"
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

          <div className="text-center">
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded">Create Card</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FlashcardForm;
