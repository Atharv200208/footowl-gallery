import { act } from '@testing-library/react-native';
import { useFavoritesStore } from '../src/state/favorites';

describe('favorites store (zustand)', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: {} }, true);
  });

  it('starts empty', () => {
    expect(useFavoritesStore.getState().favorites).toEqual({});
  });

  it('toggles favorite on and off', () => {
    const id = 'photo-1';

    act(() => {
      useFavoritesStore.getState();
    });
    expect(useFavoritesStore.getState().favorites);
    expect(useFavoritesStore.getState().favorites[id]);

    act(() => {
      useFavoritesStore.getState();
    });
    expect(useFavoritesStore.getState().favorites);
  });
});
