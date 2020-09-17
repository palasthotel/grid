<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit14e02b7dd4abab287a4c00e16ab16a98
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Palasthotel\\Grid\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Palasthotel\\Grid\\' => 
        array (
            0 => __DIR__ . '/../..' . '/classes',
        ),
    );

    public static $classMap = array (
        'Palasthotel\\Grid\\API' => __DIR__ . '/../..' . '/classes/API.php',
        'Palasthotel\\Grid\\Endpoint' => __DIR__ . '/../..' . '/classes/Endpoint.php',
        'Palasthotel\\Grid\\Template' => __DIR__ . '/../..' . '/classes/Template.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit14e02b7dd4abab287a4c00e16ab16a98::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit14e02b7dd4abab287a4c00e16ab16a98::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit14e02b7dd4abab287a4c00e16ab16a98::$classMap;

        }, null, ClassLoader::class);
    }
}
