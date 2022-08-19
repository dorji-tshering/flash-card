import { useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import styled from 'styled-components';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';

// register languages for
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);

hljs.configure({
    ignoreUnescapedHTML: true
});

const Container = styled.pre`
    margin-top: 5px;
    margin-bottom: 0;

    code {
        border-radius: 5px;

        &, & * {
            font-family: monospace
        }
    }

    @media screen and (max-width: 480px) {
        code, code * {
            font-size: 12px;
        }
    }

    @media screen and (max-width: 360px) {
        code, code * {
            font-size: 10px;
        }
    }
}
`;

interface Props {
    code: string;
    language: string;
}

const RenderCode = ({ code, language }: Props) => {

    // allowed html in the code for security reasons
    const options = {
        allowedTags: [ 'div' ],
    }

    useEffect(() => {
        hljs.highlightAll();
    },[code, language])

    return (
        <Container><code className={language}>{ sanitizeHtml(code, options) }</code></Container>
    )
}

export default RenderCode