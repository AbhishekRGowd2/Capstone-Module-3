// ShareModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareModal from '../components/ShareModal'; // adjust the path as needed

describe('ShareModal', () => {
  const mockClipboard = {
    writeText: jest.fn(),
  };

  const originalClipboard = { ...global.navigator.clipboard };

  beforeAll(() => {
    Object.assign(global.navigator, {
      clipboard: mockClipboard,
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    global.navigator.clipboard = originalClipboard;
    jest.restoreAllMocks();
  });

  it('copies link and shows alert when "Copy Link" button is clicked', () => {
    const testLink = 'http://example.com';
    const onClose = jest.fn();

    render(<ShareModal link={testLink} onClose={onClose} />);

    const copyButton = screen.getByText(/Copy Link/i);
    fireEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(testLink);
    expect(window.alert).toHaveBeenCalledWith('Link copied to clipboard!');
  });
});
