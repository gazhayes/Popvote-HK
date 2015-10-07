Template.commentList.helpers({ comments: function() {
    return Comments.find({voteId: this._id}, {sort: {commentLikes: -1}});
    }
});

Template.commentItem.events({
    'click .like': function(e) {
        e.preventDefault();
        Meteor.call('likeComment', this._id);
    }

});