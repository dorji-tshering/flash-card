import React, { useState, useRef } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, getIdToken, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

import Modal from '../modal/Modal';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { emailValidate, passwordValidate } from '../utils/inputValidate';
import { auth } from '../../firebaseClient';
import Loader from '../loader/Loader';
import { useAuthValue } from '../utils/authContext';

const Container = styled.div`
    padding: 30px;

    h2 {
        text-align: center;
        margin-top: 0;
        text-transform: uppercase;
        letter-spacing: 5px;
        color: var(--secondary-text-color);
    }

    .to-login span, .to-register span {
        cursor: pointer;
        user-select: none;
    }

    .to-login, .to-register {
        text-align: center;
        margin-top: 20px;

        span {
            color: var(--secondary-text-color);

            &:hover {
                border-bottom: 1px dotted var(--border-color);
                color: var(--primary-text-color);
                transition: all 0s;
            }
        }
    }

    input {
        display: block;
        margin: auto auto 15px;
    }

    button[type=submit] {
        display: block;
        margin: auto;
        width: 100%;
    }

    .error {
        display: block;
        margin: -10px auto 15px;
        font-size: 10px;
        color: var(--red-color);
    }

    .login-error, .signup-error {
        background: var(--light-background-color);
        padding: 5px 10px;
        color: var(--red-color);
        border-radius: 3px;
        margin-bottom: 10px;
        text-transform: capitalize;
        font-size: 13px;
    }

    .password-input-wrap {
        position: relative;
        width: 300px;
        display: block;
        margin: auto;

        .password-toggle-icon {
            user-select: none;
            position: absolute;
            top: 10px;
            right: 11px;
        }

    }

    .forgot-password-link {
        margin-bottom: 15px;
        margin-left: auto;
        display: block;
        width: fit-content;
        border-bottom: 1px solid transparent;
        cursor: pointer;
        color: var(--secondary-text-color);

        &:hover {
            color: var(--primary-text-color);
            border-bottom: 1px dotted var(--border-color);
            transition: all 0s;
        }
    }

    @media screen and (max-width: 480px) {
        & {
            padding: 0;
            margin-top: -100px;
        }

        input, .password-input-wrap {
            width: 250px;
        }
    }

    @media screen and (max-width: 320px) {
        input, .password-input-wrap {
            width: 200px;
        }
    }
`;

const LoginRegister = ({ onClickOutside }) => {
    const [onLoginForm, setOnLoginForm] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>(null);
    const [signupError, setSignupError] = useState<string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setError] = useState<{ email: string, password: string }>({
        email: '',
        password: '',
    });

    const { setCurrentUserId } = useAuthValue();

    const passwordRef = useRef<HTMLInputElement>(null);

    // remove errors on toggle
    const toggleLogin = () => {
        setOnLoginForm(!onLoginForm);
        errors.email = '';
        errors.password = '';
    }

    const passwordShow = () => {
        passwordRef.current.type = 'text';
    }

    const passwordHide = () => {
        passwordRef.current.type = 'password';
    } 

    // use react context to set the user after validation
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        let validEmail = emailValidate(email, setError);
        let validPassword = passwordValidate(password, setError); 
 
        if(validEmail && validPassword) {
            let userCredential: UserCredential;
            try {
                setLoading(true);
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }catch(err) {
                setLoginError(err.code);
                setLoading(false); 
                return; 
            }

            const user = userCredential.user;
            const token = await getIdToken(user);

            const response = await  fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    idToken: token
                })
            })

            if(response.status === 200) {
                setLoading(false);
                onClickOutside();
                Router.replace('/');
                setCurrentUserId(user.uid);
            }else if(response.status === 401) {
                console.log(response.json());
            }
        }
    }

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        let validEmail = emailValidate(email, setError);
        let validPassword = passwordValidate(password, setError);

        if(validEmail && validPassword) {
            let userCredential: UserCredential;
            try {
                setLoading(true);
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }catch(err) {
                setSignupError(err.code);
                setLoading(false);
                return;
            }

            const user = userCredential.user;
            const token = await getIdToken(user);

            const response = await  fetch('/api/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken: token
                })
            })

            if(response.status === 200) {
                setLoading(false);
                onClickOutside();
                Router.replace('/');
                setCurrentUserId(user.uid);
            }
        }
    }

    return (
        <Modal onClickOutside={onClickOutside} className='login-register'>
            { loading && <Loader background="transparent"/> }
            <Container className="login-register-wrapper">
                { onLoginForm ?
                    <> 
                        <form onSubmit={handleLogin} className="form-login" noValidate>
                            { loginError && <p className="login-error">{ loginError }</p> }
                            <h2>Login</h2>
                            <input 
                                type="email" 
                                onChange={(ev) => {setEmail(ev.target.value)}} 
                                placeholder='Email'
                                value={email}    
                            />
                            { errors.email && <span className="error">{ errors.email }</span> }
                            <span className="password-input-wrap">
                                <input 
                                    type="password" 
                                    ref={passwordRef} 
                                    onChange={(ev) => {setPassword(ev.target.value)}} 
                                    placeholder='Password'
                                    value={password}
                                />                           
                                { showPassword ? 
                                    <AiOutlineEyeInvisible className='password-toggle-icon' onClick={ () => { passwordHide(); setShowPassword(!showPassword)} } /> 
                                    : 
                                    <AiOutlineEye className='password-toggle-icon' onClick={ () => { passwordShow(); setShowPassword(!showPassword)} }/> 
                                }
                            </span>
                            { errors.password && <span className="error">{ errors.password }</span> }
                            <Link href="/forgot-password"><a className="forgot-password-link">Forgot password?</a></Link>
                            <button type="submit" className='primary-button' value='Log in'>Log in</button>
                            <p className="to-register"><span onClick={() => toggleLogin()}>New to FC? Sign up</span></p>
                        </form> 
                    </>
                    :
                    <form onSubmit={handleRegister} className="form-register" noValidate>
                        { signupError && <p className="signup-error">{ signupError }</p> }
                        <h2>Sign up</h2>
                        <input 
                            type="email" 
                            onChange={(ev) => {setEmail(ev.target.value)}} 
                            placeholder='Email'
                            value={email}
                        />
                        { errors.email && <span className="error">{ errors.email }</span> }
                        <span className="password-input-wrap">
                            <input 
                                type="password" 
                                ref={passwordRef} 
                                onChange={(ev) => {setPassword(ev.target.value)}} 
                                placeholder='Password'
                                value={password}
                            />
                            { showPassword ? 
                                <AiOutlineEyeInvisible className='password-toggle-icon' onClick={ () => { passwordHide(); setShowPassword(!showPassword)} } /> 
                                : 
                                <AiOutlineEye className='password-toggle-icon' onClick={ () => { passwordShow(); setShowPassword(!showPassword)} }/> 
                            }
                        </span>      
                        { errors.password && <span className="error">{ errors.password }</span> }             
                        <button type="submit" className='primary-button' value='Sign up'>Sign up</button>
                        <p className="to-login"><span onClick={() => toggleLogin()}>Have an account? Login</span></p>
                    </form> 
                }
            </Container>
        </Modal>
    )
}

export default LoginRegister;