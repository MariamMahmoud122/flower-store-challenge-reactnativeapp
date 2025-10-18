import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const useAutoLock = () => {
  const dispatch = useDispatch();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch(logout());
    }, 10000);
  };

  useEffect(() => {
    resetTimer();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        dispatch(logout());
      }
    });

    return () => {
      subscription.remove();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
};
