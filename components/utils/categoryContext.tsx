import { createContext, Dispatch, SetStateAction, useContext } from 'react';

const CategoryContext = createContext(null);

interface Props {
    children: React.ReactNode,
    value: {
        categories: string[],
        setCategories: Dispatch<SetStateAction<string[]>>
    }
}

export const CatContextProvider = ({children, value}: Props) => {
    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategoryContext = () => {
    return useContext(CategoryContext);
}