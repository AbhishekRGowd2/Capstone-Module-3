// TermDetails.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import TermDetails from '../components/Termdetails'; // adjust path if needed

describe('TermDetails', () => {
  const baseTerm = {
    title: 'Photosynthesis',
    definition: 'The process by which green plants make their own food.',
  };

  it('renders term title and definition', () => {
    render(<TermDetails term={baseTerm} />);
    expect(screen.getByText(/Photosynthesis/i)).toBeInTheDocument();
    expect(screen.getByText(/green plants make their own food/i)).toBeInTheDocument();
  });

  it('renders image when term.image is truthy', () => {
    const termWithImage = {
      ...baseTerm,
      image: true,
      imageFile: 'http://example.com/photo.jpg',
    };

    render(<TermDetails term={termWithImage} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', termWithImage.imageFile);
    expect(img).toHaveAttribute('alt', termWithImage.title);
  });

  it('does not render image when term.image is falsy', () => {
    render(<TermDetails term={{ ...baseTerm, image: false }} />);
    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });
});
