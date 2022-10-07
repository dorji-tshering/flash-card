import { useState, useEffect } from 'react';
import Router from 'next/router'; 
import Head from 'next/head';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseClient';
import "highlight.js/styles/atom-one-dark.css";

import GlobalStyle from '../components/utils/global.css';
import { AuthProvider } from '../components/utils/authContext';
import { CatContextProvider } from '../components/utils/categoryContext';
import Loader from '../components/loader/Loader';

function MyApp({ Component, pageProps }) {
	const [currentUserId, setCurrentUserId] = useState<string>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if(user) {
				setCurrentUserId(user.uid);
			}else {
				setCurrentUserId(null);
			} 
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
			  	loading ? <Loader background="var(--dark-background-color)"/>
				:
				<>
				<AuthProvider value={{
					currentUserId: currentUserId,
					setCurrentUserId: setCurrentUserId
					}}>
					<CatContextProvider value={{
						categories: categories,
						setCategories: setCategories
					}}>
						<Component {...pageProps} />
					</CatContextProvider>
				</AuthProvider>
				</>
			}
  		</>
	)
}

export default MyApp;
