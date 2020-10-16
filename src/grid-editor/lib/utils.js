import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const hasHTMLEditor = (element) =>{
    return getHTMLEditor(element)
}

export const getHTMLEditor = (element) => {
    return jQuery(element).data("ckeditor");
}

export const initHTMLEditor = (element) => {
    return new Promise((resolve, reject) =>{
        if(hasHTMLEditor(element)) {
            resolve(getHTMLEditor(element))
            return;
        }
        console.log("GridCKEditorConfig", window.GridCKEditorConfig, ClassicEditor.builtinPlugins.map( plugin => plugin.pluginName ));
        ClassicEditor.create(
            element,
            window.GridCKEditorConfig || {}
        ).then(editor=>{
            jQuery(element).data("ckeditor", editor)
            return editor
        }).then(resolve).catch(reject);
    })
}
