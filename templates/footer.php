<footer class="content-info">
  <div class="container">
  	<span class="teste"></span>
  	<?php
		if (has_nav_menu('footer_navigation')) :
			wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'nav']);
		endif;
    ?>
    <?php dynamic_sidebar('sidebar-footer'); ?>
  </div>
</footer>
