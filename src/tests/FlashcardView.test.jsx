import { render, screen } from '@testing-library/react';
import FlashcardView from '../components/FlashcardView';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from '../redux/store'; // Adjust according to your structure


beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});

test('renders FlashcardView heading', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FlashcardView />
      </MemoryRouter>
    </Provider>
  );  
  const heading = screen.getByText(/Flashcard not found!/i);
  expect(heading).toBeInTheDocument();
});
