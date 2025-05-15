import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaShareAlt, FaDownload, FaPrint } from "react-icons/fa";
import TermDetails from "./Termdetails";
import ShareModal from "./ShareModal"; // Import the ShareModal component

const FlashcardView = () => {
  const { flashcardId } = useParams();
  const flashcards = useSelector((state) => state.flashcards?.flashcards || []);
  const flashcard = flashcards.find((card) => card.id === Number(flashcardId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcardImageUrl, setFlashcardImageUrl] = useState(null);
  const [termImageUrl, setTermImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for visibility
  const [shareLink, setShareLink] = useState(""); // Link to be shared

  if (!flashcard) return <p className="text-center text-red-500">Flashcard not found!</p>;

  const terms = flashcard.terms || [];

  // Debugging logs
  useEffect(() => {
    console.log("Selected Flashcard Data:", flashcard);
  }, [flashcard]);

  useEffect(() => {
    console.log("Current Term Data:", terms[currentIndex]);
  }, [currentIndex, terms]);

  // Generate blob URL for flashcard image
  useEffect(() => {
    console.log("Flashcard Image File:", flashcard.imageFile);

    if (flashcard.imageFile && typeof flashcard.imageFile === "string") {
      setFlashcardImageUrl(flashcard.imageFile);
    } else if (flashcard.imageFile instanceof Blob) {
      const blobUrl = URL.createObjectURL(flashcard.imageFile);
      setFlashcardImageUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl); // Cleanup
    } else {
      setFlashcardImageUrl(null);
    }
  }, [flashcard.imageFile]);

  // Generate blob URL for term image
  useEffect(() => {
    const term = terms[currentIndex];

    console.log("Term Image File:", term?.imageFile);
    console.log("Term Image Preview:", term?.imagePreview);

    if (term?.imagePreview && typeof term.imagePreview === "string") {
      setTermImageUrl(term.imagePreview);
    } else if (term?.imageFile instanceof Blob) {
      const blobUrl = URL.createObjectURL(term.imageFile);
      setTermImageUrl(blobUrl);
      return () => URL.revokeObjectURL(blobUrl); // Cleanup
    } else {
      setTermImageUrl(null);
    }
  }, [currentIndex, terms]);

  const nextTerm = () => setCurrentIndex((prev) => (prev + 1) % terms.length);
  const prevTerm = () => setCurrentIndex((prev) => (prev - 1 + terms.length) % terms.length);

  // Handle the Share button click
  const handleShareClick = () => {
    setShareLink(window.location.href); // Set the current page URL as the share link
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="min-h-screen bg-[#f9f6f2] p-6">
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-red-600">Create Flashcard</h2>
          <div className="flex gap-6 mt-1 text-sm text-gray-600">
            <span className="font-semibold text-black border-b-2 border-red-600">Create New</span>
            <span className="hover:text-black cursor-pointer">My Flashcard</span>
          </div>
        </div>
      </div> */}
  
      {/* Title and Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{flashcard.title}</h3>
        <p className="text-gray-500 text-sm">
          {flashcard.description}
        </p>
      </div>
  
      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Terms */}
        <div className="col-span-2 bg-white border rounded-md shadow-sm">
          <div className="p-4">
            <ul className="space-y-2 text-sm">
              {terms.map((term, index) => (
                <li
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`cursor-pointer font-medium ${
                    index === currentIndex ? "text-red-600" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {term.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Main Card */}
        <div className="col-span-7 bg-white rounded-md shadow-sm">
          <div className="flex">
            {/* Term Image */}
            <div className="w-1/2 p-6 flex justify-center items-center">
              {termImageUrl ? (
                <img
                  src={termImageUrl}
                  alt={terms[currentIndex]?.title}
                  className="rounded-md w-[150px] h-[200px] object-cover"
                />
              ) : (
                <p className="text-gray-400">No Image</p>
              )}
            </div>
  
            {/* Term Details */}
            <div className="w-1/2 p-6">
              <p className="text-sm text-gray-500 mb-2">{terms[currentIndex]?.title}</p>
              <p className="text-sm text-gray-700">{terms[currentIndex]?.definition}</p>
            </div>
          </div>
        </div>
  
        {/* Right Action Panel */}
        <div className="col-span-3 flex flex-col gap-3">
          <button
            onClick={handleShareClick}
            className="flex items-center gap-2 justify-center px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50"
          >
            <FaShareAlt /> Share
          </button>
          <button className="flex items-center gap-2 justify-center px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">
            <FaDownload /> Download
          </button>
          <button className="flex items-center gap-2 justify-center px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">
            <FaPrint /> Print
          </button>
        </div>
      </div>
  
      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button onClick={prevTerm} className="text-gray-500 hover:text-black">
          <FaArrowLeft size={18} />
        </button>
        <p className="text-gray-700 text-sm">{`${currentIndex + 1}/${terms.length}`}</p>
        <button onClick={nextTerm} className="text-gray-500 hover:text-black">
          <FaArrowRight size={18} />
        </button>
      </div>
    </div>
  
    {isModalOpen && <ShareModal link={shareLink} onClose={() => setIsModalOpen(false)} />}
  </div>
  
  );
};

export default FlashcardView;
