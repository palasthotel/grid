<?php


namespace Grid\Constants;

const GRID_CSS_VARIANT_NONE    = "none";
const GRID_CSS_VARIANT_TABLE   = "table";
const GRID_CSS_VARIANT_FLEXBOX = "flexbox";

abstract class GridCSSVariant {

	/**
	 * @var string $variant
	 */
	private $variant;

	public function __construct($variant){
		$this->variant = $variant;
	}

	public function slug(){
		return $this->variant;
	}

	static function getVariant($variant){
		switch ($variant){
			case GRID_CSS_VARIANT_NONE:
				return new GridCssVariantNone(GRID_CSS_VARIANT_NONE);
			case GRID_CSS_VARIANT_FLEXBOX:
				return new GridCssVariantFlexbox(GRID_CSS_VARIANT_FLEXBOX);
			case GRID_CSS_VARIANT_TABLE:
			default:
				return new GridCssVariantTable(GRID_CSS_VARIANT_TABLE);
		}
	}
}