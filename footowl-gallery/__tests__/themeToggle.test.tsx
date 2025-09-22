import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import SettingsScreen from '../src/screens/SettingsScreen';

describe('Settings theme toggle', () => {
  it('toggles theme from provider', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <SettingsScreen />
      </ThemeProvider>
    );

    const toggle = getByTestId('theme-switch');
    fireEvent(toggle, 'valueChange', true);
    fireEvent(toggle, 'valueChange', false);

    expect(toggle.props.value).toBe(false);
  });
});
