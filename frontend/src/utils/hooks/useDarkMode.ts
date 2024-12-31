import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store'; // Adjust the path as needed
import { setDarkmode, selectDarkmode } from '@/lib/features/darkmodeSlice';

export const useDarkMode = () => {
  const dispatch = useAppDispatch();
  const darkmode = useAppSelector(selectDarkmode);

  useEffect(() => {
    // Retrieve user preference from localStorage
    const userPrefersDark = localStorage.getItem('darkMode') === 'true';
    dispatch(setDarkmode(userPrefersDark));
  }, [dispatch]);

  useEffect(() => {
    // Toggle dark mode class on the body element
    document.body.classList.toggle('dark', darkmode);
    // Save user preference to localStorage
    localStorage.setItem('darkMode', darkmode);
  }, [darkmode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    dispatch(setDarkmode(!darkmode));
  };

  return { darkmode, toggleDarkMode };
};
