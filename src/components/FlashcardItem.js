import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FlashcardItem = ({ flashcard: propFlashcard }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  const flashcardsState = useSelector((state) => state.flashcards);
  const flashcards = flashcardsState?.items || [];
  const reduxFlashcard = flashcards.find((item) => item.id === propFlashcard?.id) || propFlashcard;

  useEffect(() => {
    console.log("Flashcard Data:", reduxFlashcard);

    let storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    let storedFlashcard = storedFlashcards.find((item) => item.id === reduxFlashcard?.id);

    if (storedFlashcard?.imageFile) {
      setImageUrl(storedFlashcard.imageFile);
      setImageError(false);
    } else if (reduxFlashcard?.imageFile instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(reduxFlashcard.imageFile);
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImageUrl(base64Image);
        setImageError(false);
        let updatedFlashcards = [...storedFlashcards];
        let flashcardIndex = updatedFlashcards.findIndex((item) => item.id === reduxFlashcard.id);
        if (flashcardIndex !== -1) {
          updatedFlashcards[flashcardIndex].imageFile = base64Image;
        } else {
          updatedFlashcards.push({ ...reduxFlashcard, imageFile: base64Image });
        }
        localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
      };
    }
  }, [reduxFlashcard?.imageFile]);

  return (
    <div className="relative border rounded-md shadow-sm pt-10 w-72 h-52 bg-white text-center hover:shadow-md transition">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt="Flashcard"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            onError={() => {
              console.error("Image failed to load:", imageUrl);
              setImageError(true);
              setImageUrl(null);
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
      </div>

      <h2 className="font-semibold text-lg mb-1">{reduxFlashcard?.title || "No Title"}</h2>
      <p className="text-gray-600 text-base mb-1">
        {reduxFlashcard?.description || "No Description"}
      </p>

      {Array.isArray(reduxFlashcard?.terms) && (
        <p className="text-sm text-gray-500 mb-2">
          {reduxFlashcard.terms.length} {reduxFlashcard.terms.length === 1 ? 'card' : 'cards'}
        </p>
      )}

      <button
        onClick={() => navigate(`/flashcards/${reduxFlashcard.id}`)}
        className="border border-red-500 text-red-600 px-2 py-1 text-xs rounded hover:bg-red-50"
      >
        View Cards
      </button>
    </div>
  );
};

export default FlashcardItem;