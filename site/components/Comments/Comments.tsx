// Code from https://remark42.com/docs/manuals/integration-with-gatsby/

import * as React from 'react';

import styles from './Comments.module.css';

// This function will insert the usual <script> tag of
// Remark42 into the specified DOM location (parentElement)
const insertScript = (id: string, parentElement: HTMLElement) => {
	const script = window.document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.id = id;
	/* For Gatsby it's important to manually provide the URL
  and make sure it does not contain a trailing slash ("/").
  Because otherwise the comments for paths with/without 
  the trailing slash are stored separately in the BoltDB database.
  When following a Gatsby Link a page is loaded without the trailing slash,
  but when refreshing the page (F5) it is loaded with the trailing slash.
  So essentially every URL can become duplicated in the DB and you may not see
  your comments from the inverse URL at your present URL.
  Making sure url is provided without the trailing slash
  in the remark42 config solves this. */
	let url = window.location.origin + window.location.pathname;
	if (url.endsWith('/')) {
		url = url.slice(0, -1);
	}
	// Now the actual config and script-fetching function:
	script.innerHTML = `
    var remark_config = {
      host: "https://remark42.vitonsky.net",
      site_id: "blog",
      url: "${url}",
      theme: "light",
      components: ["embed"],
	  simple_view: false
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`;
	parentElement.appendChild(script);
};

/* This function removes the previously added script from the DOM.
Might be necessary when page transitions happen, to make sure a new instance 
is created, pointing to the current URL. Although this might actually 
not be necessary, please do your own testing.*/
const removeScript = (id: string, parentElement: HTMLElement) => {
	const script = window.document.getElementById(id);
	if (script) {
		parentElement.removeChild(script);
	}
};

// This function will be provided to useEffect and will insert the script
// when the component is mounted and remove it when it unmounts
const manageScript = () => {
	if (!window) {
		return;
	}
	const document = window.document;
	if (document.getElementById('remark42')) {
		insertScript('comments-script', document.body);
	}
	return () => removeScript('comments-script', document.body);
};

/* Another function for another useEffect - this is the most crucial part for
Gatsby compatibility. It will ensure that each page loads its own appropriate
comments, and that comments will be properly loaded */
const recreateRemark42Instance = () => {
	if (!window) {
		return;
	}

	const remark42 = (window as any).REMARK42;
	if (remark42) {
		remark42.destroy();
		remark42.createInstance((window as any).remark_config);
	}
};

export const Comments: React.FC<{ location: string }> = ({ location }) => {
	React.useEffect(manageScript, [location]);
	React.useEffect(recreateRemark42Instance, [location]);

	return (
		<div className={styles.Comments}>
			<h2>Comments</h2>
			<div id="remark42"></div>
		</div>
	);
};
