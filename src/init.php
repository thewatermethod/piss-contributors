<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package wcw
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( ! function_exists('write_log')) {
	function write_log ( $log )  {
	   if ( is_array( $log ) || is_object( $log ) ) {
		  error_log( print_r( $log, true ) );
	   } else {
		  error_log( $log );
	   }
	}
 }

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function contributors_wcw_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'contributors-wcw-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'contributors-wcw-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'contributors-wcw-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `wcwGlobal` object.
	wp_localize_script(
		'contributors-wcw-block-js',
		'wcwGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),		
			// Add more data here that you want to access from `wcwGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'wcw/block-contributors', array(
			'style'         => 'contributors-wcw-style-css',	
			'editor_script' => 'contributors-wcw-block-js',	
			'editor_style'  => 'contributors-wcw-block-editor-css',
			'attributes' => array(         			
				'orderby'=> array(
					'type' => 'string',
					'default'=> 'title',
				),
				'selectedTags' => array(
					'type' => 'array',			
				),
				'selectedContributors' => array(
					'type'=> 'array',				
				),
				'selectByContributor' => array(
					'type' => "boolean",
					'default'=> false,
				),				
			 ),
		   'render_callback' => 'contributors_wcw_render_block'
		)
	);
}


function contributors_wcw_render_block($attributes) {
	
	$tags = array();


	if( isset($attributes['selectedTags']) && count($attributes['selectedTags'])) {
		foreach ($attributes['selectedTags'] as $key => $value) {
			array_push($tags,$value['value']);		
		}
	}


	$args = array(
		'post_type' => 'contributor',
		'orderby' => $attributes['orderby'],
		'tag_id' => implode(',', $tags ),
		'numberposts' => -1	
	); 

	$contributors = get_posts( $args );

	write_log(implode(',', $tags ));

	$html = '';

	foreach ($contributors as $contributor) {		
		$html .= '<div class="contributor">';
			$html .= '<div class="wp-block-media-text alignwide is-stacked-on-mobile">';
				$html .= '<figure class="wp-block-media-text__media">';
					$html .= '<img src="' . get_the_post_thumbnail_url($contributor->ID, 'medium' ) . '" alt="" >';
				$html .= '</figure>';
				$html .= '<div class="wp-block-media-text__content">';
					$html .= '<p class="has-large-font-size">'. $contributor->post_title . '</p>';
					$html .= '<p>' . $contributor->post_content. '</p>';
				$html .= '</div>';
			$html .= '</div>';
		$html .= '</div>';
	}

	return '<div class="wp-block-wcw-block-contributors contributor-grid">'.$html.'</div>';

	
}


// Hook: Block assets.
add_action( 'init', 'contributors_wcw_block_assets' );
