import './commentBox.html'
import { Template } from 'meteor/templating'

import { Comments } from '../../../../api/collections.js'
import '../../comments/commentForm/commentForm.js'

Template.commentBox.rendered = function(){
    $("#commentBox").hide() 
}

Template.commentBox.helpers({
  comments: function() {
      var type = Session.get( 'currentType' ) || 'node',
          id = Session.get( 'currentId' ) || 'node-000' 
      var comments = Comments.find( {
          'id': id,
          'type': type
      } ).fetch() 
      return comments
  },
  isSelected : function() {
    return (Session.get( 'currentId') && Session.get( 'currentType'))? true : false 
  }
})
