import { DocumentData } from 'firebase/firestore';
import React, { createContext, Dispatch, SetStateAction, useContext } from 'react';

// export slider context
export const SliderContext = createContext(null);

interface Props {
    children: React.ReactNode,
    value: {
        setShowSlider: Dispatch<SetStateAction<boolean>>,
        setSliderData: Dispatch<SetStateAction<{
            notes: DocumentData[], 
            currentNote: DocumentData
        }>>
    }
}

export const SliderProvider = ({ children, value }: Props) => {
    return (
        <SliderContext.Provider value={value}>
            { children }
        </SliderContext.Provider>
    );
}

export const useSliderContextValue = () => {
    return useContext(SliderContext);
}

