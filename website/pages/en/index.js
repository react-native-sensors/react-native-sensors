/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
	return siteConfig.baseUrl + "img/" + img;
}

function docUrl(doc, language) {
	return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
	return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
	render() {
		return (
			<div className="pluginWrapper buttonWrapper">
				<a className="button" href={this.props.href} target={this.props.target}>
					{this.props.children}
				</a>
			</div>
		);
	}
}

Button.defaultProps = {
	target: "_self"
};

const SplashContainer = props => (
	<div className="homeContainer">
		<div className="homeSplashFade">
			<div className="wrapper homeWrapper">{props.children}</div>
		</div>
	</div>
);

const Logo = props => (
	<div className="projectLogo">
		<img src={props.img_src} />
	</div>
);

const ProjectTitle = props => (
	<h2 className="projectTitle">
		{siteConfig.title}
		<small>{siteConfig.tagline}</small>
	</h2>
);

const PromoSection = props => (
	<div className="section promoSection">
		<div className="promoRow">
			<div className="pluginRowBlock">{props.children}</div>
		</div>
	</div>
);

class HomeSplash extends React.Component {
	render() {
		let language = this.props.language || "";
		return (
			<SplashContainer>
				<div className="inner">
					<ProjectTitle />
					<PromoSection>
						<Button href="#try">Try It Out</Button>
					</PromoSection>
				</div>
			</SplashContainer>
		);
	}
}

const Block = props => (
	<Container
		padding={["bottom", "top"]}
		id={props.id}
		background={props.background}
	>
		<GridBlock align="center" contents={props.children} layout={props.layout} />
	</Container>
);

const Features = props => (
	<Block layout="fourColumn">
		{[
			{
				title: "RxJS Observables as API",
				content: "This gives you an intuitive way to deal with sensor data"
			},
			{
				title: "Full iOS & Android support",
				content:
					"Our philosophy is not to ship partial support; same sensors for every device"
			}
		]}
	</Block>
);

const Showcase = props => {
	if ((siteConfig.users || []).length === 0) {
		return null;
	}
	const showcase = siteConfig.users
		.filter(user => {
			return user.pinned;
		})
		.map((user, i) => {
			return (
				<a href={user.infoLink} key={i} style={{ position: "relative" }}>
					<img src={user.image} title={user.caption} />
					<span
						style={{
							position: "absolute",
							bottom: "-35px",
							left: 0,
							right: 0
						}}
					>
						{user.caption}
					</span>
				</a>
			);
		});

	return (
		<div className="productShowcaseSection paddingBottom">
			<h2>{"Who's Using This?"}</h2>
			<p>This project is used by all these people</p>
			<div className="logos">{showcase}</div>
		</div>
	);
};

class Index extends React.Component {
	render() {
		let language = this.props.language || "";

		return (
			<div>
				<HomeSplash language={language} />
				<div className="mainContainer">
					<Features />
					<Showcase language={language} />
				</div>
			</div>
		);
	}
}

module.exports = Index;
