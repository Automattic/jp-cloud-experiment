/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';

/**
 * External dependencies
 */
import wpcom from 'wpcom';
import wpcomOAuth from 'wpcom-oauth-cors';

const rootURL = 'https://ma.tt/wp-json/';
apiFetch.use( apiFetch.createRootURLMiddleware( rootURL ) );

const HelloWorld = () => {
	const [ posts, setPosts ] = useState( [] );
	const [ wpcomData, setWpcomData ] = useState( [] );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/posts' } ).then( ( response ) => {
			setPosts( response );
		} );
	}, [] );

	useEffect( () => {
		wpcomOAuth( '67055' );
		wpcomOAuth.get( ( auth ) => {
			const api = wpcom( auth.access_token );
			const site = api.site( auth.site_id );
			site
				.postsList( {
					number: 8,
				} )
				.then( ( list ) => {
					setWpcomData( list.posts );
				} )
				.catch( ( error ) => {
					throw error;
				} );
		} );
	}, [] );

	return (
		<Panel header="Test Panel">
			<PanelBody
				title="Toggle Panel"
				icon=""
				initialOpen={ true }
			>
				<PanelRow>
					<Button isDefault>
						Hello World!
					</Button>
				</PanelRow>
				{ posts && (
					<PanelRow>
						<ul>
							{ posts.map( ( { id, title } ) => (
								<li key={ id } dangerouslySetInnerHTML={ { __html: title.rendered } } />
							) ) }
						</ul>
					</PanelRow>
				) }
				{ wpcomData && (
					<PanelRow>
						<ul>
							{ wpcomData.map( ( { ID, title } ) => (
								<li key={ ID }>
									{ title }
								</li>
							) ) }
						</ul>
					</PanelRow>
				) }
			</PanelBody>
		</Panel>
	);
};

export default HelloWorld;
