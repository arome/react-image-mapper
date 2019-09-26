'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFastCompare = require('react-fast-compare');

var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

var ImageMapper = (function (_Component) {
	_inherits(ImageMapper, _Component);

	function ImageMapper(props) {
		var _this = this;

		_classCallCheck(this, ImageMapper);

		_get(Object.getPrototypeOf(ImageMapper.prototype), 'constructor', this).call(this, props);
		['initCanvases'].forEach(function (f) {
			return _this[f] = _this[f].bind(_this);
		});
		var absPos = { position: 'absolute', top: 0, left: 0 };
		var canvas = _extends({}, absPos, { pointerEvents: 'none' });
		this.styles = {
			container: { position: 'relative' },
			hoverCanvas: _extends({}, canvas, { zIndex: 3 }),
			prefillCanvas: _extends({}, canvas, { zIndex: 2 }),
			img: _extends({}, absPos, { zIndex: 1, userSelect: 'none' }),
			map: props.onClick && { cursor: 'pointer' } || undefined
		};
		// Props watched for changes to trigger update
		this.watchedProps = ['active', 'fillColor', 'height', 'imgWidth', 'lineWidth', 'src', 'strokeColor', 'width', 'renderChildren'];
	}

	_createClass(ImageMapper, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var _this2 = this;

			if (!(0, _reactFastCompare2['default'])(this.state.currentlyHoveredArea, nextState.currentlyHoveredArea)) return true;
			var propChanged = this.watchedProps.some(function (prop) {
				return _this2.props[prop] !== nextProps[prop];
			});
			var result = !(0, _reactFastCompare2['default'])(this.props.map, this.state.map) || propChanged;
			return result;
		}
	}, {
		key: 'UNSAFE_componentWillMount',
		value: function UNSAFE_componentWillMount() {
			this.updateCacheMap();
		}
	}, {
		key: 'updateCacheMap',
		value: function updateCacheMap() {
			this.setState({ map: _extends({}, this.props.map) }, this.initCanvases);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (!(0, _reactFastCompare2['default'])(this.props.map, this.state.map)) {
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
	}, {
		key: 'initCanvases',
		value: function initCanvases() {
			if (this.props.width) this.props.imgRef.current.width = this.props.width;

			if (this.props.height) this.props.imgRef.current.height = this.props.height;

			this.prefillSvg.setAttribute('viewBox', '0 0 ' + (this.props.width || this.props.imgRef.current.clientWidth) + ' ' + (this.props.height || this.props.imgRef.current.clientHeight));
			this.hoverSvg.setAttribute('viewBox', '0 0 ' + (this.props.width || this.props.imgRef.current.clientWidth) + ' ' + (this.props.height || this.props.imgRef.current.clientHeight));

			this.container.style.width = (this.props.width || this.props.imgRef.current.clientWidth) + 'px';
			this.container.style.height = (this.props.height || this.props.imgRef.current.clientHeight) + 'px';

			if (this.props.onLoad) this.props.onLoad();
		}
	}, {
		key: 'hoverOn',
		value: function hoverOn(area, index, event) {
			if (this.props.onMouseEnter) this.props.onMouseEnter(area, index, event);

			this.setState({
				currentlyHoveredArea: area
			});
		}
	}, {
		key: 'hoverOff',
		value: function hoverOff(area, index, event) {
			if (this.props.onMouseLeave) this.props.onMouseLeave(area, index, event);

			this.setState({
				currentlyHoveredArea: undefined
			});
		}
	}, {
		key: 'click',
		value: function click(area, index, event) {
			if (this.props.onClick) {
				event.preventDefault();
				this.props.onClick(area, index, event);
			}
		}
	}, {
		key: 'imageClick',
		value: function imageClick(event) {
			if (this.props.onImageClick) {
				event.preventDefault();
				this.props.onImageClick(event);
			}
		}
	}, {
		key: 'mouseMove',
		value: function mouseMove(area, index, event) {
			if (this.props.onMouseMove) {
				this.props.onMouseMove(area, index, event);
			}
		}
	}, {
		key: 'mouseDown',
		value: function mouseDown(area, index, event) {
			if (this.props.onMouseDown) {
				this.props.onMouseDown(area, index, event);
			}
		}
	}, {
		key: 'mouseUp',
		value: function mouseUp(area, index, event) {
			if (this.props.onMouseUp) {
				this.props.onMouseUp(area, index, event);
			}
		}
	}, {
		key: 'imageMouseMove',
		value: function imageMouseMove(area, index, event) {
			if (this.props.onImageMouseMove) {
				this.props.onImageMouseMove(area, index, event);
			}
		}
	}, {
		key: 'imageMouseDown',
		value: function imageMouseDown(area, index, event) {
			if (this.props.onImageMouseDown) {
				this.props.onImageMouseDown(area, index, event);
			}
		}
	}, {
		key: 'imageMouseUp',
		value: function imageMouseUp(area, index, event) {
			if (this.props.onImageMouseUp) {
				this.props.onImageMouseUp(area, index, event);
			}
		}
	}, {
		key: 'scaleCoords',
		value: function scaleCoords(coords) {
			var _props = this.props;
			var imgWidth = _props.imgWidth;
			var width = _props.width;

			// calculate scale based on current 'width' and the original 'imgWidth'
			var scale = width && imgWidth && imgWidth > 0 ? width / imgWidth : 1;
			return coords.map(function (coord) {
				return coord * scale;
			});
		}
	}, {
		key: 'mapCoordsToSvgFormat',
		value: function mapCoordsToSvgFormat(coords) {
			return coords.reduce(function (a, v, i, s) {
				return i % 2 ? a : [].concat(_toConsumableArray(a), [s.slice(i, i + 2)]);
			}, []).join(' ');
		}
	}, {
		key: 'computeCenter',
		value: function computeCenter(area) {
			if (!area) return [0, 0];

			var scaledCoords = this.scaleCoords(area.coords);

			switch (area.shape) {
				case 'circle':
					return [scaledCoords[0], scaledCoords[1]];
				case 'poly':
				case 'rect':
				default:
					{
						var _ret = (function () {
							// Calculate centroid
							var n = scaledCoords.length / 2;

							var _scaledCoords$reduce = scaledCoords.reduce(function (_ref, val, idx) {
								var y = _ref.y;
								var x = _ref.x;

								return !(idx % 2) ? { y: y, x: x + val / n } : { y: y + val / n, x: x };
							}, { y: 0, x: 0 });

							var y = _scaledCoords$reduce.y;
							var x = _scaledCoords$reduce.x;

							return {
								v: [x, y]
							};
						})();

						if (typeof _ret === 'object') return _ret.v;
					}
			}
		}
	}, {
		key: 'getExtendedAreas',
		value: function getExtendedAreas() {
			var _this3 = this;

			return this.state.map.areas.map(function (area) {
				var scaledCoords = _this3.scaleCoords(area.coords);
				var center = _this3.computeCenter(area);
				return _extends({}, area, { scaledCoords: scaledCoords, center: center });
			});
		}
	}, {
		key: 'getMatchingSvgElementForShape',
		value: function getMatchingSvgElementForShape(shape, coords, props) {
			var scaledCoords = this.scaleCoords(coords);
			switch (shape) {
				case 'rect':
					return _react2['default'].createElement('rect', _extends({
						x: scaledCoords[0],
						y: scaledCoords[1],
						width: scaledCoords[2] - scaledCoords[0],
						height: scaledCoords[3] - scaledCoords[1]
					}, props));
				case 'circle':
					return _react2['default'].createElement('circle', _extends({
						cx: scaledCoords[0],
						cy: scaledCoords[1],
						r: scaledCoords[2]
					}, props));
				case 'poly':
				default:
					return _react2['default'].createElement('polygon', _extends({
						points: this.mapCoordsToSvgFormat(scaledCoords)
					}, props));
			}
		}
	}, {
		key: 'renderCurrentlyHoveredSvgElement',
		value: function renderCurrentlyHoveredSvgElement() {
			var area = this.state.currentlyHoveredArea;
			if (!area) return null;
			return this.getMatchingSvgElementForShape(area.shape, area.coords, {
				key: area._id || 'hover-area',
				fill: area.fillColor || 'transparent',
				stroke: area.strokeColor || this.props.strokeColor,
				strokeWidth: area.lineWidth || this.props.lineWidth
			});
		}
	}, {
		key: 'renderPrefillSvgElements',
		value: function renderPrefillSvgElements() {
			var _this4 = this;

			return this.state.map.areas.map(function (area, index) {
				if (!area.preFillColor) return null;
				return _this4.getMatchingSvgElementForShape(area.shape, area.coords, {
					key: area._id || index,
					fill: area.preFillColor || 'transparent',
					stroke: area.strokeColor || _this4.props.strokeColor,
					strokeWidth: area.lineWidth || _this4.props.lineWidth
				});
			});
		}
	}, {
		key: 'renderAreas',
		value: function renderAreas() {
			var _this5 = this;

			return this.getExtendedAreas().map(function (extendedArea, index) {
				return _react2['default'].createElement('area', {
					key: extendedArea._id || index,
					shape: extendedArea.shape,
					coords: extendedArea.scaledCoords.join(','),
					onMouseEnter: _this5.hoverOn.bind(_this5, extendedArea, index),
					onMouseLeave: _this5.hoverOff.bind(_this5, extendedArea, index),
					onMouseMove: _this5.mouseMove.bind(_this5, extendedArea, index),
					onMouseDown: _this5.mouseDown.bind(_this5, extendedArea, index),
					onMouseUp: _this5.mouseUp.bind(_this5, extendedArea, index),
					onClick: _this5.click.bind(_this5, extendedArea, index),
					href: extendedArea.href
				});
			});
		}
	}, {
		key: 'renderChildren',
		value: function renderChildren() {
			if (this.props.renderChildren) {
				return this.props.renderChildren();
			}
			return null;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this6 = this;

			return _react2['default'].createElement(
				'div',
				{ style: this.styles.container, ref: function (node) {
						return _this6.container = node;
					} },
				_react2['default'].createElement('img', {
					style: this.styles.img,
					src: this.props.src,
					useMap: '#' + this.state.map.name,
					alt: '',
					ref: this.props.imgRef,
					onLoad: this.initCanvases,
					onClick: this.imageClick.bind(this),
					onMouseMove: this.imageMouseMove.bind(this),
					onMouseDown: this.imageMouseDown.bind(this),
					onMouseUp: this.imageMouseUp.bind(this)
				}),
				_react2['default'].createElement(
					'svg',
					{ id: 'prefill-layer', ref: function (node) {
							return _this6.prefillSvg = node;
						}, style: this.styles.prefillCanvas },
					this.renderPrefillSvgElements()
				),
				_react2['default'].createElement(
					'svg',
					{ id: 'hover-layer', ref: function (node) {
							return _this6.hoverSvg = node;
						}, style: this.styles.hoverCanvas },
					this.state.currentlyHoveredArea && this.renderCurrentlyHoveredSvgElement()
				),
				_react2['default'].createElement(
					'map',
					{ name: this.state.map.name, style: this.styles.map },
					this.renderAreas()
				),
				this.renderChildren()
			);
		}
	}]);

	return ImageMapper;
})(_react.Component);

exports['default'] = ImageMapper;

ImageMapper.defaultProps = {
	active: true,
	fillColor: 'rgba(255, 255, 255, 0.5)',
	lineWidth: 1,
	map: {
		areas: [],
		name: 'image-map-' + Math.random()
	},
	strokeColor: 'rgba(0, 0, 0, 0.5)',
	imgRef: _react2['default'].createRef()
};

ImageMapper.propTypes = {
	active: _propTypes2['default'].bool,
	fillColor: _propTypes2['default'].string,
	height: _propTypes2['default'].number,
	imgWidth: _propTypes2['default'].number,
	lineWidth: _propTypes2['default'].number,
	src: _propTypes2['default'].string.isRequired,
	strokeColor: _propTypes2['default'].string,
	width: _propTypes2['default'].number,
	renderChildren: _propTypes2['default'].func,

	onClick: _propTypes2['default'].func,
	onMouseMove: _propTypes2['default'].func,
	onMouseDown: _propTypes2['default'].func,
	onMouseUp: _propTypes2['default'].func,
	onImageClick: _propTypes2['default'].func,
	onImageMouseMove: _propTypes2['default'].func,
	onImageMouseDown: _propTypes2['default'].func,
	onImageMouseUp: _propTypes2['default'].func,
	onLoad: _propTypes2['default'].func,
	onExtendedAreasCreated: _propTypes2['default'].func,
	onMouseEnter: _propTypes2['default'].func,
	onMouseLeave: _propTypes2['default'].func,

	imgRef: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].shape({ current: _propTypes2['default'].instanceOf(Element) })]),

	map: _propTypes2['default'].shape({
		areas: _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
			area: _propTypes2['default'].shape({
				coords: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
				href: _propTypes2['default'].string,
				shape: _propTypes2['default'].string,
				preFillColor: _propTypes2['default'].string,
				fillColor: _propTypes2['default'].string
			})
		})),
		name: _propTypes2['default'].string
	})
};
module.exports = exports['default'];