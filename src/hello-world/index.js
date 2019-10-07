/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { Button, Panel, PanelBody, PanelRow, Spinner } from '@wordpress/components';
import { dateI18n } from '@wordpress/date';
import { getQueryArg } from '@wordpress/url';

/**
 * External dependencies
 */
import wpcom from 'wpcom';
import wpcomOAuth from 'wpcom-oauth-cors';
import { translate as __ } from 'i18n-calypso';
import { get } from 'lodash';

const CLIENT_ID = '67055';

const rootURL = 'https://ma.tt/wp-json/';
apiFetch.use( apiFetch.createRootURLMiddleware( rootURL ) );

const HelloWorld = () => {
	const siteId = getQueryArg( window.location.href, 'site' );
	const [ posts, setPosts ] = useState( [] );
	const [ api, setApi ] = useState( null );
	const [ backupsPage, setBackupsPage ] = useState( 1 );
	const [ totalBackupsPages, setTotalBackupsPages ] = useState( 999 );
	const [ backups, setBackups ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );

	function loadMoreItems() {
		if ( hasMorePages() ) {
			setBackupsPage( backupsPage + 1 );
		}
	}

	function hasMorePages() {
		return backupsPage < totalBackupsPages;
	}

	useEffect( () => {
		apiFetch( { path: '/wp/v2/posts' } ).then( ( response ) => {
			setPosts( response );
		} );
	}, [] );

	useEffect( () => {
		if ( ! siteId || '' === siteId ) {
			return;
		}

		wpcomOAuth( CLIENT_ID );
		wpcomOAuth.get( ( auth ) => {
			if ( ! auth ) {
				wpcomOAuth( CLIENT_ID ).reset();
				return;
			}
			setApi( wpcom( auth.access_token ) );
		} );
	}, [] );

	useEffect( () => {
		if ( ! api ) {
			return;
		}

		const query = {
			apiNamespace: 'wpcom/v2',
		};

		setIsLoading( true );
		api.req.get( `/sites/${ siteId }/activity?_envelope=1&aggregate=true&group%5B%5D=rewind&number=5&page=${ backupsPage }`, query, ( err, data ) => {
			if ( 400 <= data.status ) {
				console.error( data.body.code );
				wpcomOAuth( CLIENT_ID ).reset();
				return;
			}

			setIsLoading( false );

			const totalPages = get( data, 'body.totalPages', totalBackupsPages );
			setTotalBackupsPages( totalPages );

			const items = get( data, 'body.current.orderedItems' );
			if ( items ) {
				setBackups( [ ... backups, ... items ] );
			}
		} );
	}, [ api, backupsPage ] );

	return (
		<Panel header={ __( 'API Requests Tests' ) }>
			{ posts && (
				<PanelBody
					title={ __( 'Public API call' ) }
					icon=""
					initialOpen={ false }
				>
					<PanelRow>
						<ul>
							{ posts.map( ( { id, title } ) => (
								<li key={ id } dangerouslySetInnerHTML={ { __html: title.rendered } } />
							) ) }
						</ul>
					</PanelRow>
				</PanelBody>
			) }
			<PanelBody
				title={ __( 'Backups via authenticated call' ) }
				icon=""
				initialOpen={ true }
			>
				<PanelRow>
					<ul>
						{ backups.map( ( item ) => (
							<li key={ item.activity_id }>
								{ item.summary }, { dateI18n( 'F j, Y, h:m A', item.published ) }
							</li>
						) ) }
						{ isLoading && (
							<li>
								<Spinner />
							</li>
						) }
					</ul>
				</PanelRow>
				<PanelRow>
					<Button
						onClick={ loadMoreItems }
						isPrimary
						disabled={ ! hasMorePages() || isLoading }>
						{ __( 'Load more items' ) }
					</Button>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
};

export default HelloWorld;
