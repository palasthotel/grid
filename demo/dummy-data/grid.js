
module.exports = {
	"id":1,
	"isDraft":true,
	"container":[
		{
			"reusetitle":null,
			"type":"c-1d3-1d3-1d3",
			"type_id":"3",
			"dimension":null,
			"space_to_left":null,
			"space_to_right":null,
			"style":null,
			"classes":[

			],
			"title":"Erster Container",
			"titleurl":"",
			"readmore":"",
			"readmoreurl":"",
			"prolog":"",
			"epilog":"",
			"reused":false,
			"position":null,
			"iscontentcontainer":null,
			"firstcontentcontainer":null,
			"lastcontentcontainer":null,
			"sidebarleft":false,
			"style_label":null,
			"id":1,
			"slots":[
				{
					"id":1,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":8,
							"html":"<div class=\"grid-box-editmode\">\n\tEvery Widget Box<\/div>\n",
							"type":"all_widgets_box",
							"content":{
								"plain":""
							},
							"contentstructure":[
								{
									"key":"key_text",
									"type":"text",
									"label":"widget type: text"
								},
								{
									"key":"key_number",
									"type":"number",
									"label":"widget type: number"
								},
								{
									"key":"key_textarea",
									"type":"textarea",
									"label":"widget type: textarea"
								},
								{
									"key": "key_checkbox",
									"type": "checkbox",
									"label": "widget type: checkbox",
								},
								{
									"key": "key_select",
									"label": "widget type: select",
									"type": "select",
									"selections": [
										{
											"key": 0,
											"text": "Entry 0"
										},
										{
											"key": 1,
											"text": "Entry 1"
										},
										{
											"key": 2,
											"text": "Entry 2"
										},
									]
								},
								{
									"key": "key_html",
									"label": "widget type: html",
									"type": "html",
								},
								{
									"label": "widget type: info",
									"text": "this is the info text",
									"type": "info",
								},
								{
									// todo: check if we need that
									"key": "key_hidden",
									"type": "hidden",
								},
								{
									'key': 'list',
									"label": "widget type: list",
									"type": "list",
									"contentstructure":[
										{
											"key": "key_list_item_1",
											"type": "text",
											"label": "Text in Liste",
										}
									],
								},
								{
									"key": "key_file",
									"label": "widget type: file",
									"uploadpath": "/grid_file_endpoint",
								},
								{
									"key": "key_autocomplete",
									"label": "widget type: autocomplete",
									"type": "autocomplete",
								},
								{
									"key": "key_multi_autocomplete",
									"label": "widget type: multi-autocomplete",
									"type": "multi-autocomplete",
								}
							]
						}
					]
				},
				{
					"id":2,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":9,
							"html":"<div class=\"grid-box-editmode\">\n\tStatic HTML-Content<\/div>\n",
							"type":"wp_html",
							"content":{
								"html":""
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						}
					]
				},
				{
					"id":3,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":10,
							"html":"<div class=\"grid-box-editmode\">\n  RSS Feed\n<\/div>",
							"type":"rss",
							"content":{
								"url":"",
								"numItems":15
							},
							"contentstructure":[
								{
									"key":"url",
									"label":"RSS-URL",
									"type":"text"
								},
								{
									"key":"numItems",
									"label":"Number of items to show",
									"type":"number"
								}
							]
						}
					]
				}
			]
		},
		{
			"reusetitle":null,
			"type":"c-1d2-1d2",
			"type_id":"8",
			"dimension":null,
			"space_to_left":null,
			"space_to_right":null,
			"style":null,
			"classes":[

			],
			"title":"Container zwei",
			"titleurl":"",
			"readmore":"",
			"readmoreurl":"",
			"prolog":"",
			"epilog":"",
			"reused":false,
			"position":null,
			"iscontentcontainer":null,
			"firstcontentcontainer":null,
			"lastcontentcontainer":null,
			"sidebarleft":false,
			"style_label":null,
			"id":2,
			"slots":[
				{
					"id":4,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"Mein HTML",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":6,
							"html":"<div class=\"grid-box-editmode\">\n\t<p>HTML TEST<\/p>\n<\/div>\n",
							"type":"wp_html",
							"content":{
								"html":"<p>HTML TEST<\/p>\n"
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						},
						{
							"style":null,
							"classes":[

							],
							"title":"Mein HTML",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":6,
							"html":"<div class=\"grid-box-editmode\">\n\t<p><img src='http://placeholder.palasthotel.de/make/800x200.png'<\/p>\n<\/div>\n",
							"type":"wp_html",
							"content":{
								"html":"<p>HTML TEST<\/p>\n"
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						},
						{
							"style":null,
							"classes":[

							],
							"title":"Mein HTML",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":6,
							"html":"<div class=\"grid-box-editmode\">\n\t<p>HTML TEST<\/p>\n<\/div>\n",
							"type":"wp_html",
							"content":{
								"html":"<p>HTML TEST<\/p>\n"
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						}
					]
				},
				{
					"id":5,
					"style":null,
					"boxes":[

					]
				}
			]
		},
		{
			"reusetitle":null,
			"type":"c-1d3-1d3-1d3",
			"type_id":"3",
			"dimension":null,
			"space_to_left":null,
			"space_to_right":null,
			"style":null,
			"classes":[

			],
			"title":"Container 3",
			"titleurl":"",
			"readmore":"",
			"readmoreurl":"",
			"prolog":"",
			"epilog":"",
			"reused":false,
			"position":null,
			"iscontentcontainer":null,
			"firstcontentcontainer":null,
			"lastcontentcontainer":null,
			"sidebarleft":false,
			"style_label":null,
			"id":5,
			"slots":[
				{
					"id":1,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":8,
							"html":"<div class=\"grid-box-editmode\">\n\tPlaintext<\/div>\n",
							"type":"plaintext",
							"content":{
								"plain":""
							},
							"contentstructure":[
								{
									"key":"plain",
									"type":"textarea",
									"label":"Plaintext"
								}
							]
						}
					]
				},
				{
					"id":2,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":9,
							"html":"<div class=\"grid-box-editmode\">\n\tStatic HTML-Content<\/div>\n",
							"type":"wp_html",
							"content":{
								"html":""
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						}
					]
				},
				{
					"id":4,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[

							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":10,
							"html":"<div class=\"grid-box-editmode\">\n  RSS Feed\n<\/div>",
							"type":"rss",
							"content":{
								"url":"",
								"numItems":15
							},
							"contentstructure":[
								{
									"key":"url",
									"label":"RSS-URL",
									"type":"text"
								},
								{
									"key":"numItems",
									"label":"Number of items to show",
									"type":"number"
								}
							]
						}
					]
				}
			]
		},
		{
			"reusetitle":null,
			"type":"c-2d3-1d3",
			"type_id":"6",
			"dimension":null,
			"space_to_left":null,
			"space_to_right":null,
			"style":null,
			"classes":[
			
			],
			"title":"Container 4",
			"titleurl":"",
			"readmore":"",
			"readmoreurl":"",
			"prolog":"",
			"epilog":"",
			"reused":false,
			"position":null,
			"iscontentcontainer":null,
			"firstcontentcontainer":null,
			"lastcontentcontainer":null,
			"sidebarleft":false,
			"style_label":null,
			"id":6,
			"slots":[
				{
					"id":1,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[
							
							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":8,
							"html":"<div class=\"grid-box-editmode\">\n\tPlaintext<\/div>\n",
							"type":"plaintext",
							"content":{
								"plain":""
							},
							"contentstructure":[
								{
									"key":"plain",
									"type":"textarea",
									"label":"Plaintext"
								}
							]
						}
					]
				},
				{
					"id":2,
					"style":null,
					"boxes":[
						{
							"style":null,
							"classes":[
							
							],
							"title":"",
							"titleurl":"",
							"readmore":"",
							"readmoreurl":"",
							"prolog":"",
							"epilog":"",
							"layout":null,
							"language":null,
							"style_label":null,
							"id":9,
							"html":"<div class=\"grid-box-editmode\"><img src='http://placeholder.palasthotel.de/make/400x200.png' /><\/div>\n",
							"type":"wp_html",
							"content":{
								"html":""
							},
							"contentstructure":[
								{
									"key":"html",
									"label":"Text",
									"type":"html"
								}
							]
						}
					]
				}
			]
		}
	],
	"isSidebar":false
};