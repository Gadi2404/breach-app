const USER_DATA_NAME = 'user_data';

export const getUserLocalData = () => {
  const localData = localStorage.getItem(USER_DATA_NAME);

  if (localData) {
    return JSON.parse(localData);
  }

  const defaultData = {
    breachesList: [],
    selectedBreach: '',
    showDarkMode: false
  };

  return defaultData;
};

export const setUserLocalData = (newUserData = {}): void => {
  const userData = getUserLocalData();

  localStorage.setItem(USER_DATA_NAME, JSON.stringify({
    ...userData,
    ...newUserData
  }));
};