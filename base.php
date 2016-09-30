<?php
    use Roots\Sage\Setup;
    use Roots\Sage\Wrapper;
?>

<!doctype html>
<html <?php language_attributes(); ?> itemscope itemtype="http://schema.org/WebPage">
    <head>
        <?php get_template_part('templates/head'); ?>
    </head>
    <body <?php body_class(); ?>>

        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->


        <?php get_template_part( 'templates/content', 'svg' ); ?>

        <section id="menu-mobile">
            <?php get_template_part('templates/menu-mobile'); ?>
        </section>

        <main id="panel" id="main">

            <header class="header-nav">
                <?php
                    do_action('get_header');
                    get_template_part('templates/header');
                ?>
            </header>
            
            <div class="container">
                <section class="content">
                    <?php include Wrapper\template_path(); ?> 
                </section>

                <?php if (Setup\display_sidebar()) : ?>
                    <aside class="sidebar">
                        <?php include Wrapper\sidebar_path(); ?>
                    </aside>
                <?php endif; ?>
            </div>

            <footer class="footer">
                <?php
                    do_action('get_footer');
                    get_template_part('templates/footer');
                    wp_footer();
                ?>
            </footer>
        </main>
    </body>
</html>
