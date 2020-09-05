const deprecated = [
	{
		attributes: {
			selectByContributor: {
				type: "boolean",
				default: false,
			},
			contributorApiDataFetched: {
				type: "boolean",
				default: false,
			},
			tagApiDataFetched: {
				type: "boolean",
				default: false,
			},
			selectedTags: {
				type: "array",
				default: [{ value: 0, label: "Show All" }],
			},
			selectedContributors: {
				type: "array",
				default: [{ value: 0, label: "Show All" }],
			},
			contributors: {
				type: "array",
				default: [],
			},
			tags: {
				type: "array",
				default: [],
			},
			contributorOptions: {
				type: "array",
				default: [{ value: 0, label: "Show All" }],
			},
			tagOptions: {
				type: "array",
				default: [{ value: 0, label: "Show All" }],
			},
		},

		save: (props) => {
			const {
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

			let rest = `${wcwGlobal.rest}wp/v2/contributor`;

			if (selectByContributor) {
				if (dataContributors.indexOf(0) === -1 && dataContributors.length > 0) {
					rest = `${rest}?include=${dataContributors.join(",")}`;
				}
			} else {
				if (dataTags.indexOf(0) === -1 && dataTags.length > 0) {
					console.log(dataTags);
					rest = `${rest}?tags=${dataTags.join(",")}`;
				}
			}

			return <div data-rest={rest} className={props.className}></div>;
		},
	},
];

export { deprecated };
