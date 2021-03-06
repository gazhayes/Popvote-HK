Template.submitVote.rendered = function() {
    if(!this._rendered) {
        this._rendered = true;
        //Initialize Divs
        Session.set('official', 'none');
        Session.set('notofficial', 'none');
        Session.set('officialandunofficial', 'none');
        Session.set('aeciframe', 'block');

        //Set Display Text
        Session.set('juris', 'waiting for your selection');
        Session.set('voteofficial', 'Waiting for your selection');
        Session.set('titleplaceholder', '');
        Session.set('linkplaceholder', '');
        Session.set('detailsplaceholder', '');
        //INITIALIZE BUTTONS
        Session.set('stateButton', 'btn-default');
        Session.set('councilButton', 'btn-default');
        Session.set('parliamentButton', 'btn-default');
        Session.set('officialButton', 'btn-default');
        Session.set('nonOfficialButton', 'btn-default');
        //Get User Data
            Meteor.call('profileData', 'localCouncil', function(error, result) { if (error){
            throwError(error.reason); } else {
            council = result;}
        });

        Meteor.call('profileData', 'stateCode', function(error, result) { if (error){
            throwError(error.reason); } else {
            stateCode = result;}
        });

    }};

Template.submitVote.events({
    'click #parliament': function () {
        Session.set('juris', 'The Australian Nation');
        Session.set('officialandunofficial', 'block');
        Session.set('parliamentButton', 'btn-primary');
        Session.set('stateButton', 'btn-default');
        Session.set('councilButton', 'btn-default');
        jurisname = "National";
        juristype = "national";
    },
    'click #mystate': function () {
        Session.set('juris', 'myState'); //replace with this.userID.profile.state or something
        Session.set('officialandunofficial', 'block');
        Session.set('stateButton', 'btn-primary');
        Session.set('parliamentButton', 'btn-default');
        Session.set('councilButton', 'btn-default');
        jurisname = stateCode;
        juristype = "state";
    },
    'click #mycouncil': function () {
        Session.set('juris', 'myCouncil'); //replace with this.userID.profile.council or something
        Session.set('officialandunofficial', 'block');
        Session.set('councilButton', 'btn-primary');
        Session.set('parliamentButton', 'btn-default');
        Session.set('stateButton', 'btn-default');
        jurisname = council;
        juristype = "council";
    },
    'click #official': function () {
        //DISPLAY AND HIDE FIELDS
        Session.set('official', 'block');
        Session.set('notofficial', 'none');
        Session.set('officialandunofficial', 'block');
        //PLACEHOLDER TEXT FOR FIELDS
        Session.set('voteofficial', 'OK, please input the official data below!');
        Session.set('titleplaceholder', 'Official title of the Legco bill or council motion');
        Session.set('linkplaceholder', 'Link to the offical bill or council motion');
        Session.set('detailsplaceholder', 'Summary of the bill or motion');
        //METADATA
        Session.set('isofficial', true);
        official = true;
        //BUTTONS
        Session.set('officialButton', 'btn-primary');
        Session.set('nonOfficialButton', 'btn-default');

    },
    'click #unofficial': function () {
        //PLACEHOLDER TEXT FOR FIELDS
        Session.set('titleplaceholder', 'Please state the issue you want people to vote on');
        Session.set('voteofficial', 'OK, create your new vote below!');
        Session.set('detailsplaceholder', 'Please describe exactly what people are choosing between when voting');
        //DISPLAY AND HIDE FIELDS
        Session.set('notofficial', 'block');
        Session.set('official', 'none');
        Session.set('officialandunofficial', 'block');
        //METADATA
        Session.set('isofficial', false);
        official = false;
        //BUTTONS
        Session.set('officialButton', 'btn-default');
        Session.set('nonOfficialButton', 'btn-primary');

    },
    'submit form': function(e) {
    e.preventDefault();
    var vote = {
        title: $(e.target).find('[name=title]').val(),
        officialLink: $(e.target).find('[name=officiallink]').val(),
        problem: $(e.target).find('[name=problem]').val(),
        voteBody: $(e.target).find('[name=votebody]').val(),
        isofficial: official,
        jurisType: juristype,
        jurisName: jurisname

    };

    Meteor.call('voteInsert', vote, function(error, result) { // display the error to the user and abort
        if (error) {sAlert.error(error.reason);
        } else {
        sAlert.info('Your vote item has been created', {});
        Router.go('voteInfoPage', {_id: result._id});
        }
    });



}
});


Template.submitVote.helpers({

    data: function (variable) {
        return Session.get(variable);
    },

    display: function(block) {
        return Session.get(block);
    },
    state: function (){return Meteor.user().profile.state;}
});