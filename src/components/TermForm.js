import { FiUpload, FiTrash2, FiEdit } from 'react-icons/fi';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TermForm = ({ terms, setTerms, isDisabled }) => {
  useEffect(() => {
    const storedTerms = JSON.parse(localStorage.getItem("terms")) || [];
    setTerms(storedTerms);
  }, []);

  useEffect(() => {
    localStorage.setItem("terms", JSON.stringify(terms));
  }, [terms]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: terms[terms.length - 1] || { title: '', definition: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Term is required'),
      definition: Yup.string().required('Definition is required'),
    }),
    onSubmit: () => {
      if (!isDisabled) {
        setTerms([
          ...terms,
          { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true }
        ]);
      }
    }
  });

  const handleAddMore = async () => {
    if (terms.length === 0) {
      setTerms([
        ...terms,
        { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true }
      ]);
      return;
    }

    const lastTerm = terms[terms.length - 1];

    // Validate the last form manually
    const errors = {};
    if (!lastTerm.title.trim()) errors.title = 'Term is required';
    if (!lastTerm.definition.trim()) errors.definition = 'Definition is required';

    if (Object.keys(errors).length > 0) {
      formik.setTouched({ title: true, definition: true });
      formik.setErrors(errors);
      return;
    }

    // Add new blank term if previous one is valid
    setTerms([
      ...terms,
      { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true }
    ]);
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
    <div className={`space-y-6 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
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
              disabled={isDisabled || !term.isEditing}

            />
            {index === terms.length - 1 && formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
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
            {index === terms.length - 1 && formik.touched.definition && formik.errors.definition && (
              <div className="text-red-500 text-sm">{formik.errors.definition}</div>
            )}
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
                  data-testid={`file-input-${index}`}
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

            <button onClick={() => toggleEdit(index)} className="text-blue-600" aria-label="Edit" data-testid={`edit-button-${index}`}>
              <FiEdit size={20} />
            </button>

            <button onClick={() => removeTerm(index)} className="text-red-500" data-testid={`delete-button-${index}`} >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddMore}
        className={`bg-green-500 text-white p-2 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isDisabled}
      >
        + Add More
      </button>
    </div>
  );
};

export default TermForm;
