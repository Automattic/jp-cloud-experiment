import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';

const HelloWorld = () => (
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
		</PanelBody>
	</Panel>
);

export default HelloWorld;
