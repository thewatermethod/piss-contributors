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

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const fetchFromApi = async (url) => {
	const response = await fetch(url);
	return response.json();
};

const retrieveContributors = async () => {
	const url = `${wcwGlobal.rest}wp/v2/contributor?per_page=100`;
	return await fetchFromApi(url);
};

const retrieveTags = async () => {
	const url = `${wcwGlobal.rest}wp/v2/tags?per_page=100`;
	return await fetchFromApi(url);
};

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
		contributorApiDataFetched: {
			type: "boolean",
			default: false,
		},
		contributorOptions: {
			type: "array",
			default: [{ value: 0, label: "Show All" }],
		},
		contributors: {
			type: "array",
			default: [],
		},
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
		tags: {
			type: "array",
			default: [],
		},
		tagApiDataFetched: {
			type: "boolean",
			default: false,
		},

		tagOptions: {
			type: "array",
			default: [{ value: 0, label: "Show All" }],
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
			contributors: select("core").getEntityRecords("postType", "contributor"),
		};
	})(({ contributors, className, attributes, setAttributes }) => {
		const {
			contributorOptions,
			orderby,
			tagOptions,
			selectedContributors,
			selectedTags,
			selectByContributor,
		} = attributes;

		if (!contributors) {
			return "Loading...";
		}

		if (contributors && contributors.length === 0) {
			return "No contributors found";
		}

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
							options={contributorOptions}
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
							options={tagOptions}
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
				<div data-rest={rest} className={props.className}></div>
			</React.Fragment>
		);
	}),
	// // Creates a <p class='wp-block-wcw-block-contributors'></p>.
	// const { setAttributes } = props;
	// const {
	// 	contributorOptions,
	// 	contributorApiDataFetched,
	// 	orderby,
	// 	tagOptions,
	// 	tagApiDataFetched,
	// 	selectedContributors,
	// 	selectedTags,
	// 	selectByContributor,
	// } = props.attributes;
	// let dataContributors = [];
	// if (selectedContributors) {
	// 	dataContributors = selectedContributors.map((contributor) => {
	// 		return contributor.value;
	// 	});
	// }
	// let dataTags = [];
	// if (selectedTags) {
	// 	dataTags = selectedTags.map((tag) => {
	// 		console.log(tag.value);
	// 		return tag.value;
	// 	});
	// }
	// if (!contributorApiDataFetched) {
	// 	retrieveContributors().then((c) => {
	// 		const o = c.map((contrib) => {
	// 			return {
	// 				value: contrib.id,
	// 				label: contrib.title.rendered,
	// 			};
	// 		});
	// 		setAttributes({
	// 			contributorOptions: [...contributorOptions, ...o],
	// 			contributorApiDataFetched: true,
	// 			contributors: c,
	// 		});
	// 	});
	// }
	// if (!tagApiDataFetched) {
	// 	retrieveTags().then((t) => {
	// 		const o = t.map((terg) => {
	// 			return {
	// 				value: terg.id,
	// 				label: terg.name,
	// 			};
	// 		});
	// 		setAttributes({
	// 			tagOptions: [...tagOptions, ...o],
	// 			tagApiDataFetched: true,
	// 			tags: t,
	// 		});
	// 	});
	// }
	// let rest = `${wcwGlobal.rest}wp/v2/contributor?per_page=100&orderby=${orderby}`;
	// if (selectByContributor) {
	// 	if (dataContributors.indexOf(0) === -1 && dataContributors.length > 0) {
	// 		rest = `${rest}&include=${dataContributors.join(",")}`;
	// 	}
	// } else {
	// 	if (dataTags.indexOf(0) === -1 && dataTags.length > 0) {
	// 		rest = `${rest}&tags=${dataTags.join(",")}`;
	// 	}
	// }
	// return (
	// 	<React.Fragment>
	// 		<label>Select specific contributors (otherwise, select by tags)</label>
	// 		<br />
	// 		<FormToggle
	// 			checked={selectByContributor}
	// 			onChange={() =>
	// 				setAttributes({ selectByContributor: !selectByContributor })
	// 			}
	// 		/>
	// 		<br />
	// 		{selectByContributor ? (
	// 			<React.Fragment>
	// 				<label>Select contributors</label>
	// 				<Select
	// 					options={contributorOptions}
	// 					isMulti={true}
	// 					onChange={(newSelectedContributors) => {
	// 						setAttributes({
	// 							selectedContributors: newSelectedContributors,
	// 						});
	// 					}}
	// 					value={selectedContributors}
	// 				/>
	// 			</React.Fragment>
	// 		) : (
	// 			<React.Fragment>
	// 				<label>Select tags</label>
	// 				{/* TODO - add ids, etc*/}
	// 				<Select
	// 					options={tagOptions}
	// 					isMulti={true}
	// 					value={selectedTags}
	// 					onChange={(newSelectedTags) => {
	// 						setAttributes({
	// 							selectedTags: newSelectedTags,
	// 						});
	// 					}}
	// 				/>
	// 			</React.Fragment>
	// 		)}
	// 		<label>Order by:</label>
	// 		{/* TODO - add ids, etc*/}
	// 		<SelectControl
	// 			options={[
	// 				{
	// 					value: "date",
	// 					label: "Newest first",
	// 				},
	// 				{
	// 					value: "title",
	// 					label: "First name",
	// 				},
	// 			]}
	// 			onChange={(orderby) => {
	// 				setAttributes({
	// 					orderby,
	// 				});
	// 			}}
	// 			value={orderby}
	// 		/>
	// 		<div data-rest={rest} className={props.className}></div>
	// 	</React.Fragment>
	//);

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
		const {
			orderby,
			selectedContributors,
			selectedTags,
			selectByContributor,
		} = props.attributes;

		let dataContributors = [];
		if (selectedContributors) {
			dataContributors = selectedContributors.map((contributor) => {
				return contributor.value;
			});
		}

		let dataTags = [];
		if (selectedTags) {
			dataTags = selectedTags.map((tag) => {
				return tag.value;
			});
		}

		let rest = `${wcwGlobal.rest}wp/v2/contributor?per_page=100&orderby=${orderby}`;

		if (selectByContributor) {
			if (dataContributors.indexOf(0) === -1 && dataContributors.length > 0) {
				rest = `${rest}&include=${dataContributors.join(",")}`;
			}
		} else {
			if (dataTags.indexOf(0) === -1 && dataTags.length > 0) {
				console.log(dataTags);
				rest = `${rest}&tags=${dataTags.join(",")}`;
			}
		}

		return <div data-rest={rest} className={props.className}></div>;
	},
});
