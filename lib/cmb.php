<?php
if ( file_exists(  __DIR__ . '/cmb2/init.php' ) ) {
    require_once  __DIR__ . '/cmb2/init.php';
} elseif ( file_exists(  __DIR__ . '/CMB2/init.php' ) ) {
    require_once  __DIR__ . '/CMB2/init.php';
}

add_action( 'cmb2_admin_init', 'cmb2_sample_metaboxes' );

function cmb2_sample_metaboxes() {
    $prefix = 'cmb_';

    $cmb = new_cmb2_box( array(
        'id'            => 'format-gallery',
        'title'         => 'Galeria',
        'object_types'  => array( 'post'),
        // 'show_on'       => array( 'key' => 'post_format', 'value' => 'gallery' ),
        'context'       => 'normal',
        'priority'      => 'high',
        'show_names'    => true,
        'cmb_styles'    => true,
    ) );

    $cmb->add_field( array(
        'name' => '',
        'id'   =>  $prefix . 'text',
        'type' => 'file_list',
        'preview_size' => array( 100, 100 ),
        'text' => array(
            'add_upload_files_text' => 'Adicionar Imagem',
            'remove_image_text' => 'Deletar Imagem',
            'file_text' => 'Imagem',
            'file_download_text' => 'Baixar Imagem',
            'remove_text' => 'Imagem',
        ),
    ) );
}




// ====================== //
//         Helpers        //
// ====================== //

function change_format() {
    if(is_admin()) {
        wp_register_script('admin', get_template_directory_uri() .'/admin/format.js');
        wp_enqueue_script('admin');
    }
} add_action('admin_enqueue_scripts','change_format');

function cmb_show_on_post_format( $display, $post_format ) {
    if ( ! isset( $post_format['show_on']['key'] ) ) {
        return $display;
    }
    $post_id = 0;
    // If we're showing it based on ID, get the current ID
    if ( isset( $_GET['post'] ) ) {
        $post_id = $_GET['post'];
    } elseif ( isset( $_POST['post_ID'] ) ) {
        $post_id = $_POST['post_ID'];
    }
    if ( ! $post_id ) {
        return $display;
    }
    $value  = get_post_format($post_id);
 
    if ( empty( $post_format['show_on']['key'] ) ) {
        return (bool) $value;
    }
    return $value == $post_format['show_on']['value'];
} add_filter( 'cmb2_show_on', 'cmb_show_on_post_format', 10, 2 );

// ====================== //
//          Front         //
// ====================== //
function cmb2_output_file_list( $file_list_meta_key, $img_size = 'medium' ) {
    $files = get_post_meta( get_the_ID(), $file_list_meta_key, 1 );
    echo '<ul class="galery-post">';
        foreach ( (array) $files as $attachment_id => $attachment_url ) {
            echo '<li class="item">';
                echo wp_get_attachment_image( $attachment_id, $img_size );
            echo '</li>';
        }
    echo '</ul>';
}