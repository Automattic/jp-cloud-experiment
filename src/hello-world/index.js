/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';

const rootURL = 'https://ma.tt/wp-json/';
apiFetch.use( apiFetch.createRootURLMiddleware( rootURL ) );

const HelloWorld = () => {
	const [ posts, setPosts ] = useState( [] );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/posts' } ).then( ( response ) => {
			setPosts( response );
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
			</PanelBody>
		</Panel>
	);
};

export default HelloWorld;
