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
        ClassicEditor.create(
            element
        ).then(editor=>{
            jQuery(element).data("ckeditor", editor)
            return editor
        }).then(resolve).catch(reject);
    })
}