Meteor.methods( {
    addEdge: function( edge ) {
        Edges.insert( edge ) 
    },

    addEdgeFromIds: function( topogramId, srcId, targetId ) {
        var edge = makeEdge( topogramId, srcId, targetId, {} )
            // console.log(edge) 
        return Edges.insert( edge ) 
    },

    batchInsertEdges: function( edges ) {
        // console.log(edges.length) 
        Edges.batchInsert( edges ) 
    },

    deleteEdge: function( edgeId ) {
        var edge = Edges.findOne( {
            "data.id": edgeId
        } ) 
        Edges.remove( edge ) 
    },

    deleteEdgesByTopogramId: function( topogramId ) {
        return Edges.remove( {
            "topogramId": topogramId
        } ) 
    },
} ) 
