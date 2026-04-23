import ThemeContext from './theme-context';

export const ThemeProvider = ({ children }) => {
  const theme = 'light';
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
