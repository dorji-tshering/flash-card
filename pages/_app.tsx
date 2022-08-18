import { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import GlobalStyle from '../components/utils/global.css';
import { AuthProvider } from '../components/utils/authContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Loader from '../components/loader/Loader';
import "highlight.js/styles/atom-one-dark.css";

function MyApp({ Component, pageProps }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});
	},[]);

	useEffect(() => {
		Router.events.on('routeChangeStart', () => setLoading(true));
    	Router.events.on('routeChangeComplete', () => setLoading(false));
    	Router.events.on('routeChangeError', () => setLoading(false));
		
		return () => {
			Router.events.off('routeChangeStart', () => setLoading(true));
    		Router.events.off('routeChangeComplete', () => setLoading(false));
    		Router.events.off('routeChangeError', () => setLoading(false));
		}
	}, [Router.events]);

  	return (
	  	<>
		  	<Head> 
				<link rel="icon" type="image/png" href="/fclogo.png"/>
			</Head>
		  	<GlobalStyle/>
		  	{ 
			  	loading ? <Loader/>
				:
				<>
				<AuthProvider value={{
					currentUser: currentUser,
					setCurrentUser: setCurrentUser
					}}>
					<Component {...pageProps} />
				</AuthProvider>
				</>
			}
  		</>
	)
}

export default MyApp;
