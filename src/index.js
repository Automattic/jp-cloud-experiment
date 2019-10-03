import { render } from '@wordpress/element';
import App from './app';

( function() {
	const root = document.getElementById( 'root' );
	render( <App />, root );
}() );
