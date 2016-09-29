<?php
/**
 * Template Name: Custom
 */
?>

<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'page'); ?>
  <br>
  <br>
  <br>
  <span class="teste"></span>
  <br>
  <br>
  <br>
<?php endwhile; ?>
