import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TermForm from '../components/TermForm';
import React from 'react';

describe('TermForm Component', () => {
  const mockSetTerms = jest.fn();

  beforeEach(() => {
    mockSetTerms.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Click \"+ Add More\" to add terms" message when terms are empty', () => {
    render(<TermForm terms={[]} setTerms={mockSetTerms} isDisabled={false} />);
    expect(screen.getByText("Click \"+ Add More\" to add terms")).toBeInTheDocument();
  });

  it('renders a term input field for each term in the terms array', () => {
    const terms = [{ title: 'Term 1', definition: 'Definition 1', isEditing: true }];
    render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={false} />);

    expect(screen.getByPlaceholderText('Term')).toHaveValue('Term 1');
    expect(screen.getByPlaceholderText('Definition')).toHaveValue('Definition 1');
  });

  it('enables editing when the Edit button is clicked', () => {
    const terms = [{ title: 'Term 1', definition: 'Definition 1', isEditing: false }];
    render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={false} />);

    const editButton = screen.getByTestId('edit-button-0');
    fireEvent.click(editButton);

    expect(mockSetTerms).toHaveBeenCalledWith([
      { title: 'Term 1', definition: 'Definition 1', isEditing: true },
    ]);
  });

  // it('disables inputs and button when isDisabled is true', () => {
  //   const terms = [{ title: 'Term 1', definition: 'Definition 1', isEditing: true }];
  //   render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={true} />);

  //   expect(screen.getByPlaceholderText('Term')).toBeDisabled();
  //   expect(screen.getByPlaceholderText('Definition')).toBeDisabled();
  //   expect(screen.getByText('+ Add More')).toBeDisabled();
  // });

  it('calls removeTerm when the delete button is clicked', () => {
    const terms = [{ title: 'Term 1', definition: 'Definition 1', isEditing: true }];
    render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={false} />);

    fireEvent.click(screen.getByTestId('delete-button-0'));
    expect(mockSetTerms).toHaveBeenCalledWith([]);
  });

  it('adds a new term when Add More is clicked and last term is valid', () => {
    const terms = [{ title: 'Term 1', definition: 'Definition 1', isEditing: true }];
    render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={false} />);

    fireEvent.click(screen.getByText('+ Add More'));

    expect(mockSetTerms).toHaveBeenCalledWith([
      ...terms,
      { title: '', definition: '', imageFile: null, imagePreview: null, isEditing: true },
    ]);
  });

  it('does not add a new term when Add More is clicked and last term is invalid', () => {
    const invalidTerms = [
      { title: '', definition: '', isEditing: true, imageFile: null, imagePreview: null }
    ];
  
    render(<TermForm terms={invalidTerms} setTerms={mockSetTerms} isDisabled={false} />);
  
    // Clear any calls made during initial render
    mockSetTerms.mockClear();
  
    const addMoreBtn = screen.getByText('+ Add More');
    fireEvent.click(addMoreBtn);
  
    expect(mockSetTerms).not.toHaveBeenCalled();
  });
  

  it('uploads an image and updates imagePreview when a file is selected', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    const terms = [
      { title: 'Term 1', definition: 'Definition 1', isEditing: true, imageFile: null, imagePreview: null },
    ];
    render(<TermForm terms={terms} setTerms={mockSetTerms} isDisabled={false} />);

    const fileInput = screen.getByTestId('file-input-0');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSetTerms).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'Term 1',
          definition: 'Definition 1',
          isEditing: true,
          imageFile: expect.stringContaining('data:image'),
          imagePreview: expect.stringContaining('data:image'),
        }),
      ]);
    });
  });
});
