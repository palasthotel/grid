<?php
/**
 * @author Palasthotel <rezeption@palasthotel.de>
 * @copyright Copyright (c) 2014, Palasthotel
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @package Palasthotel\Grid\Wordpress
 */

$classes = $this->classes;
array_push( $classes, 'grid-box' );

if ( ! empty( $this->style ) ) {
	array_push( $classes, $this->style );
}

if ( isset( $content ) && isset( $content->publish ) && 'publish' == $content->publish ) : ?>
    <div class="<?php echo esc_attr( implode( $classes, ' ' ) ); ?>">
        <?php if ( ! empty( $this->title ) ) : ?>
            <?php if ( ! empty( $this->titleurl ) ) : ?>
                <h2 class="grid-box-title b-title"><a href="<?php echo esc_url( $this->titleurl ); ?>"><?php echo $this->title; ?></a></h2>
            <?php else : ?>
                <h2 class="grid-box-title b-title"><?php echo $this->title; ?></h2>
            <?php endif; ?>
        <?php endif; ?>

        <?php if ( ! empty( $this->prolog ) ) : ?>
            <div class="grid-box-prolog b-prolog">
                <?php echo $this->prolog; ?>
            </div>
        <?php endif; ?>

        <?php echo $content->output; ?>

        <?php if ( ! empty( $this->epilog ) ) : ?>
            <div class="grid-box-epilog b-epilog">
                <?php echo $this->epilog; ?>
            </div>
        <?php endif; ?>

        <?php if ( ! empty( $this->readmore ) ) : ?>
            <a href="<?php echo esc_url( $this->readmoreurl ); ?>" class="grid-box-readmore-link b-readmore-link"><?php echo $this->readmore; ?></a>
        <?php endif; ?>
    </div>
<?php else : ?>
    <p>No Content found or is not published yet!</p>
<?php endif; ?>
