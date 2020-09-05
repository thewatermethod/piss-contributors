/**
 * BLOCK: contributors
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import "./editor.scss";
import "./style.scss";

import Select from "react-select";
import { SelectControl } from "@wordpress/components";
import { FormToggle } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import ServerSideRender from "@wordpress/server-side-render";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("wcw/block-contributors", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __("Contributors for the PISSA PANTS"), // Block title.
	icon: "groups", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	attributes: {
		orderby: {
			type: "array",
			default: "title",
		},
		selectedTags: {
			type: "array",
			default: [{ value: 0, label: "Show All" }],
		},
		selectedContributors: {
			type: "array",
			default: [{ value: 0, label: "Show All" }],
		},
		selectByContributor: {
			type: "boolean",
			default: false,
		},
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: withSelect((select) => {
		return {
			contributors: select("core").getEntityRecords("postType", "contributor", {
				per_page: 100,
			}),
			tags: select("core").getEntityRecords("taxonomy", "post_tag", {
				per_page: 100,
			}),
		};
	})(({ contributors, className, attributes, setAttributes, tags }) => {
		const {
			orderby,
			selectedContributors,
			selectedTags,
			selectByContributor,
		} = attributes;

		if (!contributors || !tags) {
			return "Loading...";
		}

		if (contributors && contributors.length === 0) {
			return "No contributors found";
		}

		const deadUn = [
			{
				value: 0,
				label: "---",
			},
		];

		const contributorOptions = contributors.map((contributor) => {
			return {
				value: contributor.id,
				label: contributor.title.rendered,
			};
		});

		const tagOptions = tags.map((tag) => {
			return {
				value: tag.id,
				label: tag.name,
			};
		});

		return (
			<React.Fragment>
				<label>Select specific contributors (otherwise, select by tags)</label>
				<br />
				<FormToggle
					checked={selectByContributor}
					onChange={() =>
						setAttributes({ selectByContributor: !selectByContributor })
					}
				/>
				<br />
				{selectByContributor ? (
					<React.Fragment>
						<label>Select contributors</label>
						<Select
							options={[...deadUn, ...contributorOptions]}
							isMulti={true}
							onChange={(newSelectedContributors) => {
								setAttributes({
									selectedContributors: newSelectedContributors,
								});
							}}
							value={selectedContributors}
						/>
					</React.Fragment>
				) : (
					<React.Fragment>
						<label>Select tags</label>
						{/* TODO - add ids, etc*/}
						<Select
							options={[...deadUn, ...tagOptions]}
							isMulti={true}
							value={selectedTags}
							onChange={(newSelectedTags) => {
								setAttributes({
									selectedTags: newSelectedTags,
								});
							}}
						/>
					</React.Fragment>
				)}
				<label>Order by:</label>
				{/* TODO - add ids, etc*/}
				<SelectControl
					options={[
						{
							value: "date",
							label: "Newest first",
						},
						{
							value: "title",
							label: "First name",
						},
					]}
					onChange={(orderby) => {
						setAttributes({
							orderby,
						});
					}}
					value={orderby}
				/>

				<ServerSideRender
					block="wcw/block-contributors"
					attributes={{
						orderby,
						selectedTags,
						selectedContributors,
						selectByContributor,
					}}
				/>
			</React.Fragment>
		);
	}),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: (props) => {
		return null;
	},
});
