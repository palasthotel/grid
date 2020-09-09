<?php


namespace Grid\Constants;

const GRID_CSS_VARIANT_NONE    = "none";
const GRID_CSS_VARIANT_TABLE   = "table";
const GRID_CSS_VARIANT_FLEXBOX = "flexbox";

abstract class GridCSSVariant {
	static function getVariant($variant){
		switch ($variant){
			case GRID_CSS_VARIANT_NONE:
				return new GridCssVariantNone();
			case GRID_CSS_VARIANT_FLEXBOX:
				return new GridCssVariantFlexbox();
			case GRID_CSS_VARIANT_TABLE:
				return new GridCssVariantTable();
			default:
				error_log("Unknown grid css variant $variant. Fallback to default.");
				return new GridCssVariantTable();
		}
	}
}