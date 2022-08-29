import { createContext, Dispatch, SetStateAction, useContext } from 'react';

const RenderContext = createContext(null);

interface Props {
    children: React.ReactNode,
    value: {
        render: boolean,
        toggleRender: Dispatch<SetStateAction<boolean>>,
    }
}

export const RenderContextProvider = ({ children, value }: Props) => {
    return (
        <RenderContext.Provider value={value}>
            { children }
        </RenderContext.Provider>
    );
}

export const useRenderContext = () => {
    return useContext(RenderContext);
};