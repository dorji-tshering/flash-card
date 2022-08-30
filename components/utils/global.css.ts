import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    :root {
        --theme-color: #0175FF;
        --primary-text-color: #FCFBFC;
        --secondary-text-color: #919093;
        --light-text-color: #adc9de;
        --main-background-color: #3C4045;
        --dark-background-color: #171716;
        --light-background-color: #2B2D2F;
        --border-color: #57606a;
        --yellow-color: #FEAE12;
        --red-color: #e91e63;
        --green-color: #388E3C;
        --fc-button-padding: 10px 20px;
        --action-hover-box-shadow: rgb(0 0 0) 0px 1px 2px 0px, rgb(52 55 56) 0px 1px 3px 1px;
    }

    * {
        box-sizing: border-box;
        font-family: 'DM Sans', sans-serif;
        transition: all .3s;
        scrollbar-width: thin;
        scrollbar-color: blue orange;
    }

    body {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--primary-text-color);
    }

    button, .button {
        border: none;
        cursor: pointer;
        user-select: none;
        padding: var(--fc-button-padding);
        border-radius: 5px;
        min-width: 100px;

        &:disabled {
            background-color: gray;
            opacity: .5;
            cursor: not-allowed;
        }
    }

    input, textarea {
        color: var(--primary-text-color);
    }

    input {
        border: 1px solid var(--border-color);
        background: none;
        border-radius: 3px;
        padding: 8px 11px;
        width: 300px;
        user-select: none;
        display: block;

        &:focus {
            outline: 0;
        }
    }

    .secondary-button, .primary-button {
        font-weight: 500;
    }

    .secondary-button {
        background: var(--light-background-color);
        color: var(--primary-text-color);
    }

    .primary-button {
        background: var(--theme-color);
        color: var(--primary-text-color);
    }

    a {
        text-decoration: none;
        user-select: none;
    }

    p {
        margin: 0;
    }

    ul {
        padding: 0;
    }

    *::-webkit-scrollbar {
        height: 3px;
        width: 0px;
    }

    *::-webkit-scrollbar-track {
        background: var(--main-background-color);
    }

    *::-webkit-scrollbar-thumb {
        background-color: var(--secondary-text-color);
        border-radius: 4px;
    }
`;