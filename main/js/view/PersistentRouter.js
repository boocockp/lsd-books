"use strict";

var React                     = require('react');
var RouterMixin               = require('react-router-component').RouterMixin;
var RouteRenderingMixin       = require('react-router-component').RouteRenderingMixin;
var assign                    = Object.assign || require('object-assign');
var omit                      = require('object.omit');

// These are keys to omit - useful for preventing 15.2.0 warning regarding unknown props on DOM els
var PROP_KEYS = ['component']
    .concat(Object.keys(RouterMixin.propTypes))
    .concat(Object.keys(RouteRenderingMixin.propTypes));

const PersistentRouter =  React.createClass({

        mixins: [RouterMixin, RouteRenderingMixin],

        displayName: 'PersistentRouter',

        propTypes: {
            component: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.element
            ])
        },

        getRoutes: function(props) {
            return props.children;
        },

        getDefaultProps: function() {
            return {
                component: 'div'
            };
        },

        render: function() {
            const cache = this.handlerCache || (this.handlerCache = new Map());
            console.log('CachingRouter', 'state', this.state)
            const matchPath = this.state.match.matchedPath

            let currentHandler = cache.get(matchPath);
            if (!currentHandler) {
                currentHandler = this.renderRouteHandler()
                cache.set(matchPath, currentHandler)
            }

            const handlers = []
            for (const [p, handler] of cache.entries()) {
                const show = handler === currentHandler
                handlers.push((
                    <div key={p} style={ show ? {} : {display: 'none'} }>
                        {handler}
                    </div>
                ))
            }

            if (!this.props.component) {
                return currentHandler;
            } else {
                // Pass all props except this component to the Router (containing div/body) and the children,
                // which are swapped out by the route handler.
                var props = assign({}, this.props);
                props = omit(props, PROP_KEYS);
                return React.createElement(this.props.component, props, handlers);
            }
        }
})

module.exports = PersistentRouter;
