import '../../../assets/ckeditor/ckeditor.js'

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
        // from CDN in /templates/editor/grid.tpl
        resolve(CKEDITOR.replace(element,{
            customConfig: document.PathToConfig
        }))
    })
}

export const buildUrlTargetOptions = (selected) => {
    return [
        "","_self","_blank"
    ].map(item => {
        return {
            value: item,
            label: document.lang_values[`url_target${item}`],
            selected: selected === item ? "selected" : "",
        }
    })
}