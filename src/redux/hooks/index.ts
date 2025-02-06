// src\redux\hooks\index.ts hoặc src\redux\hooks.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../store'; // Import RootState từ store

// Tạo custom hook useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;