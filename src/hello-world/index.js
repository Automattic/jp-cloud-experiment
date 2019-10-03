/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';
import proxy from 'wpcom-proxy-request';

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
		proxy( '/me', function( err, body, headers ) {
			if ( err ) {
				throw err;
			}

			console.log( body );
			setWpcomData( body );
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
						{ wpcomData }
					</PanelRow>
				) }
			</PanelBody>
		</Panel>
	);
};

export default HelloWorld;
