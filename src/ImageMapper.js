import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

export default class ImageMapper extends Component {
	constructor(props) {
		super(props);
		['initCanvases'].forEach(f => (this[f] = this[f].bind(this)));
		let absPos = { position: 'absolute', top: 0, left: 0 };
		let canvas = { ...absPos, pointerEvents: 'none' };
		this.styles = {
			container: { position: 'relative' },
			hoverCanvas: { ...canvas, zIndex: 3 },
			prefillCanvas: { ...canvas, zIndex: 2 },
			img: { ...absPos, zIndex: 1, userSelect: 'none' },
			map: (props.onClick && { cursor: 'pointer' }) || undefined
		};
		// Props watched for changes to trigger update
		this.watchedProps = [
			'active',
			'fillColor',
			'height',
			'imgWidth',
			'lineWidth',
			'src',
			'strokeColor',
			'width',
			'renderChildren'
		];
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (!isEqual(this.state.currentlyHoveredArea, nextState.currentlyHoveredArea)) return true;
		const propChanged = this.watchedProps.some(prop => this.props[prop] !== nextProps[prop]);
		const result = !isEqual(this.props.map, this.state.map) || propChanged;
		return result;
	}

	UNSAFE_componentWillMount() {
		this.updateCacheMap();
	}

	updateCacheMap() {
		this.setState({ map: Object.assign({}, this.props.map) }, this.initCanvases);
	}

	componentDidUpdate() {
		if (!isEqual(this.props.map, this.state.map)) {
			this.setState({
				currentlyHoveredArea: undefined
			});
		}
		this.updateCacheMap();
		this.initCanvases();
		if (this.props.onExtendedAreasCreated) {
			this.props.onExtendedAreasCreated(this.getExtendedAreas());
		}
	}

	initCanvases() {
		if (this.props.width) this.img.width = this.props.width;

		if (this.props.height) this.img.height = this.props.height;

		this.prefillSvg.setAttribute(
			'viewBox',
			`0 0 ${this.props.width || this.img.clientWidth} ${this.props.height || this.img.clientHeight}`
		);
		this.hoverSvg.setAttribute(
			'viewBox',
			`0 0 ${this.props.width || this.img.clientWidth} ${this.props.height || this.img.clientHeight}`
		);

		this.container.style.width = (this.props.width || this.img.clientWidth) + 'px';
		this.container.style.height = (this.props.height || this.img.clientHeight) + 'px';

		if (this.props.onLoad) this.props.onLoad();
	}

	hoverOn(area, index, event) {
		if (this.props.onMouseEnter) this.props.onMouseEnter(area, index, event);

		this.setState({
			currentlyHoveredArea: area
		});
	}

	hoverOff(area, index, event) {
		if (this.props.onMouseLeave) this.props.onMouseLeave(area, index, event);

		this.setState({
			currentlyHoveredArea: undefined
		});
	}

	click(area, index, event) {
		if (this.props.onClick) {
			event.preventDefault();
			this.props.onClick(area, index, event);
		}
	}

	imageClick(event) {
		if (this.props.onImageClick) {
			event.preventDefault();
			this.props.onImageClick(event);
		}
	}

	mouseMove(area, index, event) {
		if (this.props.onMouseMove) {
			this.props.onMouseMove(area, index, event);
		}
	}

	mouseDown(area, index, event) {
		if (this.props.onMouseDown) {
			this.props.onMouseDown(area, index, event);
		}
	}

	mouseUp(area, index, event) {
		if (this.props.onMouseUp) {
			this.props.onMouseUp(area, index, event);
		}
	}

	imageMouseMove(area, index, event) {
		if (this.props.onImageMouseMove) {
			this.props.onImageMouseMove(area, index, event);
		}
	}

	imageMouseDown(area, index, event) {
		if (this.props.onImageMouseDown) {
			this.props.onImageMouseDown(area, index, event);
		}
	}

	imageMouseUp(area, index, event) {
		if (this.props.onImageMouseUp) {
			this.props.onImageMouseUp(area, index, event);
		}
	}

	scaleCoords(coords) {
		const { imgWidth, width, imgHeight, height } = this.props;
		const scale = width && imgWidth && imgWidth > 0 ? width / imgWidth : 1;
		const verticalScale = height && imgHeight && imgHeight > 0 ? height / imgHeight : 1;
		return coords.map((coord, index) =>
			height && imgHeight && index % 2 === 1 ? coord * verticalScale : coord * scale
		);
	}

	mapCoordsToSvgFormat(coords) {
		return coords.reduce((a, v, i, s) => (i % 2 ? a : [...a, s.slice(i, i + 2)]), []).join(' ');
	}

	computeCenter(area) {
		if (!area) return [0, 0];

		const scaledCoords = this.scaleCoords(area.coords);

		switch (area.shape) {
			case 'circle':
				return [scaledCoords[0], scaledCoords[1]];
			case 'poly':
			case 'rect':
			default: {
				// Calculate centroid
				const n = scaledCoords.length / 2;
				const { y, x } = scaledCoords.reduce(
					({ y, x }, val, idx) => {
						return !(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x };
					},
					{ y: 0, x: 0 }
				);
				return [x, y];
			}
		}
	}

	getExtendedAreas() {
		return this.state.map.areas.map(area => {
			const scaledCoords = this.scaleCoords(area.coords);
			const center = this.computeCenter(area);
			return { ...area, scaledCoords, center };
		});
	}

	getMatchingSvgElementForShape(shape, coords, props) {
		const scaledCoords = this.scaleCoords(coords);
		switch (shape) {
			case 'rect':
				return (
					<rect
						x={scaledCoords[0]}
						y={scaledCoords[1]}
						width={scaledCoords[2] - scaledCoords[0]}
						height={scaledCoords[3] - scaledCoords[1]}
						{...props}
					/>
				);
			case 'circle':
				return <circle cx={scaledCoords[0]} cy={scaledCoords[1]} r={scaledCoords[2]} {...props} />;
			case 'poly':
			default:
				return <polygon points={this.mapCoordsToSvgFormat(scaledCoords)} {...props} />;
		}
	}

	renderCurrentlyHoveredSvgElement() {
		const area = this.state.currentlyHoveredArea;
		if (!area) return null;
		return this.getMatchingSvgElementForShape(area.shape, area.coords, {
			key: area._id || 'hover-area',
			fill: area.fillColor || 'transparent',
			stroke: area.strokeColor || this.props.strokeColor,
			strokeWidth: area.lineWidth || this.props.lineWidth
		});
	}

	renderPrefillSvgElements() {
		return this.state.map.areas.map((area, index) => {
			if (!area.preFillColor) return null;
			return this.getMatchingSvgElementForShape(area.shape, area.coords, {
				key: area._id || index,
				fill: area.preFillColor || 'transparent',
				stroke: area.strokeColor || this.props.strokeColor,
				strokeWidth: area.lineWidth || this.props.lineWidth
			});
		});
	}

	renderPath() {
		const { circle, line, steps } = this.props.path;
		return (
			steps.length > 0 &&
			steps.map((step, index) => {
				const { map, width, imgWidth } = this.props;
				const fromArea = map.areas[step[0]];
				const from = this.computeCenter(fromArea);
				const toArea = map.areas[step[1]];
				const to = this.computeCenter(toArea);
				return (
					<g className="segment-path" key={index}>
						{index === 0 && (
							<circle
								cx={from[0]}
								cy={from[1]}
								r={(((circle && circle.radius) || 5) * width) / (imgWidth || width)}
								stroke={(circle && circle.color) || 'red'}
								strokeWidth="3"
								fill={(circle && circle.color) || 'red'}
							/>
						)}
						<line
							strokeDasharray="6,6"
							x1={from[0]}
							y1={from[1]}
							x2={to[0]}
							y2={to[1]}
							stroke={(line && line.color) || 'red'}
							strokeWidth={(line && line.strokeWidth) || 3}
						/>
						<circle
							cx={to[0]}
							cy={to[1]}
							r={(((circle && circle.radius) || 5) * width) / (imgWidth || width)}
							stroke={(circle && circle.color) || 'red'}
							strokeWidth="3"
							fill={(circle && circle.color) || 'red'}
						/>
					</g>
				);
			})
		);
	}

	renderAreas() {
		return this.getExtendedAreas().map((extendedArea, index) => {
			return (
				<area
					key={extendedArea._id || index}
					shape={extendedArea.shape}
					coords={extendedArea.scaledCoords.join(',')}
					onMouseEnter={this.hoverOn.bind(this, extendedArea, index)}
					onMouseLeave={this.hoverOff.bind(this, extendedArea, index)}
					onMouseMove={this.mouseMove.bind(this, extendedArea, index)}
					onMouseDown={this.mouseDown.bind(this, extendedArea, index)}
					onMouseUp={this.mouseUp.bind(this, extendedArea, index)}
					onClick={this.click.bind(this, extendedArea, index)}
					href={extendedArea.href}
				/>
			);
		});
	}

	renderChildren() {
		if (this.props.renderChildren) {
			return this.props.renderChildren();
		}
		return null;
	}

	render() {
		return (
			<div style={this.styles.container} ref={node => (this.container = node)}>
				<img
					style={this.styles.img}
					src={this.props.src}
					useMap={`#${this.state.map.name}`}
					alt=""
					ref={node => (this.img = node)}
					onLoad={this.initCanvases}
					onClick={this.imageClick.bind(this)}
					onMouseMove={this.imageMouseMove.bind(this)}
					onMouseDown={this.imageMouseDown.bind(this)}
					onMouseUp={this.imageMouseUp.bind(this)}
				/>
				<svg id="prefill-layer" ref={node => (this.prefillSvg = node)} style={this.styles.prefillCanvas}>
					{this.renderPrefillSvgElements()}
					{this.renderPath()}
				</svg>
				<svg id="hover-layer" ref={node => (this.hoverSvg = node)} style={this.styles.hoverCanvas}>
					{this.state.currentlyHoveredArea && this.renderCurrentlyHoveredSvgElement()}
				</svg>
				<map name={this.state.map.name} style={this.styles.map}>
					{this.renderAreas()}
				</map>
				{this.renderChildren()}
			</div>
		);
	}
}

ImageMapper.defaultProps = {
	active: true,
	fillColor: 'rgba(255, 255, 255, 0.5)',
	lineWidth: 1,
	map: {
		areas: [],
		name: 'image-map-' + Math.random()
	},
	strokeColor: 'rgba(0, 0, 0, 0.5)',
	path: { steps: [] }
};

ImageMapper.propTypes = {
	active: PropTypes.bool,
	fillColor: PropTypes.string,
	height: PropTypes.number,
	imgHeight: PropTypes.number,
	imgWidth: PropTypes.number,
	lineWidth: PropTypes.number,
	src: PropTypes.string.isRequired,
	strokeColor: PropTypes.string,
	width: PropTypes.number,
	path: PropTypes.shape({
		circle: PropTypes.shape({
			color: PropTypes.string,
			radius: PropTypes.number
		}),
		line: {
			color: PropTypes.string,
			strokeWidth: PropTypes.number
		},
		steps: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
	}),
	renderChildren: PropTypes.func,

	onClick: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func,
	onImageClick: PropTypes.func,
	onImageMouseMove: PropTypes.func,
	onImageMouseDown: PropTypes.func,
	onImageMouseUp: PropTypes.func,
	onLoad: PropTypes.func,
	onExtendedAreasCreated: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,

	map: PropTypes.shape({
		areas: PropTypes.arrayOf(
			PropTypes.shape({
				area: PropTypes.shape({
					coords: PropTypes.arrayOf(PropTypes.number),
					href: PropTypes.string,
					shape: PropTypes.string,
					preFillColor: PropTypes.string,
					fillColor: PropTypes.string
				})
			})
		),
		name: PropTypes.string
	})
};
