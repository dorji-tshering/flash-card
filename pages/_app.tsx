import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  	return (
	  	<>
		  	<Head> 
				<link rel="icon" type="image/png" href="/fclogo.png"/>
			</Head>
  			<Component {...pageProps} />
  		</>
	)
}

export default MyApp;
