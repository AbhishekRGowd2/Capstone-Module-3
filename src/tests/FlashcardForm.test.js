import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FlashcardForm from '../components/FlashcardForm';

describe('FlashcardForm', () => {
  const mockSubmit = jest.fn();
  const mockSetGroupTitle = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockSetGroupTitle.mockClear();
    global.alert = jest.fn(); // Mock alert to prevent errors

    // Mock FileReader
    class FileReaderMock {
      constructor() {
        this.onloadend = null;
        this.result = 'data:image/png;base64,mockedImage';
      }
      readAsDataURL() {
        setTimeout(() => {
          if (this.onloadend) this.onloadend();
        }, 0); // Make async fast
      }
    }
    global.FileReader = FileReaderMock;

    render(<FlashcardForm onSubmit={mockSubmit} setGroupTitle={mockSetGroupTitle} />);
  });

  it('submits the form when all fields are valid', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(screen.getByPlaceholderText(/enter group name/i), {
      target: { value: 'My Flashcard' },
    });

    fireEvent.change(screen.getByPlaceholderText(/describe the roles/i), {
      target: { value: 'Some description here' },
    });

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for FileReader + image preview
    await waitFor(() => {
      expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /create card/i }));

    await waitFor(() => {
      expect(mockSetGroupTitle).toHaveBeenCalledWith('My Flashcard');
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
