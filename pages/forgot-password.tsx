import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { auth } from '../firebaseClient';
import { sendPasswordResetEmail } from "firebase/auth";

import Success from '../components/notice/Success';

const Container =  styled.div`
	background: var(--main-background-color);
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	.notice-wrapper {
		position: absolute;
		top: 50px;
		z-index: 1;
		max-width: 350px;
		margin: 15px;
	}

	.logo-text {
		margin-top: -100px;

		.first {
			color: var(--theme-color);
		}

		.last {
			color: var(--yellow-color);
		}
	}

	.inner-wrapper {
		max-width: 350px;
		padding: 25px;
		border: 1px solid var(--border-color);
		border-radius: 4px;

		p {
			margin-bottom: 20px;
		}

		input {
			width: 100%;
		}

		button {
			margin-top: 20px;
			width: 100%;
		}

		.error {
			background: var(--light-background-color);
			padding: 5px 10px;
			color: var(--red-color);
			border-radius: 3px;
			margin-bottom: 10px;
			text-transform: capitalize;
			font-size: 13px;
		}
	}

	.back-home {
		text-align: center;
		margin-top: 20px;
		color: var(--secondary-text-color);
		border-bottom: 1px solid transparent;
		
		&:hover {
			color: var(--primary-text-color);
            border-bottom: 1px dotted var(--border-color);
            transition: all 0s;
		}
	}
`;

const ForgotPassword = () => {
	const [email, setEmail] = useState<string>('');
	const [error, setError] = useState<string>(null);
	const [notification, setNotification] = useState<string>(null);

	const resetPassword = (event: React.FormEvent) => {
		event.preventDefault();
		if(email === '') {
			alert('Please enter your email');
			return;
		}

		sendPasswordResetEmail(auth, email).then(() => {
			setNotification("Password reset email has been sent successfully. Please make sure to check the spam folder if you still haven't received the email.");
		}).catch((err) => {
			setError(err.code);
		});
	}

	return (
		<Container>
			<div className="notice-wrapper">
				{ notification ? <Success message={notification} closeable={true} setNotification={setNotification}/> : ''}				
			</div>
			<h2 className="logo-text"><span className="first">Flash</span><span className="last">Card</span></h2>
			<div className="inner-wrapper">
				<p className="prodedure-text">Please enter your username or email address. You will receive a link to create a new password via email.</p>
				{ error && <p className="error">{ error }</p> }
				<form onSubmit={resetPassword} className="password-reset-form" noValidate>
					<input 
						type="email"
						placeholder="Your email"
						onChange={(ev) => setEmail(ev.target.value)}
					/>
					<button type="submit" className="primary-button">Reset password</button>
				</form>
			</div>
			<Link href="/"><a className="back-home">Back to home?</a></Link>
		</Container>
	)
}

export default ForgotPassword;