import './topograms-index.html'
import { Topograms } from '../../../api/collections.js'


Template.topograms.events( {
    'click .delete': function( e ) {
        e.preventDefault();
        // console.log( this );
        // var instance = UI.renderWithData(Template.content, {topogramId: data});
        var id = Session.get( 'toDelete' );
        // console.log( id );
        Meteor.call( 'deleteTopogram', id );
        var id = Session.set( 'toDelete', '' );
    },
    'click .modal-delete-open': function( e ) {
        $( '#modal-delete' ).openModal();
        var id = $( e.target ).data( 'modal-template' );
        // console.log( id );
        Session.set( 'toDelete', id );
    },
    'click .modal-delete-close': function( e ) {
        $( '#modal-delete' ).closeModal();
    }
} );

Template.topograms.helpers( {
    topograms: function( e ) {
        console.log(Topograms);
        return Topograms.find().fetch().map( function( d, i ) {

            d.index = i + 1;
            d.privacy = d.sharedPublic ? 'Public' : 'Private';
            d.date = moment( d.createdAt ).format( 'MMMM Do YYYY, h:mm:ss a' );
            return d;
        } );
    }
} );