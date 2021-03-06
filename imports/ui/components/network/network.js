import './network.html'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Nodes, Edges } from '../../../api/collections.js'
import { initGraph } from './networkMethods.js'

import { $ }  from 'meteor/jquery'

// truncate String to make it shorter
String.prototype.trunc = String.prototype.trunc ||
  function(n){
      return (this.length > n) ? this.substr(0,n-1)+'...' : this;
};

Template.network.onCreated( function() {
  var self = this;

  // get reactive graphState
  this.graphState = this.data.graphState

  // constants
  var readOnlyMode = this.data.readOnlyMode

  // delete/add nodes
  this.advancedEditMode = Session.get('advancedEditMode')

  // init node/edge selector
  $('#infoBox').hide()  // hide infoBox by default
  Session.set( 'currentId', null )
  Session.set( 'currentType', null )
  Session.set('pathTargetNodeId', null)

  // node merger
  Session.set("mergeSource", null)
  Session.set("mergeTargets", null)

  var topogramId = FlowRouter.getParam('topogramId')
  var nodesSubscription = self.subscribe( 'nodes', topogramId )
  var edgesSubscription = self.subscribe( 'edges', topogramId )

  var nodesEdgesReady = false

  self.autorun(function() {

    if (nodesSubscription.ready() && edgesSubscription.ready() && !nodesEdgesReady) {

      var domElement = self.find("#network")

      // fetch and parse data
      var nodes = Nodes.find().fetch().map(function(i){
        i.data._id = i._id
        i.parent = "nparent"
        i.data.parent = "nparent"
        return i
      })

      var edges = Edges.find().fetch().map(function(i){
        i.data._id = i._id
        return i
      })

      // console.log("nodes", nodes.length)
      // console.log("edges", edges.length)
      self.graph = initGraph(domElement, nodes, edges, {}, readOnlyMode)

      // set global var
      self.data.network.set(self.graph)
      nodesEdgesReady = true;
    }

    if (nodesEdgesReady) {

      Nodes.find().observe({
        added: function( node ) {
          node.data._id = node._id  // make _id accessible in the el.data()
          var el = self.graph.filter('node[_id = "'+node._id+'"]')
          if(!el.length) {
            console.log(node);
            self.graph.add(node) // add a node
            console.log("node added");
            // TODO: re-apply size (radius)
          }
        },
        removed: function( node ) {
          var el = self.graph.filter('node[_id = "'+node._id+'"]')
          self.graph.remove(el)
        }
      })

      // watch changes diff
      Nodes.find().observeChanges( {
        changed: function( _id, fields ) {
            var item = self.graph.nodes().filter( function( i, node ) {
                return node.data("_id") == _id
            })
            for ( var field in fields ) {
              if (field == "position") item.position(fields[field])
              else if (field == "data") Object.keys(fields[field]).forEach(function(d){
                item.data(d, fields[field][d])
              })
            }
        }
      })

      Edges.find().observe( {
          added: function( edge ) {
            edge.data._id = edge._id  // make _id accessible in the el.data()
            var el = self.graph.filter('edge[_id = "'+edge._id+'"]')

            var nodeIds = self.graph.nodes().map( function(n)  { return n.id() })
            if(nodeIds.indexOf(edge.data.source) > -1 && nodeIds.indexOf(edge.data.target) > -1 && !el.length)
              self.graph.add(edge)
          }
          // ,
          // removed: function() {
          //     // console.log( 'edge removed' )
          // }
      })

      Edges.find().observeChanges( {
        changed: function( _id, fields ) {
            var item = self.graph.edges().filter( function( i, edge ) {
                return edge.data("_id") == _id
            })
            for ( var field in fields ) {
              if (field == "data") Object.keys(fields[field]).forEach(function(d){
                item.data(d, fields[field][d])
              })
            }
        }
      })
    }
  })


})

Template.network.onRendered(function() {
    var self = this
    self.topogramId = self.data.topogramId
})


// Template.network.destroyed = function() {
//   console.log("hahah")
// }
