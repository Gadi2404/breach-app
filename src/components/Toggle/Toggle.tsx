import { FC } from 'react';
import isDarkTheme from '../../helpers/is-dark-theme';
import './Toggle.css';

const toggleClassName = (className: string): void => {
  document.body.classList.toggle(className);
};

const onToggleTheme = () => {
  const isOsDarkTheme: boolean = isDarkTheme();
  
  let className: string = 'dark-mode';

  // TODO: consider saving the user selected theme in case of a page refresh

  // If the OS is set to dark mode
  if (isOsDarkTheme) {
    className = 'light-mode';
    // override default dark theme with light mode
    toggleClassName(className);

    return;
  }

  // override default light theme with dark mode
  toggleClassName(className);
};

const Toggle: FC = () => {
  return (
    <label className="toggle-theme toggle">
      <input type="checkbox" onInput={onToggleTheme} />
      <span className="slider round" />
    </label>
  );
};

export default Toggle;
