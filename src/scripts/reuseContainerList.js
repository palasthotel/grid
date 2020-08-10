import React from 'react'
import {render} from 'react-dom'

((Grid)=>{

    // check if configuration is complete
    if(
        typeof Grid !== typeof {}
        ||
        typeof Grid.ajax_url !== typeof ''
    ){
        console.error("Grid configration is missing", Grid);
        // TODO: show error message in dom
        return;
    }

    const root = document.getElementById("#grid-reuse-container-list-root");
    render(<h1>TEST</h1>, root);

})(Grid);
