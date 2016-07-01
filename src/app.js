import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './view/grid';

class App extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  <Grid container={this.props.grid.container} />
		);
	}
}

console.log(App);

var grid = {"id":1,"isDraft":true,"container":[{"reusetitle":null,"type":"c-1d3-1d3-1d3","type_id":"3","dimension":null,"space_to_left":null,"space_to_right":null,"style":null,"classes":[],"title":"","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","reused":false,"position":null,"iscontentcontainer":null,"firstcontentcontainer":null,"lastcontentcontainer":null,"sidebarleft":false,"style_label":null,"id":"1","slots":[{"id":"1","style":null,"boxes":[{"style":null,"classes":[],"title":"","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","layout":null,"language":null,"style_label":null,"id":"8","html":"<div class=\"grid-box-editmode\">\n\tPlaintext<\/div>\n","type":"plaintext","content":{"plain":""},"contentstructure":[{"key":"plain","type":"textarea","label":"Plaintext"}]}]},{"id":"2","style":null,"boxes":[{"style":null,"classes":[],"title":"","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","layout":null,"language":null,"style_label":null,"id":"9","html":"<div class=\"grid-box-editmode\">\n\tStatic HTML-Content<\/div>\n","type":"wp_html","content":{"html":""},"contentstructure":[{"key":"html","label":"Text","type":"html"}]}]},{"id":"3","style":null,"boxes":[{"style":null,"classes":[],"title":"","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","layout":null,"language":null,"style_label":null,"id":"10","html":"<div class=\"grid-box-editmode\">\n  RSS Feed\n<\/div>","type":"rss","content":{"url":"","numItems":15},"contentstructure":[{"key":"url","label":"RSS-URL","type":"text"},{"key":"numItems","label":"Number of items to show","type":"number"}]}]}]},{"reusetitle":null,"type":"c-1d2-1d2","type_id":"8","dimension":null,"space_to_left":null,"space_to_right":null,"style":null,"classes":[],"title":"","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","reused":false,"position":null,"iscontentcontainer":null,"firstcontentcontainer":null,"lastcontentcontainer":null,"sidebarleft":false,"style_label":null,"id":"2","slots":[{"id":"4","style":null,"boxes":[{"style":null,"classes":[],"title":"Mein HTML","titleurl":"","readmore":"","readmoreurl":"","prolog":"","epilog":"","layout":null,"language":null,"style_label":null,"id":"6","html":"<div class=\"grid-box-editmode\">\n\t<p>HTML TEST<\/p>\n<\/div>\n","type":"wp_html","content":{"html":"<p>HTML TEST<\/p>\n"},"contentstructure":[{"key":"html","label":"Text","type":"html"}]}]},{"id":"5","style":null,"boxes":[]}]}],"isSidebar":false};

/**
 * append app to grid app root
 */
ReactDOM.render(
  <App
    grid={grid}
/>,
  document.getElementById("grid-app")
);